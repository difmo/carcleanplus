const User = require('../models/User');
const Booking = require('../models/Booking');
const Contact = require('../models/Contact');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ success: false, message: 'Please provide a role' });
    }

    if (!['customer', 'admin', 'superadmin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Role-based security checks
    if (req.user.role === 'admin') {
      // 1. Admin cannot target an admin or superadmin
      if (targetUser.role === 'admin' || targetUser.role === 'superadmin') {
        return res.status(403).json({ success: false, message: 'Admins cannot modify another admin or superadmin' });
      }

      // 2. Admin cannot promote to admin or superadmin
      if (role === 'admin' || role === 'superadmin') {
        return res.status(403).json({ success: false, message: 'Only superadmin can promote to admin or superadmin' });
      }
    }

    // Superadmin has no restrictions, they can change anyone's role to anything

    targetUser.role = role;
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: {
        _id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all contact messages
// @route   GET /api/admin/contacts
// @access  Private/Admin
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Get all bookings
    const bookings = await Booking.find({});
    
    // Total Bookings
    const totalBookings = bookings.length;
    
    // Pending Bookings (status is pending or undefined)
    const pendingBookings = bookings.filter(b => !b.status || b.status.toLowerCase() === 'pending').length;
    
    // Total Revenue (sum of finalPrice for completed or confirmed bookings)
    const totalRevenue = bookings.reduce((sum, b) => {
      const status = (b.status || 'pending').toLowerCase();
      if (status !== 'cancelled' && b.finalPrice) {
        return sum + Number(b.finalPrice);
      }
      return sum;
    }, 0);

    // Get all contacts
    const totalInquiries = await Contact.countDocuments({});

    // Get 5 most recent bookings
    const recentBookings = await Booking.find({}).sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        pendingBookings,
        totalRevenue,
        totalInquiries,
        recentBookings
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUserRole,
  getContacts,
  getDashboardStats
};
