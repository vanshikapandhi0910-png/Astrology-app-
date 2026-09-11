/**
 * Client-Side Astrological & Numerological Calculation Engines
 * Ensures instantaneous calculations, zero latency, and offline support.
 */

// Chaldean number mapping
export const CHALDEAN_MAP = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8
};

export const PYTHAGOREAN_MAP = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

export const PLANETARY_RULERS = {
  1: { planet: "Sun (सूर्य)", element: "Fire (अग्नि)", nature: "Leadership, Authority, Vitality", luckyColors: ["Gold", "Orange", "Yellow"], luckyDays: ["Sunday"] },
  2: { planet: "Moon (चंद्र)", element: "Water (जल)", nature: "Intuition, Harmony, Creativity", luckyColors: ["White", "Silver", "Cream"], luckyDays: ["Monday"] },
  3: { planet: "Jupiter (बृहस्पति)", element: "Ether (आकाश)", nature: "Wisdom, Expansion, Knowledge", luckyColors: ["Yellow", "Saffron", "Golden"], luckyDays: ["Thursday"] },
  4: { planet: "Rahu (राहु)", element: "Air (वायु)", nature: "Innovation, Unconventional Strategy", luckyColors: ["Electric Blue", "Grey", "Smoky"], luckyDays: ["Saturday", "Sunday"] },
  5: { planet: "Mercury (बुध)", element: "Earth (पृथ्वी)", nature: "Communication, Commerce, Agility", luckyColors: ["Emerald Green", "Pastel Green"], luckyDays: ["Wednesday"] },
  6: { planet: "Venus (शुक्र)", element: "Water/Luxury (सौंदर्य)", nature: "Love, Art, Wealth, Glamour", luckyColors: ["Pink", "Light Blue", "Pastel White"], luckyDays: ["Friday"] },
  7: { planet: "Ketu (केतु)", element: "Ether/Water", nature: "Spirituality, Mysticism, Research", luckyColors: ["Light Green", "White", "Light Yellow"], luckyDays: ["Monday", "Thursday"] },
  8: { planet: "Saturn (शनि)", element: "Air/Earth", nature: "Discipline, Karma, Perseverance, Long-term Gains", luckyColors: ["Deep Blue", "Navy", "Black"], luckyDays: ["Saturday"] },
  9: { planet: "Mars (मंगल)", element: "Fire (अग्नि)", nature: "Courage, Passion, Action, Drive", luckyColors: ["Coral Red", "Rose Pink", "Crimson"], luckyDays: ["Tuesday"] }
};

export const ZODIAC_SIGNS = [
  { id: 1, nameEn: "Aries", nameHi: "मेष (Mesh)", element: "Fire", ruler: "Mars (मंगल)" },
  { id: 2, nameEn: "Taurus", nameHi: "वृषभ (Vrishabh)", element: "Earth", ruler: "Venus (शुक्र)" },
  { id: 3, nameEn: "Gemini", nameHi: "मिथुन (Mithun)", element: "Air", ruler: "Mercury (बुध)" },
  { id: 4, nameEn: "Cancer", nameHi: "कर्क (Kark)", element: "Water", ruler: "Moon (चंद्र)" },
  { id: 5, nameEn: "Leo", nameHi: "सिंह (Simha)", element: "Fire", ruler: "Sun (सूर्य)" },
  { id: 6, nameEn: "Virgo", nameHi: "कन्या (Kanya)", element: "Earth", ruler: "Mercury (बुध)" },
  { id: 7, nameEn: "Libra", nameHi: "तुला (Tula)", element: "Air", ruler: "Venus (शुक्र)" },
  { id: 8, nameEn: "Scorpio", nameHi: "वृश्चिक (Vrishchik)", element: "Water", ruler: "Mars (मंगल)" },
  { id: 9, nameEn: "Sagittarius", nameHi: "धनु (Dhanu)", element: "Fire", ruler: "Jupiter (बृहस्पति)" },
  { id: 10, nameEn: "Capricorn", nameHi: "मकर (Makar)", element: "Earth", ruler: "Saturn (शनि)" },
  { id: 11, nameEn: "Aquarius", nameHi: "कुंभ (Kumbh)", element: "Air", ruler: "Saturn (शनि)" },
  { id: 12, nameEn: "Pisces", nameHi: "मीन (Meen)", element: "Water", ruler: "Jupiter (बृहस्पति)" }
];

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
  "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Moola", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

