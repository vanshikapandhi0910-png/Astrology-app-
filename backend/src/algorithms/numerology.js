/**
 * Comprehensive Numerology Engine
 * - 12-digit Mobile Numerology (Country code + mobile number)
 * - DOB Numerology (Mulank, Bhagyank, Kua, Lo Shu Grid, Personal Year)
 * - Name Decoder & Name Correction (Chaldean & Pythagorean systems)
 * Output in English & Hindi with clear mathematical logic.
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

// Pythagorean number mapping
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

// Reduce any number to single digit (1-9)
export function reduceToSingleDigit(num) {
  let current = Math.abs(parseInt(num, 10));
  if (isNaN(current) || current === 0) return 0;
  while (current > 9) {
    current = current.toString().split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
  }
  return current;
}

// Calculate sum of digits
export function sumOfDigits(str) {
  return str.replace(/\D/g, '').split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
}

/**
 * 1. Mobile Number Numerology (Requires 12 digits: e.g. Country Code 2 digits + 10 digits mobile)
 */
export function analyzeMobileNumber(rawMobile) {
  const cleaned = (rawMobile || '').replace(/\D/g, '');
  const is12Digit = cleaned.length === 12;
  const digits = cleaned;
  
  if (digits.length < 10) {
    return {
      isValid: false,
      messageEn: "Please enter a valid mobile number with country code (12 digits total, e.g., 919876543210).",
      messageHi: "कृपया देश कोड सहित 12 अंकों का वैध मोबाइल नंबर दर्ज करें (उदा. 919876543210)।"
    };
  }

  const compoundSum = sumOfDigits(digits);
  const singleDigit = reduceToSingleDigit(compoundSum);
  const ruler = PLANETARY_RULERS[singleDigit] || PLANETARY_RULERS[1];

  // Frequency of digits
  const digitCounts = {};
  for (let d = 0; d <= 9; d++) digitCounts[d] = 0;
  for (let ch of digits) {
    digitCounts[ch] = (digitCounts[ch] || 0) + 1;
  }

  // Last 4 digits energy (very important in mobile numerology)
  const last4 = digits.slice(-4);
  const last4Sum = sumOfDigits(last4);
  const last4Root = reduceToSingleDigit(last4Sum);

  // Business vs Personal friendliness
  const businessFriendly = [1, 3, 5, 6].includes(singleDigit);
  const spiritualCreative = [2, 7, 9].includes(singleDigit);
  const hardWorkDisciplined = [4, 8].includes(singleDigit);

  // High vibration combos
  const hasAngelPatterns = /(111|222|333|444|555|666|777|888|999|1234|5678)/.test(digits);

  return {
    isValid: true,
    is12Digit,
    inputNumber: cleaned,
    countryCodeDetected: is12Digit ? `+${cleaned.substring(0, 2)}` : "Standard",
    coreMobileNumber: is12Digit ? cleaned.substring(2) : cleaned,
    compoundSum,
    singleDigit,
    last4Digits: last4,
    last4Compound: last4Sum,
    last4Root,
    planetaryRuler: ruler.planet,
    element: ruler.element,
    nature: ruler.nature,
    luckyColors: ruler.luckyColors,
    luckyDays: ruler.luckyDays,
    digitFrequencies: digitCounts,
    hasAngelPatterns,
    suitability: {
      businessScore: businessFriendly ? "88% - Highly Auspicious for Wealth & Commerce" : "65% - Moderate for Business",
      personalScore: spiritualCreative ? "92% - Excellent for Harmony & Peace" : "75% - Balanced",
      suitabilityEn: businessFriendly 
        ? `Number ${singleDigit} governed by ${ruler.planet} brings fast communication, deal conversions, and continuous financial inflow.`
        : `Number ${singleDigit} governed by ${ruler.planet} demands sustained perseverance and structured planning.`,
      suitabilityHi: businessFriendly
        ? `अंक ${singleDigit} (${ruler.planet}) व्यापारिक सौदों, तीव्र संचार और आर्थिक समृद्धि के लिए अत्यंत शुभ व फलदायी है।`
        : `अंक ${singleDigit} (${ruler.planet}) निरंतर एकाग्रता, अनुशासन और पूर्व-नियोजित कार्यों में सफलता देता है।`
    },
    logicExplanationEn: `Calculation Logic: Sum of all 12 digits (${digits.split('').join('+')}) = ${compoundSum}. Reduced further: ${Math.floor(compoundSum/10)} + ${compoundSum%10} = ${singleDigit}. This root resonance directly attracts frequencies of ${ruler.planet}.`,
    logicExplanationHi: `गणितीय गणना विधि: सभी 12 अंकों का योग (${digits.split('').join('+')}) = ${compoundSum}। इसे एकल अंक में बदलने पर: ${singleDigit} प्राप्त होता है, जो ${ruler.planet} के आभामंडल से जुड़ा है।`
  };
}

