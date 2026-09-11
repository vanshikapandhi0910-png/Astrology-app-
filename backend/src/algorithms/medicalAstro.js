/**
 * Medical Astrology (Astro-Ayurveda) Engine
 * - Evaluates Tri-Dosha balance (Vata, Pitta, Kapha) based on Ascendant & Planatery Elements
 * - 12 Houses and Zodiac organ rulership mapping
 * - Preventive health alerts and Ayurvedic remedies
 * Output in English & Hindi with clear astrological logic.
 */

export const ORGAN_RULERSHIPS = [
  { signId: 1, signEn: "Aries", signHi: "मेष", organsEn: "Head, Brain, Cranium, Face, Scalp", organsHi: "सिर, मस्तिष्क, खोपड़ी, मुख", dosha: "Pitta" },
  { signId: 2, signEn: "Taurus", signHi: "वृषभ", organsEn: "Throat, Vocal cords, Thyroid, Neck", organsHi: "गला, थायरॉयड, कंठ, गर्दन", dosha: "Kapha/Vata" },
  { signId: 3, signEn: "Gemini", signHi: "मिथुन", organsEn: "Lungs, Shoulders, Arms, Nervous System", organsHi: "फेफड़े, कंधे, हाथ, तंत्रिका तंत्र", dosha: "Vata" },
  { signId: 4, signEn: "Cancer", signHi: "कर्क", organsEn: "Stomach, Chest, Breasts, Digestive fluids", organsHi: "आमाशय, छाती, पाचन रस", dosha: "Kapha" },
  { signId: 5, signEn: "Leo", signHi: "सिंह", organsEn: "Heart, Spine, Upper Back, Circulation", organsHi: "हृदय, रीढ़ की हड्डी, रक्त संचार", dosha: "Pitta" },
  { signId: 6, signEn: "Virgo", signHi: "कन्या", organsEn: "Intestines, Abdomen, Digestion, Pancreas", organsHi: "आंतें, पाचन क्रिया, अग्न्याशय", dosha: "Vata" },
  { signId: 7, signEn: "Libra", signHi: "तुला", organsEn: "Kidneys, Lower Back, Adrenals, Skin", organsHi: "गुर्दे (किडनी), कमर, त्वचा", dosha: "Vata/Kapha" },
  { signId: 8, signEn: "Scorpio", signHi: "वृश्चिक", organsEn: "Excretory & Reproductive Organs, Pelvis", organsHi: "उत्सर्जन व प्रजनन अंग, मलाशय", dosha: "Pitta/Water" },
  { signId: 9, signEn: "Sagittarius", signHi: "धनु", organsEn: "Thighs, Hips, Liver, Arteries", organsHi: "जांघें, कूल्हे, यकृत (लिवर)", dosha: "Pitta/Vata" },
  { signId: 10, signEn: "Capricorn", signHi: "मकर", organsEn: "Knees, Joints, Bones, Skeletal structure", organsHi: "घुटने, जोड़, अस्थि संस्थान", dosha: "Vata" },
  { signId: 11, signEn: "Aquarius", signHi: "कुंभ", organsEn: "Shins, Calves, Ankles, Blood Circulation", organsHi: "पिंडलियां, टखने, नसों में रक्त प्रवाह", dosha: "Vata" },
  { signId: 12, signEn: "Pisces", signHi: "मीन", organsEn: "Feet, Toes, Lymphatic & Immune System", organsHi: "पैर के तलवे, लसीका तंत्र, रोग प्रतिरोधक क्षमता", dosha: "Kapha" }
];

export const PLANET_HEALTH_INDICATORS = {
  Sun: { governsEn: "Vital force, Bones, Eyesight, Heart", governsHi: "प्राण शक्ति, हड्डियां, नेत्र ज्योति, हृदय", riskEn: "Acidity, Heart burn, Eye strain", riskHi: "पित्त वृद्धि, एसिडिटी, नेत्र थकान" },
  Moon: { governsEn: "Mind, Fluids, Sleep, Lymph, Hormones", governsHi: "मन, जल तत्व, अनिद्रा, हार्मोन्स", riskEn: "Anxiety, Cold, Water retention", riskHi: "मानसिक तनाव, कफ, अनिद्रा" },
  Mars: { governsEn: "Blood, Hemoglobin, Muscles, Bone marrow", governsHi: "रक्त, हीमोग्लोबिन, मांसपेशियां, मज्जा", riskEn: "Inflammation, Fevers, Cuts, BP spikes", riskHi: "रक्तचाप, जलन, पित्त विकार" },
  Mercury: { governsEn: "Nervous system, Speech, Skin, Respiratory", governsHi: "तंत्रिका तंत्र, वाणी, त्वचा, श्वास", riskEn: "Restlessness, Skin allergy, Neuro sensitivity", riskHi: "त्वचा विकार, तनाव, बेचैनी" },
  Jupiter: { governsEn: "Liver, Fat metabolism, Arteries, Ear", governsHi: "लिवर, वसा, धमनियां, श्रवण शक्ति", riskEn: "Weight gain, Fatty liver, Cholesterol", riskHi: "मोटापा, लिवर की सुस्ती, कफ" },
  Venus: { governsEn: "Reproductive health, Kidneys, Complexion", governsHi: "प्रजनन स्वास्थ्य, गुर्दे, सौंदर्य", riskEn: "Diabetes, Urinary imbalance", riskHi: "मधुमेह, मूत्र विकार" },
  Saturn: { governsEn: "Joints, Teeth, Chronic stamina, Hair", governsHi: "जोड़, दांत, स्नायु, बाल", riskEn: "Arthritis, Vata stiffness, Fatigue", riskHi: "जोड़ों का दर्द, वात रोग, गैस" }
};

