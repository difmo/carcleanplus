# Customer app rebuild — change log

Started 16 Oct 2026 on branch `feat/client-website-requirements`.

Goal: fix the bugs in the customer app (`app/`) and bring it to a finished, Hoora-style app (yellow brand, service cards with price, discount, rating and inclusions, a vehicle chip, bookings list, booking-confirmed screen with order tracking). The backend (`backend/`) is changed where the app needs it.

Each entry says what changed, why, and where. Newest work goes at the bottom of each section.

---

## Bugs found in the audit

### App (`app/`)

| # | Bug | Effect |
|---|---|---|
| A1 | `AuthProvider.isLoading` is used both for app start and for every sign-in. The router sends any `isLoading` state to `/boot`. | Pressing Sign in throws the user to the splash screen and wipes the login form, error and OTP state. |
| A2 | `getMe()` logs out on any non-200 answer. | A server hiccup (500, cold start) signs the user out. |
| A3 | Logout does not clear the cached orders, city or address. | The next person on the phone sees the previous user's bookings. |
| A4 | Orders are only fetched every 20 s, and both the shell and the Orders tab run their own 20 s timer. | Bookings appear late after sign-in; double API traffic. |
| A5 | The city list offers cities the backend refuses (Agra, Jaipur, Kolkata, Surat, ...). Default city Lucknow is not in the list. "Use current location" opens a screen that does nothing. | Booking fails at the last step with "outside the service area". |
| A6 | Home, service page and "from" prices always use the `Compact` price for cars. | Prices shown do not match what an SUV owner pays. |
| A7 | "Move" (reschedule) is a free-text date and slot dialog. | Typos create bookings in invalid slots. |
| A8 | "Message desk" only sends; replies are never shown. | Support chat is one-way. |
| A9 | Order detail only reads the local cache. | Opening a booking that is not cached says "no longer in your list". |
| A10 | "Forgot password" just shows "Check your inbox". Nothing is sent. | Users cannot reset a password. |
| A11 | "Upgrade to Plus" adds the plan for free (see B1). | Free washes. |
| A12 | Android release manifest has no `INTERNET` permission, and no `<queries>` for `tel:`/`https:`. | Release APK cannot reach the API; call/pay links may not open on Android 11+. |
| A13 | Photo assets are 1.6–9.8 MB PNGs, decoded in list rows. | Janky scrolling, high memory. |
| A14 | Quote never sends the water/electricity choice while the booking applies it. | Shown price and charged price differ. |
| A15 | Walkthrough only shows for signed-in users who have not seen it; guests never see it. | Onboarding is skipped for new installs. |
| A16 | Phone OTP screen is wired to an API that answers "OTP is turned off" on the live server. | Dead screen. |

### Backend (`backend/`)

| # | Bug | Effect |
|---|---|---|
| B1 | `POST /api/account/plan` adds the plan when no payment id is sent. | Anyone can give themselves plan washes for free. |
| B2 | A plan wash makes **any** service free, and plan expiry is not checked. | A ₹999 "City 4" (Basic Wash) plan pays for ₹1,499 festive details. |
| B3 | Bookings paid through a Razorpay payment link are never marked paid (no webhook, no status check). | Paid bookings stay "pending" for ever. |
| B4 | `PUT /api/booking/:id` works for anyone on any booking. | Any caller can change someone else's booking. |
| B5 | `POST /api/catalog/quote` ignores `providesWaterElectricity`. | See A14. |

---

## Backend changes

### Catalog: service details, cities and real stats
- `utils/defaultCatalog.js` — added `defaultServices`: title, tagline, description, duration, inclusions, group and `popular` flag for each of the five services. Admin can override through `PUT /api/catalog` with a `services` array.
- `models/Catalog.js` — new `services` array.
- `utils/cities.js` — new `cityList()` returning each serviceable city once.
- `utils/quote.js` — `presentCatalog()` now also returns:
  - `services` (saved rows merged over the defaults),
  - `cities` (the only cities the app may offer),
  - `basePrices` (prices before a festival discount, so the app can show a struck-through price only when a real discount is on),
  - `stats` per service: `bookings30d`, `rating`, `ratingCount`, from real bookings (only when called with `withStats`, which `GET /api/catalog` does).
