const FestivalSetting = require('../models/FestivalSetting');
const Promo = require('../models/Promo');
const Booking = require('../models/Booking');
const { getCatalog } = require('./catalogStore');
const { defaultServices } = require('./defaultCatalog');
const { findCity, cityList, distanceKm } = require('./cities');

const applyFestival = (prices, festival) => {
  if (!festival || !festival.isOfferActive) return prices.map((row) => ({ ...row }));
  const discount = Number(festival.customDiscount);
  const offerPrice = Number(festival.customOfferPrice);
  return prices.map((row) => {
    let amount = Number(row.amount) || 0;
    if (Number.isFinite(discount) && discount > 0 && discount < 100) {
      amount = Math.round(amount * (1 - discount / 100));
    }
    if (row.service === 'Festive Offer' && Number.isFinite(offerPrice) && offerPrice > 0) {
      amount = Math.round(offerPrice);
    }
    return { ...row, amount };
  });
};

const isOn = (row) => row.active !== false;

// Saved service rows win over the defaults, field by field.
const mergeServices = (saved = []) => {
  const byName = new Map(defaultServices.map((row) => [row.name, { ...row }]));
  saved.forEach((row) => {
    if (!row || !row.name) return;
    const plain = typeof row.toObject === 'function' ? row.toObject() : row;
    const base = byName.get(plain.name) || {};
    const next = { ...base };
    Object.entries(plain).forEach(([key, value]) => {
      if (key === '_id' || value === undefined || value === null) return;
      if (Array.isArray(value) && value.length === 0 && Array.isArray(base[key])) return;
      next[key] = value;
    });
    byName.set(plain.name, next);
  });
  return Array.from(byName.values());
};

