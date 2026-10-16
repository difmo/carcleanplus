const { confirmOnlinePayment, createPlanPaymentLink, readPaymentLink, keys } = require('./paymentController');
const Vehicle = require('../models/Vehicle');
const AppNotification = require('../models/AppNotification');
const User = require('../models/User');
const { getCatalog } = require('../utils/catalogStore');
const { presentCatalog } = require('../utils/quote');
const { notifyUser } = require('../utils/notify');
const { findCity } = require('../utils/cities');

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
  const catalog = await getCatalog();
  const known = new Set(catalog.prices.map((row) => String(row.category).toLowerCase()));
  if (!known.has(category.toLowerCase())) {
    return res.status(400).json({ success: false, message: `${category} is not a vehicle size we price` });
  }
  if (req.body.isDefault) {
    await Vehicle.updateMany({ user: req.user._id }, { isDefault: false });
  }
  const vehicle = await Vehicle.create({
    user: req.user._id,
    name,
    category,
    plate: String(req.body.plate || '').trim().toUpperCase().slice(0, 15),
    isDefault: Boolean(req.body.isDefault) || !(await Vehicle.exists({ user: req.user._id })),
  });
  return res.status(201).json({ success: true, data: vehicle });
};

const setDefaultVehicle = async (req, res) => {
  const vehicle = await Vehicle.findOne({ _id: req.params.id, user: req.user._id });
  if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
  await Vehicle.updateMany({ user: req.user._id }, { isDefault: false });
  vehicle.isDefault = true;
  await vehicle.save();
  return res.status(200).json({ success: true, data: vehicle });
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

const grantPlan = async (user, plan) => {
  user.planName = plan.name;
  user.planWashesLeft = (user.planWashesLeft || 0) + Number(plan.washes || 0);
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 30);
  user.planExpiresAt = expiry;
  user.pendingPlan = { name: '', linkId: '', url: '' };
  await user.save();
  await notifyUser(user._id, 'Wash plan added', `${plan.name} is on your account.`);
};

// A plan bought through a payment link becomes active once Razorpay says the
// link is paid.
const settlePendingPlan = async (user) => {
  const linkId = user.pendingPlan?.linkId;
  if (!linkId) return;
  try {
    const link = await readPaymentLink(linkId);
    if (!link) return;
    if (link.status === 'paid') {
      const catalog = await getCatalog();
      const plan = catalog.plans.find((item) => item.name === user.pendingPlan.name);
      if (!plan) return;
      if ((user.planPayments || []).includes(linkId)) return;
      user.planPayments = [...(user.planPayments || []), linkId];
      await grantPlan(user, plan);
    } else if (['cancelled', 'expired'].includes(link.status)) {
      user.pendingPlan = { name: '', linkId: '', url: '' };
      await user.save();
    }
  } catch (error) {
    console.warn('Plan payment was not read:', error.message);
  }
};

const planView = (user, view) => ({
  plans: view.plans,
  planName: user.planName,
  washesLeft: user.planExpiresAt && new Date(user.planExpiresAt) < new Date() ? 0 : user.planWashesLeft,
  expiresAt: user.planExpiresAt,
  credit: user.credit,
  referralCode: user.referralCode,
  pendingPlan: user.pendingPlan?.linkId ? { name: user.pendingPlan.name, url: user.pendingPlan.url } : null,
  paymentsEnabled: Boolean(keys()),
});

const getPlan = async (req, res) => {
  const user = await User.findById(req.user._id);
  await settlePendingPlan(user);
  const view = await presentCatalog();
  return res.status(200).json({ success: true, data: planView(user, view) });
};

const buyPlan = async (req, res) => {
  const catalog = await getCatalog();
  const plan = catalog.plans.find((item) => item.name === req.body.name);
  if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
  const amount = Number(plan.amount) || 0;
  const user = await User.findById(req.user._id);

  // Checkout flow: the client already paid a Razorpay order.
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
    await grantPlan(user, plan);
    const view = await presentCatalog();
    return res.status(200).json({ success: true, message: `${plan.name} is on your account`, data: planView(user, view) });
  }

  // App flow: hand back a payment link. The plan turns on once it is paid.
  if (!keys()) {
    return res.status(503).json({ success: false, message: 'Online payment is not configured on the server' });
  }
  if (amount < 1) {
    return res.status(400).json({ success: false, message: 'This plan has no price set' });
  }
  const link = await createPlanPaymentLink(user, plan);
  user.pendingPlan = { name: plan.name, linkId: link.id, url: link.short_url };
  await user.save();
  const view = await presentCatalog();
  return res.status(200).json({
    success: true,
    message: `Pay ₹${amount} to turn on ${plan.name}`,
    paymentUrl: link.short_url,
    data: planView(user, view),
  });
};

const listAddresses = async (req, res) => {
  const user = await User.findById(req.user._id);
  return res.status(200).json({ success: true, data: user.addresses || [] });
};

const addAddress = async (req, res) => {
  const address = String(req.body.address || '').trim();
  const city = findCity(req.body.city);
  if (address.length < 8) {
    return res.status(400).json({ success: false, message: 'Add the full address where the vehicle is parked' });
  }
  if (!city) {
    return res.status(400).json({ success: false, message: `${req.body.city || 'This city'} is outside the service area` });
  }
  const user = await User.findById(req.user._id);
  const makeDefault = Boolean(req.body.isDefault) || !(user.addresses || []).length;
  if (makeDefault) user.addresses.forEach((row) => { row.isDefault = false; });
  const lat = Number(req.body.latitude);
  const lng = Number(req.body.longitude);
  user.addresses.push({
    label: String(req.body.label || 'Home').trim().slice(0, 30) || 'Home',
    address: address.slice(0, 300),
    city: city.name,
    latitude: Number.isFinite(lat) ? lat : undefined,
    longitude: Number.isFinite(lng) ? lng : undefined,
    isDefault: makeDefault,
  });
  if (makeDefault) {
    user.address = address;
    user.city = city.name;
  }
  await user.save();
  return res.status(201).json({ success: true, data: user.addresses });
};

const setDefaultAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  const row = user.addresses.id(req.params.id);
  if (!row) return res.status(404).json({ success: false, message: 'Address not found' });
  user.addresses.forEach((item) => { item.isDefault = String(item._id) === String(row._id); });
  user.address = row.address;
  user.city = row.city;
  await user.save();
  return res.status(200).json({ success: true, data: user.addresses });
};

const removeAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  const row = user.addresses.id(req.params.id);
  if (!row) return res.status(404).json({ success: false, message: 'Address not found' });
  const wasDefault = row.isDefault;
  row.deleteOne();
  if (wasDefault && user.addresses.length) {
    user.addresses[0].isDefault = true;
    user.address = user.addresses[0].address;
    user.city = user.addresses[0].city;
  }
  await user.save();
  return res.status(200).json({ success: true, data: user.addresses });
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
  setDefaultVehicle,
  removeVehicle,
  listAddresses,
  addAddress,
  setDefaultAddress,
  removeAddress,
  listNotifications,
  markNotificationsRead,
  savePushToken,
  removePushToken,
  getPlan,
  buyPlan,
  applyReferral,
};
