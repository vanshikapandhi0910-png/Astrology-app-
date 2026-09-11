/**
 * Horary Astrology (Prashna Kundali) Engine
 * Generates an instant Vedic chart for the exact timestamp a question is asked.
 * Calculates Prashna Lagna, Query Karakas, and Instant Outcome Probability.
 */
import { calculateVedicChart, ZODIAC_SIGNS } from './ephemeris.js';

export function calculateHoraryChart(questionText = "", domain = "general") {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const chart = calculateVedicChart(dateStr, timeStr);
  const ascendant = chart.ascendant;
  const moon = chart.planets.find(p => p.key === "Moon");
  const jupiter = chart.planets.find(p => p.key === "Jupiter");

  // Determine query category
  const textLower = (questionText || '').toLowerCase();
  let queryCategory = "General";
  let targetHouse = 1;
  let targetHouseNameEn = "Self & General Endeavors (1st House)";
  let targetHouseNameHi = "तनु भाव (प्रथम भाव - सामान्य सफलता)";

  if (textLower.includes("job") || textLower.includes("career") || textLower.includes("promotion") || textLower.includes("business") || textLower.includes("naukri") || textLower.includes("vyapar") || domain === 'career') {
    queryCategory = "Career & Professional Growth";
    targetHouse = 10;
    targetHouseNameEn = "Karma Bhava (10th House - Profession)";
    targetHouseNameHi = "कर्म भाव (दशम भाव - नौकरी व व्यवसाय)";
  } else if (textLower.includes("marriage") || textLower.includes("love") || textLower.includes("partner") || textLower.includes("shadi") || textLower.includes("vivah") || domain === 'marriage') {
    queryCategory = "Relationship & Marriage";
    targetHouse = 7;
    targetHouseNameEn = "Kalatra Bhava (7th House - Partnership)";
    targetHouseNameHi = "कलत्र भाव (सप्तम भाव - विवाह व संबंध)";
  } else if (textLower.includes("money") || textLower.includes("wealth") || textLower.includes("finance") || textLower.includes("paisa") || textLower.includes("dhan") || domain === 'wealth') {
    queryCategory = "Wealth & Financial Inflow";
    targetHouse = 11;
    targetHouseNameEn = "Labha & Dhana Bhava (11th/2nd Houses - Gains)";
    targetHouseNameHi = "लाभ एवं धन भाव (एकादश/द्वितीय भाव - धन प्राप्ति)";
  } else if (textLower.includes("health") || textLower.includes("illness") || textLower.includes("bimar") || textLower.includes("swasthya") || domain === 'health') {
    queryCategory = "Health & Recovery";
    targetHouse = 1;
    targetHouseNameEn = "Tanu Bhava (1st House - Vitality)";
    targetHouseNameHi = "तनु भाव (प्रथम भाव - आरोग्य)";
  } else if (textLower.includes("travel") || textLower.includes("foreign") || textLower.includes("visa") || textLower.includes("videsh") || domain === 'travel') {
    queryCategory = "Travel & Relocation";
    targetHouse = 12;
    targetHouseNameEn = "Vyaya Bhava (12th House - Foreign Lands)";
    targetHouseNameHi = "व्यय भाव (द्वादश भाव - विदेश यात्रा)";
  }

  // Horary outcome rules:
  // 1. Benevolent planets (Jupiter, Venus, Moon) influencing Lagna or Target House
  // 2. Moon in Kendra (1, 4, 7, 10) or Trikona (5, 9)
  const isMoonInKendraTrikona = [1, 4, 5, 7, 9, 10].includes(moon.house);
  const isJupiterBenefic = [1, 5, 9, targetHouse].includes(jupiter.house);

  let score = 50;
  if (isMoonInKendraTrikona) score += 25;
  if (isJupiterBenefic) score += 20;
  if ([1, 5, 9].includes(ascendant.signId % 4 + 1)) score += 5; // Benefic Lagna

  let verdictEn = "Strongly Favorable (शीघ्र कार्य सिद्धि)";
  let verdictHi = "अत्यधिक अनुकूल - शीघ्र कार्य सिद्धि";
  let timingEn = "Within 3 to 6 weeks as planetary aspects solidify.";
  let timingHi = "3 से 6 सप्ताह के भीतर सकारात्मक परिणाम दृष्टिगोचर होंगे।";

  if (score >= 80) {
    verdictEn = "Strongly Favorable - High Probability of Success";
    verdictHi = "अत्यधिक अनुकूल - निश्चित सफलता के शुभ योग";
    timingEn = "Immediate realization within 14 to 30 days.";
    timingHi = "14 से 30 दिनों में कार्य निर्विघ्न संपन्न होगा।";
  } else if (score >= 60) {
    verdictEn = "Favorable with Minor Effort";
    verdictHi = "अनुकूल - सामान्य पुरुषार्थ से सफलता संभव";
    timingEn = "Between 1 to 3 months with continuous follow-up.";
    timingHi = "1 से 3 माह के मध्य निरंतर प्रयास से सिद्धि।";
  } else {
    verdictEn = "Mixed / Demands Patience & Remedial Alignment";
    verdictHi = "मिश्रित - धैर्य एवं ग्रह शांति उपाय आवश्यक";
    timingEn = "Progress expected after current planetary transit shifts (approx 3 to 6 months).";
    timingHi = "गोचर ग्रह परिवर्तन के उपरांत (3 से 6 माह में) स्थिति में सुधार।";
  }

  return {
    timestamp: now.toISOString(),
    formattedTime: now.toLocaleString(),
    prashnaLagna: ascendant,
    moonPosition: moon,
    queryCategory,
    targetHouseSignificance: {
      houseNumber: targetHouse,
      nameEn: targetHouseNameEn,
      nameHi: targetHouseNameHi
    },
    confidenceScore: `${score}%`,
    verdictEn,
    verdictHi,
    timingEn,
    timingHi,
    logicExplanationEn: `Horary Astrological Logic: At the moment of inquiry (${timeStr}), Prashna Lagna rises in ${ascendant.signEn} (${ascendant.signHi}) with Moon occupying House ${moon.house} in ${moon.signEn}. The alignment with ${targetHouseNameEn} generates a favorable energetic resonance.`,
    logicExplanationHi: `प्रश्न कुंडली गणितीय सिद्धांत: प्रश्न काल (${timeStr}) में प्रश्न लग्न '${ascendant.signHi}' उदय हुआ है और चंद्र देव ${moon.house}वें भाव में विराजमान हैं। ${targetHouseNameHi} से शुभ दृष्टि संबंध सकारात्मक ऊर्जा का संचार कर रहे हैं।`
  };
}