// Real numbers for the service cards: bookings in the last 30 days and the
// average customer rating.
const serviceStats = async () => {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [recent, ratings] = await Promise.all([
    Booking.aggregate([
      { $match: { createdAt: { $gte: since }, status: { $nin: ['lead', 'blocked', 'cancelled'] } } },
      { $group: { _id: '$service', count: { $sum: 1 } } },
    ]),
    Booking.aggregate([
      { $match: { rating: { $gte: 1 } } },
      { $group: { _id: '$service', average: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]),
  ]);
  const stats = {};
  recent.forEach((row) => {
    if (!row._id) return;
    stats[row._id] = { ...(stats[row._id] || {}), bookings30d: row.count };
  });
  ratings.forEach((row) => {
    if (!row._id) return;
    stats[row._id] = {
      ...(stats[row._id] || {}),
      rating: Math.round(row.average * 10) / 10,
      ratingCount: row.count,
    };
  });
  return stats;
};

const presentCatalog = async ({ includeInactive = false, withStats = false } = {}) => {
  const catalog = await getCatalog();
  const festival = await FestivalSetting.findOne().sort({ updatedAt: -1 });
  const sourcePrices = includeInactive ? catalog.prices : catalog.prices.filter(isOn);
  const sourceAddons = includeInactive ? catalog.addons : catalog.addons.filter(isOn);
  const prices = applyFestival(
    sourcePrices.map((row) => ({
      category: row.category,
      service: row.service,
      amount: row.amount,
      active: row.active !== false,
    })),
    festival,
  );
  const basePrices = sourcePrices.map((row) => ({
    category: row.category,
    service: row.service,
    amount: row.amount,
  }));
  let stats = {};
  if (withStats) {
    try {
      stats = await serviceStats();
    } catch (error) {
      console.warn('Service stats were not loaded:', error.message);
    }
  }
  return {
    prices,
    basePrices,
    services: mergeServices(catalog.services),
    cities: cityList(),
    stats,
    addons: sourceAddons.map((row) => ({
      name: row.name,
      amount: row.amount,
      active: row.active !== false,
    })),
    plans: catalog.plans,
    slotCapacity: catalog.slotCapacity,
    freeRadiusKm: catalog.freeRadiusKm,
    zoneKm: catalog.zoneKm,
    travelFee: catalog.travelFee,
    staffPayPerJob: catalog.staffPayPerJob,
    gstPercent: catalog.gstPercent,
    festival: festival
      ? {
          activeFestival: festival.activeFestival,
          isOfferActive: festival.isOfferActive,
          customOfferPrice: festival.customOfferPrice,
          customDiscount: festival.customDiscount,
        }
      : null,
  };
};

const buildQuote = async ({
  category,
  service,
  addonNames = [],
  city,
  latitude,
  longitude,
  promoCode,
  providesWaterElectricity = false,
  usePlan = false,
  useCredit = false,
  user,
}) => {
  const view = await presentCatalog();
  const cityRow = findCity(city);
  if (!cityRow) {
    return { refused: true, reason: `${city || 'This city'} is outside the service area` };
  }

  let travel = 0;
  let kilometres = null;
  const lat = Number(latitude);
  const lng = Number(longitude);
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    kilometres = distanceKm(cityRow.latitude, cityRow.longitude, lat, lng);
    if (kilometres > view.zoneKm) {
      return {
        refused: true,
        reason: `That pin is ${kilometres.toFixed(1)} km from ${cityRow.name}. Washes stop at ${view.zoneKm} km.`,
      };
    }
    if (kilometres > view.freeRadiusKm) travel = Number(view.travelFee) || 0;
  }

  const baseRow = view.prices.find(
    (row) =>
      String(row.category).toLowerCase() === String(category || '').toLowerCase() &&
      String(row.service).toLowerCase() === String(service || '').toLowerCase(),
  );
  const base = baseRow ? Number(baseRow.amount) || 0 : 0;
  if (!base) {
    return { refused: true, reason: 'Price is unavailable for this vehicle' };
  }

  const wanted = new Set((addonNames || []).map((name) => String(name).toLowerCase()));
  const addonLines = view.addons
    .filter((addon) => wanted.has(String(addon.name).toLowerCase()))
    .map((addon) => ({ name: addon.name, price: Number(addon.amount) || 0 }));
  const addonTotal = addonLines.reduce((sum, line) => sum + line.price, 0);

  let discount = 0;
  let promo = null;
  if (promoCode) {
    promo = await Promo.findOne({ code: String(promoCode).trim().toUpperCase(), active: true });
    if (!promo) return { refused: true, reason: 'That promo code is not active' };
    if (promo.maxUses > 0 && promo.used >= promo.maxUses) {
      return { refused: true, reason: 'That promo code is used up' };
    }
    discount = promo.kind === 'percent'
      ? Math.round((base + addonTotal) * (Number(promo.value) || 0) / 100)
      : Math.round(Number(promo.value) || 0);
  }

  let planUsed = false;
  if (usePlan && user) {
    const plan = (view.plans || []).find((row) => row.name === user.planName);
    const expired = user.planExpiresAt && new Date(user.planExpiresAt) < new Date();
    if (!(user.planWashesLeft > 0) || expired) {
      return { refused: true, reason: 'There are no plan washes left on this account' };
    }
    if (plan && plan.service && String(plan.service).toLowerCase() !== String(service || '').toLowerCase()) {
      return { refused: true, reason: `Your ${plan.name} plan covers ${plan.service} only` };
    }
    discount += base;
    planUsed = true;
  }

  const hasWaterElectricity = Boolean(providesWaterElectricity);
  const waterElectricityDiscount = hasWaterElectricity ? 100 : 0;
  discount += waterElectricityDiscount;

  let subtotal = Math.max(0, base + addonTotal - discount) + travel;
  let creditUsed = 0;
  if (useCredit && user && user.credit > 0) {
    creditUsed = Math.min(user.credit, subtotal);
    subtotal -= creditUsed;
  }

  return {
    refused: false,
    base,
    addonLines,
    discount,
    waterElectricityDiscount,
    providesWaterElectricity: hasWaterElectricity,
    travelFee: travel,
    creditUsed,
    total: subtotal,
    kilometres,
    planUsed,
    promo,
  };
};

module.exports = { presentCatalog, buildQuote, applyFestival };
