const mongoose = require('mongoose');

const otpCodeSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

otpCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OtpCode', otpCodeSchema);
