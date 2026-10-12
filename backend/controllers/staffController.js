const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Payout = require('../models/Payout');
const { pushStatus } = require('../utils/bookingPath');
const { notifyBooking, notifyDesk, notifyUser } = require('../utils/notify');
const { getCatalog } = require('../utils/catalogStore');
const { distanceKm } = require('../utils/cities');
const { recordBookingLedger } = require('../utils/ledger');

const nextStatus = {
  pending: 'accepted',
  confirmed: 'accepted',
  accepted: 'on_the_way',
  on_the_way: 'in_progress',
  in_progress: 'completed',
};

const ownJob = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ success: false, message: 'Invalid job' });
    return null;
  }
  const job = await Booking.findOne({ _id: req.params.id, assignedStaff: req.user._id });
  if (!job) {
    res.status(404).json({ success: false, message: 'Job not found' });
    return null;
  }
  return job;
};

const todayInIndia = () => {
  const shifted = new Date(Date.now() + (5.5 * 60 * 60 * 1000));
  const month = String(shifted.getUTCMonth() + 1).padStart(2, '0');
  const day = String(shifted.getUTCDate()).padStart(2, '0');
  return `${shifted.getUTCFullYear()}-${month}-${day}`;
};

const getMyJobs = async (req, res) => {
  try {
    const date = String(req.query.date || todayInIndia());
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ success: false, message: 'Date must be YYYY-MM-DD' });
    }
    const jobs = await Booking.find({
      assignedStaff: req.user._id,
      date,
      status: { $nin: ['lead', 'cancelled', 'blocked'] },
    }).sort({ timeSlot: 1 });

    return res.status(200).json({ success: true, date, count: jobs.length, data: jobs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getMyJob = async (req, res) => {
  try {
    const job = await ownJob(req, res);
    if (!job) return;
    return res.status(200).json({ success: true, data: job });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateMyJobStatus = async (req, res) => {
  try {
    const job = await ownJob(req, res);
    if (!job) return;

    const requested = String(req.body.status || '').toLowerCase();
    if (requested === 'accepted' && !req.user.onShift) {
      return res.status(400).json({ success: false, message: 'Turn on shift before accepting a job' });
    }
    const expected = nextStatus[job.status];
    if (!expected || requested !== expected) {
      return res.status(400).json({
        success: false,
        message: expected
          ? `Next status must be ${expected}`
          : 'This job cannot be moved further',
      });
    }

    job.status = requested;
    if (requested === 'accepted') {
      job.washerName = req.user.name || job.washerName || '';
      job.washerPhone = req.user.phone || job.washerPhone || '';
    }
    pushStatus(job, requested, req.user.name || 'Washer', 'staff');
    await job.save();
    if (requested === 'completed') {
      const existing = await Payout.findOne({ booking: job._id, staff: req.user._id });
      if (!existing) {
        const catalog = await getCatalog();
        await Payout.create({
          staff: req.user._id,
          booking: job._id,
          amount: Number(catalog.staffPayPerJob) || 0,
        });
      }
    }
    await notifyBooking(job, requested);
    const customer = job.customerDetails?.fullName || 'A customer';
    await notifyDesk(
      'Job update',
      `${req.user.name} marked ${customer} as ${requested.replace(/_/g, ' ')}.`,
      job._id,
    );
    return res.status(200).json({ success: true, message: 'Job updated', data: job });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const setShift = async (req, res) => {
  try {
    req.user.onShift = Boolean(req.body.onShift);
    await req.user.save();
    return res.status(200).json({
      success: true,
      data: { onShift: req.user.onShift },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const savePhotos = async (req, res) => {
  try {
    const job = await ownJob(req, res);
    if (!job) return;
    if (['cancelled', 'blocked', 'lead'].includes(job.status)) {
      return res.status(400).json({ success: false, message: 'This job cannot take a photo' });
    }
    const before = String(req.body.before || '');
    const after = String(req.body.after || '');
    if (!before && !after) {
      return res.status(400).json({ success: false, message: 'Choose a photo' });
    }
    if (before && !before.startsWith('data:image/')) {
      return res.status(400).json({ success: false, message: 'Before photo must be an image' });
    }
    if (after && !after.startsWith('data:image/')) {
      return res.status(400).json({ success: false, message: 'After photo must be an image' });
    }
    if (before && job.status === 'completed') {
      return res.status(400).json({ success: false, message: 'This wash is already finished' });
    }
    if (after && !['in_progress', 'completed'].includes(job.status)) {
      return res.status(400).json({ success: false, message: 'Start the wash before an after photo' });
    }
    if (before.length > 2000000 || after.length > 2000000) {
      return res.status(400).json({ success: false, message: 'Photo is too large. Use a smaller image.' });
    }
    if (before) job.beforePhoto = before;
    if (after) job.afterPhoto = after;
    await job.save();
    return res.status(200).json({ success: true, message: 'Photos saved', data: job });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const collectPayment = async (req, res) => {
  try {
    const job = await ownJob(req, res);
    if (!job) return;
    if (['lead', 'cancelled', 'blocked', 'pending', 'confirmed'].includes(job.status)) {
      return res.status(400).json({ success: false, message: 'Accept the job before collecting payment' });
    }
    const cash = Number(req.body.cash);
    const upi = Number(req.body.upi);
    if (!Number.isFinite(cash) || !Number.isFinite(upi) || cash < 0 || upi < 0) {
      return res.status(400).json({ success: false, message: 'Enter a cash or UPI amount of zero or more' });
    }
    if (cash === 0 && upi === 0) {
      return res.status(400).json({ success: false, message: 'Enter the cash or UPI you collected' });
    }
    const due = Number(job.finalPrice) || 0;
    const already = (Number(job.collectedCash) || 0) + (Number(job.collectedUpi) || 0);
    if (due > 0 && already >= due) {
      return res.status(400).json({ success: false, message: 'This wash is already paid' });
    }
    if (due > 0 && already + cash + upi > due) {
      const left = Math.max(0, due - already);
      return res.status(400).json({ success: false, message: `Only ₹${left} is still due` });
    }
    job.collectedCash = (Number(job.collectedCash) || 0) + cash;
    job.collectedUpi = (Number(job.collectedUpi) || 0) + upi;
    const collected = job.collectedCash + job.collectedUpi;
    const wasPaid = job.paymentStatus === 'paid';
    if (collected >= Number(job.finalPrice || 0)) {
      job.paymentStatus = 'paid';
    }
    if (cash && upi) job.paymentMethod = 'UPI';
    else if (upi) job.paymentMethod = 'UPI';
    else if (cash) job.paymentMethod = 'Cash';
    await job.save();
    await recordBookingLedger(job);
    if (!wasPaid && job.paymentStatus === 'paid') {
      const collectedName = job.customerDetails?.fullName || 'A customer';
      if (job.user) {
        await notifyUser(job.user, 'Payment collected', 'Your washer recorded the payment for this wash.', job._id);
      }
      await notifyDesk('Payment collected', `${req.user.name} collected payment from ${collectedName}.`, job._id);
    }
    return res.status(200).json({ success: true, message: 'Collection saved', data: job });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const clockIn = async (req, res) => {
  try {
    const job = await ownJob(req, res);
    if (!job) return;
    if (job.clockedInAt) {
      return res.status(400).json({ success: false, message: 'Already clocked in' });
    }
    if (!req.user.onShift) {
      return res.status(400).json({ success: false, message: 'Turn on shift before clocking in' });
    }
    if (!['accepted', 'on_the_way', 'in_progress'].includes(job.status)) {
      return res.status(400).json({
        success: false,
        message: job.status === 'completed'
          ? 'This wash is already finished'
          : 'Accept the job before clocking in',
      });
    }
    const lat = Number(req.body.latitude);
    const lng = Number(req.body.longitude);
    const targetLat = Number(job.location?.latitude);
    const targetLng = Number(job.location?.longitude);
    if (Number.isFinite(targetLat) && Number.isFinite(targetLng)) {
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return res.status(400).json({ success: false, message: 'Share your location to clock in' });
      }
      const kilometres = distanceKm(targetLat, targetLng, lat, lng);
      if (kilometres > 0.5) {
        return res.status(400).json({
          success: false,
          message: `You are ${kilometres.toFixed(1)} km from the car. Clock in at the address.`,
        });
      }
    }
    job.clockedInAt = new Date();
    await job.save();
    return res.status(200).json({ success: true, message: 'Clocked in', data: job });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getMySummary = async (req, res) => {
  try {
    const date = todayInIndia();
    const jobs = await Booking.find({
      assignedStaff: req.user._id,
      date,
      status: { $nin: ['lead', 'cancelled', 'blocked'] },
    });
    const countOf = (status) => jobs.filter((job) => job.status === status).length;
    const sum = (field) => jobs.reduce((total, job) => total + (Number(job[field]) || 0), 0);
    return res.status(200).json({
      success: true,
      data: {
        date,
        jobs: jobs.length,
        pending: countOf('pending') + countOf('confirmed'),
        active: countOf('accepted') + countOf('on_the_way') + countOf('in_progress'),
        completed: countOf('completed'),
        collectedCash: sum('collectedCash'),
        collectedUpi: sum('collectedUpi'),
        expected: jobs.reduce((total, job) => total + (Number(job.finalPrice) || 0), 0),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyJobs,
  getMyJob,
  updateMyJobStatus,
  setShift,
  savePhotos,
  collectPayment,
  clockIn,
  getMySummary,
};
