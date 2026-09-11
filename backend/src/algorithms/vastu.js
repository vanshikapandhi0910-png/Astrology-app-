/**
 * Vastu Shastra & Directional Energy Engine
 * - Evaluates House / Flat Number vibration
 * - 8 Cardinal & Inter-cardinal directions + Brahma Sthan
 * - Recommendations for Wealth, Health, Harmony, and Puja/Kitchen/Locker placements
 * Output in English & Hindi with clear Vastu principles.
 */
import { reduceToSingleDigit, sumOfDigits, PLANETARY_RULERS } from './numerology.js';

export const VASTU_DIRECTIONS = [
  {
    direction: "North-East (ईशान कोण)",
    element: "Water (जल तत्त्व)",
    rulingDeity: "Lord Shiva & Jupiter",
    idealForEn: "Pooja Room, Meditation, Water Fountain, Clean open balcony",
    idealForHi: "पूजा घर, ध्यान कक्ष, जल स्रोत, खुला व स्वच्छ स्थान",
    avoidEn: "Heavy storage, Master bedroom, Kitchen, Toilets",
    avoidHi: "भारी सामान, शौचालय, रसोई घर, कचरा",
    wealthImpactEn: "Clears mental vision and opens divine financial abundance.",
    wealthImpactHi: "मानसिक स्पष्टता और ईश्वरीय धन के नए द्वार खोलता है।"
  },
  {
    direction: "East (पूर्व दिशा)",
    element: "Air & Sun (सूर्य तत्त्व)",
    rulingDeity: "Lord Indra & Sun",
    idealForEn: "Main Entrance, Living Room, Study Desk, Windows",
    idealForHi: "मुख्य द्वार, बैठक कक्ष, अध्ययन मेज, बड़ी खिड़कियां",
    avoidEn: "Tall opaque boundary walls, dark clutter",
    avoidHi: "अंधेरा, भारी दीवारें, कबाड़",
    wealthImpactEn: "Brings public recognition, government favor, and high vitality.",
    wealthImpactHi: "सामाजिक मान-सम्मान, सरकारी कार्यों में लाभ और उत्तम स्वास्थ्य।"
  },
  {
    direction: "South-East (आग्नेय कोण)",
    element: "Fire (अग्नि तत्त्व)",
    rulingDeity: "Lord Agni & Venus",
    idealForEn: "Kitchen (Cooking facing East), Electrical meters, Inverters",
    idealForHi: "रसोई घर (पूर्व मुखी खाना पकाना), बिजली मीटर, इन्वर्टर",
    avoidEn: "Underground water tank, Master bedroom, Pooja room",
    avoidHi: "भूमिगत जल टैंक, मुख्य शयनकक्ष, पूजा स्थल",
    wealthImpactEn: "Generates daily cash liquidity and rapid luxury returns.",
    wealthImpactHi: "दैनिक नकद प्रवाह (लिक्विड कैश) और विलासिता में वृद्धि।"
  },
  {
    direction: "South (दक्षिण दिशा)",
    element: "Earth & Fire (पृथ्वी व मंगल)",
    rulingDeity: "Lord Yama & Mars",
    idealForEn: "Heavy furniture, Bedrooms for elders, Storage",
    idealForHi: "भारी अलमारियां, वरिष्ठ सदस्यों का कक्ष, भंडारण",
    avoidEn: "Main open slope, main water boring",
    avoidHi: "जल बोरिंग, मुख्य ढलान, खुली जगह",
    wealthImpactEn: "Provides legal protection, bravery, and long-term asset security.",
    wealthImpactHi: "कानूनी सुरक्षा, स्थिरता और संपत्ति का स्थाई संरक्षण।"
  },
  {
    direction: "South-West (नैऋत्य कोण)",
    element: "Earth (पृथ्वी तत्त्व)",
    rulingDeity: "Nirriti & Rahu",
    idealForEn: "Master Bedroom for head of family, Heavy overhead water tank, Cash Locker",
    idealForHi: "गृहस्वामी का मुख्य शयनकक्ष, तिजोरी, ओवरहेड पानी की टंकी",
    avoidEn: "Main entrance, Puja room, Water sump, Open gaps",
    avoidHi: "मुख्य द्वार, भूमिगत जल टैंक, पूजा घर, ढलान",
    wealthImpactEn: "Anchors stability, prevents wealth leakage, guarantees authority.",
    wealthImpactHi: "धन की फिजूलखर्ची रोकता है, नेतृत्व और पारिवारिक स्थिरता देता है।"
  },
  {
    direction: "West (पश्चिम दिशा)",
    element: "Space / Metal (वरुण व शनि)",
    rulingDeity: "Lord Varuna & Saturn",
    idealForEn: "Dining Room, Children's Study Room, Overhead storage",
    idealForHi: "भोजन कक्ष, बच्चों का अध्ययन कक्ष, मध्यम ऊंचाई भंडारण",
    avoidEn: "Low height slope towards West",
    avoidHi: "पूर्व से नीचा स्तर",
    wealthImpactEn: "Governs business profitability and long-term gains.",
    wealthImpactHi: "व्यापारिक लाभ और स्थिर बचत को बल प्रदान करता है।"
  },
  {
    direction: "North-West (वायव्य कोण)",
    element: "Air (वायु तत्त्व)",
    rulingDeity: "Lord Vayu & Moon",
    idealForEn: "Guest Room, Finished product storage, Garage, Unmarried daughters' room",
    idealForHi: "अतिथि कक्ष, तैयार माल का भंडार, वाहन पार्किंग, कन्या कक्ष",
    avoidEn: "Master bedroom for owner, Cash safe",
    avoidHi: "गृहस्वामी का मुख्य बिस्तर, धन तिजोरी (धन चलायमान हो जाता है)",
    wealthImpactEn: "Stimulates rapid movement of inventory and international trade.",
    wealthImpactHi: "माल की तीव्र बिक्री और नए व्यावसायिक संपर्कों में गति लाता है।"
  },
  {
    direction: "North (उत्तर दिशा - कुबेर स्थान)",
    element: "Water (जल तत्त्व)",
    rulingDeity: "Lord Kubera & Mercury",
    idealForEn: "Treasury / Money Locker (opening towards North), Financial documents, Light balcony",
    idealForHi: "धन की तिजोरी (उत्तर मुखी खुलना), चेकबुक/दस्तावेज, खुला आंगन",
    avoidEn: "Heavy dumping, Septic tanks, Heavy dead walls",
    avoidHi: "कचरा, सेप्टिक टैंक, भारी अंधेरी दीवारें",
    wealthImpactEn: "The primary gateway of wealth inflow, investments, and prosperity.",
    wealthImpactHi: "माता लक्ष्मी और कुबेर देव का स्थान - धन आगमन का मुख्य स्रोत।"
  },
  {
    direction: "Center (ब्रह्मस्थान)",
    element: "Ether / Space (आकाश तत्त्व)",
    rulingDeity: "Lord Brahma",
    idealForEn: "Open courtyard, light lighting, free airflow, sacred cleanliness",
    idealForHi: "खुला आंगन, प्रकाशमान, स्वच्छ एवं हवादार स्थान",
    avoidEn: "Pillars, Toilets, Staircases, Heavy beams",
    avoidHi: "भारी खंभे, सीढ़ियां, शौचालय, भारी वजन",
    wealthImpactEn: "Maintains overall household health, peace, and spiritual harmony.",
    wealthImpactHi: "घर में शांति, ऊर्जा संतुलन और संपूर्ण पारिवारिक सुख का आधार।"
  }
];

