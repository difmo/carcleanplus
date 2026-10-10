const mongoose = require('mongoose');

const supportMessageSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fromRole: { type: String, default: 'customer' },
    body: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('SupportMessage', supportMessageSchema);
