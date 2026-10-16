# Admin and staff app (`admin/`): change log

The admin app (`admin/`, Flutter, package `car_clean_staff`) is one app with two
views. Admins and super admins get the desk (Home, Bookings, People, More).
Staff accounts get the washer view (Jobs, Alerts, Profile). Customers are shown
a "this app is for staff" screen.

This file records every fix and feature from the 2026-10-16 pass, the backend
changes it needed, and how to test it. The customer app log is in
[APP_REBUILD_NOTES.md](APP_REBUILD_NOTES.md).

## Bugs found and fixed

### Backend (`backend/`)

| # | Bug | Effect | Fix |
|---|-----|--------|-----|
| D1 | `updateBookingStatus` called `notifyBooking` without importing it | Every desk status change saved, then returned a 500 error | Imported it (`controllers/adminBookingController.js`) |
| D2 | The Prices screen loaded `prices`, which already include the festival discount, and saved them back | Saving prices while a festival offer was on permanently cut every price | Catalog now returns `basePrices` with `active`; the app edits those |
| D3 | Phone bookings set `paymentStatus: 'Paid'` for UPI or Online and `'Cash on Delivery'` for cash | Unpaid washes counted as paid, and `'Paid'` (capital P) never matched `'paid'` checks elsewhere | Always `pending`, unless the desk switches on "Already paid" (`paid`) |
| D4 | A washer payout was only created when the washer finished the job | Jobs the desk marked finished paid the washer nothing | Shared `ensurePayout` runs on both paths |
| D5 | Refunds had no checks | Unpaid washes could be "refunded", for any amount, more than once | Refund only when paid or cash was collected, at most what was paid, once |
| D6 | Any staff account could read and post on any booking's chat | Washers could see other customers' chats | Staff only on jobs assigned to them; desk on all; customers on their own |
| D7 | Desk and washer messages notified the wrong people | A desk reply on a booking with no app account notified the desk itself | Customer writes → desk + washer; desk writes → customer + washer; washer writes → customer + desk |
| D8 | The dashboard used the server clock (UTC on Vercel) and counted leads and blocked slots | Wrong "last 7 days" around midnight in India; inflated totals and revenue | Uses India dates and leaves leads and blocked slots out |
| D9 | The daily report and washer job lists matched only one date format | Bookings stored as `DD-MM-YYYY` vanished from them | Both match every stored date format |
| D10 | The desk booking list returned every lead (abandoned checkout), unlimited | Noise and slow loads | Leads hidden unless `status=lead`; capped at 500; photos left out |
| D11 | Phone bookings accepted any mobile number, past dates and made-up slots | Bad data | 10-digit mobile, today or later, one of the six slots |
| D12 | Phone bookings were never linked to the customer's account | The customer never saw the booking in their app | Linked by phone number; the customer gets a "Wash booked" alert |
| D13 | Create staff: no password length or email checks | Server errors or weak logins | Email check, password of 6+ characters, 10-digit phone |
| D14 | Promos: no value checks, duplicate codes caused a 500, no way to switch one off | | 3–20 character code, value > 0, percent at most 90, duplicates refused; `PUT /admin/promos/:id` |
| D15 | A super admin could change their own role | Could lock themselves out | Refused |
| D16 | Payouts could be marked paid twice; bad ids caused a 500 | | Refused, with a 400 for bad ids |
| D17 | Paid bookings could be deleted | Money lost from the books | Refused; cancel or refund instead |
| D18 | Reassigning a job kept the old washer's "accepted" status | The new washer never had to accept | Goes back to `confirmed`; the previous washer is told |

### App (`admin/`)

