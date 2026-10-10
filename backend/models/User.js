const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    minlength: 6,
    select: false
  },
  googleId: {
    type: String,
    default: null
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['customer', 'staff', 'admin', 'superadmin'],
    default: 'customer'
  },
  onShift: { type: Boolean, default: false },
  branch: { type: String, default: '' },
  referralCode: { type: String, default: '' },
  credit: { type: Number, default: 0 },
  planName: { type: String, default: '' },
  planWashesLeft: { type: Number, default: 0 },
  planExpiresAt: { type: Date },
  planPayments: { type: [String], default: [] },
  pushTokens: {
    type: [
      {
        token: { type: String, required: true },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    select: false,
    default: undefined,
  },
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
