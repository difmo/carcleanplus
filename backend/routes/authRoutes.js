const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleAuth,
  appleAuth,
  getMe,
  updateMe,
  markOnboardingSeen,
  deleteAccount,
  requestOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/otp/request', requestOtp);
router.post('/otp/verify', verifyOtp);
router.post('/password/forgot', forgotPassword);
router.post('/password/reset', resetPassword);
router.post('/google', googleAuth);
router.post('/apple', appleAuth);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.post('/onboarding-seen', protect, markOnboardingSeen);

router.delete('/delete-account', protect, deleteAccount);

module.exports = router;