| # | Bug | Fix |
|---|-----|-----|
| S1 | Sign-in waited for the iOS "allow notifications" popup, so the spinner never ended | Push setup runs in the background (`providers/auth_provider.dart`) |
| S2 | A network error at launch signed the user out | Only a 401/403 signs out; offline, the last known account is kept |
| S3 | The booking screen used the copy from the list and never reloaded | It loads by id (`/desk/booking/:id`), reloads after every action, and returns "changed" so the list reloads |
| S4 | The Refund button showed on every booking, including unpaid ones and blocked slots | Shown only when there is money to return; asks for the amount |
| S5 | Cancel had no confirmation | Confirm dialog with an optional reason |
| S6 | The Call, WhatsApp, Refund and Assign controls showed on blocked slots | A blocked slot shows only "Unblock" |
| S7 | Opening a booking from a link or after a restart showed "Open a booking from the list" | Id-based route |
| S8 | The phone booking form had a hard-coded service list that didn't match the catalog, and the price was typed by hand | Services and car sizes come from the catalog, with the price filled in from it (still editable) |
| S9 | Phone and block-slot date pickers allowed yesterday | Today onward |
| S10 | The dashboard date filter could not be cleared | Removable chip |
| S11 | Transactions counted every booking as money taken | Only paid rows count; unpaid ones show as "Still due" |
| S12 | The app bar said "Staff" on every desk tab; tab labels were "Board" and "Book" | Real tab titles; tabs are Home, Bookings, People, More |
| S13 | Roles showed raw names, and admins were labelled "Staff" | Washer, Admin, Super admin, Customer |
| S14 | The sign-in code prompt was shown in red, as if it were an error | Grey notice text |
| S15 | Washers only saw today and tomorrow, so later or overdue jobs were invisible | "Later" tab (`?scope=upcoming`) |
| S16 | Washers could finish a job with money still due, without a warning | Warning dialog |
| S17 | Gallery delete had no confirmation | Confirm dialog |
| S18 | The new-customer popup only said "Open desk" and polled every 5 seconds | "Open booking" goes to the booking; polls every 15 seconds |
| S19 | Logging out left the phone registered for pushes | Push token removed on logout |
| S20 | "Call" and "Call the desk" did nothing when the phone could not place the call (the simulator, an iPad, or a failed dial) | `dialNumber` shows the number with a Copy button whenever the call cannot be placed |

## New features

### Desk
- **Customer chat.** "Chat" on every booking, plus a Customer chats inbox (app bar, Home and More). Chats where the customer wrote last are marked "Waiting for a reply". Backend: `GET /api/admin/messages`.
- **Edit a booking.** Reschedule (date and slot, with the full-slot check), change the price, and edit the washer notes. Each change is written to the booking history and the customer and washer are told. Backend: `PUT /api/admin/bookings/:id`.
- **Mark paid** (Cash, UPI or Online), and **partial refunds**.
- **Booking history:** every status change and edit, with who did it and when.
- **Assign or move a washer.** On-shift washers are listed first. Uses `GET /admin/staff`.
- **Home:** "Washes left today", "Need a washer" (opens the bookings list filtered to bookings with no washer), and booked money next to paid money.
- **Bookings list, redesigned:**
  - Search box plus one scrolling row of chips: No washer, date picker (clearable), payment, and every status (including Blocked and Unfinished leads), with a "Clear filters" link and a booking count.
  - Each card has a coloured date-and-time block ("Today · 10:00 AM" instead of the cut-off "Slot 2 – 1…"), the name and price, service and car, status and paid tags, the source, and the washer or "Needs a washer".
  - Blocked slots show as a slim grey row. The stock photos are gone.
  - Source labels are readable ("Desk block", not `admin_block`).
  - Smaller Block slot and Phone booking buttons.
- **Daily report:** a list of that day's jobs; tap one to open it.
- **Promos:** on/off switch; shows percent or rupees off.
- **Payroll:** total still owed to washers.
- **People:** search, role filter, Call button, tap a past wash to open it, confirmation before a role change.
- **Alerts:** tap one to open its booking.

### Washer
- **Alerts screen redesigned** (shared with the desk):
  - Large title with an "N new" badge; alerts grouped under Today and Earlier in white cards.
  - Each alert has an icon and colour by type: new job, message, payment, cancelled, moved.
  - Unread alerts are bold on a light blue background with a blue dot; times read "12m", "3h", "Yesterday".
  - Tapping opens the booking (desk) or the chat (washer messages).
