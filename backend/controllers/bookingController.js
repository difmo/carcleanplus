const Booking = require('../models/Booking');
const transporter = require('../config/mail');

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

    const dateVariations = getDateVariations(date);

    const bookings = await Booking.find({
      date: { $in: dateVariations },
      status: { $in: ['pending', 'confirmed', 'completed', 'paid', 'blocked'] }
    }).select('timeSlot');

    const bookedSlots = bookings.map(b => b.timeSlot).filter(Boolean);

    return res.status(200).json({
      success: true,
      date,
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
      status: 'lead'
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

    // Check if slot on that date is already booked by another active booking
    if (date && timeSlot) {
      const dateVariations = getDateVariations(date);
      const existingBooking = await Booking.findOne({
        _id: { $ne: id },
        date: { $in: dateVariations },
        timeSlot: { $regex: new RegExp(timeSlot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/[-–]/g, '.*'), 'i') },
        status: { $in: ['pending', 'confirmed', 'completed', 'paid', 'blocked'] }
      });
      if (existingBooking) {
        return res.status(400).json({
          success: false,
          message: `Slot '${timeSlot}' on ${date} is already booked. Please choose another slot.`
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
    
    // Upgrade status from lead to pending (or paid if you want)
    if (booking.status === 'lead') {
      booking.status = 'pending';
    }

    await booking.save();

    // Send email to admin since booking is now complete
    const mailOptions = {
      from: `"Car Clean Plus" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO,
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

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Booking finalized successfully',
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

    // Check if slot on that date is already booked
    const dateVariations = getDateVariations(date);
    const existingBooking = await Booking.findOne({
      date: { $in: dateVariations },
      timeSlot: { $regex: new RegExp(timeSlot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/[-–]/g, '.*'), 'i') },
      status: { $in: ['pending', 'confirmed', 'completed', 'paid', 'blocked'] }
    });
    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: `Slot '${timeSlot}' on ${date} is already booked. Please choose another slot.`
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
      paymentMethod: paymentMethod || 'Online'
    });

    // Email details
    const mailOptions = {
      from: `"Car Clean Plus" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO,
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

    // Send email to admin
    await transporter.sendMail(mailOptions);

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

module.exports = {
  getBookedSlots,
  createLead,
  updateBooking,
  createBooking
};
