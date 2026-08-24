const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const email = 'admin@carcleanplus.com';
    const password = 'password123';

    // Check if exists
    let adminUser = await User.findOne({ email });
    if (adminUser) {
      console.log('Admin already exists!');
      adminUser.password = password;
      await adminUser.save();
      console.log('Password reset to: ' + password);
    } else {
      adminUser = await User.create({
        name: 'Admin User',
        email,
        phone: '1234567890',
        password,
        role: 'superadmin'
      });
      console.log('Admin created successfully!');
    }
    
    console.log('Credentials:');
    console.log('Email:', email);
    console.log('Password:', password);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
