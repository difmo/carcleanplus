const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUserRole,
  getContacts,
  getDashboardStats,
  getTransactions
} = require('../controllers/adminController');
const {
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  createManualBooking,
  updateBooking,
  deleteBooking,
  assignBooking
} = require('../controllers/adminBookingController');
const { protect, admin, superadmin } = require('../middleware/authMiddleware');
const {
  listStaff,
  dailyReport,
  userBookings,
  createStaff,
  listBranches,
  createBranch,
  listPromos,
  createPromo,
  listPayroll,
  markPayoutPaid,
  refundBooking,
  updatePromo,
  inbox,
} = require('../controllers/deskController');

const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((error) => {
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

// All routes require user to be logged in
router.use(protect);

// Dashboard Route
router.route('/dashboard')
  .get(admin, getDashboardStats);

router.route('/transactions')
  .get(admin, wrap(getTransactions));

router.route('/users')
  .get(admin, getUsers);

router.route('/users/:id')
  .get(admin, getUserById);

router.route('/users/:id/role')
  .put(superadmin, updateUserRole);

// Booking Admin Routes
router.route('/bookings')
  .get(admin, getAllBookings);

router.route('/bookings/manual')
  .post(admin, createManualBooking);

router.route('/bookings/:id')
  .get(admin, getBookingById)
  .put(admin, updateBooking)
  .delete(admin, deleteBooking);

router.route('/bookings/:id/status')
  .put(admin, updateBookingStatus);

router.route('/bookings/:id/assign')
  .put(admin, assignBooking);

router.route('/bookings/:id/refund')
  .put(admin, wrap(refundBooking));

router.route('/reports/daily')
  .get(admin, wrap(dailyReport));

router.route('/users/:id/bookings')
  .get(admin, wrap(userBookings));

router.route('/staff')
  .get(admin, wrap(listStaff))
  .post(admin, wrap(createStaff));

router.route('/branches')
  .get(admin, wrap(listBranches))
  .post(admin, wrap(createBranch));

router.route('/promos')
  .get(admin, wrap(listPromos))
  .post(admin, wrap(createPromo));

router.route('/promos/:id')
  .put(admin, wrap(updatePromo));

router.route('/messages')
  .get(admin, wrap(inbox));

router.route('/payroll')
  .get(admin, wrap(listPayroll));

router.route('/payroll/:id/paid')
  .put(admin, wrap(markPayoutPaid));

// Contact Admin Routes
router.route('/contacts')
  .get(admin, getContacts);

module.exports = router;
