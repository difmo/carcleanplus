const Contact = require('../models/Contact');
const transporter = require('../config/mail');

// Create Contact Enquiry
const createContact = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Save enquiry in MongoDB
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message
    });

    // Email details
    const mailOptions = {
      from: `"Car Clean Plus" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO,
      replyTo: email,

      subject: `New Contact Enquiry - ${subject}`,

      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">

          <h2>New Contact Enquiry</h2>

          <p>
            A new enquiry has been submitted from
            the Car Clean Plus website.
          </p>

          <hr>

          <h3>Customer Details</h3>

          <p>
            <strong>Name:</strong> ${name}
          </p>

          <p>
            <strong>Email:</strong> ${email}
          </p>

          <p>
            <strong>Phone:</strong> ${phone}
          </p>

          <p>
            <strong>Subject:</strong> ${subject}
          </p>

          <h3>Message</h3>

          <p>
            ${message}
          </p>

          <hr>

          <p>
            <strong>Submitted At:</strong>
            ${new Date().toLocaleString()}
          </p>

        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Success response
    return res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully',
      data: contact
    });

  } catch (error) {
    console.error('Contact API Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};

module.exports = {
  createContact
};