/**
 * 2. Date of Birth Numerology (Mulank, Bhagyank, Kua, Lo Shu Grid, Personal Year)
 */
export function analyzeDOB(dobString, gender = "male") {
  if (!dobString) return null;
  const dateObj = new Date(dobString);
  if (isNaN(dateObj.getTime())) return null;

  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();

  // 1. Mulank (Psychic Number) = Sum of Day digits
  const mulank = reduceToSingleDigit(day);

  // 2. Bhagyank (Destiny Number) = Sum of Day + Month + Year digits
  const fullSum = sumOfDigits(`${day}${month}${year}`);
  const bhagyank = reduceToSingleDigit(fullSum);

  // 3. Kua Number (Vedic Feng-Shui Kua)
  const yearSum = reduceToSingleDigit(year);
  let kua = 0;
  if (gender.toLowerCase() === 'female') {
    kua = reduceToSingleDigit(yearSum + 4);
  } else {
    kua = reduceToSingleDigit(11 - yearSum);
  }
  if (kua === 5) kua = (gender.toLowerCase() === 'female') ? 8 : 2;

  // 4. Lo Shu Grid (counts of 1 through 9)
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

  // Planes of Lo Shu Grid
  const mentalPlane = (loShu[4] > 0 ? 1 : 0) + (loShu[9] > 0 ? 1 : 0) + (loShu[2] > 0 ? 1 : 0);
  const emotionalPlane = (loShu[3] > 0 ? 1 : 0) + (loShu[5] > 0 ? 1 : 0) + (loShu[7] > 0 ? 1 : 0);
  const practicalPlane = (loShu[8] > 0 ? 1 : 0) + (loShu[1] > 0 ? 1 : 0) + (loShu[6] > 0 ? 1 : 0);
  const thoughtPlane = (loShu[4] > 0 ? 1 : 0) + (loShu[3] > 0 ? 1 : 0) + (loShu[8] > 0 ? 1 : 0);
  const willPlane = (loShu[9] > 0 ? 1 : 0) + (loShu[5] > 0 ? 1 : 0) + (loShu[1] > 0 ? 1 : 0);
  const actionPlane = (loShu[2] > 0 ? 1 : 0) + (loShu[7] > 0 ? 1 : 0) + (loShu[6] > 0 ? 1 : 0);

  // 5. Personal Year for current year (2026/2027)
  const currentYear = new Date().getFullYear();
  const personalYearSum = sumOfDigits(`${day}${month}${currentYear}`);
  const personalYear = reduceToSingleDigit(personalYearSum);

  const mulankRuler = PLANETARY_RULERS[mulank];
  const bhagyankRuler = PLANETARY_RULERS[bhagyank];

  // Friendly numbers
  const friendlyMatrix = {
    1: [1, 2, 3, 5, 9],
    2: [1, 2, 3, 5],
    3: [1, 2, 3, 5, 9],
    4: [1, 5, 6, 7, 8],
    5: [1, 2, 3, 5, 6],
    6: [1, 5, 6, 7],
    7: [1, 4, 6, 7],
    8: [3, 5, 6, 7],
    9: [1, 2, 3, 5]
  };

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
    planes: {
      mental: mentalPlane === 3 ? "100% Super Active" : `${Math.round((mentalPlane/3)*100)}% Active`,
      emotional: emotionalPlane === 3 ? "100% Super Intuitive" : `${Math.round((emotionalPlane/3)*100)}% Active`,
      practical: practicalPlane === 3 ? "100% Grounded & Wealth Builder" : `${Math.round((practicalPlane/3)*100)}% Active`,
      willPower: willPlane === 3 ? "Golden Willpower Line (100%)" : `${Math.round((willPlane/3)*100)}% Active`,
      thought: thoughtPlane === 3 ? "Strategic Thinker Line" : `${Math.round((thoughtPlane/3)*100)}% Active`,
      action: actionPlane === 3 ? "Fast Action Implementer" : `${Math.round((actionPlane/3)*100)}% Active`,
    },
    friendlyNumbers: friendlyMatrix[mulank] || [1, 5, 6],
    luckyColors: [...new Set([...mulankRuler.luckyColors, ...bhagyankRuler.luckyColors])],
    luckyDays: [...new Set([...mulankRuler.luckyDays, ...bhagyankRuler.luckyDays])],
    analysisEn: {
      mulankText: `Mulank ${mulank} reveals your intrinsic psychological persona ruled by ${mulankRuler.planet}. You possess high natural drive in ${mulankRuler.nature}.`,
      bhagyankText: `Bhagyank ${bhagyank} governed by ${bhagyankRuler.planet} dictates your destiny path and career zenith. It unlocks doors when aligned with proper professions.`,
      personalYearText: `Your Personal Year for ${currentYear} is ${personalYear}. This is a period of ${getPersonalYearThemeEn(personalYear)}.`
    },
    analysisHi: {
      mulankText: `मूलांक ${mulank} आपके स्वभाव और आंतरिक ऊर्जा का प्रतीक है जिसके स्वामी ${mulankRuler.planet} हैं। आपमें ${mulankRuler.nature} के विशेष गुण हैं।`,
      bhagyankText: `भाग्यांक ${bhagyank} (${bhagyankRuler.planet}) आपके जीवन की दिशा, कर्मक्षेत्र और सफलता के चरम बिंदु का निर्धारण करता है।`,
      personalYearText: `वर्ष ${currentYear} के लिए आपका व्यक्तिगत वर्ष अंक ${personalYear} है, जो ${getPersonalYearThemeHi(personalYear)} का संकेत देता है।`
    },
    logicExplanationEn: `Mulank Logic: Single digit sum of birth date (${day}) = ${mulank}. Bhagyank Logic: Complete sum of all digits (${day}+${month}+${year}) = ${fullSum} -> ${bhagyank}. Kua Logic: Based on birth year (${year}) and gender (${gender}) = ${kua}.`,
    logicExplanationHi: `मूलांक गणना: जन्म दिवस (${day}) का एकल अंक योग = ${mulank}। भाग्यांक गणना: संपूर्ण जन्मतिथि (${day}+${month}+${year}) का महायोग = ${fullSum} -> ${bhagyank}। कुआ अंक: वर्ष (${year}) एवं लिंग (${gender}) के वैदिक फेंगशुई संतुलन से = ${kua}।`
  };
}