export function analyzeMedicalAstrology(vedicChart) {
  if (!vedicChart || !vedicChart.ascendant) {
    return null;
  }

  const ascSignId = vedicChart.ascendant.signId;
  const primaryOrgan = ORGAN_RULERSHIPS.find(o => o.signId === ascSignId) || ORGAN_RULERSHIPS[0];

  // Tri-Dosha calculation
  const elementCounts = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
  (vedicChart.planets || []).forEach(p => {
    const sign = ORGAN_RULERSHIPS.find(o => o.signId === p.signId);
    if (sign) {
      if (sign.dosha.includes("Pitta")) elementCounts.Fire += 1;
      if (sign.dosha.includes("Vata")) elementCounts.Air += 1;
      if (sign.dosha.includes("Kapha")) elementCounts.Water += 1;
    }
  });

  let dominantDosha = "Vata-Pitta (वात-पित्त)";
  let doshaRecommendationEn = "Maintain balanced warm meals, hydrate well, and practice cooling pranayama (Sheetali/Anulom-Vilom).";
  let doshaRecommendationHi = "ताजा व सुपाच्य भोजन लें, नियमित जल पिएं और अनुलोम-विलोम व शीतली प्राणायाम करें।";

  if (elementCounts.Fire > elementCounts.Air && elementCounts.Fire > elementCounts.Water) {
    dominantDosha = "Pitta Dominant (पित्त प्रधान)";
    doshaRecommendationEn = "Avoid excessively spicy or fried food. Include coconut water, coriander seeds water, and sweet fruits.";
    doshaRecommendationHi = "अत्यधिक मिर्च-मसालेदार व तले भोजन से बचें। नारियल पानी, सौंफ व मिश्री का सेवन लाभकारी रहेगा।";
  } else if (elementCounts.Water > elementCounts.Air && elementCounts.Water > elementCounts.Fire) {
    dominantDosha = "Kapha Dominant (कफ प्रधान)";
    doshaRecommendationEn = "Engage in active physical exercise, ginger tea, and reduce heavy dairy/sugars.";
    doshaRecommendationHi = "नियमित व्यायाम करें, अदरक व तुलसी की चाय लें और भारी चिकनाई युक्त भोजन कम करें।";
  } else if (elementCounts.Air > elementCounts.Fire) {
    dominantDosha = "Vata Dominant (वात प्रधान)";
    doshaRecommendationEn = "Favor warm, nourishing soups, sesame oil self-massage (Abhyanga), and regular sleep schedules.";
    doshaRecommendationHi = "गुनगुना व पौष्टिक आहार लें, तिल के तेल से मालिश करें और समय पर सोने का नियम बनाएं।";
  }

  const preventiveTips = [
    { titleEn: "Primary Sensitive Zone", titleHi: "संवेदनशील अंग", detailEn: `${primaryOrgan.organsEn} (governed by your Ascendant ${vedicChart.ascendant.signEn}).`, detailHi: `${primaryOrgan.organsHi} (आपके लग्न ${vedicChart.ascendant.signHi} के प्रभाव में)।` },
    { titleEn: "Solar Vitality Guidance", titleHi: "प्राण ऊर्जा निर्देश", detailEn: "Wake up near sunrise and perform 5 minutes of Sun salutation (Surya Namaskar) to fortify bone density and immunity.", detailHi: "प्रातःकाल सूर्य को जल अर्पित करें और सूर्य नमस्कार से अस्थि संस्थान को सुदृढ़ बनाएं।" },
    { titleEn: "Ayurvedic Herbal Shield", titleHi: "हर्बल स्वास्थ्य सुरक्षा", detailEn: "Amla (Indian Gooseberry) and Ashwagandha in small seasonal quantities harmonize planetary nervous currents.", detailHi: "आंवला, गिलोय और अश्वगंधा का उचित सेवन शारीरिक संतुलन और आरोग्य प्रदान करता है।" }
  ];

  return {
    ascendantSign: vedicChart.ascendant.signEn,
    ascendantSignHi: vedicChart.ascendant.signHi,
    primaryVulnerableOrgans: primaryOrgan,
    triDoshaBalance: dominantDosha,
    doshaAdviceEn: doshaRecommendationEn,
    doshaAdviceHi: doshaRecommendationHi,
    preventiveTips,
    planetHealthIndicators: PLANET_HEALTH_INDICATORS,
    logicExplanationEn: `Medical Astrological Logic: Based on Parashari & Charaka Samhita Astro-Ayurveda principles, your Ascendant (${vedicChart.ascendant.signEn}) and planetary dispositors determine the constitutional Tri-Dosha equilibrium.`,
    logicExplanationHi: `आयुर्वेद-ज्योतिष सिद्धांत: महर्षि पाराशर एवं चरक संहिता के अनुसार लग्न एवं ग्रहों का तत्त्व विभाजन शरीर के त्रिदोष (वात, पित्त, कफ) और अंग विशेष की संवेदनशीलता को निर्धारित करता है।`
  };
}
