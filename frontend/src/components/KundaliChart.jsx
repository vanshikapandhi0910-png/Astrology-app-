import React, { useState } from 'react';
import { Compass, Eye, Info, Star, HelpCircle, AlertCircle } from 'lucide-react';

// House significance data in English and Hindi
const HOUSE_META = {
  1:  { nameEn: 'Bhava 1: Tanu (Lagna / Self)',   nameHi: 'भाव 1: तनु भाव (लग्न / स्वयं)',    significance: 'Physical body, personality, self-image, vitality, new beginnings', significanceHi: 'शरीर, व्यक्तित्व, रूप-रंग, आत्म-बल, स्वास्थ्य व जीवनी शक्ति', color: '#7C3AED' },
  2:  { nameEn: 'Bhava 2: Dhana (Wealth)',        nameHi: 'भाव 2: धन भाव (वाणी व कुटुंब)',     significance: 'Accumulated wealth, family, speech, right eye, food, early education', significanceHi: 'संचित धन, पैतृक संपत्ति, कुटुंब, वाणी, भोजन, प्रारंभिक शिक्षा', color: '#059669' },
  3:  { nameEn: 'Bhava 3: Sahaja (Siblings)',     nameHi: 'भाव 3: सहज भाव (पराक्रम व भाई-बहन)',significance: 'Courage, siblings, short travels, communication, skills, right ear', significanceHi: 'साहस, पुरुषार्थ, छोटे भाई-बहन, लघु यात्राएं, लेखन व संचार कौशल', color: '#0369A1' },
  4:  { nameEn: 'Bhava 4: Sukha (Home & Mother)', nameHi: 'भाव 4: सुख भाव (माता व भूमि)',     significance: 'Mother, home, property, vehicles, education, happiness, inner peace', significanceHi: 'माता का सुख, गृह, अचल संपत्ति, वाहन, मानसिक शांति, विद्या', color: '#7C3AED' },
  5:  { nameEn: 'Bhava 5: Putra (Intellect)',     nameHi: 'भाव 5: पुत्र भाव (संतान व बुद्धि)', significance: 'Children, intelligence, past life merit, creativity, speculations', significanceHi: 'संतान सुख, उच्च बुद्धि, पूर्व जन्म पुण्य, मंत्र सिद्धि, रचनात्मकता', color: '#059669' },
  6:  { nameEn: 'Bhava 6: Shatru/Roga (Health)',  nameHi: 'भाव 6: शत्रु व रोग भाव (ऋण व सेवा)',  significance: 'Disease, enemies, debts, litigation, service, competition, left ear', significanceHi: 'रोग, शत्रु, ऋण, कानूनी विवाद, प्रतिस्पर्धा, सेवा कार्य', color: '#DC2626' },
  7:  { nameEn: 'Bhava 7: Kalatra (Spouse)',      nameHi: 'भाव 7: कलत्र भाव (विवाह व साझेदारी)',significance: 'Marriage, business partners, open enemies, foreign travel, legal bonds', significanceHi: 'विवाह, जीवनसाथी, व्यापारिक साझेदारी, सार्वजनिक जीवन', color: '#7C3AED' },
  8:  { nameEn: 'Bhava 8: Ayur (Longevity)',      nameHi: 'भाव 8: आयु व मृत्यु भाव (गूढ़ विद्या)',significance: 'Longevity, sudden changes, occult, inheritance, transformation, research', significanceHi: 'दीर्घायु, अचानक लाभ/हानि, गुप्त विद्या, शोध, विरासत', color: '#DC2626' },
  9:  { nameEn: 'Bhava 9: Dharma/Bhagya (Fortune)',nameHi: 'भाव 9: धर्म व भाग्य भाव (गुरु व धर्म)',significance: 'Fate, father, religion, long journeys, higher learning, guru, philosophy', significanceHi: 'भाग्य, पिता, धर्म, उच्च शिक्षा, गुरु कृपा, तीर्थ यात्राएं', color: '#059669' },
  10: { nameEn: 'Bhava 10: Karma (Career)',       nameHi: 'भाव 10: कर्म भाव (व्यवसाय व पद)',  significance: 'Profession, status, reputation, government, authority, public life', significanceHi: 'व्यवसाय, आजीविका, सामाजिक पद-प्रतिष्ठा, राज्य कृपा, यश', color: '#7C3AED' },
  11: { nameEn: 'Bhava 11: Labha (Gains)',        nameHi: 'भाव 11: लाभ भाव (आय व महत्वाकांक्षा)',significance: 'Income, gains, elder siblings, social circle, aspirations, left ear', significanceHi: 'आय के स्रोत, मनोकामना पूर्ति, बड़े भाई-बहन, मित्र वर्ग', color: '#059669' },
  12: { nameEn: 'Bhava 12: Vyaya (Moksha)',       nameHi: 'भाव 12: व्यय व मोक्ष भाव (विदेश वास)',significance: 'Expenditure, foreign residence, liberation, subconscious, left eye, hospitalization', significanceHi: 'व्यय, विदेश यात्रा/वास, अध्यात्म, मोक्ष, दान, शैया सुख', color: '#DC2626' }
};

