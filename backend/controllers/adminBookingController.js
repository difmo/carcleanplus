const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const { pushStatus } = require('../utils/bookingPath');
const { notifyBooking, notifyDesk, notifyStaffJob } = require('../utils/notify');
const { slotIsFull, getDateVariations: slotDateVariations } = require('../utils/slots');

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = String(req.query.status).toLowerCase();
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
      .sort({ createdAt: -1 })
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

    const booking = await Booking.findById(req.params.id);
    
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

    const normalizedStatus = status.toLowerCase();
    const validStatuses = ['lead', 'pending', 'confirmed', 'accepted', 'on_the_way', 'in_progress', 'completed', 'cancelled', 'blocked'];
    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({ success: false, message: `Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}` });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    booking.status = normalizedStatus;
    pushStatus(
      booking,
      normalizedStatus,
      req.user?.name || 'Desk',
      req.user?.role || 'admin',
    );
    await booking.save();

    await notifyBooking(booking, normalizedStatus);
    if (booking.assignedStaff) {
      const customer = booking.customerDetails?.fullName || 'A customer';
      await notifyStaffJob(
        booking,
        'Desk updated a job',
        `${customer} is now ${normalizedStatus.replace(/_/g, ' ')}.`,
      );
    }

    res.status(200).json({ success: true, message: 'Booking status updated successfully', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
      city = 'Lucknow',
      date,
      timeSlot,
      finalPrice = 0,
      paymentMethod = 'Cash',
      notes = '',
      reason = ''
    } = req.body;

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    if (!timeSlot) {
      return res.status(400).json({ success: false, message: 'Time slot is required' });
    }

    // Helper for date variations
    const getDateVariations = (d) => {
      const variations = new Set([d]);
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
        const [year, month, day] = d.split('-');
        variations.add(`${day}-${month}-${year}`);
        variations.add(`${parseInt(day, 10)}-${parseInt(month, 10)}-${year}`);
      } else if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(d)) {
        const [day, month, year] = d.split('-');
        variations.add(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
      }
      return Array.from(variations);
    };

    const dateVariations = getDateVariations(date);

    // If 'ALL_DAY' is selected for blocking, block all standard daily slots
    const slotsToProcess = timeSlot === 'ALL_DAY'
      ? [
          'Slot 1 – 08:30 AM',
          'Slot 2 – 10:00 AM',
          'Slot 3 – 11:30 AM',
          'Slot 4 – 01:30 PM',
          'Slot 5 – 03:00 PM',
          'Slot 6 – 04:30 PM'
        ]
      : [timeSlot];

    for (const slot of slotsToProcess) {
      if (type === 'block_slot') {
        const alreadyBlocked = await Booking.findOne({
          date: { $in: dateVariations },
          timeSlot: slot,
          status: 'blocked',
          'location.city': city || 'Lucknow',
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
            city: city || 'Lucknow'
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
    if (!customerName || !mobile) {
      return res.status(400).json({ success: false, message: 'Customer name and mobile number are required' });
    }

    const newBooking = await Booking.create({
      carModel: {
        name: carName || 'Customer Vehicle',
        category: carCategory || 'Standard'
      },
      service: service || 'Doorstep Car Wash',
      location: {
        address: address || 'Lucknow (Phone Booking)',
        city: city || 'Lucknow'
      },
      date,
      timeSlot,
      customerDetails: {
        fullName: customerName,
        mobile,
        instructions: notes || 'Booked manually via Admin (Phone call)'
      },
      finalPrice: Number(finalPrice) || 0,
      paymentMethod: paymentMethod || 'Cash',
      paymentStatus: paymentMethod === 'Cash' ? 'Cash on Delivery' : 'Paid',
      status: 'confirmed',
      bookingSource: 'phone'
    });

    const customer = customerName || 'A customer';
    await notifyDesk(
      'Phone booking',
      `${customer} · ${service || 'Wash'} · ${date} ${timeSlot}`,
      newBooking._id,
    );

    res.status(201).json({
      success: true,
      message: `Phone booking confirmed for ${customerName} on ${date} (${timeSlot})`,
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

    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

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
    const User = require('../models/User');
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

    booking.assignedStaff = staffUser._id;
    await booking.save();
    await booking.populate('assignedStaff', 'name phone role');
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
  createManualBooking,
  deleteBooking,
  assignBooking,
};
