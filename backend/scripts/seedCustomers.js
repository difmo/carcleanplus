require('dotenv').config();

const PASSWORD = 'Test@123';
const API_BASE = process.env.API_BASE || 'https://carcleanplus-backend.vercel.app/api';

const customers = [
  {
    name: 'Priya Nair',
    email: 'priya.nair@carcleanplus.com',
    phone: '9000000001',
    vehicle: { name: 'Maruti Suzuki Swift', category: 'Compact', isDefault: true },
    plan: 'City 4',
    booking: true,
  },
  {
    name: 'Rahul Mehta',
    email: 'rahul.mehta@carcleanplus.com',
    phone: '9000000002',
    vehicle: { name: 'Hyundai Creta', category: 'Large', isDefault: true },
    referredByFirst: true,
  },
  {
    name: 'Ananya Iyer',
    email: 'ananya.iyer@carcleanplus.com',
    phone: '9000000003',
    vehicle: { name: 'Honda City', category: 'Standard', isDefault: true },
  },
];

const slots = [
  'Slot 1 \u2013 08:30 AM',
  'Slot 2 \u2013 10:00 AM',
  'Slot 3 \u2013 11:30 AM',
  'Slot 4 \u2013 01:30 PM',
  'Slot 5 \u2013 03:00 PM',
  'Slot 6 \u2013 04:30 PM',
];

function ymdOffset(days) {
  const ist = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  ist.setUTCDate(ist.getUTCDate() + days);
  const month = String(ist.getUTCMonth() + 1).padStart(2, '0');
  const day = String(ist.getUTCDate()).padStart(2, '0');
  return `${ist.getUTCFullYear()}-${month}-${day}`;
}

function tomorrowYmd() {
  return ymdOffset(1);
}

const sampleOrders = [
  { service: 'Basic Wash', status: 'pending', price: 299, day: 1, slot: 0, paymentMethod: 'Cash', address: '12 Hazratganj, Lucknow' },
  { service: 'Premium Wash', status: 'confirmed', price: 499, day: 1, slot: 2, paymentMethod: 'UPI', address: '44 Gomti Nagar, Lucknow' },
  { service: 'Complete Clean', status: 'on_the_way', price: 699, day: 0, slot: 3, paymentMethod: 'Online', address: '8 Vibhuti Khand, Lucknow' },
  { service: 'Festive Offer', status: 'completed', price: 899, day: -3, slot: 1, paymentMethod: 'Cash', address: '21 Aliganj, Lucknow', rating: 5 },
];

async function api(path, { method = 'GET', token, body } = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, data };
}

async function ensureAccount(customer, referralCode) {
  const registered = await api('/auth/register', {
    method: 'POST',
    body: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      password: PASSWORD,
      ...(referralCode ? { referralCode } : {}),
    },
  });
  if (registered.ok) return registered.data;

  const loggedIn = await api('/auth/login', {
    method: 'POST',
    body: { email: customer.email, password: PASSWORD },
  });
  if (!loggedIn.ok) {
    const message = loggedIn.data.message || `HTTP ${loggedIn.status}`;
    throw new Error(`${customer.email}: ${message}`);
  }
  return loggedIn.data;
}

function missingRoute(result) {
  return result.status === 404;
}

async function ensureVehicle(token, vehicle) {
  const existing = await api('/account/vehicles', { token });
  if (missingRoute(existing)) return 'skipped, /account/vehicles is not deployed';
  const rows = Array.isArray(existing.data.data) ? existing.data.data : [];
  if (rows.some((row) => row.name === vehicle.name)) return 'kept';
  const created = await api('/account/vehicles', { method: 'POST', token, body: vehicle });
  if (!created.ok) throw new Error(created.data.message || 'Could not add vehicle');
  return 'added';
}

async function ensurePlan(token, planName) {
  const current = await api('/account/plan', { token });
  if (missingRoute(current)) return 'skipped, /account/plan is not deployed';
  if (current.data.data && current.data.data.planName) return 'kept';
  const bought = await api('/account/plan', { method: 'POST', token, body: { name: planName } });
  if (!bought.ok) throw new Error(bought.data.message || 'Could not add plan');
  return 'added';
}

async function ensureReferral(token, code) {
  const current = await api('/account/plan', { token });
  if (missingRoute(current)) return 'skipped, /account/referral is not deployed';
  if ((current.data.data && current.data.data.credit) > 0) return 'kept';
  const applied = await api('/account/referral', { method: 'POST', token, body: { code } });
  if (!applied.ok) return applied.data.message || 'skipped';
  return 'added';
}

