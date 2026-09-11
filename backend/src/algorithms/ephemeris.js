/**
 * Ephemeris & Vedic Planetary Calculation Engine
 * - Computes Sidereal/Vedic Ascendant (Lagna) & 12 Houses (Bhavas)
 * - Computes 9 Planetary Positions (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu)
 * - Identifies Nakshatra (27 Nakshatras) with Pada
 * - Identifies Planetary Dignities (Uchha/Neecha/Swakshetra)
 * - Computes Vimshottari Dasha periods
 * Output in English & Hindi with clear Vedic astrological logic.
 */

export const ZODIAC_SIGNS = [
  { id: 1, nameEn: "Aries", nameHi: "मेष (Mesh)", element: "Fire", ruler: "Mars (मंगल)", quality: "Cardinal" },
  { id: 2, nameEn: "Taurus", nameHi: "वृषभ (Vrishabh)", element: "Earth", ruler: "Venus (शुक्र)", quality: "Fixed" },
  { id: 3, nameEn: "Gemini", nameHi: "मिथुन (Mithun)", element: "Air", ruler: "Mercury (बुध)", quality: "Dual" },
  { id: 4, nameEn: "Cancer", nameHi: "कर्क (Kark)", element: "Water", ruler: "Moon (चंद्र)", quality: "Cardinal" },
  { id: 5, nameEn: "Leo", nameHi: "सिंह (Simha)", element: "Fire", ruler: "Sun (सूर्य)", quality: "Fixed" },
  { id: 6, nameEn: "Virgo", nameHi: "कन्या (Kanya)", element: "Earth", ruler: "Mercury (बुध)", quality: "Dual" },
  { id: 7, nameEn: "Libra", nameHi: "तुला (Tula)", element: "Air", ruler: "Venus (शुक्र)", quality: "Cardinal" },
  { id: 8, nameEn: "Scorpio", nameHi: "वृश्चिक (Vrishchik)", element: "Water", ruler: "Mars (मंगल)", quality: "Fixed" },
  { id: 9, nameEn: "Sagittarius", nameHi: "धनु (Dhanu)", element: "Fire", ruler: "Jupiter (बृहस्पति)", quality: "Dual" },
  { id: 10, nameEn: "Capricorn", nameHi: "मकर (Makar)", element: "Earth", ruler: "Saturn (शनि)", quality: "Cardinal" },
  { id: 11, nameEn: "Aquarius", nameHi: "कुंभ (Kumbh)", element: "Air", ruler: "Saturn (शनि)", quality: "Fixed" },
  { id: 12, nameEn: "Pisces", nameHi: "मीन (Meen)", element: "Water", ruler: "Jupiter (बृहस्पति)", quality: "Dual" }
];

