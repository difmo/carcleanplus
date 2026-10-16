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