// Standard North Indian Diamond Geometry (440x440 viewport)
const NI_HOUSES = [
  { n: 1,  poly: '220,20 320,120 220,220 120,120',  tx: 220, ty: 120, anchor: 'middle' },
  { n: 2,  poly: '220,20 120,120 20,20',            tx: 120, ty: 55,  anchor: 'middle' },
  { n: 3,  poly: '20,20 120,120 20,220',            tx: 55,  ty: 120, anchor: 'middle' },
  { n: 4,  poly: '20,220 120,120 220,220 120,320',  tx: 120, ty: 220, anchor: 'middle' },
  { n: 5,  poly: '20,220 120,320 20,420',           tx: 55,  ty: 320, anchor: 'middle' },
  { n: 6,  poly: '20,420 120,320 220,420',           tx: 120, ty: 385, anchor: 'middle' },
  { n: 7,  poly: '220,420 120,320 220,220 320,320', tx: 220, ty: 320, anchor: 'middle' },
  { n: 8,  poly: '220,420 320,320 420,420',          tx: 320, ty: 385, anchor: 'middle' },
  { n: 9,  poly: '420,420 320,320 420,220',          tx: 385, ty: 320, anchor: 'middle' },
  { n: 10, poly: '420,220 320,320 220,220 320,120', tx: 320, ty: 220, anchor: 'middle' },
  { n: 11, poly: '420,220 320,120 420,20',           tx: 385, ty: 120, anchor: 'middle' },
  { n: 12, poly: '420,20 320,120 220,20',           tx: 320, ty: 55,  anchor: 'middle' },
];

const HOUSE_FILL = {
  1:'#EDE9FE', 2:'#F0FDF4', 3:'#EFF6FF', 4:'#EDE9FE',
  5:'#F0FDF4', 6:'#FEF2F2', 7:'#EDE9FE', 8:'#FEF2F2',
  9:'#F0FDF4', 10:'#EDE9FE', 11:'#F0FDF4', 12:'#FEF2F2'
};

const HOUSE_STROKE = {
  1:'#7C3AED', 4:'#7C3AED', 7:'#7C3AED', 10:'#7C3AED',
  2:'#059669', 5:'#059669', 9:'#059669', 11:'#059669',
  3:'#0369A1', 6:'#DC2626', 8:'#DC2626', 12:'#DC2626'
};

