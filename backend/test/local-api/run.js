// API checks for the app-facing routes, against an in-memory MongoDB with no
// live keys. Exits non-zero on any failure.
//
//   npm install --no-save mongodb-memory-server@10 supertest@7
//   node test/local-api/run.js
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const { blankLiveKeys } = require('./env');

const BACKEND = path.resolve(__dirname, '../..');
const model = (name) => require(path.join(BACKEND, 'models', `${name}.js`));

let failures = 0;
const check = (name, ok, extra) => {
  if (!ok) failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok || !extra ? '' : `  -> ${JSON.stringify(extra).slice(0, 300)}`}`);
};

(async () => {
  const mongo = await MongoMemoryServer.create();
  blankLiveKeys(mongo.getUri());
  const app = require(path.join(BACKEND, 'server.js'));
  const api = request(app);
  const auth = (token) => ({ Authorization: `Bearer ${token}` });

  const register = async (email, phone) => {
    const res = await api.post('/api/auth/register').send({ name: 'Test User', email, phone, password: 'secret12' });
    return res.body.token;
  };
  const a = await register('a@example.com', '9876543210');
  const b = await register('b@example.com', '9123456780');
  check('register returns token', Boolean(a && b));

  const data = (await api.get('/api/catalog')).body.data || {};
  check('catalog has service details', Array.isArray(data.services) && data.services.length === 5 && data.services[0].inclusions.length > 0, data.services);
  check('catalog has unique cities', Array.isArray(data.cities) && data.cities.some((c) => c.name === 'Lucknow') && new Set(data.cities.map((c) => c.name)).size === data.cities.length, data.cities);
  check('catalog has stats', typeof data.stats === 'object');
  check('catalog has basePrices', Array.isArray(data.basePrices) && data.basePrices.length > 0);

  const quote = (token, body) => api.post('/api/catalog/quote').set(auth(token)).send({ city: 'Lucknow', ...body });
  const q1 = await quote(a, { category: 'Large', service: 'Premium Wash', providesWaterElectricity: true });
  check('quote applies the water discount', q1.status === 200 && q1.body.data.total === 599 && q1.body.data.waterElectricityDiscount === 100, q1.body);

  const plan = await api.post('/api/account/plan').set(auth(a)).send({ name: 'City 4' });
  check('plan is not granted for free', plan.status === 503, plan.body);
  const planGet = await api.get('/api/account/plan').set(auth(a));
  check('plan still empty', planGet.body.data.washesLeft === 0 && planGet.body.data.paymentsEnabled === false, planGet.body);

  const User = model('User');
  await User.updateOne({ email: 'a@example.com' }, { planName: 'City 4', planWashesLeft: 2, planExpiresAt: new Date(Date.now() + 86400000) });
  const q2 = await quote(a, { category: 'Compact', service: 'Festive Offer', usePlan: true });
  check('plan refused for another service', q2.status === 400 && /covers Basic Wash/.test(q2.body.message), q2.body);
  const q3 = await quote(a, { category: 'Compact', service: 'Basic Wash', usePlan: true });
  check('plan accepted for its service', q3.status === 200 && q3.body.data.total === 0, q3.body);
  await User.updateOne({ email: 'a@example.com' }, { planExpiresAt: new Date(Date.now() - 1000) });
  check('expired plan refused', (await quote(a, { category: 'Compact', service: 'Basic Wash', usePlan: true })).status === 400);

  const badAddress = await api.post('/api/account/addresses').set(auth(a)).send({ address: '12 Hazratganj Main Road', city: 'Agra' });
  check('address outside the service area refused', badAddress.status === 400, badAddress.body);
  const address = await api.post('/api/account/addresses').set(auth(a)).send({ label: 'Home', address: '12 Hazratganj Main Road', city: 'lucknow' });
  check('first address saved as default', address.status === 201 && address.body.data[0].isDefault && address.body.data[0].city === 'Lucknow', address.body);
  const office = await api.post('/api/account/addresses').set(auth(a)).send({ label: 'Office', address: '5 Gomti Nagar Tower', city: 'Lucknow' });
  const officeId = office.body.data[1]._id;
  const swap = await api.put(`/api/account/addresses/${officeId}/default`).set(auth(a));
  check('default address switches', swap.body.data.filter((r) => r.isDefault).length === 1 && swap.body.data.find((r) => r._id === officeId).isDefault, swap.body);
  const me = await api.get('/api/auth/me').set(auth(a));
  check('profile carries addresses and default address', me.body.user.addresses.length === 2 && me.body.user.address === '5 Gomti Nagar Tower', me.body.user);

  const badVehicle = await api.post('/api/account/vehicles').set(auth(a)).send({ name: 'Swift', category: 'Tiny' });
  check('unknown vehicle size refused', badVehicle.status === 400, badVehicle.body);
  const vehicle = await api.post('/api/account/vehicles').set(auth(a)).send({ name: 'Hyundai Creta', category: 'Large', plate: 'up32 ab 1234' });
  check('first vehicle is default, plate saved', vehicle.status === 201 && vehicle.body.data.isDefault && vehicle.body.data.plate === 'UP32 AB 1234', vehicle.body);

  const lead = await api.post('/api/booking/lead').set(auth(a)).send({ mobile: '9876543210', fullName: 'Test User', bookingSource: 'app' });
  const id = lead.body.data._id;
  const later = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);
  const body = {
    carModel: { name: 'Hyundai Creta', category: 'Large' },
    service: 'Premium Wash',
    location: { address: '12 Hazratganj Main Road', city: 'Lucknow' },
    date: later,
    timeSlot: 'Slot 2 – 10:00 AM',
    customerDetails: { fullName: 'Test User', mobile: '9876543210' },
    paymentMethod: 'Cash',
    bookingSource: 'app',
    useServerPrice: true,
  };
  check("another user cannot finish A's lead", (await api.put(`/api/booking/${id}`).set(auth(b)).send(body)).status === 403);
  check('past date refused', (await api.put(`/api/booking/${id}`).set(auth(a)).send({ ...body, date: '2020-01-01' })).status === 400);
  check('unknown slot refused for the app', (await api.put(`/api/booking/${id}`).set(auth(a)).send({ ...body, timeSlot: '9 PM' })).status === 400);
  const done = await api.put(`/api/booking/${id}`).set(auth(a)).send(body);
  check('finish uses the server price and logs a step', done.status === 200 && done.body.data.finalPrice === 699 && done.body.data.status === 'pending' && done.body.data.timeline.length === 1, done.body);
  check('anonymous caller cannot change a booking', (await api.put(`/api/booking/${id}`).send({ finalPrice: 1 })).status === 403);

  const one = await api.get(`/api/booking/${id}`).set(auth(a));
  check('owner reads one booking', one.status === 200 && one.body.data._id === id, one.body);
  check('other user cannot read it', (await api.get(`/api/booking/${id}`).set(auth(b))).status === 403);
  check('mine lists it', (await api.get('/api/booking/mine').set(auth(a))).body.data.length === 1);

  check('reschedule refuses an unknown slot', (await api.put(`/api/booking/${id}/reschedule`).set(auth(a)).send({ date: later, timeSlot: 'whenever' })).status === 400);
  const moved = await api.put(`/api/booking/${id}/reschedule`).set(auth(a)).send({ date: later, timeSlot: 'Slot 4 – 01:30 PM' });
  check('reschedule works and is logged', moved.status === 200 && moved.body.data.timeline.some((t) => /Moved to/.test(t.note)), moved.body);

  await model('Booking').updateOne({ _id: id }, { status: 'confirmed' });
  const cancel = await api.put(`/api/booking/${id}/cancel`).set(auth(a)).send({ reason: 'Plans changed' });
  check('confirmed booking can be cancelled', cancel.status === 200 && cancel.body.data.status === 'cancelled', cancel.body);

  check('forgot password answers the same for an unknown email', (await api.post('/api/auth/password/forgot').send({ email: 'nobody@example.com' })).status === 200);
  const bcrypt = require(path.join(BACKEND, 'node_modules/bcryptjs'));
  await model('OtpCode').create({ phone: 'password-reset', email: 'b@example.com', codeHash: await bcrypt.hash('123456', 8), expiresAt: new Date(Date.now() + 60000) });
  check('reset with a wrong code refused', (await api.post('/api/auth/password/reset').send({ email: 'b@example.com', code: '000000', password: 'newpass1' })).status === 400);
  const reset = await api.post('/api/auth/password/reset').send({ email: 'b@example.com', code: '123456', password: 'newpass1' });
  check('reset with the right code signs in', reset.status === 200 && Boolean(reset.body.token), reset.body);
  check('login with the new password', (await api.post('/api/auth/login').send({ email: 'b@example.com', password: 'newpass1' })).status === 200);

  // ---- Desk (admin) and washer (staff) ----
  await User.create({ name: 'Desk Admin', email: 'desk@example.com', password: 'secret12', role: 'admin' });
  await User.create({ name: 'Ravi Washer', email: 'ravi@example.com', phone: '9000000001', password: 'secret12', role: 'staff' });
  const login = async (email) => (await api.post('/api/auth/login').send({ email, password: 'secret12', client: 'app' })).body.token;
  const desk = await login('desk@example.com');
  const ravi = await login('ravi@example.com');
  check('desk and washer sign in', Boolean(desk && ravi));
  check('customer cannot open the desk', (await api.get('/api/admin/bookings').set(auth(b))).status === 403);

  const today = new Date(Date.now() + 5.5 * 3600000).toISOString().slice(0, 10);
  const phone = await api.post('/api/admin/bookings/manual').set(auth(desk)).send({
    type: 'phone_booking', customerName: 'Walk In', mobile: '91234 56780', carName: 'Swift', carCategory: 'Compact',
    service: 'Basic Wash', address: 'Aliganj', city: 'Lucknow', date: today, timeSlot: 'Slot 5 – 03:00 PM', paymentMethod: 'Cash',
  });
  const phoneId = phone.body.data?._id;
  check('phone booking priced from the catalog, unpaid, linked to the customer',
    phone.status === 201 && phone.body.data.finalPrice > 0 && phone.body.data.paymentStatus === 'pending' && Boolean(phone.body.data.user), phone.body);
  check('phone booking refuses a bad mobile', (await api.post('/api/admin/bookings/manual').set(auth(desk)).send({
    type: 'phone_booking', customerName: 'X', mobile: '123', date: today, timeSlot: 'Slot 5 – 03:00 PM' })).status === 400);
  check('phone booking refuses a past date', (await api.post('/api/admin/bookings/manual').set(auth(desk)).send({
    type: 'phone_booking', customerName: 'X', mobile: '9999999999', date: '2020-01-01', timeSlot: 'Slot 5 – 03:00 PM' })).status === 400);

  const list = await api.get('/api/admin/bookings').set(auth(desk));
  check('desk list hides leads', list.body.data.every((row) => row.status !== 'lead'), list.body.data.map((r) => r.status));
  const unassigned = await api.get('/api/admin/bookings?unassigned=1').set(auth(desk));
  check('unassigned filter finds the phone booking', unassigned.body.data.some((row) => row._id === phoneId), unassigned.body);

  const dash = await api.get('/api/admin/dashboard').set(auth(desk));
  check('dashboard counts today and unassigned', dash.status === 200 && dash.body.data.todayBookings >= 1 && dash.body.data.unassigned >= 1 && dash.body.data.week.at(-1).date === today, dash.body.data);

  const staffList = await api.get('/api/admin/staff').set(auth(desk));
  const raviId = staffList.body.data.find((row) => row.email === 'ravi@example.com')._id;
  const assigned = await api.put(`/api/admin/bookings/${phoneId}/assign`).set(auth(desk)).send({ staffId: raviId });
  check('assign to washer', assigned.status === 200 && assigned.body.data.assignedStaff.name === 'Ravi Washer', assigned.body);

  const status = await api.put(`/api/admin/bookings/${phoneId}/status`).set(auth(desk)).send({ status: 'confirmed' });
  check('desk status change does not crash', status.status === 400 && /already/.test(status.body.message), status.body);

  const moved2 = await api.put(`/api/admin/bookings/${phoneId}`).set(auth(desk)).send({ date: today, timeSlot: 'Slot 6 – 04:30 PM', finalPrice: 450 });
  check('desk reschedules and reprices', moved2.status === 200 && moved2.body.data.timeSlot === 'Slot 6 – 04:30 PM' && moved2.body.data.finalPrice === 450, moved2.body);
  check('desk edit refuses a made-up slot', (await api.put(`/api/admin/bookings/${phoneId}`).set(auth(desk)).send({ timeSlot: 'noon' })).status === 400);

  check('refund refused before any payment', (await api.put(`/api/admin/bookings/${phoneId}/refund`).set(auth(desk)).send({})).status === 400);

  const jobs = await api.get(`/api/staff/jobs?date=${today}`).set(auth(ravi));
  check('washer sees the job today', jobs.body.data.some((row) => row._id === phoneId), jobs.body);
  check('washer must be on shift to accept', (await api.put(`/api/staff/jobs/${phoneId}/status`).set(auth(ravi)).send({ status: 'accepted' })).status === 400);
  await api.put('/api/staff/shift').set(auth(ravi)).send({ onShift: true });
  for (const next of ['accepted', 'on_the_way', 'in_progress']) {
    await api.put(`/api/staff/jobs/${phoneId}/status`).set(auth(ravi)).send({ status: next });
  }
  const collect = await api.put(`/api/staff/jobs/${phoneId}/collect`).set(auth(ravi)).send({ cash: 450, upi: 0 });
  check('washer collects cash, wash becomes paid', collect.status === 200 && collect.body.data.paymentStatus === 'paid', collect.body);
  const finished = await api.put(`/api/staff/jobs/${phoneId}/status`).set(auth(ravi)).send({ status: 'completed' });
  check('washer finishes the job', finished.status === 200 && finished.body.data.status === 'completed', finished.body);
  const payroll = await api.get('/api/admin/payroll').set(auth(desk));
  check('payout created for the washer', payroll.body.data.length === 1 && payroll.body.data[0].staff.name === 'Ravi Washer', payroll.body);
  check('payout cannot be paid twice', (await api.put(`/api/admin/payroll/${payroll.body.data[0]._id}/paid`).set(auth(desk))).status === 200
    && (await api.put(`/api/admin/payroll/${payroll.body.data[0]._id}/paid`).set(auth(desk))).status === 400);

  const tooMuch = await api.put(`/api/admin/bookings/${phoneId}/refund`).set(auth(desk)).send({ amount: 9999 });
  check('refund above the paid amount refused', tooMuch.status === 400, tooMuch.body);
  const refund = await api.put(`/api/admin/bookings/${phoneId}/refund`).set(auth(desk)).send({ amount: 200 });
  check('partial refund recorded', refund.status === 200 && refund.body.data.paymentStatus === 'refunded', refund.body);
  check('paid booking cannot be deleted', (await api.delete(`/api/admin/bookings/${phoneId}`).set(auth(desk))).status === 400);

  // Desk status change on another booking: completed must pay the washer too.
  const second = await api.post('/api/admin/bookings/manual').set(auth(desk)).send({
    type: 'phone_booking', customerName: 'Second', mobile: '9555555555', service: 'Basic Wash', carCategory: 'Compact',
    date: today, timeSlot: 'Slot 1 – 08:30 AM', finalPrice: 300, paymentMethod: 'UPI', alreadyPaid: true,
  });
  check('already-paid phone booking stored as paid', second.body.data?.paymentStatus === 'paid', second.body);
  await api.put(`/api/admin/bookings/${second.body.data._id}/assign`).set(auth(desk)).send({ staffId: raviId });
  const deskDone = await api.put(`/api/admin/bookings/${second.body.data._id}/status`).set(auth(desk)).send({ status: 'completed' });
  check('desk marks completed', deskDone.status === 200 && deskDone.body.data.status === 'completed', deskDone.body);
  check('desk completion also pays the washer', (await api.get('/api/admin/payroll').set(auth(desk))).body.data.length === 2);

  // Chat: customer, desk and assigned washer can talk; another washer cannot.
  await User.create({ name: 'Other Washer', email: 'other@example.com', password: 'secret12', role: 'staff' });
  const other = await login('other@example.com');
  check('customer writes on the phone booking', (await api.post(`/api/booking/${phoneId}/messages`).set(auth(b)).send({ body: 'Is the washer coming?' })).status === 201);
  check('desk replies', (await api.post(`/api/booking/${phoneId}/messages`).set(auth(desk)).send({ body: 'Yes, by 4:30' })).status === 201);
  check('assigned washer can read the chat', (await api.get(`/api/booking/${phoneId}/messages`).set(auth(ravi))).body.data.length === 2);
  check('unassigned washer cannot read the chat', (await api.get(`/api/booking/${phoneId}/messages`).set(auth(other))).status === 403);
  const box = await api.get('/api/admin/messages').set(auth(desk));
  check('desk inbox shows the conversation', box.status === 200 && box.body.data[0].booking === phoneId && box.body.data[0].waiting === false && box.body.data[0].count === 2, box.body);

  // Promos, staff accounts, prices, roles.
  check('percent promo over 90 refused', (await api.post('/api/admin/promos').set(auth(desk)).send({ code: 'BIG', kind: 'percent', value: 95 })).status === 400);
  const promo = await api.post('/api/admin/promos').set(auth(desk)).send({ code: 'diwali10', kind: 'percent', value: 10 });
  check('promo created uppercased', promo.status === 201 && promo.body.data.code === 'DIWALI10', promo.body);
  check('duplicate promo refused', (await api.post('/api/admin/promos').set(auth(desk)).send({ code: 'DIWALI10', value: 5 })).status === 400);
  const off = await api.put(`/api/admin/promos/${promo.body.data._id}`).set(auth(desk)).send({ active: false });
  check('promo can be switched off', off.status === 200 && off.body.data.active === false, off.body);
  check('staff with short password refused', (await api.post('/api/admin/staff').set(auth(desk)).send({ name: 'N', email: 'n@example.com', password: '123' })).status === 400);
  check('staff created', (await api.post('/api/admin/staff').set(auth(desk)).send({ name: 'New', email: 'New@Example.com', password: 'secret12' })).status === 201);
  const deskMe = (await api.get('/api/auth/me').set(auth(desk))).body.user._id;
  await User.updateOne({ email: 'desk@example.com' }, { role: 'superadmin' });
  check('superadmin cannot change own role', (await api.put(`/api/admin/users/${deskMe}/role`).set(auth(desk)).send({ role: 'customer' })).status === 400);

  await api.put('/api/festival').set(auth(desk)).send({ activeFestival: 'DIWALI', isOfferActive: true, customDiscount: '20' });
  const cat = (await api.get('/api/catalog').set(auth(desk))).body.data;
  const live = cat.prices.find((row) => row.service === 'Basic Wash' && row.category === 'Compact');
  const base = cat.basePrices.find((row) => row.service === 'Basic Wash' && row.category === 'Compact');
  check('desk sees base prices separate from festival prices', base.amount > live.amount && base.active === true, { live, base });

  const report = await api.get(`/api/admin/reports/daily?date=${today}`).set(auth(desk));
  check('daily report lists the jobs', report.status === 200 && report.body.data.count === 2, report.body);
  const upcoming = await api.get('/api/staff/jobs?scope=upcoming').set(auth(ravi));
  check('washer upcoming view works', upcoming.status === 200 && Array.isArray(upcoming.body.data), upcoming.body);

  const removed = await api.delete('/api/auth/delete-account').set(auth(a));
  check('delete account removes vehicles', removed.status === 200 && (await model('Vehicle').countDocuments()) === 0, removed.body);

  console.log(failures ? `\n${failures} FAILED` : '\nALL PASSED');
  await require(path.join(BACKEND, 'node_modules/mongoose')).disconnect();
  await mongo.stop();
  process.exit(failures ? 1 : 0);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
