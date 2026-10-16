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
`/private/tmp/.../scratchpad/apitest/run.js` (session scratchpad, not in the repo) starts the Express app against an in-memory MongoDB with every live key blanked (Razorpay, SMTP, Firebase, MSG91), so nothing touches the live database or sends anything. 33 checks, all passing on 16 Oct 2026: catalog shape, water discount quote, plan not free, plan service/expiry rules, addresses, vehicles, lead ownership, past date/slot checks, finish + timeline, single read, reschedule, cancel, forgot/reset password, delete cleanup.

To repeat: `npm i mongodb-memory-server@10 supertest@7` in an empty folder, copy the script, run `node run.js /path/to/backend`.

**Not yet deployed.** The live API on Vercel still runs the old code until the backend is redeployed.
