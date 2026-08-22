const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUserRole
} = require('../controllers/adminController');
const { protect, admin, superadmin } = require('../middleware/authMiddleware');

// All routes require user to be logged in
router.use(protect);

router.route('/users')
  .get(admin, getUsers);

router.route('/users/:id')
  .get(admin, getUserById);

router.route('/users/:id/role')
  .put(superadmin, updateUserRole);

module.exports = router;
