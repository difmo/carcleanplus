// Runs the backend on :5001 against an in-memory MongoDB with every live key
// blanked (Razorpay, SMTP, Firebase, MSG91), and seeds a demo customer with a
// finished booking. Nothing touches the live database.
//
//   npm install --no-save mongodb-memory-server@10 supertest@7
//   node test/local-api/serve.js
//
// Demo logins:
//   customer  demo@example.com / demo123
//   desk      desk@example.com / desk123   (admin app)
//   washer    ravi@example.com / ravi123   (admin app, staff view)
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { blankLiveKeys } = require('./env');

const BACKEND = path.resolve(__dirname, '../..');

(async () => {
  const mongo = await MongoMemoryServer.create();
  blankLiveKeys(mongo.getUri());
  const app = require(path.join(BACKEND, 'server.js'));
  await require(path.join(BACKEND, 'config/db.js'))();
  const User = require(path.join(BACKEND, 'models/User.js'));
  const Booking = require(path.join(BACKEND, 'models/Booking.js'));
  const user = await User.create({
    name: 'Priya Sharma',
    email: 'demo@example.com',
    phone: '9876543210',
    password: 'demo123',
    role: 'customer',
    referralCode: 'WASHDEMO01',
  });
  await Booking.create({
    user: user._id,
    status: 'completed',
    service: 'Premium Wash',
    carModel: { name: 'Hyundai Creta', category: 'Large' },
    location: { address: '12 Hazratganj Main Road', city: 'Lucknow' },
    date: '2026-10-10',
    timeSlot: 'Slot 2 – 10:00 AM',
    customerDetails: { fullName: 'Priya Sharma', mobile: '9876543210' },
    finalPrice: 699,
    paymentMethod: 'Cash',
    paymentStatus: 'paid',
    bookingSource: 'app',
    washerName: 'Ravi Kumar',
    washerPhone: '9000000001',
    timeline: [
      { status: 'pending', byName: 'Priya Sharma', byRole: 'customer', at: new Date('2026-10-09T10:00:00Z') },
      { status: 'accepted', byName: 'Ravi Kumar', byRole: 'staff', at: new Date('2026-10-10T04:00:00Z') },
      { status: 'completed', byName: 'Ravi Kumar', byRole: 'staff', at: new Date('2026-10-10T05:30:00Z') },
    ],
  });
  // Desk and washer accounts, and a wash today that still needs a washer.
  await User.create({ name: 'Desk Admin', email: 'desk@example.com', password: 'desk123', role: 'admin' });
  await User.create({ name: 'Ravi Kumar', email: 'ravi@example.com', phone: '9000000001', password: 'ravi123', role: 'staff' });
  const today = new Date(Date.now() + 5.5 * 3600000).toISOString().slice(0, 10);
  const waiting = await Booking.create({
    user: user._id,
    status: 'confirmed',
    service: 'Basic Wash',
    carModel: { name: 'Maruti Swift', category: 'Compact' },
    location: { address: '7 Aliganj Sector B', city: 'Lucknow' },
    date: today,
    timeSlot: 'Slot 6 – 04:30 PM',
    customerDetails: { fullName: 'Priya Sharma', mobile: '9876543210', instructions: 'Car is in the basement' },
    finalPrice: 399,
    paymentMethod: 'Cash',
    paymentStatus: 'pending',
    bookingSource: 'app',
    timeline: [{ status: 'confirmed', byName: 'Priya Sharma', byRole: 'customer' }],
  });
  await require(path.join(BACKEND, 'models/SupportMessage.js')).create({
    booking: waiting._id,
    user: user._id,
    fromRole: 'customer',
    body: 'Please come after 4 pm',
  });
  app.listen(5001, () => console.log('LOCAL API READY on http://localhost:5001/api'));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
