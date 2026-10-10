const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleAuth,
  getMe,
  updateMe,
  deleteAccount,
  requestOtp,
  verifyOtp,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/otp/request', requestOtp);
router.post('/otp/verify', verifyOtp);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

router.delete('/delete-account', protect, deleteAccount);

module.exports = router;
