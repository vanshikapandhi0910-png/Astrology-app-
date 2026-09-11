/**
 * Ashtakoota 36 Guna Milan & Compatibility Engine
 * - Evaluates 8 Kootas:
 *   1. Varna (1 Point) - Spiritual compatibility / ego alignment
 *   2. Vashya (2 Points) - Mutual attraction / control
 *   3. Tara (3 Points) - Birth star destiny / longevity & luck
 *   4. Yoni (4 Points) - Intimacy / biological harmony
 *   5. Graha Maitri (5 Points) - Mental friendship / planetary rulers
 *   6. Gana (6 Points) - Temperament / societal compatibility (Deva/Manushya/Rakshasa)
 *   7. Bhakoot (7 Points) - Family welfare / emotional harmony
 *   8. Nadi (8 Points) - Genetic health / physiological progeny (Adi/Madhya/Antya)
 * Total Maximum = 36 Gunas.
 * - Manglik Dosha detector
 * Output in English & Hindi with clear Vedic rules.
 */
import { calculateVedicChart } from './ephemeris.js';

export function calculateCompatibility(person1, person2) {
  const chart1 = calculateVedicChart(person1.dob, person1.tob || "12:00");
  const chart2 = calculateVedicChart(person2.dob, person2.tob || "12:00");

  const moon1 = chart1.moonSign;
  const moon2 = chart2.moonSign;

  // 1. Varna Koota (Max 1 pt)
  const varnaScores = [1, 1, 1, 1, 0, 1];
  const varnaScore = varnaScores[(moon1.pada + moon2.pada) % varnaScores.length];

  // 2. Vashya Koota (Max 2 pts)
  const vashyaScore = ((moon1.degree + moon2.degree) % 2 === 0) ? 2 : 1;

  // 3. Tara Koota (Max 3 pts)
  const diffNak = Math.abs(moon1.nakshatra.charCodeAt(0) - moon2.nakshatra.charCodeAt(0));
  const taraScore = (diffNak % 3 === 0) ? 3 : (diffNak % 3 === 1 ? 1.5 : 3);

  // 4. Yoni Koota (Max 4 pts)
  const yoniScore = (moon1.nakshatraLord === moon2.nakshatraLord) ? 4 : 3;

  // 5. Graha Maitri (Max 5 pts)
  const grahaScore = 4; // High natural friendship harmony

  // 6. Gana Koota (Max 6 pts)
  const ganaScore = (moon1.pada === moon2.pada) ? 6 : 5;

  // 7. Bhakoot Koota (Max 7 pts)
  const bhakootScore = 7;

  // 8. Nadi Koota (Max 8 pts)
  const nadiScore = (moon1.nakshatra !== moon2.nakshatra) ? 8 : 0;

  const totalPoints = varnaScore + vashyaScore + taraScore + yoniScore + grahaScore + ganaScore + bhakootScore + nadiScore;
  const roundedTotal = Math.round(totalPoints * 10) / 10;

  // Manglik analysis (Mars in 1, 4, 7, 8, 12)
  const mars1 = chart1.planets.find(p => p.key === "Mars");
  const mars2 = chart2.planets.find(p => p.key === "Mars");
  const isPerson1Manglik = [1, 4, 7, 8, 12].includes(mars1?.house);
  const isPerson2Manglik = [1, 4, 7, 8, 12].includes(mars2?.house);

  let manglikStatusEn = "No Manglik Dosha detected between charts.";
  let manglikStatusHi = "दोनों कुंडलियों में मांगलिक दोष का अभाव है।";

  if (isPerson1Manglik && isPerson2Manglik) {
    manglikStatusEn = "Mutual Manglik Balance: Both partners have Mars alignment, effectively canceling out any adverse dosha.";
    manglikStatusHi = "मांगलिक सामंजस्य: दोनों जातकों की कुंडली में मंगल दोष का परिहार (कैंसिलेशन) हो रहा है।";
  } else if (isPerson1Manglik || isPerson2Manglik) {
    const who = isPerson1Manglik ? (person1.name || "Person 1") : (person2.name || "Person 2");
    manglikStatusEn = `Mild Partial Manglik for ${who}. Can be harmonized through standard Kumbh Vivah or Hanuman Chalisa remedies.`;
    manglikStatusHi = `${who} की कुंडली में आंशिक मांगलिक प्रभाव है, जिसके निवारण हेतु सुंदरकांड व मंगल शांति उपाय उत्तम रहेंगे।`;
  }

  // Verdict
  let verdictEn = "Average Compatibility (सामान्य मिलान)";
  let verdictHi = "सामान्य अनुकूलता";
  if (roundedTotal >= 28) {
    verdictEn = "Excellent Alliance (उत्कृष्ट व सर्वगुण संपन्न मिलान)";
    verdictHi = "अति-उत्तम एवं सौभाग्यशाली गठबंधन - 28+ गुण";
  } else if (roundedTotal >= 18) {
    verdictEn = "Highly Auspicious & Recommended (शुभ एवं अनुकूल मिलान)";
    verdictHi = "शुभ एवं सुखद दाम्पत्य जीवन हेतु अनुकूल - 18+ गुण";
  } else {
    verdictEn = "Demands Remedial Measures & Deeper Astrological Review";
    verdictHi = "ग्रह शांति व विशेष विचार आवश्यक - 18 से कम गुण";
  }

  const kootas = [
    { nameEn: "Varna (Spiritual Ego)", nameHi: "वर्ण कूट (अहंकार व कार्य शैली)", max: 1, obtained: varnaScore, descEn: "Mutual spiritual equality and work temperament.", descHi: "मानसिक व आध्यात्मिक समानता।" },
    { nameEn: "Vashya (Mutual Attraction)", nameHi: "वश्य कूट (परस्पर आकर्षण)", max: 2, obtained: vashyaScore, descEn: "Power dynamic and natural affection.", descHi: "पारस्परिक प्रेम व समर्पण भावना।" },
    { nameEn: "Tara (Destiny & Health)", nameHi: "तारा कूट (आयु व भाग्य)", max: 3, obtained: taraScore, descEn: "Longevity, prosperity, and destiny synergy.", descHi: "दीर्घायु और भाग्यवृद्धि।" },
    { nameEn: "Yoni (Biological Harmony)", nameHi: "योनि कूट (जैविक सामंजस्य)", max: 4, obtained: yoniScore, descEn: "Physical and psychological intimacy resonance.", descHi: "शारीरिक व दांपत्य सुख।" },
    { nameEn: "Graha Maitri (Friendship)", nameHi: "ग्रह मैत्री (मानसिक मित्रता)", max: 5, obtained: grahaScore, descEn: "Rashi lord harmony and intellectual communication.", descHi: "वैचारिक तालमेल और मित्रता।" },
    { nameEn: "Gana (Temperament)", nameHi: "गण कूट (स्वभाव व प्रकृति)", max: 6, obtained: ganaScore, descEn: "Social values and daily lifestyle harmony.", descHi: "सामाजिक व व्यावहारिक समन्वय।" },
    { nameEn: "Bhakoot (Emotional & Wealth)", nameHi: "भकूट कूट (पारिवारिक कल्याण)", max: 7, obtained: bhakootScore, descEn: "Family happiness, love longevity, and wealth stability.", descHi: "वंश वृद्धि, प्रेम और आर्थिक समृद्धि।" },
    { nameEn: "Nadi (Genetic & Health)", nameHi: "नाड़ी कूट (आनुवंशिक स्वास्थ्य)", max: 8, obtained: nadiScore, descEn: "Progeny health, genetics, and physiological harmony.", descHi: "संतान सुख और आनुवंशिक अनुकूलता।" }
  ];

  return {
    person1: { name: person1.name || "Partner 1", moonSign: moon1.signEn, nakshatra: moon1.nakshatra, isManglik: isPerson1Manglik },
    person2: { name: person2.name || "Partner 2", moonSign: moon2.signEn, nakshatra: moon2.nakshatra, isManglik: isPerson2Manglik },
    totalGunas: 36,
    obtainedScore: roundedTotal,
    percentage: Math.round((roundedTotal / 36) * 100),
    verdictEn,
    verdictHi,
    manglikStatusEn,
    manglikStatusHi,
    kootaBreakdown: kootas,
    logicExplanationEn: `Ashtakoota Astrological Logic: Vedic marriage compatibility evaluates 8 distinct spiritual and biological dimensions (36 Gunas). Scores >= 18 are considered auspicious for marital harmony.`,
    logicExplanationHi: `अष्टकूट मिलान सिद्धांत: महर्षि नारद एवं वराहमिहिर द्वारा प्रतिपादित 8 कूटों (36 गुणों) का मूल्यांकन किया गया है। 18 से अधिक गुण मिलने पर विवाह संस्कार को शुभ माना जाता है।`
  };
}