- `controllers/catalogController.js` — `GET /catalog` sends stats; `services` is an editable field; the quote now passes `providesWaterElectricity` and returns `waterElectricityDiscount` (fixes B5).

### Plans
- `utils/quote.js` — a plan wash is refused when no washes are left, when the plan has expired, or when the service is not the plan's service (fixes B2).
- `controllers/accountController.js` — `POST /account/plan` no longer grants for free (fixes B1):
  - with a Razorpay checkout payment it is verified, then granted (old path, unchanged);
  - otherwise it creates a Razorpay payment link, stores it in `user.pendingPlan`, and returns `paymentUrl`. Without Razorpay keys it returns 503.
  - `GET /account/plan` checks the pending link and turns the plan on once it is paid. It also returns `pendingPlan` and `paymentsEnabled`, and shows 0 washes after expiry.
- `controllers/paymentController.js` — new `createPlanPaymentLink`, `readPaymentLink`.

### Payment links
- `controllers/paymentController.js` — new `syncPaymentLink(booking)` reads the link from Razorpay and marks the booking paid, notifies, and records the ledger (fixes B3). Called from the booking reads (see below).

### Saved addresses and vehicles
- `models/User.js` — `addresses[]` (label, address, city, latitude, longitude, isDefault) and `pendingPlan`.
- `models/Vehicle.js` — `plate`.
- `controllers/accountController.js`, `routes/accountRoutes.js`:
  - `GET/POST /account/addresses`, `PUT /account/addresses/:id/default`, `DELETE /account/addresses/:id`. The city must be serviceable; the address needs 8+ characters (same rule as booking). The default address is copied to `user.address`/`user.city`.
  - `PUT /account/vehicles/:id/default`.
  - `POST /account/vehicles` checks the size is a priced category, saves `plate`, and makes the first vehicle the default.

### Bookings
- `controllers/bookingController.js`, `routes/bookingRoutes.js`:
  - `PUT /booking/:id` (finish a lead) — only an open `lead` can be finished without signing in. A lead tied to an account, or a booking past `lead`, can only be changed by its owner or an admin (fixes B4). The website flow (anonymous lead → finish) still works.
  - Finishing refuses a past date, and for `bookingSource: 'app'` refuses a slot that is not one of the six slot ids.
  - Finishing now writes the first timeline step (`pending`) and the ledger row, like `POST /booking` already did.
  - New `GET /booking/:id` — the owner (or admin) reads one booking; also refreshes its payment-link status.
  - `GET /booking/mine` refreshes payment-link status for up to 5 unpaid online bookings (fixes B3).
  - Cancel is allowed while `pending` **or `confirmed`** (before a washer accepts). An optional `reason` is saved on the timeline step. After a washer accepts, the message says to contact the desk.
  - Reschedule checks the date format, refuses past dates and unknown slots, and writes a timeline note "Moved to …".

### Auth
- `controllers/authController.js`, `routes/authRoutes.js`:
  - `POST /auth/password/forgot {email}` — emails a 6 digit code (15 min). Answers the same whether or not the account exists. Needs SMTP on the server.
  - `POST /auth/password/reset {email, code, password}` — sets the password and signs in (returns `token` + `user`).
  - `DELETE /auth/delete-account` also deletes that user's vehicles and notifications. Bookings are kept for the books.
  - `publicUser` includes `addresses`.

### How the backend was tested
Scripts live in `backend/test/local-api/`. They start the Express app against an **in-memory MongoDB** and blank every live key first (`env.js`: Razorpay, SMTP, Firebase, MSG91, and `MONGO_URI`), so nothing touches the live database or sends anything.

