import express from 'express';
import { analyzeMobileNumber, analyzeDOB, decodeAndOptimizeName } from '../algorithms/numerology.js';
import { calculateVedicChart } from '../algorithms/ephemeris.js';
import { calculateHoraryChart } from '../algorithms/horary.js';
import { calculateMuhurta } from '../algorithms/muhurta.js';
import { analyzeVastu } from '../algorithms/vastu.js';
import { analyzeMedicalAstrology } from '../algorithms/medicalAstro.js';
import { calculateCompatibility } from '../algorithms/gunaMilan.js';
import { analyzeBirthdayMonth, analyzeMundaneAstrology } from '../algorithms/mundane.js';
import { processAstrologyQuery } from '../services/aiAstrologer.js';

const router = express.Router();

/**
 * 1. Comprehensive All-In-One Calculation Endpoint
 * Stateless & Ephemeral: No database storage.
 */
router.post('/calculate-all', (req, res) => {
  try {
    const { name, dob, tob = "12:00", mobile, houseNo, age, gender = "male", place = "New Delhi" } = req.body;

    if (!dob) {
      return res.status(400).json({ error: "Date of Birth (dob) is required." });
    }

    // 1. Mobile Numerology
    const mobileNumerology = analyzeMobileNumber(mobile || "919876543210");

    // 2. DOB Numerology (Mulank, Bhagyank, Kua, Lo Shu)
    const dobNumerology = analyzeDOB(dob, gender);

    // 3, 5, 11. Accurate Vedic Chart (Lagna, Houses, Planets, Nakshatras, Dasha)
    const vedicChart = calculateVedicChart(dob, tob);

    // 4. Birthday Month Analysis
    const birthdayMonth = analyzeBirthdayMonth(dob);

    // 6. Horary Astrology (Prashna Kundali at present moment)
    const horaryChart = calculateHoraryChart("General Life & Destiny Overview", "general");

    // 7. Electional Astrology (Muhurta & Choghadiya)
    const muhurta = calculateMuhurta();

    // 8. Mundane Global Astrology
    const mundane = analyzeMundaneAstrology();

    // 9. Medical Astrology & Astro-Ayurveda
    const medicalAstro = analyzeMedicalAstrology(vedicChart);

    // 10. Vastu Shastra & Directional Energy
    const vastu = analyzeVastu(houseNo || "1", dobNumerology);

    // 13. Name Decoder & Success Optimizer
    const nameDecoder = decodeAndOptimizeName(name || "Auspicious Seeker", dobNumerology);

    // Summary Profile
    const profile = {
      name: name || "Seeker",
      dob,
      tob,
      mobile: mobileNumerology.inputNumber,
      houseNo: houseNo || "1",
      age: age || (new Date().getFullYear() - new Date(dob).getFullYear()),
      gender,
      place
    };

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      profile,
      modules: {
        1: { id: "mobile-numerology", titleEn: "12-Digit Mobile Numerology", titleHi: "12-अंकीय मोबाइल अंकशास्त्र", data: mobileNumerology },
        2: { id: "dob-numerology", titleEn: "DOB Numerology (Mulank & Bhagyank)", titleHi: "जन्मतिथि अंकशास्त्र (मूलांक व भाग्यांक)", data: dobNumerology },
        3: { id: "zodiac-astrology", titleEn: "Zodiac & Elemental Astrology", titleHi: "राशि एवं तत्त्व ज्योतिष", data: { sun: vedicChart.sunSign, moon: vedicChart.moonSign, ascendant: vedicChart.ascendant } },
        4: { id: "birthday-month", titleEn: "Birthday Month Archetype", titleHi: "जन्म मास विश्लेषण", data: birthdayMonth },
        5: { id: "natal-astrology", titleEn: "Natal Astrology & Planetary Dignities", titleHi: "जन्म कुंडली व ग्रह स्थिति", data: { planets: vedicChart.planets, vimshottariDasha: vedicChart.vimshottariDasha } },
        6: { id: "horary-astrology", titleEn: "Horary Astrology (Prashna Kundali)", titleHi: "प्रश्न कुंडली (होरेरी ज्योतिष)", data: horaryChart },
        7: { id: "electional-astrology", titleEn: "Electional Astrology (Shubh Muhurta)", titleHi: "मुहूर्त शास्त्र (शुभ चौघड़िया व राहुकाल)", data: muhurta },
        8: { id: "mundane-astrology", titleEn: "Mundane Global Astrology", titleHi: "मेदनीय (वैश्विक) ज्योतिष", data: mundane },
        9: { id: "medical-astrology", titleEn: "Medical Astrology & Astro-Ayurveda", titleHi: "आयुर्वेद-ज्योतिष व त्रिदोष", data: medicalAstro },
        10: { id: "vastu-predictions", titleEn: "Vastu Shastra & Directional Energy", titleHi: "वास्तु शास्त्र व दिशा ऊर्जा", data: vastu },
        11: { id: "birth-chart", titleEn: "9 Grahas (Planets) in Vedic Kundli", titleHi: "वैदिक कुंडली में 9 ग्रह", data: vedicChart },
        13: { id: "name-decoder", titleEn: "Name Decoder & Success Optimizer", titleHi: "नाम विश्लेषण एवं सफलता सुधार", data: nameDecoder }
      }
    });
  } catch (err) {
    console.error("Calculation Error:", err);
    res.status(500).json({ error: "Failed to perform astrological calculations.", details: err.message });
  }
});

/**
 * 2. Hinglish / Multilingual AI Ask Question Endpoint
 */
router.post('/ask-question', async (req, res) => {
  try {
    const { query, profile = {}, chartData = {} } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Question query is required." });
    }

    const response = await processAstrologyQuery(query, profile, chartData);
    res.json({ success: true, response });
  } catch (err) {
    console.error("Ask Question Error:", err);
    res.status(500).json({ error: "Failed to process question.", details: err.message });
  }
});

/**
 * 3. Ashtakoot 36-Guna Milan Compatibility Endpoint
 */
router.post('/compatibility', (req, res) => {
  try {
    const { person1, person2 } = req.body;
    if (!person1?.dob || !person2?.dob) {
      return res.status(400).json({ error: "Both partner DOBs are required." });
    }

    const result = calculateCompatibility(person1, person2);
    res.json({ success: true, result });
  } catch (err) {
    console.error("Compatibility Error:", err);
    res.status(500).json({ error: "Failed to calculate compatibility.", details: err.message });
  }
});

/**
 * 4. Dynamic Shubh Muhurta Endpoint
 */
router.get('/muhurta', (req, res) => {
  try {
    const { date } = req.query;
    const result = calculateMuhurta(date);
    res.json({ success: true, result });
  } catch (err) {
    console.error("Muhurta Error:", err);
    res.status(500).json({ error: "Failed to get Muhurta.", details: err.message });
  }
});

export default router;
