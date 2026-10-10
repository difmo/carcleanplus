const AppNotification = require('../models/AppNotification');
const User = require('../models/User');
const transporter = require('../config/mail');
const { admin, initFirebase } = require('./firebaseAdmin');

const statusCopy = {
  pending: ['Wash booked', 'We have the ticket. A washer will be assigned.'],
  confirmed: ['Wash confirmed', 'The desk confirmed this wash.'],
  accepted: ['Washer accepted', 'A washer has taken this job.'],
  on_the_way: ['Washer is on the way', 'The washer is heading to the car.'],
  in_progress: ['Wash started', 'The wash is in progress.'],
  completed: ['Wash finished', 'The car is done. You can rate this wash.'],
  cancelled: ['Wash cancelled', 'This ticket was cancelled.'],
};

const sendPush = async (userId, title, body, bookingId) => {
  if (!initFirebase()) return;
  try {
    const user = await User.findById(userId).select('+pushTokens');
    const tokens = (user?.pushTokens || []).map((item) => item.token).filter(Boolean);
    if (!tokens.length) return;
    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: { title, body: body || '' },
      data: {
        title,
        body: body || '',
        bookingId: bookingId ? String(bookingId) : '',
      },
      webpush: {
        fcmOptions: { link: '/' },
      },
    });
    const stale = [];
    response.responses.forEach((item, index) => {
      const code = item.error?.code || '';
      if (
        code.includes('registration-token-not-registered')
        || code.includes('invalid-registration-token')
      ) {
        stale.push(tokens[index]);
      }
    });
    if (stale.length) {
      await User.updateOne(
        { _id: userId },
        { $pull: { pushTokens: { token: { $in: stale } } } },
      );
    }
  } catch (error) {
    console.warn('Push was not sent:', error.message);
  }
};

const notifyUser = async (userId, title, body, bookingId) => {
  if (!userId || !title) return;
  try {
    await AppNotification.create({
      user: userId,
      title,
      body: body || '',
      booking: bookingId || undefined,
    });
  } catch (error) {
    console.warn('Notification was not saved:', error.message);
  }
  await sendPush(userId, title, body, bookingId);
};

const notifyStaffJob = async (booking, title, body) => {
  const staffId = booking?.assignedStaff?._id || booking?.assignedStaff;
  if (!staffId) return;
  await notifyUser(staffId, title, body, booking._id);
};

const notifyDesk = async (title, body, bookingId) => {
  const desks = await User.find({ role: { $in: ['admin', 'superadmin'] } }).select('_id');
  await Promise.all(desks.map((desk) => notifyUser(desk._id, title, body, bookingId)));
};

const notifyNewCustomer = async (booking) => {
  const sourceKey = booking?.bookingSource === 'app' ? 'app' : 'website';
  if (booking?.bookingSource === 'phone' || booking?.bookingSource === 'admin_block' || booking?.status === 'blocked') {
    return;
  }
  const source = sourceKey === 'app' ? 'App' : 'Website';
  const name = booking?.customerDetails?.fullName || 'New customer';
  const body = `${source} · ${name} · ${booking?.service || 'Wash'} · ${booking?.date || ''} ${booking?.timeSlot || ''}`
    .replace(/\s+/g, ' ')
    .trim();
  const people = await User.find({ role: { $in: ['admin', 'superadmin', 'staff'] } }).select('_id');
  await Promise.all(people.map((person) => notifyUser(person._id, 'New customer', body, booking?._id)));
};

const notifyBooking = async (booking, status) => {
  if (!booking || !booking.user) return;
  const copy = statusCopy[status] || ['Booking update', `Status is now ${status}`];
  const userId = booking.user._id || booking.user;
  await notifyUser(userId, copy[0], copy[1], booking._id);

  try {
    const user = await User.findById(booking.user).select('email');
    const email = user?.email || '';
    const canMail = email && !email.endsWith('@otp.carcleanplus.in');
    if (canMail && process.env.MAIL_USER && process.env.MAIL_PASS) {
      await transporter.sendMail({
        from: `"Car Clean Plus" <${process.env.MAIL_USER}>`,
        to: email,
        subject: copy[0],
        text: `${copy[1]} Open Car Clean Plus to see the ticket.`,
      });
    }
  } catch (error) {
    console.warn('Status mail was not sent:', error.message);
  }
};

module.exports = { notifyBooking, notifyUser, notifyStaffJob, notifyDesk, notifyNewCustomer };
