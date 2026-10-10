const Booking = require('../models/Booking');
const { getCatalog } = require('./catalogStore');

const ACTIVE = [
  'pending',
  'confirmed',
  'accepted',
  'on_the_way',
  'in_progress',
  'completed',
  'paid',
  'blocked',
];

const getDateVariations = (dateStr) => {
  if (!dateStr) return [];
  const clean = String(dateStr).trim();
  const variations = new Set([clean]);
  const ymdMatch = clean.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (ymdMatch) {
    const [, y, m, d] = ymdMatch;
    const mm = m.padStart(2, '0');
    const dd = d.padStart(2, '0');
    variations.add(`${dd}-${mm}-${y}`);
    variations.add(`${dd}/${mm}/${y}`);
    variations.add(`${y}-${parseInt(m, 10)}-${parseInt(d, 10)}`);
  }
  const dmyMatch = clean.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch;
    const mm = m.padStart(2, '0');
    const dd = d.padStart(2, '0');
    variations.add(`${y}-${mm}-${dd}`);
    variations.add(`${dd}/${mm}/${y}`);
    variations.add(`${y}-${parseInt(m, 10)}-${parseInt(d, 10)}`);
  }
  return Array.from(variations);
};

const slotPattern = (timeSlot) =>
  new RegExp(
    String(timeSlot)
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/[-–]/g, '.*'),
    'i',
  );

const cityFilter = (city) => {
  if (!city) return null;
  const escaped = String(city).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escaped}$`, 'i');
};

const slotQuery = ({ date, timeSlot, city, excludeId, statuses }) => {
  const query = {
    date: { $in: getDateVariations(date) },
    timeSlot: { $regex: slotPattern(timeSlot) },
    status: { $in: statuses || ACTIVE },
  };
  if (excludeId) query._id = { $ne: excludeId };
  const cityMatch = cityFilter(city);
  if (cityMatch) query['location.city'] = cityMatch;
  return query;
};

const slotIsFull = async ({ date, timeSlot, city, excludeId }) => {
  const blocked = await Booking.countDocuments(
    slotQuery({
      date,
      timeSlot,
      city,
      excludeId,
      statuses: ['blocked'],
    }),
  );
  if (blocked > 0) return true;
  const catalog = await getCatalog();
  const capacity = Math.max(1, Number(catalog.slotCapacity) || 4);
  const taken = await Booking.countDocuments(
    slotQuery({
      date,
      timeSlot,
      city,
      excludeId,
      statuses: ACTIVE.filter((status) => status !== 'blocked'),
    }),
  );
  return taken >= capacity;
};

const fullSlotIds = async ({ date, city, slots }) => {
  const full = [];
  for (const slot of slots) {
    if (await slotIsFull({ date, timeSlot: slot, city })) full.push(slot);
  }
  return full;
};

module.exports = {
  ACTIVE,
  getDateVariations,
  slotIsFull,
  fullSlotIds,
};
