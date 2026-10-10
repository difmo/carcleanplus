const express = require('express');
const router = express.Router();
const { protect, optionalProtect } = require('../middleware/authMiddleware');

const {
  getBookedSlots,
  createLead,
  updateBooking,
  createBooking,
  getMyBookings,
  cancelMyBooking,
  rescheduleMyBooking,
  rateMyBooking,
  receiptMyBooking,
  listMessages,
  postMessage,
  reportMyBooking,
} = require('../controllers/bookingController');

router.get('/booked-slots', getBookedSlots);
router.get('/mine', protect, getMyBookings);
router.post('/lead', optionalProtect, createLead);
router.put('/:id/cancel', protect, cancelMyBooking);
router.put('/:id/reschedule', protect, rescheduleMyBooking);
router.put('/:id/rate', protect, rateMyBooking);
router.get('/:id/receipt', protect, receiptMyBooking);
router.get('/:id/messages', protect, listMessages);
router.post('/:id/messages', protect, postMessage);
router.post('/:id/report', protect, reportMyBooking);
router.put('/:id', optionalProtect, updateBooking);
router.post('/', optionalProtect, createBooking);

module.exports = router;
