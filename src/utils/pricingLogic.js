export const CAR_CATEGORIES = {
  COMPACT: 'Compact',
  STANDARD: 'Standard',
  LARGE: 'Large',
  PREMIUM: 'Premium'
};

export const SERVICES = {
  BASIC: 'Basic Wash',
  PREMIUM: 'Premium Wash',
  COMPLETE: 'Complete Clean'
};

export const PRICING_MATRIX = {
  [CAR_CATEGORIES.COMPACT]: {
    [SERVICES.BASIC]: 299,
    [SERVICES.PREMIUM]: 499,
    [SERVICES.COMPLETE]: 699,
  },
  [CAR_CATEGORIES.STANDARD]: {
    [SERVICES.BASIC]: 399,
    [SERVICES.PREMIUM]: 599,
    [SERVICES.COMPLETE]: 799,
  },
  [CAR_CATEGORIES.LARGE]: {
    [SERVICES.BASIC]: 499,
    [SERVICES.PREMIUM]: 699,
    [SERVICES.COMPLETE]: 899,
  },
  [CAR_CATEGORIES.PREMIUM]: {
    [SERVICES.BASIC]: 699,
    [SERVICES.PREMIUM]: 899,
    [SERVICES.COMPLETE]: 1199,
  }
};

export const CAR_MODELS = [
  // Compact
  { id: 1, name: 'Alto', category: CAR_CATEGORIES.COMPACT },
  { id: 2, name: 'WagonR', category: CAR_CATEGORIES.COMPACT },
  { id: 3, name: 'Celerio', category: CAR_CATEGORIES.COMPACT },
  { id: 4, name: 'Kwid', category: CAR_CATEGORIES.COMPACT },
  { id: 5, name: 'Tiago', category: CAR_CATEGORIES.COMPACT },
  // Standard
  { id: 6, name: 'Swift', category: CAR_CATEGORIES.STANDARD },
  { id: 7, name: 'i20', category: CAR_CATEGORIES.STANDARD },
  { id: 8, name: 'Baleno', category: CAR_CATEGORIES.STANDARD },
  { id: 9, name: 'Dzire', category: CAR_CATEGORIES.STANDARD },
  { id: 10, name: 'City', category: CAR_CATEGORIES.STANDARD },
  { id: 11, name: 'Verna', category: CAR_CATEGORIES.STANDARD },
  // Large
  { id: 12, name: 'Creta', category: CAR_CATEGORIES.LARGE },
  { id: 13, name: 'Seltos', category: CAR_CATEGORIES.LARGE },
  { id: 14, name: 'XUV700', category: CAR_CATEGORIES.LARGE },
  { id: 15, name: 'Carens', category: CAR_CATEGORIES.LARGE },
  { id: 16, name: 'Innova', category: CAR_CATEGORIES.LARGE },
  // Premium
  { id: 17, name: 'Fortuner', category: CAR_CATEGORIES.PREMIUM },
  { id: 18, name: 'Gloster', category: CAR_CATEGORIES.PREMIUM },
  { id: 19, name: 'BMW 3 Series', category: CAR_CATEGORIES.PREMIUM },
  { id: 20, name: 'Mercedes C-Class', category: CAR_CATEGORIES.PREMIUM },
  { id: 21, name: 'Audi A4', category: CAR_CATEGORIES.PREMIUM },
];

export const getPrice = (category, service) => {
  if (!category || !service) return 0;
  return PRICING_MATRIX[category][service] || 0;
};