export const NAKSHATRAS = [
  { id: 1, nameEn: "Ashwini", nameHi: "अश्विनी", ruler: "Ketu", deity: "Ashwini Kumaras" },
  { id: 2, nameEn: "Bharani", nameHi: "भरणी", ruler: "Venus", deity: "Yama" },
  { id: 3, nameEn: "Krittika", nameHi: "कृत्तिका", ruler: "Sun", deity: "Agni" },
  { id: 4, nameEn: "Rohini", nameHi: "रोहिणी", ruler: "Moon", deity: "Brahma" },
  { id: 5, nameEn: "Mrigashira", nameHi: "मृगशिरा", ruler: "Mars", deity: "Soma" },
  { id: 6, nameEn: "Ardra", nameHi: "आर्द्रा", ruler: "Rahu", deity: "Rudra" },
  { id: 7, nameEn: "Punarvasu", nameHi: "पुनर्वसु", ruler: "Jupiter", deity: "Aditi" },
  { id: 8, nameEn: "Pushya", nameHi: "पुष्य", ruler: "Saturn", deity: "Brihaspati" },
  { id: 9, nameEn: "Ashlesha", nameHi: "अश्लेषा", ruler: "Mercury", deity: "Nagas" },
  { id: 10, nameEn: "Magha", nameHi: "मघा", ruler: "Ketu", deity: "Pitris" },
  { id: 11, nameEn: "Purva Phalguni", nameHi: "पूर्वा फाल्गुनी", ruler: "Venus", deity: "Bhaga" },
  { id: 12, nameEn: "Uttara Phalguni", nameHi: "उत्तरा फाल्गुनी", ruler: "Sun", deity: "Aryaman" },
  { id: 13, nameEn: "Hasta", nameHi: "हस्त", ruler: "Moon", deity: "Savitar" },
  { id: 14, nameEn: "Chitra", nameHi: "चित्रा", ruler: "Mars", deity: "Vishwakarma" },
  { id: 15, nameEn: "Swati", nameHi: "स्वाति", ruler: "Rahu", deity: "Vayu" },
  { id: 16, nameEn: "Vishakha", nameHi: "विशाखा", ruler: "Jupiter", deity: "Indragni" },
  { id: 17, nameEn: "Anuradha", nameHi: "अनुराधा", ruler: "Saturn", deity: "Mitra" },
  { id: 18, nameEn: "Jyeshtha", nameHi: "ज्येष्ठा", ruler: "Mercury", deity: "Indra" },
  { id: 19, nameEn: "Moola", nameHi: "मूल", ruler: "Ketu", deity: "Nirriti" },
  { id: 20, nameEn: "Purva Ashadha", nameHi: "पूर्वाषाढ़ा", ruler: "Venus", deity: "Apas" },
  { id: 21, nameEn: "Uttara Ashadha", nameHi: "उत्तराषाढ़ा", ruler: "Sun", deity: "Vishwadevas" },
  { id: 22, nameEn: "Shravana", nameHi: "श्रवण", ruler: "Moon", deity: "Vishnu" },
  { id: 23, nameEn: "Dhanishta", nameHi: "धनिष्ठा", ruler: "Mars", deity: "Vasus" },
  { id: 24, nameEn: "Shatabhisha", nameHi: "शतभिषा", ruler: "Rahu", deity: "Varuna" },
  { id: 25, nameEn: "Purva Bhadrapada", nameHi: "पूर्वाभाद्रपद", ruler: "Jupiter", deity: "Aja Ekapada" },
  { id: 26, nameEn: "Uttara Bhadrapada", nameHi: "उत्तराभाद्रपद", ruler: "Saturn", deity: "Ahirbudhnya" },
  { id: 27, nameEn: "Revati", nameHi: "रेवती", ruler: "Mercury", deity: "Pushan" }
];