function getPersonalYearThemeEn(py) {
  const themes = {
    1: "New beginnings, pioneering ventures, leadership initiatives and fresh energy",
    2: "Cooperation, diplomatic alliances, patience, and emotional depth",
    3: "Creative self-expression, expansion, social networking, and joyous learning",
    4: "Hard work, laying solid foundations, discipline, and systematic execution",
    5: "Dynamic change, travel, sudden positive turns, and freedom of growth",
    6: "Family harmony, responsibility, home enrichment, and luxury gains",
    7: "Spiritual introspection, deep study, self-discovery, and inner wisdom",
    8: "Material expansion, corporate power, financial returns, and karmic rewards",
    9: "Completion of old cycles, charitable acts, forgiveness, and universal elevation"
  };
  return themes[py] || "Transformation and progress";
}

function getPersonalYearThemeHi(py) {
  const themes = {
    1: "नए कार्यों की शुरुआत, स्वावलंबन और नेतृत्व क्षमता का विकास",
    2: "साझेदारी, भावनात्मक संतुलन, धैर्य एवं आपसी सहयोग",
    3: "रचनात्मक अभिव्यक्ति, ज्ञान वृद्धि और सामाजिक दायरा विस्तार",
    4: "कठिन परिश्रम, मजबूत नींव का निर्माण और व्यवस्थित प्रगति",
    5: "सकारात्मक परिवर्तन, यात्राएं, व्यापारिक लाभ और नई स्वतंत्रता",
    6: "पारिवारिक सुख, जिम्मेदारियों का निर्वहन और भौतिक सुख-सुविधाएं",
    7: "आध्यात्मिक चिंतन, गहन शोध, आत्म-निरीक्षण और ज्ञान संचय",
    8: "आर्थिक उन्नति, अधिकार प्राप्ति, व्यवसाय विस्तार और कर्म फल",
    9: "पुराने चक्रों का समापन, क्षमा, दान-पुण्य और नई आध्यात्मिक चेतना"
  };
  return themes[py] || "सकारात्मक रूपांतरण एवं उन्नति";
}

