import React from 'react';

/**
 * Determines specific car body type based on model name
 */
export const getCarBodyType = (carName = '') => {
  const name = (carName || '').toLowerCase();

  // Sports & Supercars
  if (
    name.includes('911') || name.includes('revuelto') || name.includes('296 gtb') ||
    name.includes('vantage') || name.includes('db12') || name.includes('granturismo') ||
    name.includes('continental gt') || name.includes('spectre') || name.includes('ferrari') ||
    name.includes('lamborghini')
  ) {
    return 'sports';
  }

  // Rugged 4x4 / Offroad
  if (
    name.includes('thar') || name.includes('jimny') || name.includes('gurkha') ||
    name.includes('defender') || name.includes('wrangler')
  ) {
    return 'rugged';
  }

  // MUV / MPV / Van
  if (
    name.includes('ertiga') || name.includes('xl6') || name.includes('innova') ||
    name.includes('carens') || name.includes('triber') || name.includes('carnival') ||
    name.includes('rumion') || name.includes('lodgy') || name.includes('eeco') ||
    name.includes('evalia') || name.includes('hexa') || name.includes('lm')
  ) {
    return 'mpv';
  }

  // Tallboy / Micro-SUV
  if (
    name.includes('wagonr') || name.includes('wagon r') || name.includes('s-presso') ||
    name.includes('spresso') || name.includes('comet') || name.includes('santro')
  ) {
    return 'tallboy';
  }

  // Full-Size SUV / Tough SUV
  if (
    name.includes('fortuner') || name.includes('scorpio') || name.includes('safari') ||
    name.includes('xuv700') || name.includes('xuv500') || name.includes('endeavour') ||
    name.includes('gloster') || name.includes('bolero') || name.includes('kodiaq') ||
    name.includes('tiguan') || name.includes('meridian') || name.includes('alturas') ||
    name.includes('tucson') || name.includes('alcazar') || name.includes('cullinan') ||
    name.includes('urus') || name.includes('dbx') || name.includes('bentayga') ||
    name.includes('purosangue') || name.includes('lx') || name.includes('gls') ||
    name.includes('gle') || name.includes('x7') || name.includes('x5') ||
    name.includes('q7') || name.includes('q8') || name.includes('range rover') ||
    name.includes('discovery') || name.includes('xc90') || name.includes('ex90')
  ) {
    return 'full_suv';
  }

  // Midsize SUV
  if (
    name.includes('creta') || name.includes('seltos') || name.includes('harrier') ||
    name.includes('curvv') || name.includes('grand vitara') || name.includes('hyryder') ||
    name.includes('kushaq') || name.includes('taigun') || name.includes('duster') ||
    name.includes('hector') || name.includes('astor') || name.includes('zs ev') ||
    name.includes('compass') || name.includes('terrano') || name.includes('kicks') ||
    name.includes('captur') || name.includes('x-trail') || name.includes('glc') ||
    name.includes('q5') || name.includes('x3') || name.includes('xc60') ||
    name.includes('macan') || name.includes('cayenne') || name.includes('f-pace') ||
    name.includes('velar') || name.includes('levante') || name.includes('grecale') ||
    name.includes('nx') || name.includes('rx')
  ) {
    return 'mid_suv';
  }

  // Compact SUV / Crossover
  if (
    name.includes('brezza') || name.includes('fronx') || name.includes('punch') ||
    name.includes('nexon') || name.includes('venue') || name.includes('sonet') ||
    name.includes('exter') || name.includes('kiger') || name.includes('magnite') ||
    name.includes('ecosport') || name.includes('c3 aircross') || name.includes('taisor') ||
    name.includes('urban cruiser') || name.includes('kylaq') || name.includes('gla') ||
    name.includes('glb') || name.includes('x1') || name.includes('ix1') ||
    name.includes('q3') || name.includes('xc40') || name.includes('evoque') ||
    name.includes('countryman')
  ) {
    return 'compact_suv';
  }

  // Luxury / Executive Sedan
  if (
    name.includes('c-class') || name.includes('e-class') || name.includes('s-class') ||
    name.includes('maybach') || name.includes('cla') || name.includes('eqs') ||
    name.includes('3 series') || name.includes('5 series') || name.includes('7 series') ||
    name.includes('2 series') || name.includes('i4') || name.includes('i5') ||
    name.includes('i7') || name.includes('a4') || name.includes('a6') ||
    name.includes('a8') || name.includes('superb') || name.includes('octavia') ||
    name.includes('panamera') || name.includes('taycan') || name.includes('ghost') ||
    name.includes('phantom') || name.includes('flying spur') || name.includes('es') ||
    name.includes('teana')
  ) {
    return 'luxury_sedan';
  }

  // Standard / Compact Sedan
  if (
    name.includes('dzire') || name.includes('ciaz') || name.includes('verna') ||
    name.includes('city') || name.includes('amaze') || name.includes('aura') ||
    name.includes('tigor') || name.includes('slavia') || name.includes('virtus') ||
    name.includes('rapid') || name.includes('sunny') || name.includes('fiesta') ||
    name.includes('aspire') || name.includes('linea') || name.includes('cruze') ||
    name.includes('yaris') || name.includes('etios') || name.includes('fluence') ||
    name.includes('scala') || name.includes('accent') || name.includes('laura')
  ) {
    return 'sedan';
  }

  // Sporty Hatchback
  if (
    name.includes('swift') || name.includes('baleno') || name.includes('i20') ||
    name.includes('altroz') || name.includes('glanza') || name.includes('polo') ||
    name.includes('figo') || name.includes('freestyle') || name.includes('cooper') ||
    name.includes('punto')
  ) {
    return 'sport_hatch';
  }

  // Standard Hatchback (Alto, Alto K10, Celerio, Kwid, Tiago, Beat, Spark, etc.)
  return 'hatchback';
};