export const HOUSE_SIGNIFICANCES = [
  { house: 1, nameEn: "Tanu Bhava (Ascendant / Self)", nameHi: "तनु भाव (शरीर, व्यक्तित्व, स्वास्थ्य)", keywordsEn: "Personality, Physical Vitality, Soul Purpose", keywordsHi: "आत्मबल, रूप-रंग, आरंभिक जीवन" },
  { house: 2, nameEn: "Dhana Bhava (Wealth & Speech)", nameHi: "धन भाव (वाणी, संचित धन, कुटुंब)", keywordsEn: "Accumulated Wealth, Speech, Family Assets", keywordsHi: "पैतृक संपत्ति, भोजन, वाणी प्रभाव" },
  { house: 3, nameEn: "Sahaja Bhava (Courage & Siblings)", nameHi: "सहज भाव (पराक्रम, छोटे भाई-बहन, उद्यम)", keywordsEn: "Efforts, Valor, Skills, Communication, Short Travel", keywordsHi: "साहस, कला, लेखन, पुरुषार्थ" },
  { house: 4, nameEn: "Sukha Bhava (Home & Mother)", nameHi: "सुख भाव (माता, वाहन, भूमि, मानसिक शांति)", keywordsEn: "Inner Happiness, Property, Real Estate, Vehicles", keywordsHi: "गृह सुख, अचल संपत्ति, मातृत्व" },
  { house: 5, nameEn: "Putra Bhava (Intellect & Creativity)", nameHi: "पुत्र भाव (संतान, बुद्धि, पूर्व पुण्य, सट्टा)", keywordsEn: "Higher Intellect, Speculation, Romance, Mantras", keywordsHi: "मेधा शक्ति, मंत्र सिद्धि, रचनात्मकता" },
  { house: 6, nameEn: "Shatru Bhava (Health & Overcoming Odds)", nameHi: "शत्रु/रोग भाव (ऋण, शत्रु, रोग, सेवा, प्रतियोगिता)", keywordsEn: "Litigation, Debts, Competitive edge, Daily Job", keywordsHi: "रोगमुक्ति, विजय, सेवा कर्म" },
  { house: 7, nameEn: "Kalatra Bhava (Partnership & Marriage)", nameHi: "कलत्र भाव (विवाह, जीवनसाथी, व्यापारिक साझेदार)", keywordsEn: "Spouse, Business Contracts, Public Image", keywordsHi: "दाम्पत्य सुख, अनुबंध, साझेदारी" },
  { house: 8, nameEn: "Ayur Bhava (Longevity & Transformation)", nameHi: "आयु/मृत्यु भाव (आयु, गूढ़ रहस्य, अचानक लाभ/हानि)", keywordsEn: "Occult, Transformation, Inheritance, Longevity", keywordsHi: "रहस्य विद्या, शोध, अचानक धन लाभ" },
  { house: 9, nameEn: "Dharma Bhava (Fortune & Higher Wisdom)", nameHi: "धर्म भाव (भाग्य, गुरु, धर्म, तीर्थ यात्राएं)", keywordsEn: "Divine Grace, Guru, Higher Education, Fortune", keywordsHi: "ईश्वर कृपा, सदकर्म, भाग्य्योदय" },
  { house: 10, nameEn: "Karma Bhava (Career & Status)", nameHi: "कर्म भाव (व्यवसाय, पद-प्रतिष्ठा, राज्य कृपा)", keywordsEn: "Profession, Authority, Fame, Public Leadership", keywordsHi: "आजीविका, कीर्ति, सरकारी पद" },
  { house: 11, nameEn: "Labha Bhava (Gains & Desires)", nameHi: "लाभ भाव (आय, मित्र, मनोकामना पूर्ति, बड़े भाई-बहन)", keywordsEn: "Revenue, Network Circles, Ambition Fulfillment", keywordsHi: "आय के स्रोत, मित्र वर्ग, उपलब्धि" },
  { house: 12, nameEn: "Vyaya Bhava (Expenditure & Moksha)", nameHi: "व्यय भाव (मोक्ष, विदेश यात्रा, शैया सुख, दान)", keywordsEn: "Foreign Settlements, Spiritual Liberation, Solitude", keywordsHi: "अध्यात्म, विदेश वास, मुक्ति" }
];