export function analyzeVastu(houseNo = "", dobAnalysis = null) {
  const cleanHouse = (houseNo || '1').toString().trim();
  const digitsOnly = cleanHouse.replace(/\D/g, '');
  const houseSum = digitsOnly ? sumOfDigits(digitsOnly) : 1;
  const houseRoot = reduceToSingleDigit(houseSum);
  const houseRuler = PLANETARY_RULERS[houseRoot] || PLANETARY_RULERS[1];

  // Resonance with user's Mulank / Bhagyank if available
  let synergy = "Balanced Harmony";
  let synergyHi = "संतुलित ऊर्जा";
  if (dobAnalysis) {
    if (dobAnalysis.mulank === houseRoot || dobAnalysis.bhagyank === houseRoot) {
      synergy = "Exceptional Cosmic Resonance (अति-शुभ संयोग)";
      synergyHi = "अति-शुभ संयोग - गृह स्वामी के लिए अत्यंत फलदायी";
    }
  }

  const remedies = [
    { itemEn: "North Kuber Corner", itemHi: "उत्तर कुबेर कोण", remedyEn: "Place a green plant or emerald kuber yantra in North to stimulate money flow.", remedyHi: "उत्तर दिशा में मनी प्लांट या कुबेर यंत्र स्थापित करें।" },
    { itemEn: "North-East Ishanya", itemHi: "ईशान कोण", remedyEn: "Keep a brass bowl with clean water and fresh petals for mental clarity.", remedyHi: "ईशान कोण में तांबे/पीतल के पात्र में जल व गुलाब की पंखुड़ियां रखें।" },
    { itemEn: "South-West Nairutya", itemHi: "नैऋत्य कोण", remedyEn: "Ensure the heaviest cupboards and master bed are in SW to stop financial leaks.", remedyHi: "स्थिरता के लिए भारी अलमारी और गृहस्वामी का शयनकक्ष नैऋत्य में रखें।" },
    { itemEn: "South-East Agneya", itemHi: "आग्नेय कोण", remedyEn: "Light a ghee lamp or red night lamp in SE to activate cash liquidity.", remedyHi: "आग्नेय कोण में शाम को घी का दीपक या लाल बल्ब प्रज्वलित करें।" }
  ];

  return {
    inputHouseNo: houseNo,
    houseNumberRoot: houseRoot,
    houseCompoundSum: houseSum,
    houseRuler: houseRuler.planet,
    element: houseRuler.element,
    synergyScore: synergy,
    synergyScoreHi: synergyHi,
    houseVibrationEn: `House No. '${cleanHouse}' vibrates with Root ${houseRoot} ruled by ${houseRuler.planet}. It fosters ${houseRuler.nature}.`,
    houseVibrationHi: `मकान / फ्लैट संख्या '${cleanHouse}' की संयुक्त ऊर्जा अंक ${houseRoot} (${houseRuler.planet}) से संचालित है। यह ${houseRuler.nature} को बढ़ावा देती है।`,
    directionalMap: VASTU_DIRECTIONS,
    practicalRemedies: remedies,
    logicExplanationEn: `Vastu & Numerology Logic: House digits reduced to Root ${houseRoot} connect your domestic habitat with the elemental vibration of ${houseRuler.planet}. Aligning cardinal zones restores Pancha Mahabhuta (5 elements) harmony.`,
    logicExplanationHi: `वास्तु एवं अंक शास्त्र सिद्धांत: मकान संख्या का मूलांक ${houseRoot} (${houseRuler.planet}) पंचमहाभूतों के संतुलन को प्रभावित करता है। दिशाओं का सही विन्यास घर में धन, स्वास्थ्य और शांति सुनिश्चित करता है।`
  };
}