export const getCarBodyLabel = (type) => {
  switch (type) {
    case 'tallboy': return 'Tallboy';
    case 'sport_hatch': return 'Sport Hatch';
    case 'sedan': return 'Sedan';
    case 'compact_suv': return 'Compact SUV';
    case 'mid_suv': return 'SUV';
    case 'rugged': return '4x4 Off-Road';
    case 'full_suv': return 'Full-Size SUV';
    case 'mpv': return 'MUV / 7-Seater';
    case 'luxury_sedan': return 'Luxury Sedan';
    case 'sports': return 'Sports Car';
    default: return 'Hatchback';
  }
};

/**
 * High-definition vector SVG car illustrations tailored to each car body style
 */
const CarVisualIcon = ({ carName = '', className = 'w-16 h-10' }) => {
  const type = getCarBodyType(carName);

  switch (type) {
    // 1. COMPACT HATCHBACK (Alto, Alto K10, Celerio, Kwid, Tiago, Spark, Beat)
    case 'hatchback':
      return (
        <svg viewBox="0 0 110 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="hbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
            <linearGradient id="hbHover" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#0052cc" />
            </linearGradient>
          </defs>
          {/* Main Body */}
          <path
            d="M 12 36 L 16 26 C 18 24 23 23 30 22 L 40 13 C 43 11 48 10 57 10 L 76 10 C 82 10 86 12 88 15 L 94 22 C 99 23 102 26 102 30 L 100 36 C 98 37 92 37 88 37 C 88 33 84 30 79 30 C 74 30 70 33 70 37 L 40 37 C 40 33 36 30 31 30 C 26 30 22 33 22 37 Z"
            className="fill-slate-300 group-hover:fill-blue-500 transition-colors duration-300"
          />
          {/* Windows */}
          <path
            d="M 42 14 L 56 12 L 56 22 L 34 22 Z"
            className="fill-slate-100 group-hover:fill-blue-100 transition-colors"
          />
          <path
            d="M 60 12 L 74 12 C 78 12 82 14 84 17 L 88 22 L 60 22 Z"
            className="fill-slate-100 group-hover:fill-blue-100 transition-colors"
          />
          {/* Headlight & Tail light */}
          <circle cx="16" cy="27" r="2.5" className="fill-amber-300 group-hover:fill-amber-400" />
          <path d="M 98 25 L 101 27 L 100 30 Z" className="fill-red-400 group-hover:fill-red-500" />
          {/* Front Wheel */}
          <circle cx="31" cy="37" r="7.5" className="fill-slate-700 group-hover:fill-slate-900 transition-colors" />
          <circle cx="31" cy="37" r="4.5" className="fill-slate-300 group-hover:fill-blue-200 transition-colors" />
          <circle cx="31" cy="37" r="2" className="fill-slate-700" />
          {/* Rear Wheel */}
          <circle cx="79" cy="37" r="7.5" className="fill-slate-700 group-hover:fill-slate-900 transition-colors" />
          <circle cx="79" cy="37" r="4.5" className="fill-slate-300 group-hover:fill-blue-200 transition-colors" />
          <circle cx="79" cy="37" r="2" className="fill-slate-700" />
        </svg>
      );

    // 2. TALLBOY HATCHBACK (WagonR, S-Presso, Comet, Santro)
    case 'tallboy':
      return (
        <svg viewBox="0 0 110 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Tall Boxy Body */}
          <path
            d="M 12 36 L 15 27 C 16 24 20 23 27 22 L 36 10 C 38 7 42 6 49 6 L 79 6 C 84 6 88 8 90 12 L 95 24 C 99 25 101 28 101 32 L 99 36 C 97 37 92 37 88 37 C 88 33 84 30 79 30 C 74 30 70 33 70 37 L 41 37 C 41 33 37 30 32 30 C 27 30 23 33 23 37 Z"
            className="fill-slate-300 group-hover:fill-blue-500 transition-colors duration-300"
          />
          {/* Tall Windows */}
          <path
            d="M 38 10 L 55 8 L 55 21 L 30 21 Z"
            className="fill-slate-100 group-hover:fill-blue-100 transition-colors"
          />
          <path
            d="M 59 8 L 77 8 C 81 8 85 10 87 13 L 90 21 L 59 21 Z"
            className="fill-slate-100 group-hover:fill-blue-100 transition-colors"
          />
          {/* Headlight & Tail light */}
          <circle cx="15" cy="28" r="2.5" className="fill-amber-300 group-hover:fill-amber-400" />
          <path d="M 98 25 L 100 27 L 99 31 Z" className="fill-red-400 group-hover:fill-red-500" />
          {/* Front Wheel */}
          <circle cx="32" cy="37" r="7.5" className="fill-slate-700 group-hover:fill-slate-900 transition-colors" />
          <circle cx="32" cy="37" r="4.5" className="fill-slate-300 group-hover:fill-blue-200 transition-colors" />
          <circle cx="32" cy="37" r="2" className="fill-slate-700" />
          {/* Rear Wheel */}
          <circle cx="79" cy="37" r="7.5" className="fill-slate-700 group-hover:fill-slate-900 transition-colors" />
          <circle cx="79" cy="37" r="4.5" className="fill-slate-300 group-hover:fill-blue-200 transition-colors" />
          <circle cx="79" cy="37" r="2" className="fill-slate-700" />
        </svg>
      );

    // 3. SPORTY HATCHBACK (Swift, Baleno, i20, Altroz, Glanza, Polo)
    case 'sport_hatch':
      return (
        <svg viewBox="0 0 110 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Sleek Aerodynamic Body with Rear Spoiler */}
          <path
            d="M 10 36 L 15 25 C 18 23 24 22 31 21 L 43 12 C 47 9 53 8 62 8 L 81 8 L 87 7 L 85 11 L 91 19 C 96 21 100 24 100 29 L 98 36 C 96 37 91 37 87 37 C 87 33 83 29.5 78 29.5 C 73 29.5 69 33 69 37 L 41 37 C 41 33 37 29.5 32 29.5 C 27 29.5 23 33 23 37 Z"
            className="fill-slate-300 group-hover:fill-blue-500 transition-colors duration-300"
          />
          {/* Sport Windows */}
          <path
            d="M 44 12 L 60 10 L 60 20 L 33 20 Z"
            className="fill-slate-100 group-hover:fill-blue-100 transition-colors"
          />
          <path
            d="M 64 10 L 78 10 C 81 10 84 12 86 15 L 89 20 L 64 20 Z"
            className="fill-slate-100 group-hover:fill-blue-100 transition-colors"
          />
          {/* Aggressive Headlamp */}
          <path d="M 13 25 L 18 24 L 16 27 Z" className="fill-amber-300 group-hover:fill-amber-400" />
          <path d="M 97 25 L 100 27 L 98 30 Z" className="fill-red-400 group-hover:fill-red-500" />
          {/* Alloy Wheels */}
          <circle cx="32" cy="37" r="7.5" className="fill-slate-700 group-hover:fill-slate-900 transition-colors" />
          <circle cx="32" cy="37" r="4.5" className="fill-slate-300 group-hover:fill-blue-200 transition-colors" />
          <circle cx="32" cy="37" r="2" className="fill-slate-700" />
          <circle cx="78" cy="37" r="7.5" className="fill-slate-700 group-hover:fill-slate-900 transition-colors" />
          <circle cx="78" cy="37" r="4.5" className="fill-slate-300 group-hover:fill-blue-200 transition-colors" />
          <circle cx="78" cy="37" r="2" className="fill-slate-700" />
        </svg>
      );

    // 4. SEDAN (Dzire, Ciaz, Verna, City, Aura, Amaze, Virtus, Slavia)
    case 'sedan':
      return (
        <svg viewBox="0 0 115 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Three-Box Sedan Silhouette with Clear Trunk */}
          <path
            d="M 8 36 L 14 26 C 18 23 25 22 34 21 L 45 12 C 49 9 56 8 66 8 L 81 8 C 86 8 90 10 93 14 L 97 22 L 107 23 C 110 24 111 27 111 31 L 109 36 C 107 37 101 37 97 37 C 97 33 93 29.5 88 29.5 C 83 29.5 79 33 79 37 L 42 37 C 42 33 38 29.5 33 29.5 C 28 29.5 24 33 24 37 Z"
            className="fill-slate-300 group-hover:fill-blue-500 transition-colors duration-300"
          />
          {/* Windows */}
          <path
            d="M 46 12 L 63 10 L 63 20 L 36 20 Z"
            className="fill-slate-100 group-hover:fill-blue-100 transition-colors"
          />
          <path
            d="M 67 10 L 79 10 C 83 10 86 12 88 15 L 94 20 L 67 20 Z"
            className="fill-slate-100 group-hover:fill-blue-100 transition-colors"
          />
          {/* Headlight & Tail light */}
          <path d="M 12 26 L 17 24 L 16 28 Z" className="fill-amber-300 group-hover:fill-amber-400" />
          <path d="M 108 26 L 111 28 L 110 32 Z" className="fill-red-400 group-hover:fill-red-500" />
          {/* Wheels */}
          <circle cx="33" cy="37" r="7.5" className="fill-slate-700 group-hover:fill-slate-900 transition-colors" />
          <circle cx="33" cy="37" r="4.5" className="fill-slate-300 group-hover:fill-blue-200 transition-colors" />
          <circle cx="33" cy="37" r="2" className="fill-slate-700" />
          <circle cx="88" cy="37" r="7.5" className="fill-slate-700 group-hover:fill-slate-900 transition-colors" />
          <circle cx="88" cy="37" r="4.5" className="fill-slate-300 group-hover:fill-blue-200 transition-colors" />
          <circle cx="88" cy="37" r="2" className="fill-slate-700" />
        </svg>
      );

    // 5. COMPACT SUV / CROSSOVER (Brezza, Fronx, Punch, Nexon, Venue, Sonet)
    case 'compact_suv':
      return (
        <svg viewBox="0 0 110 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Roof rails */}
          <rect x="46" y="5" width="34" height="2" rx="1" className="fill-slate-400 group-hover:fill-blue-600 transition-colors" />
          {/* Elevated Muscular Body */}
          <path
            d="M 10 35 L 14 25 C 17 23 23 22 31 21 L 41 10 C 44 8 49 7 57 7 L 82 7 C 86 7 90 9 92 13 L 97 22 C 101 23 103 26 103 30 L 101 35 C 99 36 93 36 89 36 C 89 31.5 85 28 80 28 C 75 28 71 31.5 71 36 L 41 36 C 41 31.5 37 28 32 28 C 27 28 23 31.5 23 36 Z"
            className="fill-slate-300 group-hover:fill-blue-500 transition-colors duration-300"
          />
          {/* Windows */}
          <path
            d="M 43 11 L 58 9 L 58 20 L 33 20 Z"
            className="fill-slate-100 group-hover:fill-blue-100 transition-colors"
          />
          <path
            d="M 62 9 L 80 9 C 83 9 86 11 88 14 L 92 20 L 62 20 Z"
            className="fill-slate-100 group-hover:fill-blue-100 transition-colors"
          />
          {/* Headlamp & Tail lamp */}
          <circle cx="15" cy="26" r="2.5" className="fill-amber-300 group-hover:fill-amber-400" />
          <path d="M 99 24 L 102 26 L 101 29 Z" className="fill-red-400 group-hover:fill-red-500" />
          {/* Rugged Wheels with High Ground Clearance */}
          <circle cx="32" cy="36" r="8" className="fill-slate-700 group-hover:fill-slate-900 transition-colors" />
          <circle cx="32" cy="36" r="5" className="fill-slate-300 group-hover:fill-blue-200 transition-colors" />
          <circle cx="32" cy="36" r="2" className="fill-slate-700" />
          <circle cx="80" cy="36" r="8" className="fill-slate-700 group-hover:fill-slate-900 transition-colors" />
          <circle cx="80" cy="36" r="5" className="fill-slate-300 group-hover:fill-blue-200 transition-colors" />
          <circle cx="80" cy="36" r="2" className="fill-slate-700" />
        </svg>
      );

    // 6. RUGGED 4X4 OFF-ROAD (Thar, Jimny, Gurkha, Wrangler)
    case 'rugged':
      return (
        <svg viewBox="0 0 115 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Iconic Boxy 4x4 with Rear Mounted Spare Tyre */}
          <path
            d="M 12 34 L 15 23 C 16 21 21 20 28 20 L 37 8 C 39 6 43 5 49 5 L 87 5 C 89 5 91 6 92 8 L 94 20 L 98 21 C 100 22 101 25 101 29 L 99 34 C 98 35 94 35 90 35 C 90 30 86 26.5 81 26.5 C 76 26.5 72 30 72 35 L 42 35 C 42 30 38 26.5 33 26.5 C 28 26.5 24 30 24 35 Z"
            className="fill-slate-300 group-hover:fill-blue-500 transition-colors duration-300"
          />
          {/* Upright Windows */}
          <path
            d="M 39 8 L 57 7 L 57 19 L 30 19 Z"
            className="fill-slate-100 group-hover:fill-blue-100 transition-colors"
          />
          <path
            d="M 61 7 L 86 7 L 88 19 L 61 19 Z"
            className="fill-slate-100 group-hover:fill-blue-100 transition-colors"
          />
          {/* Round Headlight */}
          <circle cx="16" cy="24" r="3" className="fill-amber-300 group-hover:fill-amber-400" />
          {/* Tailgate Spare Tyre */}
          <circle cx="102" cy="23" r="6.5" className="fill-slate-800 group-hover:fill-slate-900 transition-colors" />
          <circle cx="102" cy="23" r="3.5" className="fill-slate-400 group-hover:fill-blue-300" />
          {/* Large Off-road Wheels */}
          <circle cx="33" cy="35" r="8.5" className="fill-slate-800 group-hover:fill-slate-900 transition-colors" />
          <circle cx="33" cy="35" r="5" className="fill-slate-300 group-hover:fill-blue-200 transition-colors" />
          <circle cx="33" cy="35" r="2" className="fill-slate-800" />
          <circle cx="81" cy="35" r="8.5" className="fill-slate-800 group-hover:fill-slate-900 transition-colors" />
          <circle cx="81" cy="35" r="5" className="fill-slate-300 group-hover:fill-blue-200 transition-colors" />
          <circle cx="81" cy="35" r="2" className="fill-slate-800" />
        </svg>
      );

    // 7. FULL-SIZE / TOUGH SUV (Scorpio, Fortuner, Safari, XUV700, Endeavour)
    case 'full_suv':
    case 'mid_suv':
      return (
        <svg viewBox="0 0 115 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Roof Rail */}
          <rect x="42" y="5" width="45" height="2" rx="1" className="fill-slate-400 group-hover:fill-blue-600 transition-colors" />
          {/* Large Muscular SUV Body */}
          <path
            d="M 8 35 L 13 24 C 17 22 25 21 34 20 L 44 9 C 48 7 54 7 63 7 L 91 7 C 95 7 98 9 100 13 L 105 21 C 109 23 111 26 111 30 L 109 35 C 107 36 102 36 98 36 C 98 31 93 27 88 27 C 83 27 78 31 78 36 L 44 36 C 44 31 39 27 34 27 C 29 27 24 31 24 36 Z"
            className="fill-slate-300 group-hover:fill-blue-500 transition-colors duration-300"
          />
          {/* Windows */}
          <path
            d="M 45 10 L 64 9 L 64 19 L 36 19 Z"
            className="fill-slate-100 group-hover:fill-blue-100 transition-colors"
          />
          <path
            d="M 68 9 L 88 9 C 92 9 95 11 97 14 L 100 19 L 68 19 Z"
            className="fill-slate-100 group-hover:fill-blue-100 transition-colors"
          />
          {/* Aggressive Headlamp */}
          <path d="M 12 24 L 17 23 L 15 27 Z" className="fill-amber-300 group-hover:fill-amber-400" />
          <path d="M 108 24 L 111 26 L 110 30 Z" className="fill-red-400 group-hover:fill-red-500" />
          {/* Big SUV Wheels */}
          <circle cx="34" cy="36" r="8.5" className="fill-slate-700 group-hover:fill-slate-900 transition-colors" />
          <circle cx="34" cy="36" r="5" className="fill-slate-300 group-hover:fill-blue-200 transition-colors" />
          <circle cx="34" cy="36" r="2" className="fill-slate-700" />
          <circle cx="88" cy="36" r="8.5" className="fill-slate-700 group-hover:fill-slate-900 transition-colors" />
          <circle cx="88" cy="36" r="5" className="fill-slate-300 group-hover:fill-blue-200 transition-colors" />
          <circle cx="88" cy="36" r="2" className="fill-slate-700" />
        </svg>
      );

    // 8. MPV / MUV (Ertiga, Innova, Carens, XL6, Triber)
    case 'mpv':
      return (
        <svg viewBox="0 0 115 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Long 3-Row Multi-Utility Van / MPV Body */}
          <path
            d="M 9 35 L 14 26 C 18 24 24 23 33 21 L 43 9 C 46 8 51 7 58 7 L 93 7 C 97 7 101 9 103 13 L 107 23 C 110 24 112 27 112 31 L 110 35 C 108 36 102 36 98 36 C 98 31.5 94 28 89 28 C 84 28 80 31.5 80 36 L 43 36 C 43 31.5 39 28 34 28 C 29 28 25 31.5 25 36 Z"
            className="fill-slate-300 group-hover:fill-blue-500 transition-colors duration-300"
          />
          {/* Extended 3-Window Greenhouse */}
          <path
            d="M 44 10 L 59 9 L 59 20 L 35 20 Z"
            className="fill-slate-100 group-hover:fill-blue-100 transition-colors"
          />
          <path
            d="M 63 9 L 81 9 L 81 20 L 63 20 Z"
            className="fill-slate-100 group-hover:fill-blue-100 transition-colors"
          />
          <path
            d="M 85 9 L 94 9 C 97 9 99 11 101 14 L 103 20 L 85 20 Z"
            className="fill-slate-100 group-hover:fill-blue-100 transition-colors"
          />
          {/* Headlamp & Tail lamp */}
          <circle cx="14" cy="27" r="2.5" className="fill-amber-300 group-hover:fill-amber-400" />
          <path d="M 109 25 L 112 27 L 111 31 Z" className="fill-red-400 group-hover:fill-red-500" />
          {/* Wheels */}
          <circle cx="34" cy="36" r="8" className="fill-slate-700 group-hover:fill-slate-900 transition-colors" />
          <circle cx="34" cy="36" r="4.5" className="fill-slate-300 group-hover:fill-blue-200 transition-colors" />
          <circle cx="34" cy="36" r="2" className="fill-slate-700" />
          <circle cx="89" cy="36" r="8" className="fill-slate-700 group-hover:fill-slate-900 transition-colors" />
          <circle cx="89" cy="36" r="4.5" className="fill-slate-300 group-hover:fill-blue-200 transition-colors" />
          <circle cx="89" cy="36" r="2" className="fill-slate-700" />
        </svg>
      );

    // 9. LUXURY / EXECUTIVE SEDAN (BMW, Mercedes, Audi)
    case 'luxury_sedan':
      return (
        <svg viewBox="0 0 115 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Stately, Low Limousine Profile */}
          <path
            d="M 6 36 L 13 26 C 18 22 26 21 37 20 L 49 11 C 54 8 62 7 73 7 L 85 7 C 91 7 96 9 99 14 L 102 21 L 110 22 C 113 23 114 26 114 30 L 112 36 C 110 37 104 37 100 37 C 100 32.5 96 29 91 29 C 86 29 82 32.5 82 37 L 43 37 C 43 32.5 39 29 34 29 C 29 29 25 32.5 25 37 Z"
            className="fill-slate-300 group-hover:fill-blue-500 transition-colors duration-300"
          />
          {/* Sleek Tinted Windows */}
          <path
            d="M 50 11 L 68 9 L 68 19 L 38 19 Z"
            className="fill-slate-100 group-hover:fill-blue-100 transition-colors"
          />
          <path
            d="M 72 9 L 84 9 C 88 9 92 11 94 14 L 99 19 L 72 19 Z"
            className="fill-slate-100 group-hover:fill-blue-100 transition-colors"
          />
          {/* Sharp LED Lights */}
          <path d="M 10 26 L 16 24 L 14 28 Z" className="fill-cyan-300 group-hover:fill-cyan-400" />
          <path d="M 111 25 L 114 27 L 113 31 Z" className="fill-red-400 group-hover:fill-red-500" />
          {/* Multi-spoke Wheels */}
          <circle cx="34" cy="37" r="7.5" className="fill-slate-700 group-hover:fill-slate-900 transition-colors" />
          <circle cx="34" cy="37" r="4.5" className="fill-slate-300 group-hover:fill-blue-200 transition-colors" />
          <circle cx="34" cy="37" r="2" className="fill-slate-700" />
          <circle cx="91" cy="37" r="7.5" className="fill-slate-700 group-hover:fill-slate-900 transition-colors" />
          <circle cx="91" cy="37" r="4.5" className="fill-slate-300 group-hover:fill-blue-200 transition-colors" />
          <circle cx="91" cy="37" r="2" className="fill-slate-700" />
        </svg>
      );

    // 10. SPORTS & EXOTIC (Porsche, Ferrari, Lamborghini)
    case 'sports':
      return (
        <svg viewBox="0 0 115 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Low-Slung Aerodynamic Wedge */}
          <path
            d="M 6 36 L 12 26 C 18 22 27 21 38 19 L 51 9 C 56 7 66 6 78 7 L 88 10 C 93 12 97 16 100 20 L 109 23 C 112 24 113 27 113 31 L 111 36 C 109 37 103 37 99 37 C 99 32 95 28.5 90 28.5 C 85 28.5 81 32 81 37 L 43 37 C 43 32 39 28.5 34 28.5 C 29 28.5 25 32 25 37 Z"
            className="fill-slate-300 group-hover:fill-blue-500 transition-colors duration-300"
          />
          {/* Cockpit Canopy */}
          <path
            d="M 52 10 L 75 8 C 82 8 88 11 91 15 L 94 18 L 42 18 Z"
            className="fill-slate-100 group-hover:fill-blue-100 transition-colors"
          />
          {/* Aggressive LED DRL */}
          <path d="M 10 25 L 17 23 L 14 26 Z" className="fill-amber-300 group-hover:fill-amber-400" />
          <path d="M 110 25 L 113 27 L 112 30 Z" className="fill-red-400 group-hover:fill-red-500" />
          {/* Supercar Wheels */}
          <circle cx="34" cy="37" r="8" className="fill-slate-800 group-hover:fill-slate-900 transition-colors" />
          <circle cx="34" cy="37" r="4.5" className="fill-slate-300 group-hover:fill-blue-200 transition-colors" />
          <circle cx="34" cy="37" r="2" className="fill-slate-800" />
          <circle cx="90" cy="37" r="8" className="fill-slate-800 group-hover:fill-slate-900 transition-colors" />
          <circle cx="90" cy="37" r="4.5" className="fill-slate-300 group-hover:fill-blue-200 transition-colors" />
          <circle cx="90" cy="37" r="2" className="fill-slate-800" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 110 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path
            d="M 12 36 L 16 26 C 18 24 23 23 30 22 L 40 13 C 43 11 48 10 57 10 L 76 10 C 82 10 86 12 88 15 L 94 22 C 99 23 102 26 102 30 L 100 36 C 98 37 92 37 88 37 C 88 33 84 30 79 30 C 74 30 70 33 70 37 L 40 37 C 40 33 36 30 31 30 C 26 30 22 33 22 37 Z"
            className="fill-slate-300 group-hover:fill-blue-500 transition-colors duration-300"
          />
          <circle cx="31" cy="37" r="7.5" className="fill-slate-700" />
          <circle cx="79" cy="37" r="7.5" className="fill-slate-700" />
        </svg>
      );
  }
};

export default CarVisualIcon;