```
cd backend
npm install --no-save mongodb-memory-server@10 supertest@7   # does not change package.json
node test/local-api/run.js     # 33 API checks, all passing on 16 Oct 2026
node test/local-api/serve.js   # API on :5001 for the app, demo@example.com / demo123
```

`run.js` covers: catalog shape, water discount quote, plan not free, plan service/expiry rules, addresses, vehicles, lead ownership, past date/slot checks, finish + timeline, single read, reschedule, cancel, forgot/reset password, delete cleanup.

**Not yet deployed.** The live API on Vercel still runs the old code until the backend is redeployed.


---

## App changes (`app/`)

### Structure
The app was rewritten under `app/lib/src/`. `lib/main.dart` only imports `lib/src`, so the old screens are **no longer compiled**. They are still on disk (deleting or moving them was not allowed in this session) and are excluded in `analysis_options.yaml`. Old folders that can be deleted once you are happy: `lib/authentication`, `lib/compoments`, `lib/component`, `lib/data`, `lib/location`, `lib/models`, `lib/providers`, `lib/router`, `lib/services`, `lib/theme`, `lib/user_footer`, `lib/user_pages`, `lib/utils` (then remove the exclude list).

```
lib/main.dart                 providers + MaterialApp.router
lib/src/config.dart           API_BASE, SITE_BASE, support contacts, photo paths
lib/src/theme.dart            Hoora-style yellow + ink theme, text styles
lib/src/router.dart           routes, sign-in guard, first-run tour gate
lib/src/data/defaults.dart    built-in catalog (mirrors backend defaults), slots, car models
lib/src/models/               user, address, vehicle, catalog, booking
lib/src/services/             api (one HTTP client), local_store, social_sign_in, notifications
lib/src/providers/            auth, catalog, account (vehicles/addresses/plan/alerts), bookings
lib/src/widgets/              ui kit, service card, vehicle/address sheets, slot picker
lib/src/screens/              splash, tour, auth, home, services, booking, orders, plus, profile, alerts, city, desk
```

