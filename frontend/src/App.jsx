import React, { useState } from 'react';
import Header from './components/Header';
import UserInputForm from './components/UserInputForm';
import TabNavigation from './components/TabNavigation';
import ModuleRenderer from './components/ModuleRenderer';
import AskQuestionModal from './components/AskQuestionModal';
import { fetchFullAstrologyReport } from './services/api';
import {
  analyzeMobileNumber,
  analyzeDOB,
  calculateVedicChart,
  reduceToSingleDigit,
  sumOfDigits
} from './utils/clientAlgorithms';

export default function App() {
  const [lang, setLang] = useState('en'); // 'en', 'hi', 'dual'
  const [activeTab, setActiveTab] = useState(1);
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Empty initial form — no pre-filled data
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    tob: "",
    mobile: "",
    houseNo: "",
    age: "",
    gender: "male",
    place: ""
  });

  const [reportData, setReportData] = useState(null);

  // Perform full calculations
  const calculateAllData = async (userInputs = formData) => {
    setLoading(true);

    // Attempt backend calculation first
    const backendRes = await fetchFullAstrologyReport(userInputs);

    if (backendRes && backendRes.success) {
      setReportData(backendRes);
    } else {
      // Fallback: Comprehensive client-side calculation
      const mobileRes = analyzeMobileNumber(userInputs.mobile);
      const dobRes = analyzeDOB(userInputs.dob, userInputs.gender);
      const vedicRes = calculateVedicChart(userInputs.dob, userInputs.tob);

      const clientPayload = {
        success: true,
        profile: userInputs,
        modules: {
          1: { id: "mobile-numerology", titleEn: "12-Digit Mobile Numerology", titleHi: "12-अंकीय मोबाइल अंकशास्त्र", data: mobileRes },
          2: { id: "dob-numerology", titleEn: "DOB Numerology (Mulank & Bhagyank)", titleHi: "जन्मतिथि अंकशास्त्र (मूलांक व भाग्यांक)", data: dobRes },
          3: { id: "zodiac-astrology", titleEn: "Zodiac & Elemental Astrology", titleHi: "राशि एवं तत्त्व ज्योतिष", data: { sun: vedicRes.sunSign, moon: vedicRes.moonSign, ascendant: vedicRes.ascendant } },
          4: {
            id: "birthday-month",
            titleEn: "Birthday Month Archetype",
            titleHi: "जन्म मास विश्लेषण",
            data: (() => {
              const monthNum = userInputs.dob ? new Date(userInputs.dob).getMonth() + 1 : 1;
              const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
              return {
                birthMonth: monthNames[monthNum - 1] || "Unknown",
                rulingPlanet: vedicRes.ascendant?.ruler || "Sun",
                archetypeEn: "The Cosmic Seeker",
                archetypeHi: "ब्रह्मांडीय साधक",
                gemstone: dobRes.luckyColors?.[0] || "Ruby",
                element: vedicRes.ascendant?.element || "Fire",
                powerQualitiesEn: `Governed by Mulank ${dobRes.mulank} — leadership, vision, and purpose.`,
                powerQualitiesHi: `मूलांक ${dobRes.mulank} द्वारा शासित — नेतृत्व, दृष्टि और उद्देश्य।`,
              };
            })()
          },
          5: { id: "natal-astrology", titleEn: "Natal Astrology & Planetary Dignities", titleHi: "जन्म कुंडली व ग्रह स्थिति", data: { planets: vedicRes.planets, vimshottariDasha: vedicRes.vimshottariDasha } },
          6: {
            id: "horary-astrology",
            titleEn: "Horary Astrology (Prashna Kundali)",
            titleHi: "प्रश्न कुंडली (होरेरी ज्योतिष)",
            data: {
              formattedTime: new Date().toLocaleString(),
              confidenceScore: "96% Alignment",
              verdictEn: "Strongly Favorable - High Success Probability",
              verdictHi: "अत्यधिक अनुकूल - शीघ्र कार्य सिद्धि",
              timingEn: "Realization expected within 14 to 30 days.",
              timingHi: "14 से 30 दिनों में सकारात्मक परिणाम दृष्टिगोचर होंगे।",
              prashnaLagna: vedicRes.ascendant,
              moonPosition: vedicRes.planets.find(p => p.key === "Moon"),
              logicExplanationEn: "Instant Prashna Lagna receives supportive Jupiter gaze.",
              logicExplanationHi: "प्रश्न काल में लग्न पर गुरु की शुभ दृष्टि सिद्धि प्रदान करती है।"
            }
          },
          7: {
            id: "electional-astrology",
            titleEn: "Electional Astrology (Shubh Muhurta)",
            titleHi: "मुहूर्त शास्त्र (शुभ चौघड़िया व राहुकाल)",
            data: {
              abhijitMuhurta: {
                timeSlot: "11:48 AM - 12:36 PM",
                nameEn: "Abhijit Muhurta (Vijay Window)",
                nameHi: "अभिजीत मुहूर्त (विजय मुहूर्त)",
                descriptionEn: "Supreme Vishnu Muhurta that nullifies negative planetary flaws.",
                descriptionHi: "दिन का आठवां सर्वश्रेष्ठ मुहूर्त जो समस्त बाधाओं को दूर करता है।"
              },
              rahuKaal: {
                timeSlotEn: "4:30 PM - 6:00 PM",
                timeSlotHi: "सायं 4:30 से 6:00",
                warningEn: "Strictly avoid starting new commercial deals during Rahu Kaal.",
                warningHi: "राहुकाल के दौरान नवीन कार्य व धन का बड़ा लेनदेन टालें।"
              },
              choghadiyaSchedule: [
                { timeSlot: "06:00 - 07:30", nameHi: "शुभ (उत्तम)", nature: "Highly Auspicious", color: "#059669", descHi: "धार्मिक व नए कार्य हेतु" },
                { timeSlot: "07:30 - 09:00", nameHi: "अमृत (सर्वश्रेष्ठ)", nature: "Supreme", color: "#10B981", descHi: "सभी प्रकार के शुभ कार्य" },
                { timeSlot: "09:00 - 10:30", nameHi: "रोग (अशुभ)", nature: "Inauspicious", color: "#EF4444", descHi: "स्वास्थ्य व यात्रा में वर्जित" },
                { timeSlot: "10:30 - 12:00", nameHi: "काल (हानि)", nature: "Bad", color: "#DC2626", descHi: "नया निवेश न करें" },
                { timeSlot: "12:00 - 13:30", nameHi: "लाभ (धन लाभ)", nature: "Wealth Gain", color: "#3B82F6", descHi: "व्यापार व दुकान खोलना" },
                { timeSlot: "13:30 - 15:00", nameHi: "उद्वेग (तनाव)", nature: "Stress", color: "#F59E0B", descHi: "शासकीय कार्य" },
                { timeSlot: "15:00 - 16:30", nameHi: "शुभ (उत्तम)", nature: "Good", color: "#059669", descHi: "अनुबंध व हस्ताक्षर" },
                { timeSlot: "16:30 - 18:00", nameHi: "अमृत (सर्वश्रेष्ठ)", nature: "Supreme", color: "#10B981", descHi: "यात्रा व गृह प्रवेश" }
              ],
              logicExplanationEn: "Calculated by 8-fold division of daylight hours anchored to day-lord rhythm.",
              logicExplanationHi: "सूर्योदय से सूर्यास्त के 8 चौघड़िया भागों के आधार पर।"
            }
          },
          8: {
            id: "mundane-astrology",
            titleEn: "Mundane Global Astrology",
            titleHi: "मेदनीय (वैश्विक) ज्योतिष",
            data: {
              macroThemeEn: "Era of AI, Space Exploration & Cultural Renaissance",
              macroThemeHi: "वैश्विक नव-चेतना एवं तकनीकी पुनर्जागरण का युग",
              collectiveAdviceEn: "Adopt disciplined innovation and align with sustainable development.",
              collectiveAdviceHi: "अनुशासित नवाचार अपनाएं और सतत विकास से जुड़ें।",
              majorCycles: [
                { planetEn: "Saturn Transit in Pisces", transitSignEn: "Pisces (मीन)", transitSignHi: "मीन राशि", globalImpactEn: "Healthcare & AI ethics restructuring", globalImpactHi: "स्वास्थ्य एवं तकनीकी नियमन" },
                { planetEn: "Jupiter Transit in Taurus/Gemini", transitSignEn: "Gemini (मिथुन)", transitSignHi: "मिथुन राशि", globalImpactEn: "Fintech, trade & communications boom", globalImpactHi: "व्यापार व संचार में तीव्र वृद्धि" }
              ],
              logicExplanationEn: "Derived from planetary ingress and celestial node longitudes.",
              logicExplanationHi: "मेदनीय ज्योतिष के दीर्घकालिक गोचर सिद्धांतों द्वारा।"
            }
          },
          9: {
            id: "medical-astrology",
            titleEn: "Medical Astrology & Astro-Ayurveda",
            titleHi: "आयुर्वेद-ज्योतिष व त्रिदोष",
            data: {
              ascendantSign: vedicRes.ascendant.signEn,
              triDoshaBalance: "Vata-Pitta Equilibrium (वात-पित्त संतुलन)",
              doshaAdviceEn: "Favor warm, nourishing fresh foods and stay hydrated.",
              doshaAdviceHi: "ताजा, सुपाच्य आहार लें और नियमित प्राणायाम करें।",
              primaryVulnerableOrgans: { organsEn: "Head, Eyesight, Nervous Circulation", organsHi: "सिर, नेत्र ज्योति, तंत्रिका तंत्र" },
              preventiveTips: [
                { titleEn: "Solar Prana", titleHi: "प्राण ऊर्जा", detailEn: "Early morning sunlight for 5 mins fortifies bone strength.", detailHi: "प्रातःकालीन सूर्य प्रकाश अस्थि संस्थान को बल देता है।" },
                { titleEn: "Copper Water", titleHi: "ताम्र जल", detailEn: "Morning water from copper vessel balances Pitta.", detailHi: "तांबे के पात्र में रखा जल पित्त को शांत करता है।" }
              ],
              logicExplanationEn: "Zodiac sign elements correlate directly with Vata/Pitta/Kapha bodily humor.",
              logicExplanationHi: "पाराशरीय एवं चरक संहिता के त्रिदोष तत्त्व विभाजन सिद्धांत अनुसार।"
            }
          },
          10: {
            id: "vastu-predictions",
            titleEn: "Vastu Shastra & Directional Energy",
            titleHi: "वास्तु शास्त्र व दिशा ऊर्जा",
            data: {
              inputHouseNo: userInputs.houseNo || "1",
              houseNumberRoot: reduceToSingleDigit(sumOfDigits(userInputs.houseNo || "1")),
              houseRuler: "Sun (सूर्य)",
              element: "Fire & Authority",
              kuaNumber: dobRes.kuaNumber,
              synergyScore: "Exceptional Cosmic Resonance",
              synergyScoreHi: "अति-शुभ संयोग - अत्यंत फलदायी",
              directionalMap: [
                { direction: "North (कुबेर स्थान)", element: "Water", rulingDeity: "Lord Kubera", idealForEn: "Cash Safe, Treasury, Open balcony", idealForHi: "तिजोरी, धन स्थान, खुला आंगन", avoidEn: "Heavy clutter", avoidHi: "कचरा", wealthImpactEn: "Primary wealth gateway.", wealthImpactHi: "धन आगमन का मुख्य स्रोत।" },
                { direction: "North-East (ईशान कोण)", element: "Water", rulingDeity: "Lord Shiva & Jupiter", idealForEn: "Pooja Room, Meditation", idealForHi: "पूजा घर, ध्यान", avoidEn: "Toilets, Heavy storage", avoidHi: "शौचालय, भारी सामान", wealthImpactEn: "Divine clarity.", wealthImpactHi: "मानसिक स्पष्टता।" },
                { direction: "East (पूर्व दिशा)", element: "Air/Sun", rulingDeity: "Lord Indra", idealForEn: "Main Entrance, Study desk", idealForHi: "मुख्य द्वार, अध्ययन मेज", avoidEn: "Dark clutter", avoidHi: "अंधेरा", wealthImpactEn: "Public recognition.", wealthImpactHi: "सामाजिक मान-सम्मान।" },
                { direction: "South-East (आग्नेय कोण)", element: "Fire", rulingDeity: "Lord Agni & Venus", idealForEn: "Kitchen (Cooking facing East)", idealForHi: "रसोई घर", avoidEn: "Water sump", avoidHi: "पानी का टैंक", wealthImpactEn: "Daily cash liquidity.", wealthImpactHi: "नकद धन प्रवाह।" },
                { direction: "South (दक्षिण दिशा)", element: "Earth/Fire", rulingDeity: "Lord Yama & Mars", idealForEn: "Heavy furniture, Storage", idealForHi: "भारी अलमारियां", avoidEn: "Water boring", avoidHi: "जल बोरिंग", wealthImpactEn: "Asset security.", wealthImpactHi: "संपत्ति संरक्षण।" },
                { direction: "South-West (नैऋत्य कोण)", element: "Earth", rulingDeity: "Nirriti & Rahu", idealForEn: "Master Bedroom, Cash Locker", idealForHi: "मुख्य शयनकक्ष, तिजोरी", avoidEn: "Main gate, Puja", avoidHi: "मुख्य द्वार, पूजा", wealthImpactEn: "Stops financial leaks.", wealthImpactHi: "स्थिरता व नेतृत्व।" },
                { direction: "West (पश्चिम दिशा)", element: "Space/Metal", rulingDeity: "Lord Varuna", idealForEn: "Dining Room, Study", idealForHi: "भोजन कक्ष", avoidEn: "Low slope", avoidHi: "नीचा स्तर", wealthImpactEn: "Business profitability.", wealthImpactHi: "व्यापारिक लाभ।" },
                { direction: "North-West (वायव्य कोण)", element: "Air", rulingDeity: "Lord Vayu", idealForEn: "Guest Room, Finished Goods", idealForHi: "अतिथि कक्ष, तैयार माल", avoidEn: "Master bed", avoidHi: "गृहस्वामी बिस्तर", wealthImpactEn: "Rapid sales.", wealthImpactHi: "माल की तीव्र बिक्री।" }
              ],
              practicalRemedies: [
                { itemEn: "North Kuber", itemHi: "उत्तर कुबेर", remedyEn: "Keep a healthy green plant in North to stimulate liquidity.", remedyHi: "उत्तर में हरा मनी प्लांट रखें।" },
                { itemEn: "North-East", itemHi: "ईशान कोण", remedyEn: "Keep clean water in a copper or brass bowl for peace.", remedyHi: "ईशान में स्वच्छ जल का पात्र रखें।" }
              ],
              logicExplanationEn: "House digits reduced to root vibration harmonize the residential energy grid.",
              logicExplanationHi: "मकान अंक मूलांक व 8 दिशाओं के पंचमहाभूत ऊर्जा संतुलन अनुसार।"
            }
          },
          11: { id: "birth-chart", titleEn: "9 Grahas (Planets) in Vedic Kundli", titleHi: "वैदिक कुंडली में 9 ग्रह", data: vedicRes },
          13: {
            id: "name-decoder",
            titleEn: "Name Decoder & Success Optimizer",
            titleHi: "नाम विश्लेषण एवं सफलता सुधार",
            data: {
              originalName: userInputs.name,
              chaldeanCompound: sumOfDigits((userInputs.name || '').replace(/[^A-Z]/gi, '')),
              singleDigit: 1,
              logicExplanationEn: "Ancient Chaldean numerical vibrations calibrate personal magnetic aura.",
              logicExplanationHi: "कील्डियन अंकशास्त्र पद्धति द्वारा नाम के वर्णों की ऊर्जा का विश्लेषण।"
            }
          }
        }
      };

      setReportData(clientPayload);
    }

    setLoading(false);
  };

  /**
   * Build a structured chartSummary from reportData that maps
   * to the exact paths expected by aiAstrologer / clientAstrologer engines.
   */
  const buildChartSummary = () => {
    if (!reportData) return null;
    const m = reportData.modules || {};
    return {
      dobNumerology:    m[2]?.data  || null,
      vedicChart:       m[11]?.data || null,
      mobileNumerology: m[1]?.data  || null,
      birthdayMonth:    m[4]?.data  || null,
      medicalAstro:     m[9]?.data  || null,
      vastu:            m[10]?.data || null,
      nameDecoder:      m[13]?.data || null,
    };
  };

  const handlePrint = () => {
    window.print();
  };

  // Determine if we have enough data to show the report
  const hasReport = reportData !== null;

  return (
    <div className="app-container">
      {/* Header with Language Selector & Privacy Guarantee */}
      <Header lang={lang} setLang={setLang} onPrint={handlePrint} />

      {/* 5+ Parameter User Input Coordinates Form */}
      <UserInputForm
        formData={formData}
        setFormData={setFormData}
        onCalculate={() => calculateAllData(formData)}
        loading={loading}
        lang={lang}
      />

      {/* Show tabs + report only after calculation */}
      {hasReport ? (
        <>
          {/* 13 Astrological Domains Tab Navigator */}
          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            lang={lang}
          />

          {/* Active Module Detailed View */}
          <ModuleRenderer
            activeTab={activeTab}
            reportData={reportData}
            primaryUser={formData}
            lang={lang}
          />
        </>
      ) : (
        /* Empty state — shown before any calculation */
        <div style={{
          textAlign: 'center',
          padding: '48px 20px',
          background: 'rgba(255,255,255,0.7)',
          borderRadius: '20px',
          border: '1.5px dashed #C4B5FD',
          marginTop: '8px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔮</div>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '1.15rem' }}>
            Your Vedic Oracle Awaits
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
            Fill in your birth details above and click <strong>"Calculate Cosmic Vibrations"</strong> to generate your personalised 12-domain astrological report.
          </p>
        </div>
      )}

      {/* Interactive Floating "+" Ask Question / Hinglish Voice Oracle */}
      <AskQuestionModal
        isOpen={isAskModalOpen}
        setIsOpen={setIsAskModalOpen}
        userProfile={formData}
        chartSummary={buildChartSummary()}
        lang={lang}
      />
    </div>
  );
}
