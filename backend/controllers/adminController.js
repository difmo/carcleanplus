const User = require('../models/User');

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

module.exports = {
  getUsers,
  getUserById,
  updateUserRole
};