- **Live sample data (2026-10-16):** 6 sample alerts were added directly to the live database for `ravi@example.com` only, with no booking links, using a one-off script kept outside the repo. Remove them with `AppNotification.deleteMany({ user: <ravi id> })` before real use.
- **Profile screen redesigned** (shared with the desk, `lib/screens/account_screens.dart`):
  - Initials avatar, name, email, and badges for role, shift and branch.
  - A blue "Today" card: progress bar for jobs done, still to do, cash, UPI, and collected vs booked. The desk sees today / need a washer / paid.
  - "Your details" is read-only (name, phone, email) until **Edit**, which shows the fields with Cancel and **Save changes**.
  - **Change password** has its own page (`ChangePasswordScreen`): current password, new password twice, a show-passwords box, and errors shown inline.
  - The Account card has Change password, Call the desk (`AppConstants.supportPhone`) and Log out.
  - A confirmation before logging out, and a back button when the screen is opened as its own page.
- **Jobs screen redesigned** (same brand colours):
  - The header has the date, "Hi, Ravi" and an On shift / Off shift pill.
  - A blue summary strip shows jobs to do, finished, and cash collected.
  - Today / Tomorrow / Later tabs replace the wrapping segmented buttons.
  - Each job card shows:
    - the time in large type, with the customer, car and address
    - the washer note
    - the price and how much is still to collect
    - a 4-step progress bar instead of the tall status list
    - round icon actions: Navigate, Call, Chat, Before/After photo, Collect, Clock in
    - one big button for the next step (Accept job → Start driving → Start wash → Finish wash), or "Wash finished" when done
- **Later** tab for jobs after tomorrow or still open from earlier days.
- **Chat** on each job.
- A warning before finishing a job that still has money due.

## Files

- Backend:
  - `controllers/adminBookingController.js`: rewritten.
  - `controllers/deskController.js`, `controllers/adminController.js`, `controllers/staffController.js`.
  - `controllers/bookingController.js`: chat rules.
  - `utils/slots.js`: shared `SLOT_IDS`.
  - `utils/quote.js`: `basePrices.active`.
  - `routes/adminRoutes.js`.
- App:
  - New: `lib/screens/chat_screen.dart` (chat and inbox), `test/models_test.dart`, `integration_test/desk_flow_test.dart`.
  - Rewritten: `lib/screens/booking_detail_screen.dart`.
  - Updated: the models, services, router and the other screens.
  - Shared helpers in `lib/theme/desk_theme.dart`: `rupees`, `roleLabel`, `whenText`.
  - `openBooking()` in `lib/core/screen_guard.dart`.

## How it was tested

Never against the live database: `backend/test/local-api/env.js` blanks every live key and uses an in-memory MongoDB.

- **Backend:** `cd backend && npm install --no-save mongodb-memory-server@10 supertest@7 && node test/local-api/run.js`. **73 checks, all pass**, 40 of them for the desk and washers: phone booking, assign, edit, refunds, payouts, chat permissions, inbox, promos, staff accounts, roles, base prices, daily report, the upcoming view.
- **App:** `cd admin && flutter analyze` is clean; `flutter test` passes 11 tests.
- **Simulator:** `node test/local-api/serve.js` (seeds the desk, washer and customer accounts, a wash today with no washer, and a customer chat message), then
  `flutter test integration_test/desk_flow_test.dart -d <simulator> --dart-define=API_BASE=http://localhost:5001/api`.
  The desk signs in, opens "Need a washer", assigns Ravi, changes the price, and replies in chat. The washer then signs in, turns on shift, accepts the job and reads the reply.
  Result: SIMULATOR_RESULT

**Demo logins** (local server only): desk `desk@example.com` / `desk123`, washer `ravi@example.com` / `ravi123`, customer `demo@example.com` / `demo123`.

**Running by hand:** `flutter run -d <simulator> --dart-define=API_BASE=http://localhost:5001/api`. On an Android emulator, use `http://10.0.2.2:5001/api`.

## Still needed

- Redeploy the backend to Vercel. The new desk features call new endpoints, and the D1 status-change crash is live until then.
- Commit `admin/` (its own git repo) and `backend/`; nothing from this pass is committed yet.
