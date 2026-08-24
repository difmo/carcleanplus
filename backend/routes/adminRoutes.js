const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUserRole,
  getContacts,
  getDashboardStats
} = require('../controllers/adminController');
const {
  getAllBookings,
  getBookingById,
  updateBookingStatus
} = require('../controllers/adminBookingController');
const { protect, admin, superadmin } = require('../middleware/authMiddleware');

// All routes require user to be logged in
router.use(protect);

// Dashboard Route
router.route('/dashboard')
  .get(admin, getDashboardStats);

router.route('/users')
  .get(admin, getUsers);

router.route('/users/:id')
  .get(admin, getUserById);

router.route('/users/:id/role')
  .put(superadmin, updateUserRole);

// Booking Admin Routes
router.route('/bookings')
  .get(admin, getAllBookings);

router.route('/bookings/:id')
  .get(admin, getBookingById);

router.route('/bookings/:id/status')
  .put(admin, updateBookingStatus);

// Contact Admin Routes
router.route('/contacts')
  .get(admin, getContacts);

module.exports = router;
