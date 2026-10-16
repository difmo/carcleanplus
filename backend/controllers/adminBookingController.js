const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Payout = require('../models/Payout');
const User = require('../models/User');
const { pushStatus } = require('../utils/bookingPath');
const { notifyBooking, notifyUser, notifyDesk, notifyStaffJob } = require('../utils/notify');
const { slotIsFull, getDateVariations: slotDateVariations, SLOT_IDS } = require('../utils/slots');
const { recordBookingLedger } = require('../utils/ledger');
const { getCatalog } = require('../utils/catalogStore');
const { buildQuote } = require('../utils/quote');

const VALID_STATUSES = ['lead', 'pending', 'confirmed', 'accepted', 'on_the_way', 'in_progress', 'completed', 'cancelled', 'blocked'];
const PAYMENT_METHODS = ['Cash', 'UPI', 'Online'];
const LIST_LIMIT = 500;

const lastTen = (value) => String(value || '').replace(/\D/g, '').slice(-10);

const todayInIndia = () => {
  const shifted = new Date(Date.now() + (5.5 * 60 * 60 * 1000));
  return shifted.toISOString().slice(0, 10);
};

const isPaid = (booking) => String(booking.paymentStatus || '').toLowerCase() === 'paid';

// Pays the washer once for a finished job, whoever marked it finished.
const ensurePayout = async (booking) => {
  const staffId = booking.assignedStaff?._id || booking.assignedStaff;
  if (!staffId) return;
  const existing = await Payout.findOne({ booking: booking._id, staff: staffId });
  if (existing) return;
  const catalog = await getCatalog();
  await Payout.create({ staff: staffId, booking: booking._id, amount: Number(catalog.staffPayPerJob) || 0 });
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const filter = {};
    const status = String(req.query.status || '').toLowerCase();
    if (status) {
      filter.status = status;
    } else {
      // Unfinished checkouts are noise on the desk; ask for status=lead to see them.
      filter.status = { $ne: 'lead' };
    }
    if (req.query.date) {
      const dates = slotDateVariations(String(req.query.date));
      filter.date = dates.length ? { $in: dates } : String(req.query.date);
    }
    if (req.query.staff) {
      if (!mongoose.Types.ObjectId.isValid(String(req.query.staff))) {
        return res.status(400).json({ success: false, message: 'Invalid staff id' });
      }
      filter.assignedStaff = req.query.staff;
    }
    if (req.query.unassigned === '1') {
      filter.assignedStaff = null;
      if (!status) filter.status = { $in: ['pending', 'confirmed'] };
    }
    if (req.query.payment) filter.paymentMethod = req.query.payment;
    if (req.query.branch) filter.branch = req.query.branch;
    if (req.query.q) {
      const q = String(req.query.q).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { 'customerDetails.fullName': new RegExp(q, 'i') },
        { 'customerDetails.mobile': new RegExp(q, 'i') },
        { service: new RegExp(q, 'i') },
      ];
    }

    const bookings = await Booking.find(filter)
      .select('-beforePhoto -afterPhoto -reports.image')
      .sort({ createdAt: -1 })
      .limit(LIST_LIMIT)
      .populate('assignedStaff', 'name phone role');
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single booking
// @route   GET /api/admin/bookings/:id
// @access  Private/Admin
const getBookingById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid booking ID' });
    }

    const booking = await Booking.findById(req.params.id).populate('assignedStaff', 'name phone role');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/admin/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid booking ID' });
    }

    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Please provide a status' });
    }

    const normalizedStatus = String(status).toLowerCase();
    if (!VALID_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({ success: false, message: `Invalid status: ${status}. Must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.status === normalizedStatus) {
      return res.status(400).json({ success: false, message: `This booking is already ${normalizedStatus.replace(/_/g, ' ')}` });
    }
    const reason = String(req.body.reason || '').trim().slice(0, 200);
    booking.status = normalizedStatus;
    pushStatus(
      booking,
      normalizedStatus,
      req.user?.name || 'Desk',
      req.user?.role || 'admin',
      reason,
    );
    await booking.save();

    if (normalizedStatus === 'completed') await ensurePayout(booking);
    await recordBookingLedger(booking);
    await notifyBooking(booking, normalizedStatus);
    if (booking.assignedStaff) {
      const customer = booking.customerDetails?.fullName || 'A customer';
      await notifyStaffJob(
        booking,
        'Desk updated a job',
        `${customer} is now ${normalizedStatus.replace(/_/g, ' ')}.`,
      );
    }

    await booking.populate('assignedStaff', 'name phone role');
    res.status(200).json({ success: true, message: 'Booking status updated successfully', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change the date, slot, price, notes or payment of a booking
// @route   PUT /api/admin/bookings/:id
// @access  Private/Admin
const updateBooking = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid booking ID' });
    }
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (['blocked', 'lead'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: 'Only real bookings can be edited' });
    }

    const notes = [];
    const date = req.body.date === undefined ? booking.date : String(req.body.date).trim();
    const timeSlot = req.body.timeSlot === undefined ? booking.timeSlot : String(req.body.timeSlot).trim();
    const moved = date !== booking.date || timeSlot !== booking.timeSlot;
    if (moved) {
      if (['completed', 'cancelled'].includes(booking.status)) {
        return res.status(400).json({ success: false, message: 'A finished or cancelled wash cannot be moved' });
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ success: false, message: 'Date must be YYYY-MM-DD' });
      }
      if (!SLOT_IDS.includes(timeSlot)) {
        return res.status(400).json({ success: false, message: 'Choose one of the six daily slots' });
      }
      const full = await slotIsFull({ date, timeSlot, city: booking.location?.city, excludeId: booking._id });
      if (full) {
        return res.status(409).json({ success: false, message: `${timeSlot} on ${date} is full or blocked` });
      }
      booking.date = date;
      booking.timeSlot = timeSlot;
      notes.push(`Moved to ${date} · ${timeSlot}`);
    }

    if (req.body.finalPrice !== undefined) {
      const price = Number(req.body.finalPrice);
      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({ success: false, message: 'Price must be zero or more' });
      }
      if (price !== Number(booking.finalPrice || 0)) {
        notes.push(`Price changed from ₹${booking.finalPrice || 0} to ₹${price}`);
        booking.finalPrice = price;
      }
    }

    if (req.body.instructions !== undefined) {
      booking.customerDetails = booking.customerDetails || {};
      booking.customerDetails.instructions = String(req.body.instructions).slice(0, 500);
    }

    if (req.body.markPaid === true && !isPaid(booking)) {
      const method = PAYMENT_METHODS.includes(req.body.paymentMethod) ? req.body.paymentMethod : booking.paymentMethod;
      if (!PAYMENT_METHODS.includes(method)) {
        return res.status(400).json({ success: false, message: 'Choose cash, UPI or online' });
      }
      booking.paymentMethod = method;
      booking.paymentStatus = 'paid';
      notes.push(`Marked paid (${method})`);
    }

    if (!notes.length && req.body.instructions === undefined) {
      return res.status(400).json({ success: false, message: 'Nothing to change' });
    }
    if (notes.length) {
      pushStatus(booking, booking.status, req.user?.name || 'Desk', req.user?.role || 'admin', notes.join(' · '));
    }
    await booking.save();
    await recordBookingLedger(booking);
    if (moved) {
      if (booking.user) {
        await notifyUser(booking.user, 'Wash moved', `Your wash is now on ${booking.date} at ${booking.timeSlot}.`, booking._id);
      }
      await notifyStaffJob(booking, 'Job moved', `${booking.customerDetails?.fullName || 'A customer'} · ${booking.date} ${booking.timeSlot}`);
    }
    await booking.populate('assignedStaff', 'name phone role');
    return res.status(200).json({ success: true, message: 'Booking updated', data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create manual/phone booking or block a slot
// @route   POST /api/admin/bookings/manual
// @access  Private/Admin
const createManualBooking = async (req, res) => {
  try {
    const {
      type = 'phone_booking', // 'phone_booking' | 'block_slot'
      customerName,
      mobile,
      carName,
      carCategory,
      service,
      address,
      date,
      timeSlot,
      paymentMethod = 'Cash',
      notes = '',
      reason = ''
    } = req.body;
    const city = String(req.body.city || 'Lucknow').trim() || 'Lucknow';

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(String(date))) {
      return res.status(400).json({ success: false, message: 'Date must be YYYY-MM-DD' });
    }
    if (String(date) < todayInIndia()) {
      return res.status(400).json({ success: false, message: 'Pick today or a later date' });
    }

    if (!timeSlot) {
      return res.status(400).json({ success: false, message: 'Time slot is required' });
    }
    if (timeSlot !== 'ALL_DAY' && !SLOT_IDS.includes(timeSlot)) {
      return res.status(400).json({ success: false, message: 'Choose one of the six daily slots' });
    }
    if (type === 'phone_booking' && timeSlot === 'ALL_DAY') {
      return res.status(400).json({ success: false, message: 'A phone booking needs one slot' });
    }

    const dateVariations = slotDateVariations(date);

    // If 'ALL_DAY' is selected for blocking, block all standard daily slots
    const slotsToProcess = timeSlot === 'ALL_DAY' ? SLOT_IDS : [timeSlot];

    for (const slot of slotsToProcess) {
      if (type === 'block_slot') {
        const alreadyBlocked = await Booking.findOne({
          date: { $in: dateVariations },
          timeSlot: slot,
          status: 'blocked',
          'location.city': city,
        });
        if (alreadyBlocked) {
          return res.status(409).json({
            success: false,
            message: `Slot '${slot}' on ${date} is already blocked.`,
          });
        }
        continue;
      }
      const full = await slotIsFull({ date, timeSlot: slot, city });
      if (full) {
        return res.status(409).json({
          success: false,
          message: `Slot '${slot}' on ${date} is full. Please choose another slot.`,
        });
      }
    }

    if (type === 'block_slot') {
      const createdRecords = [];
      for (const slot of slotsToProcess) {
        const blockEntry = await Booking.create({
          carModel: {
            name: 'Slot Blocked',
            category: 'Standard'
          },
          service: 'Admin Slot Block',
          location: {
            address: address || 'Service Area (Blocked)',
            city
          },
          date,
          timeSlot: slot,
          customerDetails: {
            fullName: reason ? `[BLOCKED] ${reason}` : '[BLOCKED] Slot Blocked by Admin',
            mobile: '0000000000',
            instructions: reason || 'Slot blocked by Admin'
          },
          finalPrice: 0,
          paymentMethod: 'N/A',
          status: 'blocked',
          bookingSource: 'admin_block'
        });
        createdRecords.push(blockEntry);
      }

      return res.status(201).json({
        success: true,
        message: `Successfully blocked ${createdRecords.length} slot(s) for ${date}`,
        data: createdRecords
      });
    }

    // Phone / Manual Booking
    const name = String(customerName || '').trim();
    const phone = lastTen(mobile);
    if (!name || !mobile) {
      return res.status(400).json({ success: false, message: 'Customer name and mobile number are required' });
    }
    if (phone.length !== 10) {
      return res.status(400).json({ success: false, message: 'Mobile number needs 10 digits' });
    }
    if (!PAYMENT_METHODS.includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: 'Payment must be Cash, UPI or Online' });
    }
    const category = carCategory || 'Standard';
    const serviceName = service || 'Basic Wash';

    // Price: the desk can type one; otherwise use the catalog like the app does.
    let price = Number(req.body.finalPrice);
    if (!Number.isFinite(price) || price <= 0) {
      const quote = await buildQuote({ category, service: serviceName, city });
      if (quote.refused) {
        return res.status(400).json({ success: false, message: `${quote.reason}. Type the price instead.` });
      }
      price = quote.total;
    }

    // Link the booking to the customer's app account when the phone matches,
    // so it shows up in their bookings and they get updates.
    const owner = await User.findOne({
      role: 'customer',
      phone: new RegExp(`${phone.split('').join('\\D*')}$`),
    }).select('_id');

    const newBooking = await Booking.create({
      user: owner?._id,
      carModel: {
        name: carName || 'Customer Vehicle',
        category
      },
      service: serviceName,
      location: {
        address: address || `${city} (Phone Booking)`,
        city
      },
      date,
      timeSlot,
      customerDetails: {
        fullName: name,
        mobile: phone,
        instructions: notes || 'Booked manually via Admin (Phone call)'
      },
      finalPrice: price,
      paymentMethod,
      paymentStatus: req.body.alreadyPaid === true ? 'paid' : 'pending',
      status: 'confirmed',
      bookingSource: 'phone',
      timeline: [{
        status: 'confirmed',
        at: new Date(),
        byName: req.user?.name || 'Desk',
        byRole: 'admin',
        note: 'Phone booking',
      }],
    });

    await recordBookingLedger(newBooking);

    await notifyDesk(
      'Phone booking',
      `${name} · ${serviceName} · ${date} ${timeSlot}`,
      newBooking._id,
    );
    if (owner) {
      await notifyUser(owner._id, 'Wash booked', `${serviceName} on ${date} at ${timeSlot}.`, newBooking._id);
    }

    res.status(201).json({
      success: true,
      message: `Phone booking confirmed for ${name} on ${date} (${timeSlot})`,
      data: newBooking
    });
  } catch (error) {
    console.error('Manual booking creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete booking or unblock slot
// @route   DELETE /api/admin/bookings/:id
// @access  Private/Admin
const deleteBooking = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid booking ID' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    // A paid wash is money on the books: cancel or refund it instead.
    if (isPaid(booking) || String(booking.paymentStatus).toLowerCase() === 'refunded') {
      return res.status(400).json({ success: false, message: 'Paid bookings cannot be deleted. Cancel or refund it instead.' });
    }
    await booking.deleteOne();

    res.status(200).json({
      success: true,
      message: booking.status === 'blocked' ? 'Slot unblocked successfully' : 'Booking deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const assignBooking = async (req, res) => {
  try {
    const { staffId } = req.body;
    if (!staffId) {
      return res.status(400).json({ success: false, message: 'Choose a staff member' });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id) || !mongoose.Types.ObjectId.isValid(staffId)) {
      return res.status(400).json({ success: false, message: 'Invalid id' });
    }

    const staffUser = await User.findById(staffId);
    if (!staffUser || staffUser.role !== 'staff') {
      return res.status(400).json({ success: false, message: 'That account is not staff' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (['cancelled', 'completed', 'blocked'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: 'This wash can no longer be assigned' });
    }
    const previous = booking.assignedStaff ? String(booking.assignedStaff) : '';
    if (previous === String(staffUser._id)) {
      return res.status(400).json({ success: false, message: `Already assigned to ${staffUser.name}` });
    }

    booking.assignedStaff = staffUser._id;
    booking.washerName = staffUser.name || '';
    booking.washerPhone = staffUser.phone || '';
    // A new washer has to accept the job again.
    if (['pending', 'lead', 'accepted', 'on_the_way'].includes(booking.status)) {
      booking.status = 'confirmed';
    }
    pushStatus(
      booking,
      booking.status,
      req.user?.name || 'Desk',
      'admin',
      `Assigned to ${staffUser.name || 'washer'}`,
    );
    await booking.save();
    await booking.populate('assignedStaff', 'name phone role');
    if (previous) {
      await notifyUser(previous, 'Job moved to another washer', `${booking.customerDetails?.fullName || 'A customer'} · ${booking.date} ${booking.timeSlot}`, booking._id);
    }
    if (booking.user) {
      const userId = booking.user._id || booking.user;
      await notifyUser(
        userId,
        'Washer assigned',
        `${staffUser.name || 'A washer'} will do this wash.`,
        booking._id,
      );
    }
    const customer = booking.customerDetails?.fullName || 'A customer';
    await notifyStaffJob(
      booking,
      'New job',
      `${customer} · ${booking.service || 'Wash'} · ${booking.date || ''} ${booking.timeSlot || ''}`.trim(),
    );

    return res.status(200).json({
      success: true,
      message: `Assigned to ${staffUser.name}`,
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  updateBooking,
  createManualBooking,
  deleteBooking,
  assignBooking,
  ensurePayout,
};
