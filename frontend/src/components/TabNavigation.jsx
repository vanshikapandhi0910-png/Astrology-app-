import React from 'react';
import {
  Smartphone, Hash, Sun, CalendarDays, Orbit, Clock, CalendarCheck,
  Globe2, Activity, Compass, FileText, HeartHandshake, SpellCheck
} from 'lucide-react';

export const MODULE_TABS = [
  { id: 1, key: "mobile-numerology", icon: Smartphone, labelEn: "1. Mobile Numerology", labelHi: "1. मोबाइल अंकशास्त्र", badge: "12-Digits" },
  { id: 2, key: "dob-numerology", icon: Hash, labelEn: "2. DOB Numerology", labelHi: "2. जन्मतिथि अंकशास्त्र", badge: "Lo Shu" },
  { id: 3, key: "zodiac-astrology", icon: Sun, labelEn: "3. Zodiac & Elements", labelHi: "3. राशि एवं तत्त्व", badge: "Sun/Moon" },
  { id: 4, key: "birthday-month", icon: CalendarDays, labelEn: "4. Birthday Month", labelHi: "4. जन्म मास विश्लेषण", badge: "Solar" },
  { id: 5, key: "natal-astrology", icon: Orbit, labelEn: "5. Natal & Dignities", labelHi: "5. ग्रह स्थिति व दशा", badge: "Dasha" },
  { id: 6, key: "horary-astrology", icon: Clock, labelEn: "6. Horary (Prashna)", labelHi: "6. प्रश्न कुंडली", badge: "Live" },
  { id: 7, key: "electional-astrology", icon: CalendarCheck, labelEn: "7. Electional (Muhurta)", labelHi: "7. शुभ मुहूर्त", badge: "Choghadiya" },
  { id: 8, key: "mundane-astrology", icon: Globe2, labelEn: "8. Mundane Global", labelHi: "8. मेदनीय (वैश्विक)", badge: "Macro" },
  { id: 9, key: "medical-astrology", icon: Activity, labelEn: "9. Medical & Ayurveda", labelHi: "9. आयुर्वेद व त्रिदोष", badge: "Tri-Dosha" },
  { id: 10, key: "vastu-predictions", icon: Compass, labelEn: "10. Vastu & Directions", labelHi: "10. वास्तु व दिशा ऊर्जा", badge: "8-Zones" },
  { id: 11, key: "birth-chart", icon: FileText, labelEn: "11. 9 Grahas in Vedic Kundli", labelHi: "11. वैदिक कुंडली के 9 ग्रह", badge: "9 Grahas" },
  { id: 12, key: "compatibility", icon: HeartHandshake, labelEn: "12. 36-Guna Compatibility", labelHi: "12. 36 गुण मिलान", badge: "Ashtakoot" },
  { id: 13, key: "name-decoder", icon: SpellCheck, labelEn: "13. Name Decoder", labelHi: "13. नाम सुधार व यश", badge: "Chaldean" }
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
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
