const Booking = require('../models/Booking');
const Transaction = require('../models/Transaction');

function details(booking) {
  return {
    method: booking.paymentMethod || '',
    paymentStatus: booking.paymentStatus || '',
    bookingStatus: (booking.status || 'pending').toLowerCase(),
    customerName: booking.customerDetails?.fullName || '',
    mobile: booking.customerDetails?.mobile || '',
    service: booking.service || '',
    date: booking.date || '',
  };
}

function worthRecording(booking) {
  const status = (booking.status || '').toLowerCase();
  const price = Number(booking.finalPrice) || 0;
  return booking && booking._id && status !== 'blocked' && status !== 'lead' && price > 0;
}

async function recordBookingLedger(booking) {
  if (!worthRecording(booking)) return;
  const price = Number(booking.finalPrice) || 0;
  const shared = details(booking);
  await Transaction.updateOne(
    { booking: booking._id, kind: 'payment' },
    {
      $set: { ...shared, amount: price },
      $setOnInsert: {
        booking: booking._id,
        kind: 'payment',
        at: booking.createdAt || new Date(),
      },
    },
    { upsert: true }
  );

  const refund = Number(booking.refundAmount) || 0;
  if (refund > 0 || booking.paymentStatus === 'refunded') {
    await Transaction.updateOne(
      { booking: booking._id, kind: 'refund' },
      {
        $set: {
          ...shared,
          amount: refund || price,
          paymentStatus: 'refunded',
        },
        $setOnInsert: {
          booking: booking._id,
          kind: 'refund',
          at: booking.updatedAt || new Date(),
        },
      },
      { upsert: true }
    );
  }
}

async function syncAllLedgers() {
  const bookings = await Booking.find({
    status: { $nin: ['blocked', 'lead'] },
    finalPrice: { $gt: 0 },
  });
  for (const booking of bookings) {
    await recordBookingLedger(booking);
  }
}

async function listTransactions() {
  await syncAllLedgers();
  return Transaction.find({}).sort({ at: -1 }).lean();
}

module.exports = { recordBookingLedger, listTransactions };
