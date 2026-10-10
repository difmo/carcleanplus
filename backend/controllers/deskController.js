const User = require('../models/User');
const Booking = require('../models/Booking');
const Branch = require('../models/Branch');
const Promo = require('../models/Promo');
const Payout = require('../models/Payout');
const { refundPayment } = require('./paymentController');
const { notifyUser, notifyDesk } = require('../utils/notify');

const listStaff = async (req, res) => {
  const staff = await User.find({ role: 'staff' }).select('name phone email branch onShift').sort({ name: 1 });
  return res.status(200).json({ success: true, data: staff });
};

const dailyReport = async (req, res) => {
  const date = String(req.query.date || '');
  if (!date) return res.status(400).json({ success: false, message: 'Date is required' });
  const bookings = await Booking.find({
    date,
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
        .filter((booking) => booking.paymentStatus !== 'paid' && booking.paymentStatus !== 'refunded')
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
  const { name, email, phone, password, branch } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
  }
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ success: false, message: 'That email is already used' });
  const staff = await User.create({
    name,
    email,
    phone: phone || '',
    password,
    role: 'staff',
    branch: branch || '',
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

const createPromo = async (req, res) => {
  const code = String(req.body.code || '').trim().toUpperCase();
  if (!code) return res.status(400).json({ success: false, message: 'Code is required' });
  const promo = await Promo.create({
    code,
    kind: req.body.kind === 'percent' ? 'percent' : 'flat',
    value: Number(req.body.value) || 0,
    active: req.body.active !== false,
    maxUses: Number(req.body.maxUses) || 0,
  });
  return res.status(201).json({ success: true, data: promo });
};

const listPayroll = async (req, res) => {
  const rows = await Payout.find()
    .sort({ createdAt: -1 })
    .populate('staff', 'name phone')
    .populate('booking', 'date service finalPrice');
  return res.status(200).json({ success: true, data: rows });
};

const markPayoutPaid = async (req, res) => {
  const row = await Payout.findById(req.params.id);
  if (!row) return res.status(404).json({ success: false, message: 'Payout not found' });
  row.paid = true;
  row.paidAt = new Date();
  await row.save();
  return res.status(200).json({ success: true, data: row });
};

const refundBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  const amount = Number(req.body.amount) || Number(booking.finalPrice) || 0;
  await refundPayment(booking, amount);
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
};