### Fixes for the audit list
- **A1** `AuthProvider` has `status` (unknown/signedOut/signedIn) for app start and a separate `busy` flag for sign-in. The router only shows the splash while `status` is unknown.
- **A2** Only a 401/404 from `/auth/me` signs out. Offline or 5xx keeps the cached profile (`LocalStore.user`).
- **A3** Logout and account deletion clear token, cached profile, selected vehicle and every per-user bookings cache. Bookings are cached per user id.
- **A4** One 30 s poll for the whole app (started/stopped with the app lifecycle in `AppShell`); bookings load as soon as someone signs in. The booking page refreshes itself every 20 s while open.
- **A5** Cities come from `GET /catalog` → `cities` (the only cities the backend accepts). "Use my current location" uses the GPS and picks the nearest city within `zoneKm`, or says the area is not served.
- **A6** Prices use the chosen vehicle's size everywhere. With no vehicle, cards say "from ₹…" (lowest car price). Guests can add a vehicle; it is kept on the phone and uploaded on first sign-in.
- **A7** Reschedule uses the same date/slot picker as checkout (full and past slots disabled).
- **A8** Chat screen shows the whole thread and refreshes every 10 s.
- **A9** Booking page reads `GET /booking/:id` and falls back to the list for the old API.
- **A10** Forgot password sends a real code and resets (needs the backend change).
- **A11** Plus buys a plan through a payment link; the plan turns on once paid.
- **A12** `AndroidManifest.xml`: `INTERNET` permission and `<queries>` for `tel:`, `https:`, `mailto:`. (A `CAMERA` permission was deliberately **not** added: declaring it without a runtime request breaks image_picker's camera.)
- **A13** Photos converted to JPEG, max 1400 px (≈45 MB → 4.4 MB). `Photo` widget decodes at display size.
- **A14** Checkout quote sends `providesWaterElectricity`; bill comes from the server quote.
- **A15** First-run tour shows for everyone on first launch; signing in later marks it seen on the server.
- **A16** Phone-OTP screen dropped from the new app (the live server has OTP turned off).

### Screens (Hoora-style)
- **Tour**: three slides, Skip / Next / Get started.
- **Home**: yellow header with address (or city) picker, vehicle chip, alerts bell, search, hero banner with the real starting price, category tiles, next upcoming booking card, popular service cards, plan banner, promises, refer banner. Pull to refresh.
- **Service card**: photo, title, price with struck-through price and % off **only when a real festival discount is on**, rating and "bookings in last 30 days" **only from real data** (`stats`), duration, inclusions, View details / Book.
- **Service detail**: photo gallery, inclusions, description, how it works, price for your vehicle, prices by size, Book now bar.
- **Checkout** (one page): vehicle, address, date + slot, add-ons, coupon, water/power discount, plan wash, referral credit, pay after service / pay online, mobile (if missing), notes, server bill. Confirm → **Booking Confirmed** (booking ID, vehicle, time, Track order); online payment opens from there.
- **My Bookings**: Upcoming / Completed / Cancelled tabs.
- **Booking detail / tracking**: status stepper with timestamps, washer card with call, details, payment with Pay online and receipt, before/after photos, rate with review, reports, Reschedule, Chat with us, Report an issue (camera/gallery), Cancel with reason, activity log.
- **Plus**: plans from the catalog, per-wash price, pending-payment state with "I have paid".
- **Profile**: header, stats, vehicles, addresses, plans, refer and earn, notifications, help, privacy/terms (when `SITE_BASE` is set), log out, delete account.
- **Help**: call, WhatsApp, email (+91 91207 59988, carcleanplusofficial@gmail.com from the website), FAQ.

### Tests
- `app/test/widget_test.dart` — 8 tests: rupee formatting, discount rule, booking status rules match the backend, slot ids, first launch tour → home, guest Book → sign-in. They caught 3 real overflow bugs (home search bar, service card duration line, sign-in "remember" row).
- `app/integration_test/app_flow_test.dart` — full journey on a simulator against `serve.js`: guest home → sign in → add vehicle → checkout with address, slot and add-on → Booking Confirmed → tracking → reschedule → chat → cancel → bookings → rate → plan purchase refused without payment keys. Prints `SHOT:` markers for screenshots. Run: `flutter test integration_test/app_flow_test.dart -d <simulator>`.
- `app/test_driver/local_app.dart` — dev entry that points the app at the local API: `flutter run -t test_driver/local_app.dart`.

Bugs the simulator run found and fixed: sign-in did not leave a pushed sign-in page (screens now navigate on success), Upcoming tab label truncated, payment card missing the service line, cancel-reason sheet overflowing on smaller phones (and reschedule sheet made scrollable), ticked checkbox showed no tick, content scrolling under the status bar on Home/Plus/Profile, a 60 px gap from nested grids picking up the status bar inset.

### Still needed outside the code
1. **Redeploy the backend** to Vercel. Until then the app runs on the old API: it falls back to built-in services/cities, single profile address, list-based booking reads; forgot password, plan purchase, cancel-when-confirmed and addresses will not work against the old API.
2. Set `--dart-define=SITE_BASE=https://<website>` in release builds so privacy/terms links show (the website URL is not in the repo).
3. Android push: add `android/app/google-services.json` (Firebase). Without it push stays off on Android; local alerts still work.
4. Razorpay keys must stay set on the server for online payment and plan purchase.

## Admin and staff app

The admin/staff app (`admin/`) and the backend changes it needed are logged in
[ADMIN_STAFF_APP_NOTES.md](ADMIN_STAFF_APP_NOTES.md) (2026-10-16): 18 backend
bugs, 19 app bugs, desk chat and inbox, booking edit, refunds and payouts.

