const Booking = require('../models/Booking');
const { pushStatus } = require('../utils/bookingPath');
const User = require('../models/User');
const SupportMessage = require('../models/SupportMessage');
const transporter = require('../config/mail');
const { slotIsFull, fullSlotIds } = require('../utils/slots');
const { buildQuote } = require('../utils/quote');
const { createPaymentLink, syncPaymentLink } = require('./paymentController');
const { notifyDesk, notifyStaffJob, notifyNewCustomer, notifyBooking, notifyUser } = require('../utils/notify');
const { recordBookingLedger } = require('../utils/ledger');

const SLOT_IDS = [
  'Slot 1 – 08:30 AM',
  'Slot 2 – 10:00 AM',
  'Slot 3 – 11:30 AM',
  'Slot 4 – 01:30 PM',
  'Slot 5 – 03:00 PM',
  'Slot 6 – 04:30 PM',
];

const todayYmd = () => {
  // Bookings are in India, so "today" is the IST date.
  const now = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  return now.toISOString().slice(0, 10);
};

const isPastDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(String(date)) && String(date) < todayYmd();

const isAdmin = (user) => Boolean(user) && ['admin', 'superadmin'].includes(user.role);

// Helper to build date format variations
const getDateVariations = (dateStr) => {
  if (!dateStr) return [];
  const clean = String(dateStr).trim();
  const variations = new Set([clean]);

  // If YYYY-MM-DD
  const ymdMatch = clean.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (ymdMatch) {
    const [_, y, m, d] = ymdMatch;
    const mm = m.padStart(2, '0');
    const dd = d.padStart(2, '0');
    variations.add(`${dd}-${mm}-${y}`);
    variations.add(`${dd}/${mm}/${y}`);
    variations.add(`${y}-${parseInt(m, 10)}-${parseInt(d, 10)}`);
  }

  // If DD-MM-YYYY
  const dmyMatch = clean.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (dmyMatch) {
    const [_, d, m, y] = dmyMatch;
    const mm = m.padStart(2, '0');
    const dd = d.padStart(2, '0');
    variations.add(`${y}-${mm}-${dd}`);
    variations.add(`${dd}/${mm}/${y}`);
    variations.add(`${y}-${parseInt(m, 10)}-${parseInt(d, 10)}`);
  }

  return Array.from(variations);
};

// Get Booked Slots for a date
const getBookedSlots = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date query parameter is required' });
    }

    const city = req.query.city || '';
    const bookedSlots = await fullSlotIds({ date, city, slots: SLOT_IDS });

    return res.status(200).json({
      success: true,
      date,
      city,
      bookedSlots
    });
  } catch (error) {
    console.error('Get Booked Slots Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch booked slots', error: error.message });
  }
};

// Create Lead
const createLead = async (req, res) => {
  try {
    const { mobile, name, fullName } = req.body;
    if (!mobile) {
      return res.status(400).json({ success: false, message: 'Mobile number is required' });
    }

    const customerName = fullName || name || '';

    const lead = await Booking.create({
      customerDetails: { 
        mobile,
        fullName: customerName 
      },
      status: 'lead',
      user: req.user ? req.user._id : undefined,
      bookingSource: req.body.bookingSource === 'app' ? 'app' : 'website',
    });

    return res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead
    });
  } catch (error) {
    console.error('Create Lead Error:', error);
    return res.status(500).json({ success: false, message: 'Something went wrong', error: error.message });
  }
};

