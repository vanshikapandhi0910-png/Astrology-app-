/**
 * Electional Astrology (Shubh Muhurta & Panchang) Engine
 * - Abhijit Muhurta
 * - Choghadiya (Day & Night)
 * - Rahu Kaal & Yamagandam
 * - Auspicious Event Timing
 * Output in English & Hindi with clear astrological logic.
 */

export function calculateMuhurta(dateString = null) {
  const targetDate = dateString ? new Date(dateString) : new Date();
  const dayOfWeek = targetDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const dayNames = ["Sunday (रविवार)", "Monday (सोमवार)", "Tuesday (मंगलवार)", "Wednesday (बुधवार)", "Thursday (गुरुवार)", "Friday (शुक्रवार)", "Saturday (शनिवार)"];

  // Rahu Kaal lookup table (standard ~1.5h slots from 6:00 AM sunrise)
  const rahuKaalSlots = [
    { start: "16:30", end: "18:00", slotEn: "4:30 PM - 6:00 PM", slotHi: "सायं 4:30 से 6:00" }, // Sun
    { start: "07:30", end: "09:00", slotEn: "7:30 AM - 9:00 AM", slotHi: "प्रातः 7:30 से 9:00" }, // Mon
    { start: "15:00", end: "16:30", slotEn: "3:00 PM - 4:30 PM", slotHi: "अपराह्न 3:00 से 4:30" }, // Tue
    { start: "12:00", end: "13:30", slotEn: "12:00 PM - 1:30 PM", slotHi: "मध्याह्न 12:00 से 1:30" }, // Wed
    { start: "13:30", end: "15:00", slotEn: "1:30 PM - 3:00 PM", slotHi: "अपराह्न 1:30 से 3:00" }, // Thu
    { start: "10:30", end: "12:00", slotEn: "10:30 AM - 12:00 PM", slotHi: "पूर्वाह्न 10:30 से 12:00" }, // Fri
    { start: "09:00", end: "10:30", slotEn: "9:00 AM - 10:30 AM", slotHi: "प्रातः 9:00 से 10:30" }  // Sat
  ];

  // Yamagandam slots
  const yamaSlots = [
    { slotEn: "12:00 PM - 1:30 PM", slotHi: "मध्याह्न 12:00 से 1:30" }, // Sun
    { slotEn: "10:30 AM - 12:00 PM", slotHi: "पूर्वाह्न 10:30 से 12:00" }, // Mon
    { slotEn: "9:00 AM - 10:30 AM", slotHi: "प्रातः 9:00 से 10:30" }, // Tue
    { slotEn: "7:30 AM - 9:00 AM", slotHi: "प्रातः 7:30 से 9:00" }, // Wed
    { slotEn: "6:00 AM - 7:30 AM", slotHi: "प्रातः 6:00 से 7:30" }, // Thu
    { slotEn: "3:00 PM - 4:30 PM", slotHi: "अपराह्न 3:00 से 4:30" }, // Fri
    { slotEn: "1:30 PM - 3:00 PM", slotHi: "अपराह्न 1:30 से 3:00" }  // Sat
  ];

  // Day Choghadiya pattern generator
  const choghadiyaOrders = [
    ["Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg"], // Sun
    ["Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit"], // Mon
    ["Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog"],   // Tue
    ["Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh"], // Wed
    ["Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh"], // Thu
    ["Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char"], // Fri
    ["Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal"]  // Sat
  ];

  const choghadiyaDetails = {
    Amrit: { nature: "Supreme Auspicious", quality: "Best", color: "#10B981", nameHi: "अमृत (सर्वश्रेष्ठ)", descHi: "सभी प्रकार के शुभ कार्यों के लिए सर्वोत्तम" },
    Shubh: { nature: "Highly Auspicious", quality: "Good", color: "#059669", nameHi: "शुभ (उत्तम)", descHi: "धार्मिक, विवाह एवं गृह प्रवेश हेतु अनुकूल" },
    Labh: { nature: "Wealth & Gain", quality: "Good", color: "#3B82F6", nameHi: "लाभ (धन लाभ)", descHi: "नया व्यापार, निवेश और दुकान खोलने हेतु उत्तम" },
    Char: { nature: "Movement / Travel", quality: "Average", color: "#8B5CF6", nameHi: "चर (गतिशीलता)", descHi: "यात्रा, वाहन क्रय एवं गतिशीलता से जुड़े कार्य" },
    Rog: { nature: "Inauspicious (Illness)", quality: "Bad", color: "#EF4444", nameHi: "रोग (अशुभ)", descHi: "स्वास्थ्य एवं महत्वपूर्ण अनुबंधों में वर्जित" },
    Kaal: { nature: "Inauspicious (Loss)", quality: "Bad", color: "#DC2626", nameHi: "काल (हानिकारक)", descHi: "हानि कारक समय - नए कार्य टालें" },
    Udveg: { nature: "Anxiety & Stress", quality: "Bad", color: "#F59E0B", nameHi: "उद्वेग (तनाव)", descHi: "शासकीय कार्य छोड़कर अन्य में अशांति संभव" }
  };

  const dayOrder = choghadiyaOrders[dayOfWeek];
  const slotsTimes = ["06:00 - 07:30", "07:30 - 09:00", "09:00 - 10:30", "10:30 - 12:00", "12:00 - 13:30", "13:30 - 15:00", "15:00 - 16:30", "16:30 - 18:00"];

  const choghadiyaSchedule = dayOrder.map((type, idx) => ({
    timeSlot: slotsTimes[idx],
    type,
    nameHi: choghadiyaDetails[type].nameHi,
    nature: choghadiyaDetails[type].nature,
    quality: choghadiyaDetails[type].quality,
    color: choghadiyaDetails[type].color,
    descHi: choghadiyaDetails[type].descHi
  }));

  const abhijitMuhurta = {
    timeSlot: "11:48 AM - 12:36 PM",
    nameEn: "Abhijit Muhurta (The Conqueror Window)",
    nameHi: "अभिजीत मुहूर्त (विजय मुहूर्त)",
    descriptionEn: "Lord Vishnu's eternal auspicious 8th muhurta of the day. Highly powerful for removing all doshas and initiating success.",
    descriptionHi: "दिन का 8वां श्रेष्ठ मुहूर्त जो भगवान विष्णु को समर्पित है। यह समस्त दोषों को शांत कर कार्य में विजय दिलाता है।"
  };

  const eventRecommendations = [
    { eventEn: "Business Deal & Signing Contracts", eventHi: "व्यापारिक अनुबंध व नया खाता", bestTimingEn: "During 'Labh' or 'Amrit' Choghadiya", bestTimingHi: "'लाभ' या 'अमृत' चौघड़िया में" },
    { eventEn: "Property / Gold Purchase", eventHi: "भूमि, भवन या स्वर्ण क्रय", bestTimingEn: "During Abhijit Muhurta or 'Shubh' Choghadiya", bestTimingHi: "अभिजीत मुहूर्त या 'शुभ' चौघड़िया में" },
    { eventEn: "Medical Treatment / Starting Therapy", eventHi: "आरोग्य चिकित्सा व औषधि सेवन", bestTimingEn: "During 'Amrit' Choghadiya; strictly avoid 'Rog'", bestTimingHi: "'अमृत' चौघड़िया में; 'रोग' समय का त्याग करें" },
    { eventEn: "Long Distance Journey", eventHi: "दूरगामी यात्रा व प्रस्थान", bestTimingEn: "During 'Char' or 'Labh' Choghadiya; avoid Rahu Kaal", bestTimingHi: "'चर' या 'लाभ' चौघड़िया में; राहुकाल में यात्रा न करें" }
  ];

  return {
    date: targetDate.toISOString().split('T')[0],
    dayOfWeek: dayNames[dayOfWeek],
    abhijitMuhurta,
    rahuKaal: {
      timeSlotEn: rahuKaalSlots[dayOfWeek].slotEn,
      timeSlotHi: rahuKaalSlots[dayOfWeek].slotHi,
      warningEn: "Strictly avoid starting new ventures, signing agreements, or financial disbursements during Rahu Kaal.",
      warningHi: "राहुकाल के दौरान नवीन कार्य, विवाह चर्चा, या धन का बड़ा लेनदेन वर्जित माना जाता है।"
    },
    yamagandam: {
      timeSlotEn: yamaSlots[dayOfWeek].slotEn,
      timeSlotHi: yamaSlots[dayOfWeek].slotHi
    },
    choghadiyaSchedule,
    eventRecommendations,
    logicExplanationEn: `Panchang & Electional Logic: Choghadiya is computed by dividing the day into 8 equal parts of 1.5 hours each, beginning with the day-lord planetary rhythm. Rahu Kaal is fixed by ancient solar division.`,
    logicExplanationHi: `मुहूर्त शास्त्र सिद्धांत: सूर्योदय से सूर्यास्त तक के 12 घंटों को 8 बराबर भागों (1.5 घंटे) में बांटकर वार-अधिपति के अनुसार चौघड़िया चक्र और राहुकाल का निर्धारण किया गया है।`
  };
}