export default function KundaliChart({ vedicChart, lang = 'en' }) {
  const [chartStyle, setChartStyle] = useState('north');
  const [selectedHouse, setSelectedHouse] = useState(null);

  if (!vedicChart || !vedicChart.houses) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        {lang === 'hi' ? 'कुंडली गणना जारी है...' : 'Kundali calculation in progress...'}
      </div>
    );
  }

  const { ascendant, houses, planets, birthInfo } = vedicChart;

  // Map planets by house number
  const housePlanetMap = {};
  (planets || []).forEach(p => {
    if (!housePlanetMap[p.house]) housePlanetMap[p.house] = [];
    const abbrEn = { Sun:'Su', Moon:'Mo', Mars:'Ma', Mercury:'Me', Jupiter:'Ju', Venus:'Ve', Saturn:'Sa', Rahu:'Ra', Ketu:'Ke' };
    const abbrHi = { Sun:'सूर्य', Moon:'चंद्र', Mars:'मंगल', Mercury:'बुध', Jupiter:'गुरु', Venus:'शुक्र', Saturn:'शनि', Rahu:'राहु', Ketu:'केतु' };
    const name = lang === 'hi' ? (abbrHi[p.key] || p.nameHi) : (abbrEn[p.key] || p.key.slice(0,2));
    housePlanetMap[p.house].push(name);
  });

  const SI_GRID_ORDER = [
    { signIdx: 11, gr: 0, gc: 0 }, { signIdx: 0,  gr: 0, gc: 1 }, { signIdx: 1,  gr: 0, gc: 2 }, { signIdx: 2,  gr: 0, gc: 3 },
    { signIdx: 10, gr: 1, gc: 0 },                                                                   { signIdx: 3,  gr: 1, gc: 3 },
    { signIdx: 9,  gr: 2, gc: 0 },                                                                   { signIdx: 4,  gr: 2, gc: 3 },
    { signIdx: 8,  gr: 3, gc: 0 }, { signIdx: 7,  gr: 3, gc: 1 }, { signIdx: 6,  gr: 3, gc: 2 }, { signIdx: 5,  gr: 3, gc: 3 },
  ];

  const SIGN_NAMES_EN = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
  const SIGN_NAMES_HI = ['मेष','वृषभ','मिथुन','कर्क','सिंह','कन्या','तुला','वृश्चिक','धनु','मकर','कुंभ','मीन'];

  return (
    <div style={{ padding: '6px' }}>
      {/* Educational Header Badge: 12 Houses vs 12 Signs vs 9 Grahas */}
      <div style={{ background: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 100%)', border: '1.5px solid #C4B5FD', borderRadius: '14px', padding: '12px 16px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>🔮</span>
            <div>
              <strong style={{ fontSize: '0.92rem', color: '#4C1D95' }}>
                {lang === 'hi' ? 'वैदिक कुंडली: 12 भाव, 12 राशियां एवं 9 ग्रह' : 'Vedic Kundli: 12 Bhavas (Houses), 12 Rashis (Signs) & 9 Grahas (Planets)'}
              </strong>
              <div style={{ fontSize: '0.74rem', color: '#6D28D9', marginTop: '2px' }}>
                {lang === 'hi' 
                  ? 'भाव (स्थान) 1 से 12 तक निश्चित हैं · राशियां (1-12) लग्न अनुसार बदलती हैं · 9 ग्रह भावों में स्थित हैं' 
                  : '12 Houses are fixed structural positions · 12 Zodiac Signs align by Lagna · 9 Planets occupy the Bhavas'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span className="pastel-badge badge-lavender" style={{ fontSize: '0.72rem' }}>
              {lang === 'hi' ? `लग्न: ${ascendant.signHi}` : `Lagna: ${ascendant.signEn}`} ({ascendant.degreeInSign}°)
            </span>
            <span className="pastel-badge badge-mint" style={{ fontSize: '0.72rem' }}>
              {lang === 'hi' ? `स्वामी: ${ascendant.ruler}` : `Lord: ${ascendant.ruler}`}
            </span>
          </div>
        </div>
      </div>

      {/* Chart View Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {lang === 'hi' ? 'चार्ट प्रारूप चुनें:' : 'Select Kundli Chart Layout:'}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setChartStyle('north')} className={chartStyle === 'north' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
            {lang === 'hi' ? '◇ उत्तर भारतीय (12 भाव व्यू)' : '◇ North Indian (12 Bhavas)'}
          </button>
          <button onClick={() => setChartStyle('south')} className={chartStyle === 'south' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
            {lang === 'hi' ? '⊞ दक्षिण भारतीय (12 राशि व्यू)' : '⊞ South Indian (12 Rashis)'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', alignItems: 'start' }}>
        {/* ─── SVG Chart ─── */}
        <div className="pastel-card" style={{ padding: '16px', textAlign: 'center', background: '#FFFFFF' }}>
          {chartStyle === 'north' ? (
            <svg viewBox="0 0 440 440" style={{ width: '100%', maxWidth: '440px', height: 'auto', display: 'block', margin: '0 auto' }}>
              {/* Background */}
              <rect x="0" y="0" width="440" height="440" fill="#FAF5FF" rx="8" />

              {/* Draw all 12 house polygons */}
              {NI_HOUSES.map(({ n, poly, tx, ty, anchor }) => {
                const hData = houses[n - 1] || {};
                const signName = lang === 'hi' ? hData.signHi : hData.signEn;
                const signNum = hData.signId || n;
                const pList = housePlanetMap[n] || [];
                const meta  = HOUSE_META[n] || {};
                const isSelected = selectedHouse?.house === n;

                return (
                  <g key={n} onClick={() => setSelectedHouse({ ...hData, house: n, ...meta })} style={{ cursor: 'pointer' }}>
                    <polygon
                      points={poly}
                      fill={isSelected ? '#DDD6FE' : HOUSE_FILL[n]}
                      stroke={isSelected ? '#4C1D95' : HOUSE_STROKE[n] || '#8B5CF6'}
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                      opacity="0.95"
                    />
                    {/* House number & Sign Number */}
                    <text x={tx} y={ty - 10} textAnchor={anchor} fill="#4C1D95" fontSize="10" fontWeight="800" fontFamily="system-ui">
                      {lang === 'hi' ? `${n} भाव · रा <sup>${signNum}</sup>` : `H${n} · Sign ${signNum}`}
                    </text>
                    {/* Sign name */}
                    <text x={tx} y={ty + 4} textAnchor={anchor} fill={HOUSE_STROKE[n] || '#5B21B6'} fontSize="10" fontWeight="700" fontFamily="system-ui">
                      {signName}
                    </text>
                    {/* Planets list */}
                    {pList.length > 0 && (
                      <text x={tx} y={ty + 18} textAnchor={anchor} fill="#1E1B4B" fontSize="9" fontWeight="800" fontFamily="system-ui">
                        {pList.join(' ')}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Center diamond label */}
              <text x="220" y="210" textAnchor="middle" fill="#7C3AED" fontSize="14" fontWeight="800" fontFamily="system-ui">🔮</text>
              <text x="220" y="226" textAnchor="middle" fill="#5B21B6" fontSize="9" fontWeight="800" fontFamily="system-ui">KundliGPT</text>
              <text x="220" y="238" textAnchor="middle" fill="#7C3AED" fontSize="8" fontFamily="system-ui">{lang === 'hi' ? '12 भाव व 9 ग्रह' : '12 Bhavas & 9 Grahas'}</text>
            </svg>
          ) : (
            /* ─── South Indian 4×4 Grid ─── */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', gap: '3px', height: '380px', maxWidth: '380px', margin: '0 auto', background: '#8B5CF6', borderRadius: '8px', padding: '3px' }}>
              {SI_GRID_ORDER.map(({ signIdx, gr, gc }) => {
                const houseForSign = houses.find(h => h.signId === signIdx + 1);
                const hNum = houseForSign?.house;
                const meta = HOUSE_META[hNum] || {};
                const pList = housePlanetMap[hNum] || [];
                const isSelected = selectedHouse?.house === hNum;
                const signName = lang === 'hi' ? SIGN_NAMES_HI[signIdx] : SIGN_NAMES_EN[signIdx];

                return (
                  <div
                    key={signIdx}
                    onClick={() => houseForSign && setSelectedHouse({ ...houseForSign, house: hNum, ...meta })}
                    style={{
                      gridRow: gr + 1,
                      gridColumn: gc + 1,
                      background: isSelected ? '#DDD6FE' : HOUSE_FILL[hNum] || '#FFFFFF',
                      borderRadius: '5px',
                      padding: '4px 3px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '80px',
                      border: isSelected ? '2px solid #4C1D95' : '1px solid #E9D5FF',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: HOUSE_STROKE[hNum] || '#5B21B6' }}>
                      {lang === 'hi' ? `${hNum} भाव · ${signName}` : `H${hNum} · ${signName}`}
                    </div>
                    <div style={{ fontSize: '0.6rem', color: '#475569', fontWeight: 600 }}>
                      {lang === 'hi' ? `राशि ${signIdx + 1}` : `Sign ${signIdx + 1}`}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#1E1B4B' }}>
                      {pList.join(' ') || ''}
                    </div>
                  </div>
                );
              })}

              {/* Center 2×2 cells */}
              <div style={{ gridRow: 2, gridColumn: 2, gridRowEnd: 4, gridColumnEnd: 4, background: 'linear-gradient(135deg, #FAF5FF, #EDE9FE)', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px', border: '1px solid #C4B5FD' }}>
                <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>🔮</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#4C1D95', textAlign: 'center', marginBottom: '4px' }}>
                  {lang === 'hi' ? 'वैदिक जन्मांग' : 'Vedic Kundli'}
                </div>
                <div style={{ fontSize: '0.55rem', color: '#7C3AED', textAlign: 'center', marginBottom: '3px', fontWeight: 600 }}>
                  {lang === 'hi' ? '12 राशि · 12 भाव · 9 ग्रह' : '12 Rashis · 12 Bhavas · 9 Grahas'}
                </div>
                <div style={{ fontSize: '0.52rem', color: '#5B21B6', textAlign: 'center', fontWeight: 600, marginBottom: '2px' }}>
                  {lang === 'hi' ? `लग्न: ${ascendant.signHi}` : `Lagna: ${ascendant.signEn}`}
                </div>
                <div style={{ fontSize: '0.5rem', color: '#6D28D9', textAlign: 'center', lineHeight: 1.4 }}>
                  {lang === 'hi'
                    ? 'सूर्य·चंद्र·मंगल·बुध·गुरु·शुक्र·शनि·राहु·केतु'
                    : 'Su·Mo·Ma·Me·Ju·Ve·Sa·Ra·Ke'}
                </div>
              </div>
            </div>
          )}

          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '10px' }}>
            💡 {lang === 'hi' ? 'चार्ट में किसी भी भाव पर क्लिक करके उसकी राशि, भावेश (स्वामी), 9 ग्रहों की स्थिति व महत्व देखें।' : 'Click any house cell in the chart above to inspect its Rashi, House Lord, 9 Grahas & Significances.'}
          </p>

          {/* 9 Grahas Summary */}
          <div style={{ marginTop: '14px', textAlign: 'left' }}>
            <h4 style={{ fontSize: '0.82rem', color: '#4C1D95', marginBottom: '8px' }}>
              {lang === 'hi' ? 'कुंडली में 9 ग्रह (नवग्रह स्थिति):' : '9 Grahas (Planets) in this Kundli:'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '6px' }}>
              {(planets || []).map((planet) => (
                <div key={planet.key} style={{ background: '#FAF5FF', border: '1px solid #E9D5FF', borderRadius: '7px', padding: '6px 8px', fontSize: '0.72rem', color: '#1E1B4B' }}>
                  <strong>{lang === 'hi' ? planet.nameHi : planet.nameEn}</strong> · {lang === 'hi' ? `${planet.house} भाव` : `H${planet.house}`}
                  <div style={{ color: '#64748B', fontSize: '0.65rem', marginTop: '2px' }}>
                    {lang === 'hi' ? planet.signHi : planet.signEn} · {planet.degInSign}°
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── House Inspector ─── */}
        <div className="pastel-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: '#1E1B4B' }}>
            <Eye size={18} color="#7C3AED" />
            {selectedHouse
              ? (lang === 'hi' ? selectedHouse.nameHi : selectedHouse.nameEn)
              : (lang === 'hi' ? 'भाव एवं ग्रह विश्लेषण निर्देशिका' : 'Planetary Placements & Bhava Guide')}
          </h3>

          {selectedHouse ? (
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                <span className="pastel-badge badge-lavender">
                  {lang === 'hi' ? `सूर्य राशि: ${selectedHouse.signHi}` : `Sun-Sign: ${selectedHouse.signEn}`} ({lang === 'hi' ? `राशि #${selectedHouse.signId}` : `Sign #${selectedHouse.signId}`})
                </span>
                <span className="pastel-badge badge-mint">
                  {lang === 'hi' ? `भावेश (स्वामी): ${selectedHouse.ruler}` : `House Lord: ${selectedHouse.ruler}`}
                </span>
              </div>

              <div style={{ background: '#FAF5FF', borderRadius: '10px', padding: '12px 14px', marginBottom: '10px', border: '1px solid #E9D5FF' }}>
                <p style={{ fontSize: '0.82rem', color: '#1E1B4B', fontWeight: 700, marginBottom: '4px' }}>
                  <Info size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} color="#7C3AED" />
                  {lang === 'hi' ? 'वैदिक भाव महत्व व फल:' : 'House Significance & Domain:'}
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {lang === 'hi' ? selectedHouse.significanceHi : selectedHouse.significance}
                </p>
              </div>

              {/* Planets in this house */}
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  {lang === 'hi' ? `भाव ${selectedHouse.house} में स्थित ग्रह:` : `Planets in House ${selectedHouse.house}:`}
                </p>
                {(housePlanetMap[selectedHouse.house] || []).length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(planets || []).filter(p => p.house === selectedHouse.house).map((p, i) => (
                      <span key={i} className="pastel-badge badge-sky" style={{ fontSize: '0.75rem' }}>
                        <Star size={11} /> {lang === 'hi' ? p.nameHi : p.nameEn} ({lang === 'hi' ? p.signHi : p.signEn}, {p.degInSign}°) — {lang === 'hi' ? p.dignityHi || p.dignity : p.dignity}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    {lang === 'hi' ? 'रिक्त भाव — यह भाव अपने भावेश (स्वामी ग्रह) की स्थिति से फल प्रदान करता है।' : 'Empty house — unoccupied houses draw energy from their lord\'s position'}
                  </span>
                )}
              </div>
            </div>
          ) : (
            /* Summary when no house selected */
            <div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                {lang === 'hi' ? 'ऊपर कुंडली चार्ट में किसी भी भाव पर क्लिक करें। नवग्रह संक्षिप्त सूची:' : 'Select any house in the chart above to see its detailed analysis. Planet summary:'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(planets || []).map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAF5FF', borderRadius: '8px', padding: '8px 12px', border: '1px solid #E9D5FF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4C1D95', minWidth: '70px' }}>
                        {lang === 'hi' ? p.nameHi : p.nameEn}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        {lang === 'hi' ? p.signHi : p.signEn} ({p.degInSign}°)
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span className="pastel-badge badge-lavender" style={{ fontSize: '0.68rem' }}>
                        {lang === 'hi' ? `${p.house} भाव` : `H${p.house}`}
                      </span>
                      <span className="pastel-badge badge-mint" style={{ fontSize: '0.68rem' }}>
                        {lang === 'hi' ? p.dignityHi || p.dignity : p.dignity?.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* All 12 Bhavas Quick Reference Table */}
      <div style={{ marginTop: '24px' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4C1D95', marginBottom: '12px' }}>
          📋 {lang === 'hi' ? 'समस्त 12 भाव (Bhavas) - विवरण व स्वामी तालिका' : 'All 12 Bhavas — House, Sign & Lord Master Reference'}
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
          {houses.map((h, i) => {
            const meta = HOUSE_META[h.house] || {};
            const pList = housePlanetMap[h.house] || [];
            const isSel = selectedHouse?.house === h.house;
            return (
              <div
                key={i}
                onClick={() => setSelectedHouse({ ...h, ...meta })}
                style={{
                  background: isSel ? '#DDD6FE' : '#FAFAFA',
                  border: `1px solid ${isSel ? '#7C3AED' : '#E9D5FF'}`,
                  borderRadius: '10px',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderLeft: `3px solid ${HOUSE_STROKE[h.house] || '#8B5CF6'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4C1D95' }}>
                    {lang === 'hi' ? `${h.house} भाव: ${h.signHi}` : `H${h.house}: ${h.signEn}`}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#7C3AED', fontWeight: 600 }}>{pList.join(' ') || '∅'}</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                  {lang === 'hi' ? meta.nameHi : meta.nameEn}
                </div>
                <div style={{ fontSize: '0.67rem', color: '#94A3B8' }}>
                  {lang === 'hi' ? `स्वामी: ${h.ruler}` : `Lord: ${h.ruler}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