// Update Booking (Finalize from Lead)
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      carModel,
      service,
      location,
      date,
      timeSlot,
      customerDetails,
      finalPrice,
      paymentId,
      orderId,
      paymentStatus,
      paymentMethod
    } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    // Only an open lead can be finished without owning it. A lead that
    // belongs to an account can only be finished by that account.
    const owner = req.user && ownsBooking(booking, req.user);
    if (booking.status !== 'lead' && !owner && !isAdmin(req.user)) {
      return res.status(403).json({ success: false, message: 'This booking can no longer be changed' });
    }
    if (booking.status === 'lead' && booking.user && !owner && !isAdmin(req.user)) {
      return res.status(403).json({ success: false, message: 'This booking is not yours' });
    }
    if (date && isPastDate(date)) {
      return res.status(400).json({ success: false, message: 'Choose today or a later date' });
    }
    if (req.body.bookingSource === 'app' && timeSlot && !SLOT_IDS.includes(timeSlot)) {
      return res.status(400).json({ success: false, message: 'Choose one of the listed time slots' });
    }

    const nextCity = location?.city || booking.location?.city;
    if (date && timeSlot) {
      const full = await slotIsFull({
        date,
        timeSlot,
        city: nextCity,
        excludeId: id,
      });
      if (full) {
        return res.status(400).json({
          success: false,
          message: `Slot '${timeSlot}' on ${date} is full in ${nextCity || 'this city'}. Please choose another slot.`
        });
      }
    }

    booking.carModel = carModel || booking.carModel;
    booking.service = service || booking.service;
    booking.location = location || booking.location;
    booking.date = date || booking.date;
    booking.timeSlot = timeSlot || booking.timeSlot;
    
    if (customerDetails) {
      booking.customerDetails.fullName = customerDetails.fullName || booking.customerDetails.fullName;
      booking.customerDetails.instructions = customerDetails.instructions || booking.customerDetails.instructions;
    }
    
    booking.finalPrice = finalPrice || booking.finalPrice;
    booking.paymentId = paymentId || booking.paymentId;
    booking.orderId = orderId || booking.orderId;
    booking.paymentStatus = paymentStatus || booking.paymentStatus;
    if (paymentMethod) {
      booking.paymentMethod = paymentMethod;
    }
    if (location && (location.latitude || location.longitude)) {
      booking.location.latitude = Number(location.latitude) || booking.location.latitude;
      booking.location.longitude = Number(location.longitude) || booking.location.longitude;
    }
    if (Array.isArray(req.body.addons)) {
      booking.addons = req.body.addons.map((name) => ({ name: String(name), price: 0 }));
    }
    if (req.body.branch) booking.branch = String(req.body.branch);

    if (req.body.useServerPrice) {
      const account = req.user ? await User.findById(req.user._id) : null;
      const quote = await buildQuote({
        category: booking.carModel?.category,
        service: booking.service,
        addonNames: (req.body.addons || []).map((item) => (typeof item === 'string' ? item : item.name)),
        city: booking.location?.city,
        latitude: booking.location?.latitude,
        longitude: booking.location?.longitude,
        promoCode: req.body.promoCode,
        providesWaterElectricity: req.body.providesWaterElectricity,
        usePlan: Boolean(req.body.usePlan) && Boolean(account) && !booking.planUsed,
        useCredit: Boolean(req.body.useCredit) && Boolean(account),
        user: account,
      });
      if (quote.refused) {
        return res.status(400).json({ success: false, message: quote.reason });
      }
      const parked = String(booking.location?.address || '').trim();
      if (parked.length < 8) {
        return res.status(400).json({ success: false, message: 'Add the full address where the car is parked' });
      }
      booking.finalPrice = quote.total;
      booking.discount = quote.discount;
      booking.providesWaterElectricity = Boolean(quote.providesWaterElectricity);
      booking.waterElectricityDiscount = quote.waterElectricityDiscount || 0;
      booking.travelFee = quote.travelFee;
      booking.addons = quote.addonLines;
      booking.promoCode = req.body.promoCode ? String(req.body.promoCode).toUpperCase() : '';
      if (quote.planUsed && account) {
        account.planWashesLeft = Math.max(0, account.planWashesLeft - 1);
        booking.planUsed = true;
        await account.save();
      }
      if (quote.creditUsed && account) {
        account.credit = Math.max(0, account.credit - quote.creditUsed);
        booking.creditUsed = quote.creditUsed;
        await account.save();
      }
      if (quote.promo) {
        quote.promo.used += 1;
        await quote.promo.save();
      }
    }
    
    // Upgrade status from lead to pending (or paid if you want)
    if (req.user && !booking.user) {
      booking.user = req.user._id;
    }
    if (req.body.bookingSource === 'app') {
      booking.bookingSource = 'app';
    }

    const becameBooking = booking.status === 'lead';
    if (becameBooking) {
      booking.status = 'pending';
      pushStatus(
        booking,
        'pending',
        booking.customerDetails?.fullName || req.user?.name || 'Customer',
        'customer',
      );
    }

    await booking.save();
    if (becameBooking) {
      await recordBookingLedger(booking);
      await notifyNewCustomer(booking);
      if (booking.user) await notifyBooking(booking, 'pending');
    }

    let paymentMessage = '';
    if (booking.paymentMethod === 'Online' && booking.paymentStatus !== 'paid' && !booking.paymentUrl) {
      try {
        const url = await createPaymentLink(booking);
        if (!url) {
          paymentMessage = 'Online payment is not configured. You can pay the washer at the car.';
        }
      } catch (paymentError) {
        console.warn('Payment link was not created:', paymentError.message);
        paymentMessage = 'The payment link could not be opened. You can pay the washer at the car.';
      }
    }

    // Send email to admin since booking is now complete
    const mailOptions = {
      from: `"Car Clean Plus" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO || 'carcleanplusofficial@gmail.com',
      subject: `New Booking Confirmed - ${service}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>New Booking Confirmed</h2>
          <p>A new booking has been finalized from the Car Clean Plus website.</p>
          <hr>
          
          <h3>Customer Details</h3>
          <p><strong>Name:</strong> ${booking.customerDetails.fullName || 'Customer'}</p>
          <p><strong>Mobile:</strong> ${booking.customerDetails.mobile}</p>
          <p><strong>Instructions:</strong> ${booking.customerDetails.instructions || 'N/A'}</p>
          
          <h3>Booking Details</h3>
          <p><strong>Car:</strong> ${booking.carModel?.name || 'N/A'} (${booking.carModel?.category || 'N/A'})</p>
          <p><strong>Service:</strong> ${booking.service}</p>
          <p><strong>Location:</strong> ${booking.location?.address} (City: ${booking.location?.city || 'N/A'})</p>
          <p><strong>Date & Time:</strong> ${booking.date} | ${booking.timeSlot}</p>
          <p><strong>Total Price:</strong> ₹${booking.finalPrice}</p>

          <hr>
          <p><strong>Booking ID:</strong> ${booking._id}</p>
          <p><strong>Submitted At:</strong> ${new Date(booking.updatedAt).toLocaleString()}</p>
        </div>
      `
    };

    // Send email notification safely (will not crash booking if SMTP is misconfigured)
    try {
      if (process.env.MAIL_USER && process.env.MAIL_PASS) {
        await transporter.sendMail(mailOptions);
      }
    } catch (mailError) {
      console.warn('Booking confirmation email could not be sent (non-critical):', mailError.message);
    }

    return res.status(200).json({
      success: true,
      message: paymentMessage || 'Booking finalized successfully',
      data: booking
    });
  } catch (error) {
    console.error('Update Booking Error:', error);
    return res.status(500).json({ success: false, message: 'Something went wrong', error: error.message });
  }
};

// Create Booking (Old fallback, kept just in case)
const createBooking = async (req, res) => {
  try {
    const {
      carModel,
      service,
      location,
      date,
      timeSlot,
      customerDetails,
      finalPrice,
      paymentMethod
    } = req.body;

    // Validate required fields (Basic validation)
    if (!carModel || !service || !location || !date || !timeSlot || !customerDetails || !finalPrice) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const full = await slotIsFull({
      date,
      timeSlot,
      city: location?.city,
    });
    if (full) {
      return res.status(400).json({
        success: false,
        message: `Slot '${timeSlot}' on ${date} is full. Please choose another slot.`
      });
    }

    // Save booking in MongoDB
    const booking = await Booking.create({
      carModel,
      service,
      location,
      date,
      timeSlot,
      customerDetails,
      finalPrice,
      providesWaterElectricity: Boolean(req.body.providesWaterElectricity),
      waterElectricityDiscount: req.body.providesWaterElectricity ? 100 : 0,
      discount: req.body.discount || (req.body.providesWaterElectricity ? 100 : 0),
      paymentMethod: paymentMethod || 'Online',
      user: req.user ? req.user._id : undefined,
      status: 'pending',
      bookingSource: req.body.bookingSource === 'app' ? 'app' : 'website',
      timeline: [{
        status: 'pending',
        at: new Date(),
        byName: customerDetails.fullName || req.user?.name || 'Customer',
        byRole: 'customer',
      }],
    });

    await notifyNewCustomer(booking);
    if (booking.user) await notifyBooking(booking, 'pending');
    await recordBookingLedger(booking);

    // Email details
    const mailOptions = {
      from: `"Car Clean Plus" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO || 'carcleanplusofficial@gmail.com',
      subject: `New Booking Request - ${service}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>New Booking Confirmed</h2>
          <p>A new booking has been submitted from the Car Clean Plus website.</p>
          <hr>
          
          <h3>Customer Details</h3>
          <p><strong>Name:</strong> ${customerDetails.fullName}</p>
          <p><strong>Mobile:</strong> ${customerDetails.mobile}</p>
          <p><strong>Instructions:</strong> ${customerDetails.instructions || 'N/A'}</p>
          
          <h3>Booking Details</h3>
          <p><strong>Car:</strong> ${carModel.name} (${carModel.category})</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Location:</strong> ${location.address} (Pincode: ${location.pincode})</p>
          <p><strong>Date & Time:</strong> ${date} | ${timeSlot}</p>
          <p><strong>Total Price:</strong> ₹${finalPrice}</p>

          <hr>
          <p><strong>Booking ID:</strong> ${booking._id}</p>
          <p><strong>Submitted At:</strong> ${new Date(booking.createdAt).toLocaleString()}</p>
        </div>
      `
    };

    // Send email notification safely
    try {
      if (process.env.MAIL_USER && process.env.MAIL_PASS) {
        await transporter.sendMail(mailOptions);
      }
    } catch (mailError) {
      console.warn('Booking creation email could not be sent (non-critical):', mailError.message);
    }

    // Success response
    return res.status(201).json({
      success: true,
      message: 'Booking submitted successfully',
      data: booking
    });

  } catch (error) {
    console.error('Booking API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};

const lastTen = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : '';
};

const phonePattern = (digits) =>
  new RegExp(`${String(digits).split('').join('\\D*')}\\D*$`);

const ownsBooking = (booking, user) => {
  if (!booking || !user) return false;
  if (booking.user && String(booking.user) === String(user._id)) return true;
  const bookingPhone = lastTen(booking.customerDetails?.mobile);
  const userPhone = lastTen(user.phone);
  return Boolean(bookingPhone && userPhone && bookingPhone === userPhone);
};

// Customers chat on their own bookings, washers on jobs assigned to them,
// and the desk on any booking.
const canChat = (booking, user) => {
  if (['admin', 'superadmin'].includes(user.role)) return true;
  if (user.role === 'staff') return String(booking.assignedStaff || '') === String(user._id);
  return ownsBooking(booking, user);
};

const getMyBookings = async (req, res) => {
  try {
    const phone = lastTen(req.user.phone);
    const or = [{ user: req.user._id }];
    if (phone) {
      or.push({ 'customerDetails.mobile': phonePattern(phone) });
    }

    const bookings = await Booking.find({
      $or: or,
      status: { $ne: 'lead' },
    })
      .sort({ createdAt: -1 })
      .populate('assignedStaff', 'name phone');

    const unpaid = bookings
      .filter((booking) => booking.paymentLinkId && booking.paymentStatus !== 'paid' && booking.status !== 'cancelled')
      .slice(0, 5);
    await Promise.all(unpaid.map((booking) => syncPaymentLink(booking)));

    const claimIds = bookings
      .filter((booking) => !booking.user && ownsBooking(booking, req.user))
      .map((booking) => booking._id);
    if (claimIds.length) {
      await Booking.updateMany({ _id: { $in: claimIds } }, { user: req.user._id });
    }

    return res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getMyBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('assignedStaff', 'name phone');
    if (!booking || booking.status === 'lead') {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (!ownsBooking(booking, req.user) && !isAdmin(req.user)) {
      return res.status(403).json({ success: false, message: 'This booking is not yours' });
    }
    await syncPaymentLink(booking);
    return res.status(200).json({ success: true, data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const cancelMyBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (!ownsBooking(booking, req.user)) {
      return res.status(403).json({ success: false, message: 'This booking is not yours' });
    }
    if (!['pending', 'confirmed', 'lead'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'A washer has already taken this job. Message the desk to cancel it.',
      });
    }

    booking.status = 'cancelled';
    pushStatus(
      booking,
      'cancelled',
      req.user?.name || booking.customerDetails?.fullName || 'Customer',
      'customer',
      String(req.body?.reason || '').trim().slice(0, 200),
    );
    await booking.save();
    const cancelledName = booking.customerDetails?.fullName || 'A customer';
    await notifyDesk('Wash cancelled', `${cancelledName} cancelled ${booking.service || 'a wash'}.`, booking._id);
    await notifyStaffJob(booking, 'Job cancelled', `${cancelledName} cancelled this wash.`);
    return res.status(200).json({ success: true, message: 'Booking cancelled', data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const rescheduleMyBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (!ownsBooking(booking, req.user)) {
      return res.status(403).json({ success: false, message: 'This booking is not yours' });
    }
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: 'This wash can no longer be moved' });
    }
    const { date, timeSlot } = req.body;
    if (!date || !timeSlot) {
      return res.status(400).json({ success: false, message: 'Date and slot are required' });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date)) || isPastDate(date)) {
      return res.status(400).json({ success: false, message: 'Choose today or a later date' });
    }
    if (!SLOT_IDS.includes(timeSlot)) {
      return res.status(400).json({ success: false, message: 'Choose one of the listed time slots' });
    }
    const full = await slotIsFull({
      date,
      timeSlot,
      city: booking.location?.city,
      excludeId: booking._id,
    });
    if (full) {
      return res.status(400).json({ success: false, message: 'That slot is full' });
    }
    booking.date = date;
    booking.timeSlot = timeSlot;
    pushStatus(
      booking,
      booking.status,
      req.user?.name || booking.customerDetails?.fullName || 'Customer',
      'customer',
      `Moved to ${date}, ${timeSlot}`,
    );
    await booking.save();
    const movedName = booking.customerDetails?.fullName || 'A customer';
    await notifyDesk('Wash moved', `${movedName} moved a wash to ${date} ${timeSlot}.`, booking._id);
    await notifyStaffJob(booking, 'Job moved', `${movedName} is now ${date} ${timeSlot}.`);
    if (booking.user) {
      await notifyUser(booking.user, 'Wash moved', `Your wash is now ${date} at ${timeSlot}.`, booking._id);
    }
    return res.status(200).json({ success: true, message: 'Wash moved', data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const rateMyBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (!ownsBooking(booking, req.user)) {
      return res.status(403).json({ success: false, message: 'This booking is not yours' });
    }
    if (booking.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Rate the wash after it is finished' });
    }
    const rating = Number(req.body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be from 1 to 5' });
    }
    booking.rating = rating;
    booking.review = String(req.body.review || '').slice(0, 400);
    await booking.save();
    const ratedName = booking.customerDetails?.fullName || 'A customer';
    await notifyDesk('New rating', `${ratedName} rated a wash ${rating}/5.`, booking._id);
    return res.status(200).json({ success: true, message: 'Thanks for the rating', data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const receiptMyBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('assignedStaff', 'name phone');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (!ownsBooking(booking, req.user) && !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'This booking is not yours' });
    }
    const { getCatalog } = require('../utils/catalogStore');
    const catalog = await getCatalog();
    const total = Number(booking.finalPrice) || 0;
    const gstPercent = Number(catalog.gstPercent) || 0;
    const gstAmount = Math.round((total * gstPercent) / (100 + gstPercent));
    return res.status(200).json({
      success: true,
      data: {
        receiptNo: `CCP-${String(booking._id).slice(-6).toUpperCase()}`,
        service: booking.service,
        vehicle: booking.carModel?.name,
        category: booking.carModel?.category,
        date: booking.date,
        timeSlot: booking.timeSlot,
        address: booking.location?.address,
        city: booking.location?.city,
        addons: booking.addons,
        travelFee: booking.travelFee,
        discount: booking.discount,
        total,
        gstPercent,
        gstAmount,
        taxable: total - gstAmount,
        paymentMethod: booking.paymentMethod,
        paymentStatus: booking.paymentStatus,
        status: booking.status,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const listMessages = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (!canChat(booking, req.user)) {
      return res.status(403).json({ success: false, message: 'This booking is not yours' });
    }
    const messages = await SupportMessage.find({ booking: booking._id }).sort({ createdAt: 1 });
    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const postMessage = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (!canChat(booking, req.user)) {
      return res.status(403).json({ success: false, message: 'This booking is not yours' });
    }
    const role = req.user.role;
    const body = String(req.body.body || '').trim();
    if (!body) return res.status(400).json({ success: false, message: 'Write a message' });
    const message = await SupportMessage.create({
      booking: booking._id,
      user: req.user._id,
      fromRole: req.user.role,
      body: body.slice(0, 1000),
    });
    const preview = body.slice(0, 140);
    const sender = req.user.name || 'Someone';
    if (role === 'customer') {
      await notifyDesk('New message', `${sender}: ${preview}`, booking._id);
      await notifyStaffJob(booking, 'New message', preview);
    } else {
      // Desk or washer wrote: tell the customer, and the other side of the crew.
      if (booking.user) await notifyUser(booking.user, 'New message', preview, booking._id);
      if (role === 'staff') await notifyDesk('Washer message', `${sender}: ${preview}`, booking._id);
      else await notifyStaffJob(booking, 'Desk message', preview);
    }
    return res.status(201).json({ success: true, data: message });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const payMyBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (!ownsBooking(booking, req.user)) {
      return res.status(403).json({ success: false, message: 'This booking is not yours' });
    }
    if (['cancelled', 'blocked', 'lead'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: 'This wash cannot be paid' });
    }
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'This wash is already paid' });
    }
    if (Math.round(Number(booking.finalPrice) * 100) < 100) {
      return res.status(400).json({ success: false, message: 'This wash has no amount to pay online' });
    }
    booking.paymentMethod = 'Online';
    booking.paymentUrl = '';
    booking.paymentLinkId = '';
    const url = await createPaymentLink(booking);
    if (!url) {
      return res.status(503).json({ success: false, message: 'Online payment is not configured on the server' });
    }
    return res.status(200).json({ success: true, paymentUrl: url, data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const reportMyBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (!ownsBooking(booking, req.user)) {
      return res.status(403).json({ success: false, message: 'This booking is not yours' });
    }
    const note = String(req.body.note || '').trim();
    const image = String(req.body.image || '');
    if (!note && !image) {
      return res.status(400).json({ success: false, message: 'Add a note or a photo' });
    }
    if (image.length > 1800000) {
      return res.status(400).json({ success: false, message: 'That photo is too large. Choose a smaller one.' });
    }
    const byName = req.user.name || booking.customerDetails?.fullName || 'Customer';
    booking.reports.push({
      note: note.slice(0, 500),
      image,
      at: new Date(),
      byName,
    });
    await booking.save();
    const preview = note ? note.slice(0, 80) : 'A photo was attached';
    await notifyDesk('Wash report', `${byName}: ${preview}`, booking._id);
    return res.status(201).json({ success: true, message: 'Report sent', data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBookedSlots,
  createLead,
  updateBooking,
  createBooking,
  getMyBookings,
  getMyBooking,
  cancelMyBooking,
  rescheduleMyBooking,
  rateMyBooking,
  receiptMyBooking,
  listMessages,
  postMessage,
  payMyBooking,
  reportMyBooking,
};
