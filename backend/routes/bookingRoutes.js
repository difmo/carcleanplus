const express = require('express');
const router = express.Router();

const {
  getBookedSlots,
  createLead,
  updateBooking,
  createBooking
} = require('../controllers/bookingController');

router.get('/booked-slots', getBookedSlots);
router.post('/lead', createLead);
router.put('/:id', updateBooking);
router.post('/', createBooking);

module.exports = router;
