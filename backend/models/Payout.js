const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema(
  {
    staff: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    amount: { type: Number, required: true },
    paid: { type: Boolean, default: false },
    paidAt: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Payout', payoutSchema);
