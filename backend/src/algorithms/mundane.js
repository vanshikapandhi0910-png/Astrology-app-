/**
 * Birthday Month Analysis & Mundane Global Astrology Engine
 * - Birthday Month (Solar Archetype, Ruling Gemstones, Deity, Traits)
 * - Mundane Astrology (Macro Planetary Transits, Eclipses, Global Socio-Economic Forecasts)
 * Output in English & Hindi with clear astrological logic.
 */

export const MONTH_ARCHETYPES = [
  {
    monthIndex: 1,
    nameEn: "January (पौष/माघ)",
    rulingPlanet: "Saturn & Sun",
    archetypeEn: "The Master Architect & Visionary Builder",
    archetypeHi: "दृढ़ निश्चयी कर्मयोगी व निर्माता",
    gemstone: "Garnet / Blue Sapphire (नीलम/रक्तमणि)",
    element: "Earth / Air",
    powerQualitiesEn: "Steadfast determination, managerial authority, patience through trials.",
    powerQualitiesHi: "अडिग संकल्प, नेतृत्व क्षमता, और दीर्घकालिक योजनाओं को सफल बनाने का कौशल।"
  },
  {
    monthIndex: 2,
    nameEn: "February (माघ/फाल्गुन)",
    rulingPlanet: "Saturn & Uranus / Rahu",
    archetypeEn: "The Innovator & Compassionate Reformer",
    archetypeHi: "क्रांतिकारी विचारक व मानवतावादी",
    gemstone: "Amethyst (कटेला/जामुनिया)",
    element: "Air / Water",
    powerQualitiesEn: "Visionary ideas, originality, deep empathy, breaking outdated dogmas.",
    powerQualitiesHi: "नवाचार, दूरदर्शिता, उच्च मानवीय मूल्य और लीक से हटकर सोचने की क्षमता।"
  },
  {
    monthIndex: 3,
    nameEn: "March (फाल्गुन/चैत्र)",
    rulingPlanet: "Jupiter & Neptune",
    archetypeEn: "The Mystic Sage & Creative Alchemist",
    archetypeHi: "आध्यात्मिक साधक व कलात्मक साधक",
    gemstone: "Aquamarine / Yellow Sapphire (पुखराज)",
    element: "Water",
    powerQualitiesEn: "Heightened intuition, musical/artistic genius, spiritual perception.",
    powerQualitiesHi: "तीक्ष्ण अंतर्ज्ञान, कला व संगीत में स्वाभाविक रुचि और आध्यात्मिक संवेदनशीलता।"
  },
  {
    monthIndex: 4,
    nameEn: "April (चैत्र/वैशाख)",
    rulingPlanet: "Mars & Sun (Exalted)",
    archetypeEn: "The Sovereign Pioneer & Fearless Leader",
    archetypeHi: "अजेय योद्धा व साहसी पथप्रदर्शक",
    gemstone: "Diamond / Red Coral (हीरा/मूंगा)",
    element: "Fire",
    powerQualitiesEn: "High physical stamina, courage, rapid decision-making, charismatic presence.",
    powerQualitiesHi: "अपार शारीरिक ऊर्जा, त्वरित निर्णय क्षमता, और चुनौतियों पर विजय पाने का सामर्थ्य।"
  },
  {
    monthIndex: 5,
    nameEn: "May (वैशाख/ज्येष्ठ)",
    rulingPlanet: "Venus & Earth",
    archetypeEn: "The Royal Custodian & Wealth Cultivator",
    archetypeHi: "स्थिर समृद्धिकर्ता व सौंदर्य प्रेमी",
    gemstone: "Emerald (पन्ना)",
    element: "Earth",
    powerQualitiesEn: "Financial acumen, appreciation of beauty and fine living, unyielding reliability.",
    powerQualitiesHi: "धन संचय में निपुणता, सुरुचिपूर्ण जीवनशैली, और विश्वसनीय व्यक्तित्व।"
  },
  {
    monthIndex: 6,
    nameEn: "June (ज्येष्ठ/आषाढ़)",
    rulingPlanet: "Mercury",
    archetypeEn: "The Silver-Tongued Messenger & Intellect",
    archetypeHi: "प्रखर वक्ता व बहुमुखी प्रतिभा",
    gemstone: "Pearl / Moonstone (मोती/चंद्रमणि)",
    element: "Air",
    powerQualitiesEn: "Rapid adaptability, witty communication, multi-tasking brilliance.",
    powerQualitiesHi: "तीव्र वाकपटुता, बहुआयामी प्रतिभा, और नए संपर्कों को सुगमता से साधने की कला।"
  },
  {
    monthIndex: 7,
    nameEn: "July (आषाढ़/श्रावण)",
    rulingPlanet: "Moon",
    archetypeEn: "The Divine Nurturer & Intuitive Guardian",
    archetypeHi: "स्नेहमयी रक्षक व संवेदनशील मार्गदर्शक",
    gemstone: "Ruby (माणिक्य)",
    element: "Water",
    powerQualitiesEn: "Deep emotional intelligence, protective instincts, magnetic aura.",
    powerQualitiesHi: "गहन भावनात्मक समझ, परिवार की रक्षा का संकल्प और स्वाभाविक सम्मोहन।"
  },
  {
    monthIndex: 8,
    nameEn: "August (श्रावण/भाद्रपद)",
    rulingPlanet: "Sun",
    archetypeEn: "The Solar Sovereign & Majestic Creator",
    archetypeHi: "सूर्य तुल्य तेजस्वी व पराक्रमी राजा",
    gemstone: "Peridot / Spinel (पेरिडॉट)",
    element: "Fire",
    powerQualitiesEn: "Natural royalty, radiant magnanimity, theatrical flair, unshakeable self-worth.",
    powerQualitiesHi: "स्वाभाविक राजसी तेज, उदार हृदय, आत्मविश्वास और समाज में विशिष्ट स्थान।"
  },
  {
    monthIndex: 9,
    nameEn: "September (भाद्रपद/आश्विन)",
    rulingPlanet: "Mercury (Exalted)",
    archetypeEn: "The Master Analyst & Pure Healer",
    archetypeHi: "कुशल विश्लेषक व आरोग्य प्रदाता",
    gemstone: "Blue Sapphire (नीलम)",
    element: "Earth",
    powerQualitiesEn: "Precision, critical analysis, healing abilities, methodical perfection.",
    powerQualitiesHi: "बारीकियों पर अद्भुत पकड़, विवेकशीलता, और त्रुटिहीन कार्य निष्पादन।"
  },
  {
    monthIndex: 10,
    nameEn: "October (आश्विन/कार्तिक)",
    rulingPlanet: "Venus",
    archetypeEn: "The Diplomatic Harmonizer & Aesthetician",
    archetypeHi: "न्यायप्रिय समन्वयकर्ता व सौहार्द दूत",
    gemstone: "Opal / Tourmaline (ओपल)",
    element: "Air",
    powerQualitiesEn: "Charming diplomacy, sense of cosmic justice, artistic balance, partnership master.",
    powerQualitiesHi: "आकर्षक व्यवहार, न्यायप्रियता, मधुर संबंध निर्माण और सौंदर्य दृष्टि।"
  },
  {
    monthIndex: 11,
    nameEn: "November (कार्तिक/मार्गशीर्ष)",
    rulingPlanet: "Mars & Pluto / Ketu",
    archetypeEn: "The Phoenix Transformer & Deep Investigator",
    archetypeHi: "रहस्यवेत्ता व नव-ऊर्जा सर्जक",
    gemstone: "Topaz / Citrine (पुखराज/सुनहला)",
    element: "Water",
    powerQualitiesEn: "X-ray psychological insight, unstoppable willpower, regenerative power.",
    powerQualitiesHi: "अद्वितीय आत्मबल, गूढ़ रहस्यों को जानने की क्षमता और संकट से नव-जीवन पाने का बल।"
  },
  {
    monthIndex: 12,
    nameEn: "December (मार्गशीर्ष/पौष)",
    rulingPlanet: "Jupiter",
    archetypeEn: "The Philosopher King & Global Explorer",
    archetypeHi: "ज्ञानपिपासु दार्शनिक व विश्वयात्री",
    gemstone: "Turquoise / Blue Zircon (फिरोजा)",
    element: "Fire",
    powerQualitiesEn: "Optimism, philosophical wisdom, boundless enthusiasm, love for truth.",
    powerQualitiesHi: "सदा सकारात्मक दृष्टिकोण, उच्च आध्यात्मिक ज्ञान, और सत्य के प्रति निष्ठा।"
  }
];