async function ensureBooking(token, customer) {
  const mine = await api('/booking/mine', { token });
  if (missingRoute(mine)) return 'skipped, /booking/mine is not deployed';
  const rows = Array.isArray(mine.data.data) ? mine.data.data : [];
  if (rows.length) return 'kept';

  const date = tomorrowYmd();
  const payload = {
    carModel: { name: customer.vehicle.name, category: customer.vehicle.category },
    service: 'Basic Wash',
    location: {
      address: '12 Hazratganj, Lucknow',
      city: 'Lucknow',
      pincode: '226001',
    },
    date,
    timeSlot: slots[0],
    customerDetails: {
      fullName: customer.name,
      mobile: customer.phone,
      instructions: 'Seed booking for app testing',
    },
    finalPrice: 299,
    paymentMethod: 'Cash',
    bookingSource: 'app',
  };

  let lastError = 'Could not create booking';
  for (const timeSlot of slots) {
    const created = await api('/booking', {
      method: 'POST',
      token,
      body: { ...payload, timeSlot },
    });
    if (!created.ok) {
      lastError = created.data.message || lastError;
      continue;
    }
    const id = created.data.data && created.data.data._id;
    const finalized = await api(`/booking/${id}`, {
      method: 'PUT',
      token,
      body: { ...payload, timeSlot, paymentMethod: 'Cash' },
    });
    if (!finalized.ok) {
      lastError = finalized.data.message || lastError;
      continue;
    }
    return `added ${date} ${timeSlot}`;
  }
  throw new Error(lastError);
}

async function seedViaApi() {
  console.log(`Seeding customers through ${API_BASE}`);
  const accounts = [];
  for (const customer of customers) {
    const account = await ensureAccount(customer);
    accounts.push({ customer, ...account });
    console.log(`account  ${customer.email}`);
  }

  const referrerCode = accounts[0].user && accounts[0].user.referralCode;
  for (const account of accounts) {
    const { customer, token } = account;
    const vehicle = await ensureVehicle(token, customer.vehicle);
    console.log(`vehicle  ${customer.email} ${vehicle} ${customer.vehicle.name}`);
    if (customer.plan) {
      const plan = await ensurePlan(token, customer.plan);
      console.log(`plan     ${customer.email} ${plan} ${customer.plan}`);
    }
    if (customer.referredByFirst && referrerCode) {
      const referral = await ensureReferral(token, referrerCode);
      console.log(`referral ${customer.email} ${referral} ${referrerCode}`);
    }
    if (customer.booking) {
      const booking = await ensureBooking(token, customer);
      console.log(`booking  ${customer.email} ${booking}`);
    }
  }
}

