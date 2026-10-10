const nodemailer = require('nodemailer');

const mailUser = () => process.env.SMTP_USER || process.env.MAIL_USER || '';
const mailPass = () => process.env.SMTP_PASS || process.env.MAIL_PASS || '';

const buildTransport = () => {
  const host = process.env.SMTP_HOST || process.env.MAIL_HOST;
  const port = Number(process.env.SMTP_PORT || process.env.MAIL_PORT || 587);
  const secure =
    String(process.env.SMTP_SECURE || process.env.MAIL_SECURE || '').toLowerCase() === 'true' ||
    port === 465;
  const auth = { user: mailUser(), pass: mailPass() };
  if (host) {
    return nodemailer.createTransport({ host, port, secure, auth });
  }
  return nodemailer.createTransport({ service: 'gmail', auth });
};

const transporter = buildTransport();

const mailConfigured = () => Boolean(mailUser() && mailPass());

const mailFrom = () =>
  process.env.MAIL_FROM || (mailUser() ? `"Car Clean Plus" <${mailUser()}>` : 'Car Clean Plus');

const sendMail = (options) => {
  if (!mailConfigured()) {
    const error = new Error('Set SMTP_USER and SMTP_PASS in the server env to send mail');
    error.statusCode = 503;
    throw error;
  }
  return buildTransport().sendMail({ from: mailFrom(), ...options });
};

module.exports = transporter;
module.exports.sendMail = sendMail;
module.exports.mailConfigured = mailConfigured;
module.exports.mailFrom = mailFrom;