const mongoose = require('mongoose');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Branch = require('../models/Branch');
const Promo = require('../models/Promo');
const Payout = require('../models/Payout');
const { refundPayment } = require('./paymentController');
const SupportMessage = require('../models/SupportMessage');
const { notifyUser, notifyDesk } = require('../utils/notify');
const { getDateVariations } = require('../utils/slots');

const validId = (id) => mongoose.Types.ObjectId.isValid(String(id || ''));

const listStaff = async (req, res) => {
  const staff = await User.find({ role: 'staff' }).select('name phone email branch onShift').sort({ name: 1 });
  return res.status(200).json({ success: true, data: staff });
};

const dailyReport = async (req, res) => {
  const date = String(req.query.date || '');
  if (!date) return res.status(400).json({ success: false, message: 'Date is required' });
  const bookings = await Booking.find({
    date: { $in: getDateVariations(date) },
    status: { $nin: ['lead', 'cancelled', 'blocked'] },
  }).populate('assignedStaff', 'name phone').sort({ timeSlot: 1 });
  const sum = (method) =>
    bookings
      .filter((booking) => booking.paymentMethod === method)
      .reduce((total, booking) => total + (Number(booking.finalPrice) || 0), 0);
  const collectedCash = bookings.reduce((total, booking) => total + (Number(booking.collectedCash) || 0), 0);
  const collectedUpi = bookings.reduce((total, booking) => total + (Number(booking.collectedUpi) || 0), 0);
  return res.status(200).json({
    success: true,
    data: {
      date,
      count: bookings.length,
      cash: sum('Cash'),
      upi: sum('UPI'),
      online: sum('Online'),
      collectedCash,
      collectedUpi,
      unpaid: bookings
        .filter((booking) => !['paid', 'refunded'].includes(String(booking.paymentStatus || '').toLowerCase()))
        .reduce((total, booking) => total + (Number(booking.finalPrice) || 0), 0),
      jobs: bookings.map((booking) => ({
        _id: booking._id,
        customer: booking.customerDetails?.fullName || '',
        mobile: booking.customerDetails?.mobile || '',
        service: booking.service,
        timeSlot: booking.timeSlot,
        city: booking.location?.city || '',
        address: booking.location?.address || '',
        finalPrice: booking.finalPrice,
        paymentMethod: booking.paymentMethod,
        paymentStatus: booking.paymentStatus,
        status: booking.status,
        assignedStaff: booking.assignedStaff
          ? { _id: booking.assignedStaff._id, name: booking.assignedStaff.name }
          : null,
      })),
    },
  });
};

const userBookings = async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid user' });
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const phone = String(user.phone || '').replace(/\D/g, '').slice(-10);
  const or = [{ user: user._id }];
  if (phone.length === 10) {
    or.push({
      'customerDetails.mobile': new RegExp(`${phone.split('').join('\\D*')}\\D*$`),
    });
  }
  const bookings = await Booking.find({ $or: or, status: { $ne: 'lead' } }).sort({ createdAt: -1 });
  return res.status(200).json({ success: true, user, data: bookings });
};

const createStaff = async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const phone = String(req.body.phone || '').replace(/\D/g, '').slice(-10);
  const password = String(req.body.password || '');
  const branch = String(req.body.branch || '').trim();
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Enter a valid email' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password needs at least 6 characters' });
  }
  if (req.body.phone && phone.length !== 10) {
    return res.status(400).json({ success: false, message: 'Phone needs 10 digits' });
  }
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ success: false, message: 'That email is already used' });
  const staff = await User.create({
    name,
    email,
    phone,
    password,
    role: 'staff',
    branch,
    onShift: false,
  });
  return res.status(201).json({
    success: true,
    message: 'Staff login created',
    data: { _id: staff._id, name: staff.name, email: staff.email, phone: staff.phone, role: staff.role, branch: staff.branch },
  });
};

const listBranches = async (req, res) => {
  const branches = await Branch.find().sort({ city: 1, name: 1 });
  return res.status(200).json({ success: true, data: branches });
};

const createBranch = async (req, res) => {
  const name = String(req.body.name || '').trim();
  const city = String(req.body.city || '').trim();
  if (!name || !city) return res.status(400).json({ success: false, message: 'Name and city are required' });
  const branch = await Branch.create({ name, city, active: req.body.active !== false });
  return res.status(201).json({ success: true, data: branch });
};

const listPromos = async (req, res) => {
  const promos = await Promo.find().sort({ createdAt: -1 });
  return res.status(200).json({ success: true, data: promos });
};

const promoInput = (body, current = {}) => {
  const kind = body.kind === undefined ? current.kind || 'flat' : (body.kind === 'percent' ? 'percent' : 'flat');
  const value = body.value === undefined ? Number(current.value) : Number(body.value);
  if (!Number.isFinite(value) || value <= 0) return { error: 'Value must be more than zero' };
  if (kind === 'percent' && value > 90) return { error: 'A percent promo can be at most 90%' };
  return { kind, value };
};

