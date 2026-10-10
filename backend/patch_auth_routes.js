const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'routes/authRoutes.js');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace('getMe,', 'getMe,\n  deleteAccount,');
content = content.replace('module.exports = router;', 'router.delete(\'/delete-account\', protect, deleteAccount);\n\nmodule.exports = router;');
fs.writeFileSync(filePath, content);
console.log('authRoutes updated');
