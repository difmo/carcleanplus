const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'controllers/authController.js');
let content = fs.readFileSync(filePath, 'utf8');

const newCode = `
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
`;

content = content.replace('module.exports = {', newCode + '\nmodule.exports = {\n  deleteAccount,');
fs.writeFileSync(filePath, content);
console.log('authController updated');
