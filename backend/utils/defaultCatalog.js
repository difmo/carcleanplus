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

// What the customer app shows for each service. The admin can override any of
// these through PUT /api/catalog with a `services` array.
const defaultServices = [
  {
    name: 'Basic Wash',
    title: 'Smart Wash',
    tagline: 'Foam wash, rinse and dry at your door',
    description:
      'A quick doorstep wash for regular upkeep. Road dust and grime come off with a pH-neutral foam, then the car is rinsed and hand dried with microfibre.',
    durationMins: 45,
    inclusions: ['Exterior foam wash', 'Tyre and rim clean', 'Microfibre hand dry', 'Glass wipe'],
    group: 'wash',
    popular: true,
  },
  {
    name: 'Premium Wash',
    title: 'Premium Wash',
    tagline: 'Pressure wash plus interior vacuum',
    description:
      'Everything in the Smart Wash plus a high-pressure rinse, a full interior vacuum and a dashboard wipe-down so the cabin feels fresh again.',
    durationMins: 75,
    inclusions: ['High-pressure foam wash', 'Interior vacuum', 'Dashboard and console wipe', 'Tyre dressing'],
    group: 'wash',
    popular: true,
  },
  {
    name: 'Complete Clean',
    title: 'Complete Clean',
    tagline: 'Deep interior and exterior detail',
    description:
      'A deep clean inside and out. Seats, mats and door pads are cleaned, the exterior gets a foam wash and a polish for a lasting shine.',
    durationMins: 120,
    inclusions: ['Exterior foam wash and polish', 'Seat and mat cleaning', 'Door pad and roof wipe', 'Interior vacuum', 'Tyre dressing'],
    group: 'detailing',
    popular: true,
  },
  {
    name: 'Festive Offer',
    title: 'Festive Detail',
    tagline: 'A new-car shine for the season',
    description:
      'Our festive package: a full detail with wax protection so your vehicle looks its best for the celebrations.',
    durationMins: 150,
    inclusions: ['Complete Clean included', 'Wax coat', 'Engine bay wipe', 'Fragrance'],
    group: 'detailing',
    popular: false,
  },
  {
    name: 'Waterless Wash',
    title: 'Waterless Wash',
    tagline: 'Eco wash that uses almost no water',
    description:
      'An eco-friendly spray-and-wipe wash that cleans where the vehicle is parked, without a hose. Ideal for basements and society parking.',
    durationMins: 40,
    inclusions: ['Waterless spray wash', 'Microfibre wipe', 'Glass clean', 'Tyre shine'],
    group: 'eco',
    popular: false,
  },
];

module.exports = { defaultPrices, defaultAddons, defaultPlans, defaultServices, services };
