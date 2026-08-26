const express = require('express');
const router = express.Router();

const {
  createLead,
  updateBooking,
  createBooking
} = require('../controllers/bookingController');

router.post('/lead', createLead);
router.put('/:id', updateBooking);
router.post('/', createBooking);

module.exports = router;
