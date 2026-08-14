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
  // Maruti
  { id: 1, name: 'Maruti Alto', category: CAR_CATEGORIES.COMPACT },
  { id: 2, name: 'Maruti Alto K10', category: CAR_CATEGORIES.COMPACT },
  { id: 3, name: 'Maruti S-Presso', category: CAR_CATEGORIES.COMPACT },
  { id: 4, name: 'Maruti Celerio', category: CAR_CATEGORIES.COMPACT },
  { id: 5, name: 'Maruti WagonR', category: CAR_CATEGORIES.COMPACT },
  { id: 6, name: 'Maruti Ignis', category: CAR_CATEGORIES.COMPACT },
  { id: 7, name: 'Maruti Swift', category: CAR_CATEGORIES.COMPACT },
  { id: 8, name: 'Maruti Eeco', category: CAR_CATEGORIES.COMPACT },
  { id: 9, name: 'Maruti Baleno', category: CAR_CATEGORIES.STANDARD },
  { id: 10, name: 'Maruti Dzire', category: CAR_CATEGORIES.STANDARD },
  { id: 11, name: 'Maruti Ciaz', category: CAR_CATEGORIES.STANDARD },
  { id: 12, name: 'Maruti Brezza', category: CAR_CATEGORIES.STANDARD },
  { id: 13, name: 'Maruti Fronx', category: CAR_CATEGORIES.STANDARD },
  { id: 14, name: 'Maruti Grand Vitara', category: CAR_CATEGORIES.STANDARD },
  { id: 15, name: 'Maruti Ertiga', category: CAR_CATEGORIES.LARGE },
  { id: 16, name: 'Maruti XL6', category: CAR_CATEGORIES.LARGE },
  
  // Hyundai
  { id: 17, name: 'Hyundai Santro', category: CAR_CATEGORIES.COMPACT },
  { id: 18, name: 'Hyundai i10', category: CAR_CATEGORIES.COMPACT },
  { id: 19, name: 'Hyundai Grand i10', category: CAR_CATEGORIES.COMPACT },
  { id: 20, name: 'Hyundai Grand i10 Nios', category: CAR_CATEGORIES.COMPACT },
  { id: 21, name: 'Hyundai Exter', category: CAR_CATEGORIES.STANDARD },
  { id: 22, name: 'Hyundai i20', category: CAR_CATEGORIES.STANDARD },
  { id: 23, name: 'Hyundai Aura', category: CAR_CATEGORIES.STANDARD },
  { id: 24, name: 'Hyundai Verna', category: CAR_CATEGORIES.STANDARD },
  { id: 25, name: 'Hyundai Venue', category: CAR_CATEGORIES.STANDARD },
  { id: 26, name: 'Hyundai Accent', category: CAR_CATEGORIES.STANDARD },
  { id: 27, name: 'Hyundai Creta', category: CAR_CATEGORIES.LARGE },
  { id: 28, name: 'Hyundai Alcazar', category: CAR_CATEGORIES.LARGE },
  { id: 29, name: 'Hyundai Tucson', category: CAR_CATEGORIES.LARGE },

  // Tata
  { id: 30, name: 'Tata Tiago', category: CAR_CATEGORIES.COMPACT },
  { id: 31, name: 'Tata Tigor', category: CAR_CATEGORIES.COMPACT },
  { id: 32, name: 'Tata Punch', category: CAR_CATEGORIES.COMPACT },
  { id: 33, name: 'Tata Altroz', category: CAR_CATEGORIES.STANDARD },
  { id: 34, name: 'Tata Nexon', category: CAR_CATEGORIES.STANDARD },
  { id: 35, name: 'Tata Curvv', category: CAR_CATEGORIES.LARGE },
  { id: 36, name: 'Tata Harrier', category: CAR_CATEGORIES.LARGE },
  { id: 37, name: 'Tata Safari', category: CAR_CATEGORIES.LARGE },
  { id: 38, name: 'Tata Hexa', category: CAR_CATEGORIES.LARGE },

  // Honda
  { id: 39, name: 'Honda Amaze', category: CAR_CATEGORIES.STANDARD },
  { id: 40, name: 'Honda City', category: CAR_CATEGORIES.STANDARD },

  // Toyota
  { id: 41, name: 'Toyota Glanza', category: CAR_CATEGORIES.COMPACT },
  { id: 42, name: 'Toyota Yaris', category: CAR_CATEGORIES.STANDARD },
  { id: 43, name: 'Toyota Etios', category: CAR_CATEGORIES.STANDARD },
  { id: 44, name: 'Toyota Urban Cruiser', category: CAR_CATEGORIES.STANDARD },
  { id: 45, name: 'Toyota Urban Cruiser Taisor', category: CAR_CATEGORIES.STANDARD },
  { id: 46, name: 'Toyota Hyryder', category: CAR_CATEGORIES.LARGE },
  { id: 47, name: 'Toyota Innova', category: CAR_CATEGORIES.LARGE },
  { id: 48, name: 'Toyota Innova Crysta', category: CAR_CATEGORIES.LARGE },
  { id: 49, name: 'Toyota Innova Hycross', category: CAR_CATEGORIES.LARGE },
  { id: 50, name: 'Toyota Rumion', category: CAR_CATEGORIES.LARGE },
  { id: 51, name: 'Toyota Fortuner', category: CAR_CATEGORIES.LARGE },

  // Volkswagen
  { id: 52, name: 'Volkswagen Virtus', category: CAR_CATEGORIES.STANDARD },
  { id: 53, name: 'Volkswagen Taigun', category: CAR_CATEGORIES.LARGE },
  { id: 54, name: 'Volkswagen Tiguan', category: CAR_CATEGORIES.LARGE },

  // Skoda
  { id: 55, name: 'Skoda Slavia', category: CAR_CATEGORIES.STANDARD },
  { id: 56, name: 'Skoda Rapid', category: CAR_CATEGORIES.STANDARD },
  { id: 57, name: 'Skoda Kushaq', category: CAR_CATEGORIES.LARGE },
  { id: 58, name: 'Skoda Octavia', category: CAR_CATEGORIES.LARGE },
  { id: 59, name: 'Skoda Fabia', category: CAR_CATEGORIES.COMPACT },
  { id: 60, name: 'Skoda Kodiaq', category: CAR_CATEGORIES.LARGE },
  { id: 61, name: 'Skoda Superb', category: CAR_CATEGORIES.LARGE },
  { id: 62, name: 'Skoda Laura', category: CAR_CATEGORIES.STANDARD },
  { id: 63, name: 'Skoda Yeti', category: CAR_CATEGORIES.LARGE },
  { id: 64, name: 'Skoda Karoq', category: CAR_CATEGORIES.LARGE },
  { id: 65, name: 'Skoda Kylaq', category: CAR_CATEGORIES.STANDARD },

  // Kia
  { id: 66, name: 'Kia Sonet', category: CAR_CATEGORIES.STANDARD },
  { id: 67, name: 'Kia Seltos', category: CAR_CATEGORIES.LARGE },
  { id: 68, name: 'Kia Carens', category: CAR_CATEGORIES.LARGE },
  { id: 69, name: 'Kia Carnival', category: CAR_CATEGORIES.LARGE },

  // Renault
  { id: 70, name: 'Renault Kwid', category: CAR_CATEGORIES.COMPACT },
  { id: 71, name: 'Renault Triber', category: CAR_CATEGORIES.COMPACT },
  { id: 72, name: 'Renault Kiger', category: CAR_CATEGORIES.STANDARD },
  { id: 73, name: 'Renault Fluence', category: CAR_CATEGORIES.STANDARD },
  { id: 74, name: 'Renault Duster', category: CAR_CATEGORIES.LARGE },
  { id: 75, name: 'Renault Scala', category: CAR_CATEGORIES.STANDARD },
  { id: 76, name: 'Renault Pulse', category: CAR_CATEGORIES.COMPACT },
  { id: 77, name: 'Renault Captur', category: CAR_CATEGORIES.LARGE },
  { id: 78, name: 'Renault Lodgy', category: CAR_CATEGORIES.LARGE },
  { id: 79, name: 'Renault Koleos', category: CAR_CATEGORIES.LARGE },

  // Nissan
  { id: 80, name: 'Nissan Magnite', category: CAR_CATEGORIES.STANDARD },
  { id: 81, name: 'Nissan Micra', category: CAR_CATEGORIES.COMPACT },
  { id: 82, name: 'Nissan Terrano', category: CAR_CATEGORIES.LARGE },
  { id: 83, name: 'Nissan Sunny', category: CAR_CATEGORIES.STANDARD },
  { id: 84, name: 'Nissan Kicks', category: CAR_CATEGORIES.LARGE },
  { id: 85, name: 'Nissan X-Trail', category: CAR_CATEGORIES.LARGE },
  { id: 86, name: 'Nissan Micra Active', category: CAR_CATEGORIES.COMPACT },
  { id: 87, name: 'Nissan Evalia', category: CAR_CATEGORIES.LARGE },
  { id: 88, name: 'Nissan Teana', category: CAR_CATEGORIES.LARGE },

  // Ford
  { id: 89, name: 'Ford Figo', category: CAR_CATEGORIES.COMPACT },
  { id: 90, name: 'Ford Fiesta', category: CAR_CATEGORIES.STANDARD },
  { id: 91, name: 'Ford Ikon', category: CAR_CATEGORIES.COMPACT },
  { id: 92, name: 'Ford Classic', category: CAR_CATEGORIES.STANDARD },
  { id: 93, name: 'Ford Freestyle', category: CAR_CATEGORIES.STANDARD },
  { id: 94, name: 'Ford Aspire', category: CAR_CATEGORIES.STANDARD },
  { id: 95, name: 'Ford EcoSport', category: CAR_CATEGORIES.STANDARD },
  { id: 96, name: 'Ford Endeavour', category: CAR_CATEGORIES.LARGE },

  // MG
  { id: 97, name: 'MG Comet', category: CAR_CATEGORIES.COMPACT },
  { id: 98, name: 'MG Astor', category: CAR_CATEGORIES.LARGE },
  { id: 99, name: 'MG Astor Select Blackstorm CVT', category: CAR_CATEGORIES.LARGE },
  { id: 100, name: 'MG Hector', category: CAR_CATEGORIES.LARGE },
  { id: 101, name: 'MG Hector Plus', category: CAR_CATEGORIES.LARGE },
  { id: 102, name: 'MG ZS EV', category: CAR_CATEGORIES.LARGE },
  { id: 103, name: 'MG Windsor', category: CAR_CATEGORIES.LARGE },
  { id: 104, name: 'MG Windsor EV', category: CAR_CATEGORIES.LARGE },
  { id: 105, name: 'MG Gloster', category: CAR_CATEGORIES.LARGE },

  // Mahindra
  { id: 106, name: 'Mahindra XUV500', category: CAR_CATEGORIES.LARGE },
  { id: 107, name: 'Mahindra XUV700', category: CAR_CATEGORIES.LARGE },
  { id: 108, name: 'Mahindra Scorpio', category: CAR_CATEGORIES.LARGE },
  { id: 109, name: 'Mahindra Scorpio-N', category: CAR_CATEGORIES.LARGE },
  { id: 110, name: 'Mahindra Thar', category: CAR_CATEGORIES.LARGE },
  { id: 111, name: 'Mahindra Bolero', category: CAR_CATEGORIES.LARGE },
  { id: 112, name: 'Mahindra Alturas G4', category: CAR_CATEGORIES.LARGE },

  // Jeep
  { id: 113, name: 'Jeep Compass', category: CAR_CATEGORIES.LARGE },
  { id: 114, name: 'Jeep Meridian', category: CAR_CATEGORIES.LARGE },

  // Citroën
  { id: 115, name: 'Citroën C3', category: CAR_CATEGORIES.COMPACT },
  { id: 116, name: 'Citroën C3 Aircross', category: CAR_CATEGORIES.STANDARD },

  // Datsun
  { id: 117, name: 'Datsun GO', category: CAR_CATEGORIES.COMPACT },
];

export const getPrice = (category, service) => {
  if (!category || !service) return 0;
  return PRICING_MATRIX[category][service] || 0;
};