async function seedViaMongo() {
  const mongoose = require('mongoose');
  const User = require('../models/User');
  const Vehicle = require('../models/Vehicle');
  const Booking = require('../models/Booking');
  const AppNotification = require('../models/AppNotification');

  await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);

  const saved = [];
  for (const customer of customers) {
    let user = await User.findOne({ email: customer.email });
    if (!user) {
      user = new User({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        password: PASSWORD,
        role: 'customer',
      });
    } else {
      user.name = customer.name;
      user.phone = customer.phone;
      user.role = 'customer';
      user.password = PASSWORD;
    }
    if (!user.referralCode) {
      user.referralCode = `WASH${customer.phone.slice(-6)}`;
    }
    if (customer.plan) {
      user.planName = customer.plan;
      user.planWashesLeft = user.planWashesLeft || 4;
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 30);
      user.planExpiresAt = user.planExpiresAt || expiry;
    }
    await user.save();
    saved.push({ customer, user });
    console.log(`account  ${customer.email}`);
  }

  const referrer = saved[0].user;
  for (const entry of saved) {
    if (!entry.customer.referredByFirst || entry.user.credit > 0) continue;
    entry.user.credit = 50;
    referrer.credit = (referrer.credit || 0) + 50;
    await entry.user.save();
    await referrer.save();
    console.log(`referral ${entry.customer.email} added ${referrer.referralCode}`);
  }

  for (const { customer, user } of saved) {
    const vehicle = await Vehicle.findOne({ user: user._id, name: customer.vehicle.name });
    if (!vehicle) {
      if (customer.vehicle.isDefault) {
        await Vehicle.updateMany({ user: user._id }, { isDefault: false });
      }
      await Vehicle.create({ user: user._id, ...customer.vehicle });
      console.log(`vehicle  ${customer.email} added ${customer.vehicle.name}`);
    } else {
      console.log(`vehicle  ${customer.email} kept ${customer.vehicle.name}`);
    }

    const existing = await Booking.countDocuments({
      user: user._id,
      'customerDetails.instructions': /^Sample order/,
    });
    if (existing >= sampleOrders.length) {
      console.log(`booking  ${customer.email} kept ${existing}`);
      continue;
    }
    for (const sample of sampleOrders) {
      const marker = `Sample order ${sample.service}`;
      const already = await Booking.findOne({
        user: user._id,
        'customerDetails.instructions': marker,
      });
      if (already) continue;
      const booking = await Booking.create({
        carModel: { name: customer.vehicle.name, category: customer.vehicle.category },
        service: sample.service,
        location: { address: sample.address, city: 'Lucknow', pincode: '226001' },
        date: ymdOffset(sample.day),
        timeSlot: slots[sample.slot],
        customerDetails: {
          fullName: customer.name,
          mobile: customer.phone,
          instructions: marker,
        },
        finalPrice: sample.price,
        paymentMethod: sample.paymentMethod,
        paymentStatus: sample.status === 'completed' ? 'paid' : 'pending',
        status: sample.status,
        rating: sample.rating,
        bookingSource: 'app',
        user: user._id,
      });
      await AppNotification.create({
        user: user._id,
        title: 'Wash booked',
        body: `${sample.service} for ${customer.vehicle.name} is ${sample.status.replaceAll('_', ' ')}.`,
        booking: booking._id,
      });
      console.log(`booking  ${customer.email} added ${sample.status} ${booking.date}`);
    }
  }

  const seededIds = saved.map((entry) => entry.user._id);
  const others = await User.find({ role: 'customer', _id: { $nin: seededIds } });
  for (const user of others) {
    const count = await Booking.countDocuments({ user: user._id });
    if (count > 0) continue;
    for (const sample of sampleOrders) {
      await Booking.create({
        carModel: { name: 'Maruti Suzuki Swift', category: 'Compact' },
        service: sample.service,
        location: { address: sample.address, city: 'Lucknow', pincode: '226001' },
        date: ymdOffset(sample.day),
        timeSlot: slots[sample.slot],
        customerDetails: {
          fullName: user.name,
          mobile: user.phone || '9000000099',
          instructions: `Sample order ${sample.service}`,
        },
        finalPrice: sample.price,
        paymentMethod: sample.paymentMethod,
        paymentStatus: sample.status === 'completed' ? 'paid' : 'pending',
        status: sample.status,
        rating: sample.rating,
        bookingSource: 'app',
        user: user._id,
      });
    }
    console.log(`booking  ${user.email} added ${sampleOrders.length} sample orders`);
  }

  const owned = await Booking.find({ user: { $in: seededIds } });
  for (const booking of owned) {
    const customerName = booking.customerDetails?.fullName || 'Customer';
    const steps = pathForStatus(booking.status);
    const last = booking.timeline && booking.timeline[booking.timeline.length - 1];
    if (!last || last.status !== booking.status || booking.timeline.length < steps.length) {
      const end = booking.updatedAt || new Date();
      booking.timeline = steps.map((status, index) => ({
        status,
        at: new Date(end.getTime() - (steps.length - 1 - index) * 40 * 60 * 1000),
        byName: actorName(status, customerName),
        byRole: actorRole(status),
      }));
    }
    if (['on_the_way', 'in_progress', 'completed'].includes(booking.status)) {
      booking.washerName = booking.washerName || 'Amit Sharma';
      booking.washerPhone = booking.washerPhone || '9876500101';
    }
    await booking.save();
  }
  console.log(`path     filled ${owned.length} orders`);

  await mongoose.disconnect();
}

function pathForStatus(status) {
  if (status === 'cancelled' || status === 'canceled') return ['pending', 'cancelled'];
  const steps = ['pending', 'confirmed', 'on_the_way', 'completed'];
  const index = steps.indexOf(status === 'accepted' ? 'confirmed' : status === 'in_progress' ? 'on_the_way' : status);
  if (index < 0) return ['pending'];
  return steps.slice(0, index + 1);
}

function actorName(status, customerName) {
  if (status === 'pending' || status === 'cancelled') return customerName;
  if (status === 'confirmed') return 'Wash desk';
  return 'Amit Sharma';
}

function actorRole(status) {
  if (status === 'pending' || status === 'cancelled') return 'customer';
  if (status === 'confirmed') return 'admin';
  return 'washer';
}

const run = process.env.MONGO_URI ? seedViaMongo : seedViaApi;

run()
  .then(() => {
    console.log('Password for every seeded customer: ' + PASSWORD);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
