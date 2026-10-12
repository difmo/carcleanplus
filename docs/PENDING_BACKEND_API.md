# Car Clean Plus — pending API work

Checked 11 Oct 2026, after the production deploy.

Live API: `https://carcleanplus-backend.vercel.app/api`

Both Flutter apps use that live API unless a run passes `--dart-define=API_BASE=http://localhost:5001/api`.

## Done

| Feature | What shipped |
|---|---|
| Deploy | Current backend is on `carcleanplus-backend.vercel.app`. Apple sign-in, transactions, and the desk routes answer there. |
| Order timeline | Washer status changes and phone bookings write a timeline step. |
| Washer on the ticket | Assign and accept copy the washer name and phone onto the booking. |
| Customer wash report | A report notifies the desk and shows on the booking. |
| In-app payment | The customer app calls `POST /api/booking/:id/pay`. Razorpay keys are on the live server. |
| Push registration | Both apps send the device token after sign-in. iOS Firebase configs are in each app. |
| Phone OTP | Live OTP is on. With no MSG91 keys, the code is emailed to the account. Local testing still skips OTP. |
| Google and Apple sign-in | `POST /api/auth/google` and `POST /api/auth/apple` are live. The customer app calls them. |
| Delete account | Profile calls `DELETE /api/auth/delete-account`. |
| Saved profile | Name, phone, city, and address save with `PUT /api/auth/me`. |
| Before and after photos | The customer ticket shows `beforePhoto` and `afterPhoto`. |

## Still outside this repo

These need accounts that are not in the project.

1. Text OTP. Add `MSG91_AUTH_KEY` and `MSG91_TEMPLATE_ID` on the live server. Until then, the code is sent by email.
2. Alerts when the iPhone app is fully closed. Upload an Apple push key to the Firebase project `carcleanplus-continue`. Sign-in already registers the token when Firebase can issue one.
