const Catalog = require('../models/Catalog');
const { getCatalog } = require('../utils/catalogStore');
const { presentCatalog, buildQuote } = require('../utils/quote');

const readCatalog = async (req, res) => {
  const includeInactive = req.user && (req.user.role === 'admin' || req.user.role === 'superadmin');
  const data = await presentCatalog({ includeInactive });
  return res.status(200).json({ success: true, data });
};

const updateCatalog = async (req, res) => {
  const catalog = await getCatalog();
  const fields = [
    'prices',
    'addons',
    'plans',
    'slotCapacity',
    'freeRadiusKm',
    'zoneKm',
    'travelFee',
    'staffPayPerJob',
    'gstPercent',
  ];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) catalog[field] = req.body[field];
  });
  await catalog.save();
  const includeInactive = req.user && (req.user.role === 'admin' || req.user.role === 'superadmin');
  const data = await presentCatalog({ includeInactive });
  return res.status(200).json({ success: true, message: 'Prices saved', data });
};

const quote = async (req, res) => {
  const result = await buildQuote({
    category: req.body.category,
    service: req.body.service,
    addonNames: req.body.addons || [],
    city: req.body.city,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    promoCode: req.body.promoCode,
    usePlan: Boolean(req.body.usePlan),
    useCredit: Boolean(req.body.useCredit),
    user: req.user,
  });
  if (result.refused) {
    return res.status(400).json({ success: false, message: result.reason });
  }
  return res.status(200).json({
    success: true,
    data: {
      base: result.base,
      addons: result.addonLines,
      discount: result.discount,
      travelFee: result.travelFee,
      creditUsed: result.creditUsed,
      total: result.total,
      kilometres: result.kilometres,
      planUsed: Boolean(result.planUsed),
    },
  });
};

module.exports = { readCatalog, updateCatalog, quote, Catalog };
