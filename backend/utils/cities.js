const cities = {
  lucknow: { name: 'Lucknow', latitude: 26.8467, longitude: 80.9462 },
  mumbai: { name: 'Mumbai', latitude: 19.076, longitude: 72.8777 },
  ahmedabad: { name: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714 },
  hyderabad: { name: 'Hyderabad', latitude: 17.385, longitude: 78.4867 },
  pune: { name: 'Pune', latitude: 18.5204, longitude: 73.8567 },
  chennai: { name: 'Chennai', latitude: 13.0827, longitude: 80.2707 },
  bengaluru: { name: 'Bengaluru', latitude: 12.9716, longitude: 77.5946 },
  bangalore: { name: 'Bengaluru', latitude: 12.9716, longitude: 77.5946 },
  nagpur: { name: 'Nagpur', latitude: 21.1458, longitude: 79.0882 },
  'new delhi': { name: 'New Delhi', latitude: 28.6139, longitude: 77.209 },
  delhi: { name: 'New Delhi', latitude: 28.6139, longitude: 77.209 },
};

const findCity = (name) => cities[String(name || '').trim().toLowerCase()] || null;

// One row per serviceable city, without the alias keys.
const cityList = () => {
  const seen = new Map();
  Object.values(cities).forEach((city) => {
    if (!seen.has(city.name)) seen.set(city.name, { ...city });
  });
  return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name));
};

const toRad = (value) => (value * Math.PI) / 180;

const distanceKm = (fromLat, fromLng, toLat, toLng) => {
  const earth = 6371;
  const dLat = toRad(toLat - fromLat);
  const dLng = toRad(toLng - fromLng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(fromLat)) * Math.cos(toRad(toLat)) * Math.sin(dLng / 2) ** 2;
  return earth * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

module.exports = { findCity, cityList, distanceKm, cities };