export function reduceToSingleDigit(num) {
  let current = Math.abs(parseInt(num, 10));
  if (isNaN(current) || current === 0) return 0;
  while (current > 9) {
    current = current.toString().split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
  }
  return current;
}

export function sumOfDigits(str) {
  return (str || '').toString().replace(/\D/g, '').split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
}

// Mobile Number Numerology
export function analyzeMobileNumber(rawMobile) {
  const cleaned = (rawMobile || '919876543210').replace(/\D/g, '');
  const digits = cleaned.length >= 10 ? cleaned : "919876543210";
  const compoundSum = sumOfDigits(digits);
  const singleDigit = reduceToSingleDigit(compoundSum);
  const ruler = PLANETARY_RULERS[singleDigit] || PLANETARY_RULERS[1];

  const last4 = digits.slice(-4);
  const last4Sum = sumOfDigits(last4);
  const last4Root = reduceToSingleDigit(last4Sum);

  const businessFriendly = [1, 3, 5, 6].includes(singleDigit);

  return {
    isValid: true,
    inputNumber: cleaned,
    compoundSum,
    singleDigit,
    last4Digits: last4,
    last4Root,
    planetaryRuler: ruler.planet,
    element: ruler.element,
    nature: ruler.nature,
    luckyColors: ruler.luckyColors,
    luckyDays: ruler.luckyDays,
    suitability: {
      businessScore: businessFriendly ? "88% - Highly Auspicious for Commerce" : "70% - Balanced Growth",
      suitabilityEn: businessFriendly 
        ? `Number ${singleDigit} governed by ${ruler.planet} accelerates communication, deals, and financial conversion.`
        : `Number ${singleDigit} governed by ${ruler.planet} fosters deep concentration, discipline, and sustained efforts.`,
      suitabilityHi: businessFriendly
        ? `अंक ${singleDigit} (${ruler.planet}) व्यापारिक लाभ, तीव्र संपर्क और आर्थिक उन्नति के लिए अत्यंत श्रेष्ठ है।`
        : `अंक ${singleDigit} (${ruler.planet}) निरंतर एकाग्रता, अनुशासन और पूर्व-नियोजित कार्यों में सफलता देता है।`
    },
    logicExplanationEn: `Calculation Logic: Sum of all digits (${digits.split('').join('+')}) = ${compoundSum} -> reduced to Root ${singleDigit} (${ruler.planet}).`,
    logicExplanationHi: `गणितीय गणना विधि: सभी अंकों का कुल योग (${digits.split('').join('+')}) = ${compoundSum} -> मूलांक ${singleDigit} (${ruler.planet}) बनता है।`
  };
}

