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

function tomorrowYmd() {
  const ist = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  ist.setUTCDate(ist.getUTCDate() + 1);
  const month = String(ist.getUTCMonth() + 1).padStart(2, '0');
  const day = String(ist.getUTCDate()).padStart(2, '0');
  return `${ist.getUTCFullYear()}-${month}-${day}`;
}

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

    if (!customer.booking) continue;
    const existing = await Booking.findOne({
      user: user._id,
      'customerDetails.instructions': 'Seed booking for app testing',
    });
    if (existing) {
      console.log(`booking  ${customer.email} kept`);
      continue;
    }
    const booking = await Booking.create({
      carModel: { name: customer.vehicle.name, category: customer.vehicle.category },
      service: 'Basic Wash',
      location: { address: '12 Hazratganj, Lucknow', city: 'Lucknow', pincode: '226001' },
      date: tomorrowYmd(),
      timeSlot: slots[0],
      customerDetails: {
        fullName: customer.name,
        mobile: customer.phone,
        instructions: 'Seed booking for app testing',
      },
      finalPrice: 299,
      paymentMethod: 'Cash',
      paymentStatus: 'pending',
      status: 'pending',
      bookingSource: 'app',
      user: user._id,
    });
    await AppNotification.create({
      user: user._id,
      title: 'Wash booked',
      body: `Basic Wash for ${customer.vehicle.name} is pending.`,
      booking: booking._id,
    });
    console.log(`booking  ${customer.email} added ${booking.date}`);
  }

  await mongoose.disconnect();
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
