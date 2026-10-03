import React from 'react';
import {
  Smartphone, Hash, Sun, CalendarDays, Orbit, Clock, CalendarCheck,
  Globe2, Activity, Compass, FileText, HeartHandshake, SpellCheck
} from 'lucide-react';

export const MODULE_TABS = [
  { id: 1, key: "mobile-numerology", icon: Smartphone, labelEn: "1. Mobile Numerology", labelHi: "1. मोबाइल अंकशास्त्र", badgeEn: "12-Digits", badgeHi: "12-अंक" },
  { id: 2, key: "dob-numerology", icon: Hash, labelEn: "2. DOB Numerology", labelHi: "2. जन्मतिथि अंकशास्त्र", badgeEn: "Lo Shu", badgeHi: "लो शू" },
  { id: 3, key: "zodiac-astrology", icon: Sun, labelEn: "3. Zodiac & Elements", labelHi: "3. राशि एवं तत्त्व", badgeEn: "Sun/Moon", badgeHi: "सूर्य/चंद्र" },
  { id: 4, key: "birthday-month", icon: CalendarDays, labelEn: "4. Birthday Month", labelHi: "4. जन्म मास विश्लेषण", badgeEn: "Solar", badgeHi: "सौर" },
  { id: 5, key: "natal-astrology", icon: Orbit, labelEn: "5. Natal & Dignities", labelHi: "5. ग्रह स्थिति व दशा", badgeEn: "Dasha", badgeHi: "दशा" },
  { id: 6, key: "horary-astrology", icon: Clock, labelEn: "6. Horary (Prashna)", labelHi: "6. प्रश्न कुंडली", badgeEn: "Live", badgeHi: "लाइव" },
  { id: 7, key: "electional-astrology", icon: CalendarCheck, labelEn: "7. Electional (Muhurta)", labelHi: "7. शुभ मुहूर्त", badgeEn: "Choghadiya", badgeHi: "चौघड़िया" },
  { id: 8, key: "mundane-astrology", icon: Globe2, labelEn: "8. Mundane Global", labelHi: "8. मेदनीय (वैश्विक)", badgeEn: "Macro", badgeHi: "वैश्विक" },
  { id: 9, key: "medical-astrology", icon: Activity, labelEn: "9. Medical & Ayurveda", labelHi: "9. आयुर्वेद व त्रिदोष", badgeEn: "Tri-Dosha", badgeHi: "त्रिदोष" },
  { id: 10, key: "vastu-predictions", icon: Compass, labelEn: "10. Vastu & Directions", labelHi: "10. वास्तु व दिशा ऊर्जा", badgeEn: "8-Zones", badgeHi: "8-दिशाएं" },
  { id: 11, key: "birth-chart", icon: FileText, labelEn: "11. Kundli/BirthChart", labelHi: "11. कुंडली/जन्मपत्री", badgeEn: "12 Bhavas", badgeHi: "12 भाव" },
  { id: 12, key: "compatibility", icon: HeartHandshake, labelEn: "12. 36-Guna Compatibility", labelHi: "12. 36 गुण मिलान", badgeEn: "Ashtakoot", badgeHi: "अष्टकूट" },
  { id: 13, key: "name-decoder", icon: SpellCheck, labelEn: "13. Name Decoder", labelHi: "13. नाम सुधार व यश", badgeEn: "Chaldean", badgeHi: "कील्डियन" }
];

export default function TabNavigation({ activeTab, setActiveTab, lang = 'en' }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{
        display: 'flex',
        gap: '10px',
        overflowX: 'auto',
        paddingBottom: '12px',
        scrollbarWidth: 'thin'
      }}>
        {MODULE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 16px',
                borderRadius: '14px',
                border: isActive ? '2px solid #7C3AED' : '1px solid var(--pastel-lavender-border)',
                background: isActive ? 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 100%)' : '#FFFFFF',
                color: isActive ? '#4C1D95' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isActive ? '0 6px 16px rgba(124, 58, 237, 0.15)' : '0 2px 6px rgba(0,0,0,0.03)',
                flexShrink: 0
              }}
            >
              <Icon size={16} color={isActive ? '#7C3AED' : '#64748B'} />
              <span>{lang === 'hi' ? tab.labelHi : tab.labelEn}</span>
              <span
                style={{
                  fontSize: '0.68rem',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  background: isActive ? '#DDD6FE' : '#F1F5F9',
                  color: isActive ? '#5B21B6' : '#64748B',
                  fontWeight: 600
                }}
              >
                {lang === 'hi' ? (tab.badgeHi || tab.badgeEn) : tab.badgeEn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
