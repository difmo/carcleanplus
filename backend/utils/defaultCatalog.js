const services = [
  'Basic Wash',
  'Premium Wash',
  'Complete Clean',
  'Festive Offer',
  'Waterless Wash',
];

const table = {
  Compact: [299, 499, 699, 899, 349],
  Standard: [399, 599, 799, 999, 449],
  Large: [499, 699, 899, 1199, 549],
  'Premium Compact': [499, 699, 899, 1099, 549],
  'Premium Standard': [599, 799, 999, 1299, 649],
  'Premium Large': [699, 899, 1199, 1499, 749],
  Premium: [699, 899, 1199, 1499, 749],
  Bike: [149, 249, 349, 399, 199],
};

const defaultPrices = Object.entries(table).flatMap(([category, amounts]) =>
  services.map((service, index) => ({
    category,
    service,
    amount: amounts[index],
  })),
);

const defaultAddons = [
  { name: 'Wax', amount: 149 },
  { name: 'Interior', amount: 199 },
  { name: 'Engine bay', amount: 249 },
];

const defaultPlans = [
  { name: 'City 4', washes: 4, amount: 999, service: 'Basic Wash' },
  { name: 'City 8', washes: 8, amount: 1799, service: 'Basic Wash' },
];

module.exports = { defaultPrices, defaultAddons, defaultPlans, services };
