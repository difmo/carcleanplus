require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedSuperadmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    // Get superadmin details from environment variables
    const { SUPERADMIN_NAME, SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD, SUPERADMIN_PHONE } = process.env;

    if (!SUPERADMIN_NAME || !SUPERADMIN_EMAIL || !SUPERADMIN_PASSWORD || !SUPERADMIN_PHONE) {
      console.error('Error: Please provide SUPERADMIN_NAME, SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD, and SUPERADMIN_PHONE in .env file.');
      process.exit(1);
    }

    // Check if superadmin already exists
    const superadminExists = await User.findOne({ role: 'superadmin' });

    if (superadminExists) {
      console.log('A superadmin already exists in the database. Seed aborted.');
      process.exit(0);
    }

    // Check if a user with this email already exists
    const userExists = await User.findOne({ email: SUPERADMIN_EMAIL });
    if (userExists) {
      console.log(`User with email ${SUPERADMIN_EMAIL} already exists but is not a superadmin. Upgrading them...`);
      userExists.role = 'superadmin';
      // Password and phone update can be optional, but we will keep their existing details.
      await userExists.save();
      console.log('User upgraded to superadmin successfully!');
      process.exit(0);
    }

    // Create superadmin
    const superadmin = await User.create({
      name: SUPERADMIN_NAME,
      email: SUPERADMIN_EMAIL,
      password: SUPERADMIN_PASSWORD,
      phone: SUPERADMIN_PHONE,
      role: 'superadmin'
    });

    console.log(`Superadmin created successfully: ${superadmin.email}`);
    process.exit(0);

  } catch (error) {
    console.error('Error seeding superadmin:', error);
    process.exit(1);
  }
};

seedSuperadmin();
