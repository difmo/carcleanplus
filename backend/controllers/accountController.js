const { confirmOnlinePayment } = require('./paymentController');
const Vehicle = require('../models/Vehicle');
const AppNotification = require('../models/AppNotification');
const User = require('../models/User');
const { getCatalog } = require('../utils/catalogStore');
const { presentCatalog } = require('../utils/quote');
const { notifyUser } = require('../utils/notify');

const listVehicles = async (req, res) => {
  const vehicles = await Vehicle.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
  return res.status(200).json({ success: true, data: vehicles });
};

const addVehicle = async (req, res) => {
  const name = String(req.body.name || '').trim();
  const category = String(req.body.category || '').trim();
  if (!name || !category) {
    return res.status(400).json({ success: false, message: 'Vehicle name and size are required' });
  }
  if (req.body.isDefault) {
    await Vehicle.updateMany({ user: req.user._id }, { isDefault: false });
  }
  const vehicle = await Vehicle.create({
    user: req.user._id,
    name,
    category,
    isDefault: Boolean(req.body.isDefault),
  });
  return res.status(201).json({ success: true, data: vehicle });
};

const removeVehicle = async (req, res) => {
  const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
  return res.status(200).json({ success: true, message: 'Vehicle removed' });
};

const listNotifications = async (req, res) => {
  const items = await AppNotification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  const unread = items.filter((item) => !item.read).length;
  return res.status(200).json({ success: true, unread, data: items });
};

const markNotificationsRead = async (req, res) => {
  await AppNotification.updateMany({ user: req.user._id, read: false }, { read: true });
  return res.status(200).json({ success: true });
};

const savePushToken = async (req, res) => {
  const token = String(req.body.token || '').trim();
  if (!token || token.length > 4096) {
    return res.status(400).json({ success: false, message: 'A push token is required' });
  }
  const user = await User.findById(req.user._id).select('+pushTokens');
  const kept = (user.pushTokens || []).filter((item) => item.token !== token);
  kept.push({ token, updatedAt: new Date() });
  user.pushTokens = kept.slice(-6);
  await user.save();
  return res.status(200).json({ success: true, message: 'This browser will get alerts' });
};

const removePushToken = async (req, res) => {
  const token = String(req.body.token || '').trim();
  if (!token) return res.status(400).json({ success: false, message: 'A push token is required' });
  await User.updateOne({ _id: req.user._id }, { $pull: { pushTokens: { token } } });
  return res.status(200).json({ success: true });
};

const getPlan = async (req, res) => {
  const view = await presentCatalog();
  return res.status(200).json({
    success: true,
    data: {
      plans: view.plans,
      planName: req.user.planName,
      washesLeft: req.user.planWashesLeft,
      expiresAt: req.user.planExpiresAt,
      credit: req.user.credit,
      referralCode: req.user.referralCode,
    },
  });
};

const buyPlan = async (req, res) => {
  const catalog = await getCatalog();
  const plan = catalog.plans.find((item) => item.name === req.body.name);
  if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
  const amount = Number(plan.amount) || 0;
  const user = await User.findById(req.user._id);
  if (req.body.razorpay_payment_id) {
    const paymentId = String(req.body.razorpay_payment_id);
    if ((user.planPayments || []).includes(paymentId)) {
      return res.status(400).json({ success: false, message: 'That payment was already used for a plan' });
    }
    const check = await confirmOnlinePayment({
      orderId: req.body.razorpay_order_id,
      paymentId,
      signature: req.body.razorpay_signature,
      expectedRupees: amount,
    });
    if (!check.ok) return res.status(400).json({ success: false, message: check.reason });
    user.planPayments = [...(user.planPayments || []), paymentId];
  }
  user.planName = plan.name;
  user.planWashesLeft = (user.planWashesLeft || 0) + Number(plan.washes || 0);
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 30);
  user.planExpiresAt = expiry;
  await user.save();
  await notifyUser(user._id, 'Wash plan added', `${plan.name} is on your account.`);
  return res.status(200).json({
    success: true,
    message: `${plan.name} added. Pay ₹${plan.amount} on the next wash, or it is collected with the plan.`,
    data: {
      planName: user.planName,
      washesLeft: user.planWashesLeft,
      amount: plan.amount,
    },
  });
};

const applyReferral = async (req, res) => {
  const code = String(req.body.code || '').trim().toUpperCase();
  if (!code) return res.status(400).json({ success: false, message: 'Enter a referral code' });
  if (code === String(req.user.referralCode || '').toUpperCase()) {
    return res.status(400).json({ success: false, message: 'That is your own code' });
  }
  const owner = await User.findOne({ referralCode: code });
  if (!owner) return res.status(404).json({ success: false, message: 'Referral code not found' });
  if (req.user.credit > 0) {
    return res.status(400).json({ success: false, message: 'A referral is already on this account' });
  }
  const user = await User.findById(req.user._id);
  user.credit = (user.credit || 0) + 50;
  owner.credit = (owner.credit || 0) + 50;
  await user.save();
  await owner.save();
  await notifyUser(user._id, 'Referral credit', '₹50 was added to your account.');
  await notifyUser(owner._id, 'Referral credit', `${user.name || 'A friend'} used your code. ₹50 was added.`);
  return res.status(200).json({ success: true, message: '₹50 added for you and your friend', credit: user.credit });
};

module.exports = {
  listVehicles,
  addVehicle,
  removeVehicle,
  listNotifications,
  markNotificationsRead,
  savePushToken,
  removePushToken,
  getPlan,
  buyPlan,
  applyReferral,
};