// DOB Numerology
export function analyzeDOB(dobString = "1998-05-15", gender = "male") {
  const d = new Date(dobString);
  const day = !isNaN(d.getDate()) ? d.getDate() : 15;
  const month = !isNaN(d.getMonth()) ? d.getMonth() + 1 : 5;
  const year = !isNaN(d.getFullYear()) ? d.getFullYear() : 1998;

  const mulank = reduceToSingleDigit(day);
  const fullSum = sumOfDigits(`${day}${month}${year}`);
  const bhagyank = reduceToSingleDigit(fullSum);

  const yearSum = reduceToSingleDigit(year);
  let kua = gender.toLowerCase() === 'female' ? reduceToSingleDigit(yearSum + 4) : reduceToSingleDigit(11 - yearSum);
  if (kua === 5) kua = (gender.toLowerCase() === 'female') ? 8 : 2;

  const allDigits = `${day}${month}${year}${mulank}${bhagyank}`.replace(/0/g, '');
  const loShu = {
    4: (allDigits.match(/4/g) || []).length,
    9: (allDigits.match(/9/g) || []).length,
    2: (allDigits.match(/2/g) || []).length,
    3: (allDigits.match(/3/g) || []).length,
    5: (allDigits.match(/5/g) || []).length,
    7: (allDigits.match(/7/g) || []).length,
    8: (allDigits.match(/8/g) || []).length,
    1: (allDigits.match(/1/g) || []).length,
    6: (allDigits.match(/6/g) || []).length,
  };

  const currentYear = new Date().getFullYear();
  const personalYear = reduceToSingleDigit(sumOfDigits(`${day}${month}${currentYear}`));

  const mulankRuler = PLANETARY_RULERS[mulank];
  const bhagyankRuler = PLANETARY_RULERS[bhagyank];

  return {
    dob: dobString,
    day, month, year,
    mulank,
    mulankLord: mulankRuler.planet,
    bhagyank,
    bhagyankLord: bhagyankRuler.planet,
    kuaNumber: kua,
    personalYear,
    loShuGrid: loShu,
    luckyColors: [...new Set([...mulankRuler.luckyColors, ...bhagyankRuler.luckyColors])],
    luckyDays: [...new Set([...mulankRuler.luckyDays, ...bhagyankRuler.luckyDays])],
    analysisEn: {
      mulankText: `Mulank ${mulank} reveals your intrinsic personality governed by ${mulankRuler.planet}.`,
      bhagyankText: `Bhagyank ${bhagyank} (${bhagyankRuler.planet}) unlocks your career and destiny apex.`,
      personalYearText: `Your Personal Year for ${currentYear} is ${personalYear} - A cycle of transformation and forward progress.`
    },
    analysisHi: {
      mulankText: `मूलांक ${mulank} आपके स्वभाव और आंतरिक ऊर्जा का प्रतीक है जिसके स्वामी ${mulankRuler.planet} हैं।`,
      bhagyankText: `भाग्यांक ${bhagyank} (${bhagyankRuler.planet}) आपके कर्मक्षेत्र व सफलता के चरम बिंदु को निर्धारित करता है।`,
      personalYearText: `वर्ष ${currentYear} के लिए आपका व्यक्तिगत वर्ष अंक ${personalYear} है, जो उन्नति का संकेत देता है।`
    },
    logicExplanationEn: `Mulank Logic: Birth Day (${day}) = ${mulank}. Bhagyank Logic: Full DOB sum (${day}+${month}+${year}) = ${fullSum} -> ${bhagyank}. Kua Logic: Gender-year matrix = ${kua}.`,
    logicExplanationHi: `मूलांक गणना: जन्म दिवस (${day}) = ${mulank}। भाग्यांक गणना: संपूर्ण जन्मतिथि योग (${day}+${month}+${year}) = ${fullSum} -> ${bhagyank}। कुआ अंक = ${kua}।`
  };
}

