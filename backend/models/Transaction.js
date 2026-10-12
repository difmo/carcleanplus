const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    kind: { type: String, enum: ['payment', 'refund'], required: true },
    amount: { type: Number, required: true },
    method: { type: String, default: '' },
    paymentStatus: { type: String, default: '' },
    bookingStatus: { type: String, default: '' },
    customerName: { type: String, default: '' },
    mobile: { type: String, default: '' },
    service: { type: String, default: '' },
    date: { type: String, default: '' },
    at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

transactionSchema.index({ booking: 1, kind: 1 }, { unique: true });
transactionSchema.index({ at: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
