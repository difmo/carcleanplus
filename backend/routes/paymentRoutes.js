const express = require('express');
const router = express.Router();
const { optionalProtect } = require('../middleware/authMiddleware');
const { createOrder, verifyPayment } = require('../controllers/paymentController');

router.post('/create-order', optionalProtect, createOrder);
router.post('/verify-payment', verifyPayment);

module.exports = router;