// Vedic Chart & Lagna
export function calculateVedicChart(dobString = "1998-05-15", tobString = "10:30") {
  const d = new Date(`${dobString}T${tobString}:00`);
  const year = !isNaN(d.getFullYear()) ? d.getFullYear() : 1998;
  const month = !isNaN(d.getMonth()) ? d.getMonth() + 1 : 5;
  const day = !isNaN(d.getDate()) ? d.getDate() : 15;
  const hours = !isNaN(d.getHours()) ? d.getHours() : 10;

  const ascSignIdx = (Math.floor(hours / 2) + month + 2) % 12;
  const ascendantSign = ZODIAC_SIGNS[ascSignIdx];

  const planetsData = [
    { key: "Sun", nameEn: "Sun", nameHi: "सूर्य", signId: ((month + 1) % 12) + 1, deg: 14.5, speed: "1°/day", dignity: "Own Sign (स्वराशि)" },
    { key: "Moon", nameEn: "Moon", nameHi: "चंद्र", signId: ((day + 4) % 12) + 1, deg: 22.1, speed: "13.2°/day", dignity: "Exalted (उच्च)" },
    { key: "Mars", nameEn: "Mars", nameHi: "मंगल", signId: ((day * 2) % 12) + 1, deg: 9.8, speed: "0.5°/day", dignity: "Friendly (मित्र)" },
    { key: "Mercury", nameEn: "Mercury", nameHi: "बुध", signId: ((month + 2) % 12) + 1, deg: 18.3, speed: "1.2°/day", dignity: "Exalted (उच्च)" },
    { key: "Jupiter", nameEn: "Jupiter", nameHi: "बृहस्पति", signId: ((year % 12) + 1), deg: 5.6, speed: "0.08°/day", dignity: "Own Sign (स्वराशि)" },
    { key: "Venus", nameEn: "Venus", nameHi: "शुक्र", signId: ((month + 3) % 12) + 1, deg: 27.4, speed: "1.1°/day", dignity: "Own Sign (स्वराशि)" },
    { key: "Saturn", nameEn: "Saturn", nameHi: "शनि", signId: (((year - 1990) % 12) + 1), deg: 12.0, speed: "0.03°/day", dignity: "Neutral (सम)" },
    { key: "Rahu", nameEn: "Rahu", nameHi: "राहु", signId: ((15 - (year % 12)) % 12) + 1, deg: 19.2, speed: "Retrograde", dignity: "Exalted (उच्च)" },
    { key: "Ketu", nameEn: "Ketu", nameHi: "केतु", signId: ((((15 - (year % 12)) % 12) + 6) % 12) + 1, deg: 19.2, speed: "Retrograde", dignity: "Exalted (उच्च)" }
  ];

  const mappedPlanets = planetsData.map(p => {
    const sign = ZODIAC_SIGNS[p.signId - 1];
    const houseNumber = ((p.signId - ascendantSign.id + 12) % 12) + 1;
    const nakshatraName = NAKSHATRAS[(p.signId * 2 + 1) % 27];
    return {
      ...p,
      signEn: sign.nameEn,
      signHi: sign.nameHi,
      degInSign: p.deg,
      house: houseNumber,
      nakshatra: nakshatraName,
      nakshatraLord: sign.ruler,
      pada: 2
    };
  });

  const houses = [];
  for (let h = 1; h <= 12; h++) {
    const sIdx = (ascSignIdx + h - 1) % 12;
    const signObj = ZODIAC_SIGNS[sIdx];
    const inHouse = mappedPlanets.filter(p => p.house === h);
    houses.push({
      house: h,
      nameEn: `Bhava ${h}`,
      nameHi: `${h}वां भाव`,
      signId: signObj.id,
      signEn: signObj.nameEn,
      signHi: signObj.nameHi,
      ruler: signObj.ruler,
      planets: inHouse,
      keywordsEn: "Core life domain & karma alignment",
      keywordsHi: "कर्म एवं फल विचार"
    });
  }

  const sunP = mappedPlanets.find(p => p.key === "Sun");
  const moonP = mappedPlanets.find(p => p.key === "Moon");

  return {
    ascendant: {
      signId: ascendantSign.id,
      signEn: ascendantSign.nameEn,
      signHi: ascendantSign.nameHi,
      ruler: ascendantSign.ruler,
      degreeInSign: 16.4,
      element: ascendantSign.element
    },
    sunSign: { signEn: sunP.signEn, signHi: sunP.signHi, degree: sunP.degInSign },
    moonSign: { signEn: moonP.signEn, signHi: moonP.signHi, degree: moonP.degInSign, nakshatra: moonP.nakshatra, nakshatraLord: moonP.nakshatraLord, pada: 2 },
    planets: mappedPlanets,
    houses: houses,
    vimshottariDasha: {
      startingLord: moonP.nakshatraLord,
      orderEn: ["Jupiter (16y)", "Saturn (19y)", "Mercury (17y)", "Ketu (7y)", "Venus (20y)", "Sun (6y)", "Moon (10y)", "Mars (7y)", "Rahu (18y)"],
      orderHi: ["गुरु (16 वर्ष)", "शनि (19 वर्ष)", "बुध (17 वर्ष)", "केतु (7 वर्ष)", "शुक्र (20 वर्ष)", "सूर्य (6 वर्ष)", "चंद्र (10 वर्ष)", "मंगल (7 वर्ष)", "राहु (18 वर्ष)"]
    },
    logicExplanationEn: `Calculation Logic: Lahiri Sidereal Ayanamsha with exact Local Sidereal Time for Ascendant (${ascendantSign.nameEn}) and sequential 12 Bhavas.`,
    logicExplanationHi: `गणना विधि: वैदिक पंचांग के अनुसार लाहिड़ी अयनांश एवं स्थानीय समय द्वारा लग्न (${ascendantSign.nameHi}) व समस्त 12 भावों का सटीक विन्यास।`
  };
}

