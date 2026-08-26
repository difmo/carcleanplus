const Razorpay = require('razorpay');
const crypto = require('crypto');
const dotenv = require('dotenv');

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Public
const createOrder = async (req, res) => {
  try {
    // Force reload .env file so it picks up Live Keys without restarting server!
    dotenv.config({ override: true });

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'dummy',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy'
    });

    const { amount } = req.body;

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: "receipt_order_" + Math.floor(Math.random() * 1000000),
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ success: false, message: 'Some error occurred' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payment/verify-payment
// @access  Public
const verifyPayment = async (req, res) => {
  try {
    dotenv.config({ override: true });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'dummy')
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Signature is valid
      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      // Signature is invalid
      return res.status(400).json({ success: false, message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error('Razorpay Verify Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

module.exports = {
  createOrder,
  verifyPayment
};