const createPromo = async (req, res) => {
  const code = String(req.body.code || '').trim().toUpperCase();
  if (!code) return res.status(400).json({ success: false, message: 'Code is required' });
  if (!/^[A-Z0-9_-]{3,20}$/.test(code)) {
    return res.status(400).json({ success: false, message: 'Code must be 3 to 20 letters or numbers' });
  }
  const input = promoInput(req.body);
  if (input.error) return res.status(400).json({ success: false, message: input.error });
  if (await Promo.findOne({ code })) {
    return res.status(400).json({ success: false, message: `${code} already exists` });
  }
  const promo = await Promo.create({
    code,
    kind: input.kind,
    value: input.value,
    active: req.body.active !== false,
    maxUses: Math.max(0, Number(req.body.maxUses) || 0),
  });
  return res.status(201).json({ success: true, data: promo });
};

const updatePromo = async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid promo' });
  const promo = await Promo.findById(req.params.id);
  if (!promo) return res.status(404).json({ success: false, message: 'Promo not found' });
  if (req.body.value !== undefined || req.body.kind !== undefined) {
    const input = promoInput(req.body, promo);
    if (input.error) return res.status(400).json({ success: false, message: input.error });
    promo.kind = input.kind;
    promo.value = input.value;
  }
  if (req.body.active !== undefined) promo.active = Boolean(req.body.active);
  if (req.body.maxUses !== undefined) promo.maxUses = Math.max(0, Number(req.body.maxUses) || 0);
  await promo.save();
  return res.status(200).json({ success: true, data: promo });
};

const listPayroll = async (req, res) => {
  const rows = await Payout.find()
    .sort({ createdAt: -1 })
    .populate('staff', 'name phone')
    .populate('booking', 'date service finalPrice');
  return res.status(200).json({ success: true, data: rows });
};

const markPayoutPaid = async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid payout' });
  const row = await Payout.findById(req.params.id);
  if (!row) return res.status(404).json({ success: false, message: 'Payout not found' });
  if (row.paid) return res.status(400).json({ success: false, message: 'Already paid' });
  row.paid = true;
  row.paidAt = new Date();
  await row.save();
  return res.status(200).json({ success: true, data: row });
};

const refundBooking = async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid booking' });
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  const payment = String(booking.paymentStatus || '').toLowerCase();
  if (payment === 'refunded') {
    return res.status(400).json({ success: false, message: 'This booking is already refunded' });
  }
  const collected = (Number(booking.collectedCash) || 0) + (Number(booking.collectedUpi) || 0);
  if (payment !== 'paid' && collected <= 0) {
    return res.status(400).json({ success: false, message: 'Nothing was paid for this booking' });
  }
  const price = Number(booking.finalPrice) || 0;
  const most = payment === 'paid' ? Math.max(price, collected) : collected;
  const amount = req.body.amount === undefined ? most : Number(req.body.amount);
  if (!Number.isFinite(amount) || amount <= 0 || amount > most) {
    return res.status(400).json({ success: false, message: `Refund must be between ₹1 and ₹${most}` });
  }
  try {
    await refundPayment(booking, amount);
  } catch (error) {
    return res.status(502).json({ success: false, message: `Payment gateway refused the refund: ${error.error?.description || error.message}` });
  }
  if (booking.user) {
    await notifyUser(booking.user, 'Refund recorded', `₹${booking.refundAmount || amount} was marked refunded.`, booking._id);
  }
  await notifyDesk('Refund recorded', `A wash refund of ₹${booking.refundAmount || amount} was recorded.`, booking._id);
  return res.status(200).json({
    success: true,
    message: booking.paymentId
      ? 'Refund sent to the payment gateway'
      : 'Refund recorded. Collect or return the cash yourself.',
    data: booking,
  });
};

// Latest chat per booking, newest first: the desk's support inbox.
const inbox = async (req, res) => {
  const rows = await SupportMessage.aggregate([
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$booking',
        body: { $first: '$body' },
        fromRole: { $first: '$fromRole' },
        at: { $first: '$createdAt' },
        count: { $sum: 1 },
      },
    },
    { $sort: { at: -1 } },
    { $limit: 100 },
  ]);
  const bookings = await Booking.find({ _id: { $in: rows.map((row) => row._id) } })
    .select('service date timeSlot status customerDetails.fullName customerDetails.mobile');
  const byId = new Map(bookings.map((booking) => [String(booking._id), booking]));
  const data = rows
    .filter((row) => byId.has(String(row._id)))
    .map((row) => {
      const booking = byId.get(String(row._id));
      return {
        booking: String(row._id),
        customer: booking.customerDetails?.fullName || 'Customer',
        mobile: booking.customerDetails?.mobile || '',
        service: booking.service || '',
        date: booking.date || '',
        timeSlot: booking.timeSlot || '',
        status: booking.status || '',
        last: row.body,
        lastFrom: row.fromRole,
        at: row.at,
        count: row.count,
        // The customer spoke last, so the desk owes a reply.
        waiting: row.fromRole === 'customer',
      };
    });
  return res.status(200).json({ success: true, data });
};

module.exports = {
  listStaff,
  dailyReport,
  userBookings,
  createStaff,
  listBranches,
  createBranch,
  listPromos,
  createPromo,
  listPayroll,
  markPayoutPaid,
  refundBooking,
  updatePromo,
  inbox,
};
