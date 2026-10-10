const User = require('../models/User');
const OtpCode = require('../models/OtpCode');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const generateToken = require('../utils/generateToken');
const { sendMail } = require('../config/mail');

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || '',
  role: user.role,
  avatar: user.avatar || '',
  referralCode: user.referralCode || '',
  credit: user.credit || 0,
  planName: user.planName || '',
  planWashesLeft: user.planWashesLeft || 0,
  onShift: Boolean(user.onShift),
  branch: user.branch || '',
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const ensureCode = async (user) => {
  if (user.referralCode) return user;
  user.referralCode = `WASH${String(user._id).slice(-6).toUpperCase()}`;
  await user.save();
  return user;
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: 'customer'
    });

    if (user) {
      await ensureCode(user);
      if (req.body.referralCode) {
        const owner = await User.findOne({
          referralCode: String(req.body.referralCode).trim().toUpperCase(),
        });
        if (owner && String(owner._id) !== String(user._id)) {
          user.credit = 50;
          owner.credit = (owner.credit || 0) + 50;
          await user.save();
          await owner.save();
        }
      }
      res.status(201).json({
        success: true,
        user: publicUser(user),
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check for user email explicitly selecting the password since it is excluded by default
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      await ensureCode(user);
      const fromApp = String(req.body.client || '') === 'app';
      if (fromApp && !otpBypass()) {
        const code = String(req.body.code || '').trim();
        if (!code) {
          await issueEmailCode(user);
          return res.status(200).json({
            success: true,
            otpRequired: true,
            email: user.email,
            message: `Code sent to ${user.email}`,
          });
        }
        const email = String(user.email || '').trim().toLowerCase();
        const record = await OtpCode.findOne({ email }).sort({ createdAt: -1 });
        if (!record || record.expiresAt < new Date()) {
          return res.status(400).json({ success: false, message: 'That code has expired. Sign in again to get a new one.' });
        }
        const matches = await bcrypt.compare(code, record.codeHash);
        if (!matches) {
          return res.status(400).json({ success: false, message: 'That code is wrong' });
        }
        await OtpCode.deleteMany({ email });
      }
      return res.status(200).json({
        success: true,
        user: publicUser(user),
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // User is attached to req by protect middleware
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: publicUser(await ensureCode(user)),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Google Sign In / Register
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
  try {
    const { credential, email: bodyEmail, name: bodyName, picture: bodyPicture } = req.body;
    let email = bodyEmail;
    let name = bodyName;
    let avatar = bodyPicture;
    let googleId = null;

    if (credential) {
      try {
        const payload = JSON.parse(Buffer.from(credential.split('.')[1], 'base64').toString('utf8'));
        if (payload.email) email = payload.email;
        if (payload.name) name = payload.name;
        if (payload.picture) avatar = payload.picture;
        if (payload.sub) googleId = payload.sub;
      } catch (err) {
        console.error('Failed to decode Google token:', err);
      }
    }

    if (!email) {
      return res.status(400).json({ success: false, message: 'Google account email is required' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists -> return token
      if (googleId && !user.googleId) {
        user.googleId = googleId;
        if (avatar) user.avatar = avatar;
        await user.save();
      }
      await ensureCode(user);

      return res.status(200).json({
        success: true,
        user: publicUser(user),
        token: generateToken(user._id)
      });
    }

    // Auto create user for Google sign in
    user = await User.create({
      name: name || email.split('@')[0],
      email,
      phone: '',
      googleId: googleId || 'google_' + Date.now(),
      avatar: avatar || '',
      role: 'customer'
    });
    await ensureCode(user);

    return res.status(201).json({
      success: true,
      user: publicUser(user),
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ success: false, message: error.message || 'Google login failed' });
  }
};


// @desc    Delete user account
// @route   DELETE /api/auth/delete-account
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const phonePattern = (digits) =>
  new RegExp(`${String(digits).split('').join('\\D*')}\\D*$`);

const otpBypass = () => {
  const raw = String(process.env.OTP_BYPASS ?? 'true').trim().toLowerCase();
  return raw === 'true' || raw === '1' || raw === 'yes';
};

const issueEmailCode = async (user) => {
  const email = String(user.email || '').trim().toLowerCase();
  if (!email.includes('@')) {
    const error = new Error('This account has no email for the code');
    error.statusCode = 400;
    throw error;
  }
  const code = String(crypto.randomInt(100000, 999999));
  const codeHash = await bcrypt.hash(code, 8);
  const phone = String(user.phone || '').replace(/\D/g, '').slice(-10) || 'email-login';
  await OtpCode.deleteMany({ email });
  await OtpCode.create({
    phone,
    email,
    codeHash,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });
  try {
    await sendMail({
      to: email,
      subject: 'Your Car Clean Plus code',
      text: `Your sign-in code is ${code}. It expires in 10 minutes.`,
    });
  } catch (error) {
    await OtpCode.deleteMany({ email });
    throw error;
  }
};

const requestOtp = async (req, res) => {
  try {
    if (otpBypass()) {
      return res.status(200).json({
        success: true,
        bypass: true,
        message: 'OTP is turned off. Sign in with email and password.',
      });
    }
    const phone = String(req.body.phone || '').replace(/\D/g, '').slice(-10);
    if (phone.length !== 10) {
      return res.status(400).json({ success: false, message: 'Enter a 10 digit mobile number' });
    }
    const code = String(crypto.randomInt(100000, 999999));
    const codeHash = await bcrypt.hash(code, 8);
    const existing = await User.findOne({ phone: phonePattern(phone) });
    const requestedEmail = String(req.body.email || '').trim().toLowerCase();
    const accountEmail = existing && existing.email && !existing.email.endsWith('@otp.carcleanplus.in')
      ? existing.email
      : '';
    const targetEmail = accountEmail || (requestedEmail.includes('@') ? requestedEmail : '');

    await OtpCode.deleteMany({ phone });
    await OtpCode.create({
      phone,
      email: targetEmail,
      codeHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    if (!targetEmail) {
      await OtpCode.deleteMany({ phone });
      return res.status(400).json({ success: false, message: 'Add an email that can receive the code' });
    }

    try {
      await sendMail({
        to: targetEmail,
        subject: 'Your Car Clean Plus code',
        text: `Your sign-in code is ${code}. It expires in 10 minutes.`,
      });
    } catch (error) {
      await OtpCode.deleteMany({ phone });
      throw error;
    }
    return res.status(200).json({ success: true, message: `Code sent to ${targetEmail}` });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    if (otpBypass()) {
      return res.status(400).json({
        success: false,
        bypass: true,
        message: 'OTP is turned off. Sign in with email and password.',
      });
    }
    const phone = String(req.body.phone || '').replace(/\D/g, '').slice(-10);
    const code = String(req.body.code || '').trim();
    const record = await OtpCode.findOne({ phone }).sort({ createdAt: -1 });
    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'That code has expired' });
    }
    const matches = await bcrypt.compare(code, record.codeHash);
    if (!matches) {
      return res.status(400).json({ success: false, message: 'That code is wrong' });
    }
    await OtpCode.deleteMany({ phone });

    let user = await User.findOne({ phone: phonePattern(phone) });
    if (!user) {
      const email = record.email && record.email.includes('@')
        ? record.email
        : `${phone}@otp.carcleanplus.in`;
      user = await User.create({
        name: String(req.body.name || 'Customer').trim() || 'Customer',
        email,
        phone,
        password: crypto.randomBytes(18).toString('hex'),
        role: 'customer',
      });
    }
    await ensureCode(user);
    return res.status(200).json({
      success: true,
      user: publicUser(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const name = String(req.body.name || '').trim();
    const phone = String(req.body.phone ?? user.phone ?? '').trim();
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    const digits = phone.replace(/\D/g, '');
    if (phone && digits.length < 10) {
      return res.status(400).json({ success: false, message: 'Phone needs 10 digits' });
    }
    user.name = name;
    user.phone = digits ? digits.slice(-10) : '';
    if (req.body.password) {
      const nextPassword = String(req.body.password);
      if (nextPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      }
      const current = String(req.body.currentPassword || '');
      const matches = await user.matchPassword(current);
      if (!matches) {
        return res.status(400).json({ success: false, message: 'Current password is wrong' });
      }
      user.password = nextPassword;
    }
    await user.save();
    return res.status(200).json({ success: true, user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  deleteAccount,
  registerUser,
  loginUser,
  googleAuth,
  getMe,
  updateMe,
  requestOtp,
  verifyOtp,
};