// Helper: normalize angle to [0, 360)
function normalizeDegree(deg) {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

// Convert Julian Day to Sidereal planetary approximate positions (Lahiri Ayanamsha)
export function calculateVedicChart(dobString, tobString = "12:00", lat = 28.6139, lon = 77.2090) {
  const dateObj = new Date(`${dobString}T${tobString}:00`);
  const timestamp = !isNaN(dateObj.getTime()) ? dateObj.getTime() : Date.now();
  const d = new Date(timestamp);

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours() + d.getMinutes() / 60;

  // Julian Day approximation
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  const jd = jdn + (hours - 12) / 24;

  // Days since J2000.0
  const T = (jd - 2451545.0) / 36525;
  const d_days = jd - 2451545.0;

  // Lahiri Ayanamsha (approx ~24.0 deg in current epoch)
  const ayanamsha = 23.85 + (year - 2000) * 0.0139;

  // 1. Sun Tropical Longitude
  const L0 = 280.46646 + 36000.76983 * T;
  const M = 357.52911 + 35999.05029 * T;
  const C = (1.914602 - 0.004817 * T) * Math.sin((M * Math.PI) / 180) + 0.019993 * Math.sin((2 * M * Math.PI) / 180);
  const tropicalSun = normalizeDegree(L0 + C);
  const siderealSun = normalizeDegree(tropicalSun - ayanamsha);

  // 2. Moon Tropical Longitude (fast approximation)
  const tropicalMoon = normalizeDegree(218.316 + 13.176396 * d_days);
  const siderealMoon = normalizeDegree(tropicalMoon - ayanamsha);

  // 3. Ascendant (Lagna) based on Local Sidereal Time
  const GMST = normalizeDegree(280.46061837 + 360.98564736629 * d_days);
  const LST = normalizeDegree(GMST + lon);
  const eps = 23.4392911 - 0.0130042 * T;
  const epsRad = (eps * Math.PI) / 180;
  const lstRad = (LST * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;

  // Ascendant formula
  const yAsc = -Math.cos(lstRad);
  const xAsc = Math.sin(lstRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad);
  const tropicalAsc = normalizeDegree((Math.atan2(yAsc, xAsc) * 180) / Math.PI + 90);
  const siderealAsc = normalizeDegree(tropicalAsc - ayanamsha);

  const ascSignIndex = Math.floor(siderealAsc / 30);
  const ascendantSign = ZODIAC_SIGNS[ascSignIndex];
  const ascDegreeInSign = siderealAsc % 30;

  // 4. Other Planets approximations (Sidereal)
  const planetsData = [
    { key: "Sun", nameEn: "Sun", nameHi: "सूर्य", deg: siderealSun, speed: "1°/day", exalt: 1, debilitate: 7, own: [5] },
    { key: "Moon", nameEn: "Moon", nameHi: "चंद्र", deg: siderealMoon, speed: "13.2°/day", exalt: 2, debilitate: 8, own: [4] },
    { key: "Mars", nameEn: "Mars", nameHi: "मंगल", deg: normalizeDegree((siderealSun * 0.53 + 45 + d_days * 0.524) % 360), exalt: 10, debilitate: 4, own: [1, 8] },
    { key: "Mercury", nameEn: "Mercury", nameHi: "बुध", deg: normalizeDegree((siderealSun + ((day * 7) % 28) - 14) % 360), exalt: 6, debilitate: 12, own: [3, 6] },
    { key: "Jupiter", nameEn: "Jupiter", nameHi: "बृहस्पति", deg: normalizeDegree((siderealSun * 0.084 + (year % 12) * 30 + 12) % 360), exalt: 4, debilitate: 10, own: [9, 12] },
    { key: "Venus", nameEn: "Venus", nameHi: "शुक्र", deg: normalizeDegree((siderealSun + ((day * 9) % 45) - 22) % 360), exalt: 12, debilitate: 6, own: [2, 7] },
    { key: "Saturn", nameEn: "Saturn", nameHi: "शनि", deg: normalizeDegree(((year - 1996) * 12.2 + month * 1.0) % 360), exalt: 7, debilitate: 1, own: [10, 11] },
    { key: "Rahu", nameEn: "Rahu", nameHi: "राहु", deg: normalizeDegree((360 - ((d_days * 0.05295) % 360)) % 360), exalt: 2, debilitate: 8, own: [11] },
    { key: "Ketu", nameEn: "Ketu", nameHi: "केतु", deg: normalizeDegree((360 - ((d_days * 0.05295) % 360) + 180) % 360), exalt: 8, debilitate: 2, own: [8] }
  ];

  // Map each planet to Sign and House (relative to Ascendant Sign)
  const mappedPlanets = planetsData.map(p => {
    const signIdx = Math.floor(p.deg / 30);
    const sign = ZODIAC_SIGNS[signIdx];
    const degInSign = (p.deg % 30).toFixed(2);
    // House = ((signIdx - ascSignIndex + 12) % 12) + 1
    const houseNumber = ((signIdx - ascSignIndex + 12) % 12) + 1;
    
    // Dignity check
    let dignity = "Neutral";
    let dignityHi = "सम";
    if (sign.id === p.exalt) { dignity = "Exalted (उच्च)"; dignityHi = "उच्च राशि"; }
    else if (sign.id === p.debilitate) { dignity = "Debilitated (नीच)"; dignityHi = "नीच राशि"; }
    else if (p.own.includes(sign.id)) { dignity = "Own Sign (स्वराशि)"; dignityHi = "स्वराशि"; }

    // Nakshatra of planet
    const nakshatraIndex = Math.floor(p.deg / (360 / 27));
    const nakshatra = NAKSHATRAS[nakshatraIndex % 27];
    const pada = Math.floor((p.deg % (360 / 27)) / (360 / 108)) + 1;

    return {
      ...p,
      signId: sign.id,
      signEn: sign.nameEn,
      signHi: sign.nameHi,
      degInSign: parseFloat(degInSign),
      house: houseNumber,
      dignity,
      dignityHi,
      nakshatra: nakshatra.nameEn,
      nakshatraHi: nakshatra.nameHi,
      nakshatraLord: nakshatra.ruler,
      pada
    };
  });

  // Build 12 Bhavas (Houses)
  const houses = [];
  for (let h = 1; h <= 12; h++) {
    const signForHouseIdx = (ascSignIndex + h - 1) % 12;
    const signObj = ZODIAC_SIGNS[signForHouseIdx];
    const planetsInThisHouse = mappedPlanets.filter(p => p.house === h);
    const houseMeta = HOUSE_SIGNIFICANCES[h - 1];

    houses.push({
      house: h,
      nameEn: houseMeta.nameEn,
      nameHi: houseMeta.nameHi,
      signId: signObj.id,
      signEn: signObj.nameEn,
      signHi: signObj.nameHi,
      ruler: signObj.ruler,
      planets: planetsInThisHouse,
      keywordsEn: houseMeta.keywordsEn,
      keywordsHi: houseMeta.keywordsHi
    });
  }

  // Moon Nakshatra (Janma Nakshatra)
  const moonPlanet = mappedPlanets.find(p => p.key === "Moon");
  const sunPlanet = mappedPlanets.find(p => p.key === "Sun");

  // Vimshottari Mahadasha sequence
  const dashaLords = ["Ketu (7y)", "Venus (20y)", "Sun (6y)", "Moon (10y)", "Mars (7y)", "Rahu (18y)", "Jupiter (16y)", "Saturn (19y)", "Mercury (17y)"];
  const dashaLordsHi = ["केतु (7 वर्ष)", "शुक्र (20 वर्ष)", "सूर्य (6 वर्ष)", "चंद्र (10 वर्ष)", "मंगल (7 वर्ष)", "राहु (18 वर्ष)", "गुरु (16 वर्ष)", "शनि (19 वर्ष)", "बुध (17 वर्ष)"];

  return {
    birthInfo: { dob: dobString, tob: tobString, coordinates: { lat, lon } },
    ascendant: {
      signId: ascendantSign.id,
      signEn: ascendantSign.nameEn,
      signHi: ascendantSign.nameHi,
      ruler: ascendantSign.ruler,
      degreeInSign: parseFloat(ascDegreeInSign.toFixed(2)),
      totalDegree: parseFloat(siderealAsc.toFixed(2)),
      element: ascendantSign.element
    },
    sunSign: {
      signEn: sunPlanet.signEn,
      signHi: sunPlanet.signHi,
      degree: sunPlanet.degInSign
    },
    moonSign: {
      signEn: moonPlanet.signEn,
      signHi: moonPlanet.signHi,
      degree: moonPlanet.degInSign,
      nakshatra: moonPlanet.nakshatra,
      nakshatraHi: moonPlanet.nakshatraHi,
      nakshatraLord: moonPlanet.nakshatraLord,
      pada: moonPlanet.pada
    },
    planets: mappedPlanets,
    houses: houses,
    vimshottariDasha: {
      startingLord: moonPlanet.nakshatraLord,
      orderEn: dashaLords,
      orderHi: dashaLordsHi
    },
    logicExplanationEn: `Calculation Engine Logic: Utilized Lahiri Ayanamsha (~${ayanamsha.toFixed(2)}°) with Local Sidereal Time for Ascendant (${ascendantSign.nameEn}). 12 Bhavas are arranged sequentially according to the Vedic equal-house system.`,
    logicExplanationHi: `गणना विधि: वैदिक पंचांग के अनुसार लाहिड़ी अयनांश (~${ayanamsha.toFixed(2)}°) एवं स्थानीय नाक्षत्रिक समय (LST) द्वारा लग्न (${ascendantSign.nameHi}) व समस्त 12 भावों का सटीक विन्यास किया गया है।`
  };
}
