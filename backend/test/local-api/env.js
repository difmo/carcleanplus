// Sets every variable server.js would read from .env, so dotenv (which never
// overrides an existing variable) cannot load a live key or the live database.
const blankLiveKeys = (mongoUri) => {
  Object.assign(process.env, {
    MONGO_URI: mongoUri,
    JWT_SECRET: 'local-secret',
    RAZORPAY_KEY_ID: '',
    RAZORPAY_KEY_SECRET: '',
    FIREBASE_PROJECT_ID: '',
    FIREBASE_CLIENT_EMAIL: '',
    FIREBASE_PRIVATE_KEY: '',
    SMTP_HOST: '',
    SMTP_PORT: '',
    SMTP_USER: '',
    SMTP_PASS: '',
    MAIL_USER: '',
    MAIL_PASS: '',
    MAIL_FROM: '',
    MSG91_AUTH_KEY: '',
    MSG91_TEMPLATE_ID: '',
    OTP_BYPASS: 'true',
  });
};

module.exports = { blankLiveKeys };