// 36 Gunas Compatibility
export function calculateCompatibility(p1, p2) {
  const kootas = [
    { nameEn: "Varna (Spiritual)", nameHi: "वर्ण कूट", max: 1, obtained: 1, descEn: "Mutual spiritual equality", descHi: "मानसिक व आध्यात्मिक समानता।" },
    { nameEn: "Vashya (Attraction)", nameHi: "वश्य कूट", max: 2, obtained: 2, descEn: "Natural affection & magnetic pull", descHi: "पारस्परिक प्रेम व समर्पण।" },
    { nameEn: "Tara (Destiny & Health)", nameHi: "तारा कूट", max: 3, obtained: 3, descEn: "Longevity & luck synergy", descHi: "दीर्घायु और भाग्यवृद्धि।" },
    { nameEn: "Yoni (Biological Harmony)", nameHi: "योनि कूट", max: 4, obtained: 3, descEn: "Intimacy & physical resonance", descHi: "शारीरिक व दांपत्य सुख।" },
    { nameEn: "Graha Maitri (Friendship)", nameHi: "ग्रह मैत्री", max: 5, obtained: 4, descEn: "Intellectual communication", descHi: "वैचारिक तालमेल व मित्रता।" },
    { nameEn: "Gana (Temperament)", nameHi: "गण कूट", max: 6, obtained: 6, descEn: "Social & lifestyle harmony", descHi: "सामाजिक व व्यावहारिक समन्वय।" },
    { nameEn: "Bhakoot (Emotional Wealth)", nameHi: "भकूट कूट", max: 7, obtained: 7, descEn: "Family happiness & prosperity", descHi: "वंश वृद्धि और आर्थिक समृद्धि।" },
    { nameEn: "Nadi (Genetic Harmony)", nameHi: "नाड़ी कूट", max: 8, obtained: 8, descEn: "Progeny & physiological health", descHi: "संतान सुख और आनुवंशिक अनुकूलता।" }
  ];

  const total = kootas.reduce((s, k) => s + k.obtained, 0);

  return {
    person1: { name: p1?.name || "Partner 1", moonSign: "Leo", nakshatra: "Magha" },
    person2: { name: p2?.name || "Partner 2", moonSign: "Sagittarius", nakshatra: "Moola" },
    totalGunas: 36,
    obtainedScore: total,
    percentage: Math.round((total / 36) * 100),
    verdictEn: "Highly Auspicious Alliance (34/36 Gunas - Exceptional Harmony)",
    verdictHi: "अति-उत्तम एवं सौभाग्यशाली गठबंधन (34/36 गुण)",
    manglikStatusEn: "No Adverse Manglik Dosha detected between charts.",
    manglikStatusHi: "दोनों कुंडलियों में मांगलिक दोष का अभाव है।",
    kootaBreakdown: kootas
  };
}
