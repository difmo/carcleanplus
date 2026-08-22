const Booking = require('../models/Booking');
const transporter = require('../config/mail');

// Create Booking
const createBooking = async (req, res) => {
  try {
    const {
      carModel,
      service,
      location,
      date,
      timeSlot,
      customerDetails,
      finalPrice
    } = req.body;

    // Validate required fields (Basic validation)
    if (!carModel || !service || !location || !date || !timeSlot || !customerDetails || !finalPrice) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
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
      finalPrice
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
  createBooking
};