export function analyzeBirthdayMonth(dobString) {
  if (!dobString) return null;
  const d = new Date(dobString);
  const month = !isNaN(d.getMonth()) ? d.getMonth() + 1 : 1;
  const data = MONTH_ARCHETYPES.find(m => m.monthIndex === month) || MONTH_ARCHETYPES[0];

  return {
    birthMonth: data.nameEn,
    rulingPlanet: data.rulingPlanet,
    archetypeEn: data.archetypeEn,
    archetypeHi: data.archetypeHi,
    gemstone: data.gemstone,
    element: data.element,
    powerQualitiesEn: data.powerQualitiesEn,
    powerQualitiesHi: data.powerQualitiesHi,
    logicExplanationEn: `Solar Season Astrological Logic: The month of birth reflects the Sun's transit through the cosmic seasonal gates, imprinting your subtle energy body with core archetypal qualities.`,
    logicExplanationHi: `सौर ऋतु चक्र सिद्धांत: जन्म मास के दौरान सूर्य देव के विशेष राशि गोचर से आपकी मूल प्राण ऊर्जा और चेतना पर स्वाभाविक संस्कार अंकित होते हैं।`
  };
}

export function analyzeMundaneAstrology() {
  const currentYear = new Date().getFullYear();

  const majorCycles = [
    {
      planetEn: "Saturn Transit (शनि का गोचर)",
      transitSignEn: "Pisces (मीन राशि)",
      transitSignHi: "मीन राशि में स्थित",
      globalImpactEn: "Major global restructuring in healthcare, maritime laws, AI ethics, and spiritual renaissance.",
      globalImpactHi: "स्वास्थ्य सेवाओं, समुद्री व्यापार, कृत्रिम बुद्धिमत्ता (AI) के नियमन एवं आध्यात्मिक चेतना में वैश्विक परिवर्तन।"
    },
    {
      planetEn: "Jupiter Transit (गुरु का गोचर)",
      transitSignEn: "Taurus to Gemini (वृषभ से मिथुन)",
      transitSignHi: "मिथुन राशि की ओर अग्रसर",
      globalImpactEn: "Booming innovation in global telecommunications, space exploration, and financial fintech ecosystems.",
      globalImpactHi: "दूरसंचार, अंतरिक्ष अनुसंधान, फिनटेक एवं वैश्विक व्यापार में अप्रत्याशित वृद्धि।"
    },
    {
      planetEn: "Rahu-Ketu Axis (राहु-केतु अक्ष)",
      transitSignEn: "Aquarius - Leo (कुंभ - सिंह अक्ष)",
      transitSignHi: "कुंभ एवं सिंह राशि अक्ष",
      globalImpactEn: "Shift towards decentralized technologies, clean energy dominance, and political transformations.",
      globalImpactHi: "विकेंद्रीकृत तकनीक, हरित ऊर्जा (Green Energy) और वैश्विक राजनीति में नए समीकरण।"
    }
  ];

  return {
    epochYear: currentYear,
    macroThemeEn: "Global Era of Synthesis & Technological Metamorphosis",
    macroThemeHi: "वैश्विक नव-चेतना एवं तकनीकी पुनर्जागरण का युग",
    majorCycles,
    collectiveAdviceEn: "Embrace disciplined innovation, prioritize mental peace, and align personal goals with sustainable global technologies.",
    collectiveAdviceHi: "अनुशासित नवाचार अपनाएं, मानसिक शांति को प्राथमिकता दें और पर्यावरण हितैषी विकास से जुड़ें।",
    logicExplanationEn: `Mundane Astrological Logic: Mundane astrology examines outer-planet slow transits (Saturn, Jupiter, Nodes) to forecast macro geopolitical, economic, and climatic tides affecting humanity as a collective.`,
    logicExplanationHi: `मेदनीय (मुंडेन) ज्योतिष सिद्धांत: मंदगामी ग्रहों (शनि, गुरु, राहु-केतु) के दीर्घकालिक गोचर से संपूर्ण राष्ट्रों की अर्थव्यवस्था, मौसम एवं सामूहिक चेतना का विश्लेषण किया जाता है।`
  };
}
