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

    if (!['customer', 'staff', 'admin', 'superadmin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    if (String(req.params.id) === String(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You cannot change your own role' });
    }

    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Role-based security checks
    if (req.user.role === 'admin') {
      // 1. Admin cannot target an admin or superadmin
      if (['admin', 'superadmin', 'staff'].includes(targetUser.role)) {
        return res.status(403).json({ success: false, message: 'Admins cannot modify staff, admin, or superadmin accounts' });
      }

      if (['admin', 'superadmin', 'staff'].includes(role)) {
        return res.status(403).json({ success: false, message: 'Only a superadmin can assign staff, admin, or superadmin' });
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
const { listTransactions } = require('../utils/ledger');

const getTransactions = async (req, res) => {
  const data = await listTransactions();
  res.status(200).json({ success: true, count: data.length, data });
};

const indiaDay = (offset = 0) =>
  new Date(Date.now() + (5.5 * 60 * 60 * 1000) + offset * 86400000).toISOString().slice(0, 10);

// Stored dates can be YYYY-MM-DD or DD-MM-YYYY; compare them as YYYY-MM-DD.
const ymd = (raw) => {
  const text = String(raw || '').trim();
  const iso = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) return `${iso[1]}-${iso[2].padStart(2, '0')}-${iso[3].padStart(2, '0')}`;
  const dmy = text.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmy) return `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`;
  return text.slice(0, 10);
};

const getDashboardStats = async (req, res) => {
  try {
    // Leads are abandoned checkouts and blocked rows are closed slots: neither is a booking.
    const bookings = await Booking.find({ status: { $nin: ['lead', 'blocked'] } })
      .select('status finalPrice date assignedStaff paymentStatus');
    const live = bookings.filter((b) => (b.status || 'pending').toLowerCase() !== 'cancelled');

    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => !b.status || b.status.toLowerCase() === 'pending').length;
    const totalRevenue = live.reduce((sum, b) => sum + (Number(b.finalPrice) || 0), 0);
    const collectedRevenue = live
      .filter((b) => String(b.paymentStatus || '').toLowerCase() === 'paid')
      .reduce((sum, b) => sum + (Number(b.finalPrice) || 0), 0);

    const today = indiaDay();
    const todayBookings = live.filter((b) => ymd(b.date) === today && b.status !== 'completed').length;
    const unassigned = live.filter(
      (b) => !b.assignedStaff && ['pending', 'confirmed'].includes(b.status) && ymd(b.date) >= today,
    ).length;

    const totalInquiries = await Contact.countDocuments({});
    const leads = await Booking.countDocuments({ status: 'lead' });

    const recentBookings = await Booking.find({ status: { $nin: ['lead', 'blocked'] } })
      .select('-beforePhoto -afterPhoto -reports.image')
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('assignedStaff', 'name phone role');

    const week = [];
    for (let offset = -6; offset <= 0; offset += 1) {
      week.push({ date: indiaDay(offset), count: 0, revenue: 0 });
    }
    const weekIndex = new Map(week.map((point, index) => [point.date, index]));
    const statusCounts = {};
    for (const booking of bookings) {
      const status = (booking.status || 'pending').toLowerCase();
      statusCounts[status] = (statusCounts[status] || 0) + 1;
      if (status === 'cancelled') continue;
      const index = weekIndex.get(ymd(booking.date));
      if (index == null) continue;
      week[index].count += 1;
      week[index].revenue += Number(booking.finalPrice) || 0;
    }

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        pendingBookings,
        totalRevenue,
        collectedRevenue,
        totalInquiries,
        todayBookings,
        unassigned,
        leads,
        today,
        recentBookings,
        week,
        statusCounts
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
  getDashboardStats,
  getTransactions
};