/**
 * 13. Name Decoder & Success Optimizer (Chaldean & Pythagorean systems)
 */
export function decodeAndOptimizeName(name, dobAnalysis = null) {
  if (!name) return null;
  const cleanName = name.trim().toUpperCase().replace(/[^A-Z]/g, '');
  if (!cleanName) return null;

  // Chaldean breakdown
  const chaldeanLetters = [];
  let chaldeanCompound = 0;
  for (let ch of cleanName) {
    const val = CHALDEAN_MAP[ch] || 0;
    chaldeanLetters.push({ char: ch, val });
    chaldeanCompound += val;
  }
  const chaldeanRoot = reduceToSingleDigit(chaldeanCompound);

  // Pythagorean breakdown
  const pythagoreanLetters = [];
  let pythagoreanCompound = 0;
  for (let ch of cleanName) {
    const val = PYTHAGOREAN_MAP[ch] || 0;
    pythagoreanLetters.push({ char: ch, val });
    pythagoreanCompound += val;
  }
  const pythagoreanRoot = reduceToSingleDigit(pythagoreanCompound);

  // Suggested optimizations (target numbers: 1, 3, 5, 6 depending on Mulank/Bhagyank)
  let targetNumber = 5; // Mercury is universal communicator & business lucky
  if (dobAnalysis) {
    if ([1, 9].includes(dobAnalysis.mulank)) targetNumber = 1;
    else if ([2, 7].includes(dobAnalysis.mulank)) targetNumber = 7;
    else if ([3].includes(dobAnalysis.mulank)) targetNumber = 3;
    else if ([6].includes(dobAnalysis.mulank)) targetNumber = 6;
    else targetNumber = 5;
  }

  // Generate 3 suggested spelling tweaks
  const suggestions = [];
  const vowelsToAdd = ['A', 'E', 'I'];
  for (let v of vowelsToAdd) {
    const modifiedName = cleanName.slice(0, 1) + cleanName.slice(1) + v;
    const modCompound = modifiedName.split('').reduce((s, c) => s + (CHALDEAN_MAP[c] || 0), 0);
    const modRoot = reduceToSingleDigit(modCompound);
    suggestions.push({
      variant: modifiedName,
      chaldeanCompound: modCompound,
      chaldeanRoot: modRoot,
      benefitEn: `Tuned to vibrational Root ${modRoot} (${PLANETARY_RULERS[modRoot]?.planet}) for amplified authority & career ease.`,
      benefitHi: `कंपन अंक ${modRoot} (${PLANETARY_RULERS[modRoot]?.planet}) से जुड़कर सम्मान, व्यापार और पदोन्नति में सहयोग देता है।`
    });
  }

  return {
    originalName: name,
    normalizedName: cleanName,
    letterCount: cleanName.length,
    chaldean: {
      letters: chaldeanLetters,
      compoundNumber: chaldeanCompound,
      singleDigit: chaldeanRoot,
      ruler: PLANETARY_RULERS[chaldeanRoot]?.planet,
      interpretationEn: getChaldeanCompoundInterpretationEn(chaldeanCompound, chaldeanRoot),
      interpretationHi: getChaldeanCompoundInterpretationHi(chaldeanCompound, chaldeanRoot)
    },
    pythagorean: {
      letters: pythagoreanLetters,
      compoundNumber: pythagoreanCompound,
      singleDigit: pythagoreanRoot,
      ruler: PLANETARY_RULERS[pythagoreanRoot]?.planet
    },
    suggestedOptimizations: suggestions,
    logicExplanationEn: `Chaldean Logic: Each alphabet has an ancient vibrational value. Sum of '${cleanName}' = ${chaldeanCompound} -> ${chaldeanRoot} (${PLANETARY_RULERS[chaldeanRoot]?.planet}). Modifying letters adjusts your public magnetic signature to harmonize with destiny.`,
    logicExplanationHi: `कील्डियन पद्धति: प्रत्येक वर्ण का निश्चित ऊर्जा मान होता है। '${cleanName}' के वर्णों का योग = ${chaldeanCompound} -> ${chaldeanRoot} (${PLANETARY_RULERS[chaldeanRoot]?.planet}) बनता है। नाम में सूक्ष्म परिवर्तन आपके यश और समृद्धि को बढ़ाता है।`
  };
}

