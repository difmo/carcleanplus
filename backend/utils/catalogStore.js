const Catalog = require('../models/Catalog');
const { defaultPrices, defaultAddons, defaultPlans } = require('./defaultCatalog');

const getCatalog = async () => {
  let catalog = await Catalog.findOne({ singleton: 'main' });
  if (!catalog) {
    catalog = await Catalog.create({
      singleton: 'main',
      prices: defaultPrices,
      addons: defaultAddons,
      plans: defaultPlans,
    });
  }
  return catalog;
};

module.exports = { getCatalog };
