const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const { notifyUser, notifyDesk } = require('../utils/notify');
const { recordBookingLedger } = require('../utils/ledger');

const keys = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return { keyId, keySecret };
};

const client = () => {
  const pair = keys();
  if (!pair) return null;
  return new Razorpay({ key_id: pair.keyId, key_secret: pair.keySecret });
};

const openOrder = async (rupees, receipt) => {
  const razorpay = client();
  if (!razorpay) return null;
  const amount = Math.round(Number(rupees) * 100);
  if (amount < 100) return { free: true, amount: 0 };
  return razorpay.orders.create({
    amount,
    currency: 'INR',
    receipt: String(receipt || `ccp_${Date.now()}`).replace(/[^a-zA-Z0-9_]/g, '').slice(0, 40),
  });
};

const confirmOnlinePayment = async ({ orderId, paymentId, signature, expectedRupees }) => {
  const pair = keys();
  if (!pair) return { ok: false, reason: 'Online payment is not configured on the server' };
  if (!orderId || !paymentId || !signature) {
    return { ok: false, reason: 'Payment details are missing' };
  }
  const sign = `${orderId}|${paymentId}`;
  const expectedSign = crypto.createHmac('sha256', pair.keySecret).update(sign).digest('hex');
  if (signature !== expectedSign) return { ok: false, reason: 'Payment could not be verified' };
  const order = await client().orders.fetch(orderId);
  const expectedPaise = Math.round(Number(expectedRupees) * 100);
  if (Number(order.amount) !== expectedPaise) {
    return { ok: false, reason: 'Paid amount does not match this wash' };
  }
  return { ok: true };
};

const createOrder = async (req, res) => {
  try {
    const razorpay = client();
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: 'Online payment is not configured on the server',
      });
    }

    const options = {
      amount: Math.round(Number(req.body.amount) * 100),
      currency: 'INR',
      receipt: `receipt_order_${Math.floor(Math.random() * 1000000)}`,
    };
    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).json({ success: false, message: 'Some error occurred' });
    }
    return res.json({ success: true, key_id: keys().keyId, data: order });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error.message);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const pair = keys();
    if (!pair) {
      return res.status(503).json({
        success: false,
        message: 'Online payment is not configured on the server',
      });
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac('sha256', pair.keySecret)
      .update(sign)
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ success: false, message: 'Invalid signature sent!' });
    }

    if (bookingId) {
      const booking = await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'paid',
        paymentMethod: 'Online',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      }, { new: true });
      if (booking?.user) {
        await notifyUser(booking.user, 'Payment received', 'We received the online payment for your wash.', booking._id);
      }
      const paidName = booking?.customerDetails?.fullName || 'A customer';
      await notifyDesk('Payment received', `${paidName} paid online.`, booking?._id);
      if (booking) await recordBookingLedger(booking);
    }
    return res.status(200).json({ success: true, message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Razorpay Verify Error:', error.message);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const createPaymentLink = async (booking) => {
  const razorpay = client();
  if (!razorpay) return null;
  const link = await razorpay.paymentLink.create({
    amount: Math.round(Number(booking.finalPrice) * 100),
    currency: 'INR',
    description: `${booking.service || 'Car wash'} ${booking.date || ''}`.trim(),
    customer: {
      name: booking.customerDetails?.fullName || 'Customer',
      contact: String(booking.customerDetails?.mobile || '').replace(/\D/g, '').slice(-10),
    },
    notify: { sms: false, email: false },
    reminder_enable: false,
    notes: { bookingId: String(booking._id) },
  });
  booking.paymentLinkId = link.id;
  booking.paymentUrl = link.short_url;
  booking.paymentMethod = 'Online';
  booking.paymentStatus = 'pending';
  await booking.save();
  return link.short_url;
};

const refundPayment = async (booking, amount) => {
  const razorpay = client();
  const rupees = Math.round(Number(amount) || Number(booking.finalPrice) || 0);
  booking.refundAmount = rupees;
  booking.paymentStatus = 'refunded';
  if (razorpay && booking.paymentId) {
    await razorpay.payments.refund(booking.paymentId, { amount: rupees * 100 });
  }
  await booking.save();
  await recordBookingLedger(booking);
  return booking;
};

module.exports = {
  createOrder,
  verifyPayment,
  createPaymentLink,
  refundPayment,
  openOrder,
  confirmOnlinePayment,
  keys,
};