function getChaldeanCompoundInterpretationEn(compound, root) {
  const specialNumbers = {
    10: "Wheel of Fortune - High success, honor, and realization of desires.",
    14: "Movement & Combinations - Fortunate in business, communications, and public dealings.",
    15: "Occult Charm - Magnetic charisma, immense financial fortune, artistic genius.",
    19: "Prince of Heaven - One of the luckiest numbers. Assures triumph, wealth, and joy.",
    21: "Crown of the Magi - Total victory, advancement, and global renown.",
    23: "Royal Star of the Lion - Promise of success, protection from superiors, and supreme fortune.",
    24: "Lucky Partnership - Boundless financial help from higher placed associates.",
    33: "Universal Master - Great compassion, wisdom, wealth, and spiritual leadership."
  };
  return specialNumbers[compound] || `Harmonious compound vibration ${compound} reducing to ${root} (${PLANETARY_RULERS[root]?.planet}). Promotes steady elevation and strong personality.`;
}

function getChaldeanCompoundInterpretationHi(compound, root) {
  const specialNumbers = {
    10: "भाग्य चक्र - निरंतर सफलता, उच्च मान-सम्मान और मनोकामना पूर्ति।",
    14: "तीव्र प्रगति - व्यापार, जनसंचार और वित्तीय सौदों में विशेष लाभकारी।",
    15: "आकर्षण और ऐश्वर्य - जादुई व्यक्तित्व, कलात्मक प्रतिभा और प्रचुर धन लाभ।",
    19: "स्वर्ग का राजकुमार - अति-शुभ अंक। हर क्षेत्र में विजय, सुख और प्रतिष्ठा।",
    21: "सिद्धि और विजय - सर्वत्र सम्मान, पदोन्नति और वैश्विक सफलता।",
    23: "सिंह का राज-नक्षत्र - अप्रत्याशित सफलता, सुरक्षा और उच्चाधिकारियों का स्नेह।",
    24: "सौभाग्यशाली सहयोग - मित्रों एवं प्रतिष्ठित व्यक्तियों से निरंतर आर्थिक सहयोग।",
    33: "महागुरु अंक - अद्वितीय ज्ञान, आध्यात्मिक आभा और सामाजिक नेतृत्व।"
  };
  return specialNumbers[compound] || `संतुलित संयुक्त ऊर्जा ${compound}, एकल अंक ${root} (${PLANETARY_RULERS[root]?.planet}) के साथ स्थिरता व निरंतर यश प्रदान करती है।`;
}
