import React, { useState } from 'react';
import { Compass, Eye, Info, Star } from 'lucide-react';

// House significance data
const HOUSE_META = {
  1:  { nameEn: 'Lagna (Self)',       nameHi: 'लग्न (स्वयं)',        significance: 'Physical body, personality, self-image, vitality, new beginnings', significanceHi: 'शरीर, व्यक्तित्व, आत्म-छवि, जीवनी शक्ति', color: '#7C3AED', badge: 'bg-purple' },
  2:  { nameEn: 'Dhana (Wealth)',     nameHi: 'धन भाव',              significance: 'Accumulated wealth, family, speech, right eye, food, early education', significanceHi: 'संचित धन, परिवार, वाणी, दाहिनी आंख, प्रारंभिक शिक्षा', color: '#059669', badge: 'bg-green' },
  3:  { nameEn: 'Sahaja (Siblings)',  nameHi: 'सहज भाव',            significance: 'Courage, siblings, short travels, communication, skills, right ear', significanceHi: 'साहस, भाई-बहन, लघु यात्रा, संचार कौशल, दाहिना कान', color: '#0369A1', badge: 'bg-blue' },
  4:  { nameEn: 'Sukha (Happiness)',  nameHi: 'सुख भाव',            significance: 'Mother, home, property, vehicles, education, happiness, inner peace', significanceHi: 'माता, गृह, संपत्ति, वाहन, सुख, आंतरिक शांति', color: '#7C3AED', badge: 'bg-purple' },
  5:  { nameEn: 'Putra (Children)',   nameHi: 'पुत्र भाव',          significance: 'Children, intelligence, past life merit, creativity, speculations', significanceHi: 'संतान, बुद्धि, पूर्व जन्म का पुण्य, रचनात्मकता', color: '#059669', badge: 'bg-green' },
  6:  { nameEn: 'Ari (Enemies)',      nameHi: 'अरि भाव',            significance: 'Disease, enemies, debts, litigation, service, competition, left ear', significanceHi: 'रोग, शत्रु, ऋण, कानूनी विवाद, सेवा', color: '#DC2626', badge: 'bg-red' },
  7:  { nameEn: 'Kalatra (Spouse)',   nameHi: 'कलत्र भाव',          significance: 'Marriage, business partners, open enemies, foreign travel, legal bonds', significanceHi: 'विवाह, व्यापारिक साझेदार, विदेश यात्रा, कानूनी बंधन', color: '#7C3AED', badge: 'bg-purple' },
  8:  { nameEn: 'Mrityu (Longevity)', nameHi: 'मृत्यु/आयु भाव',   significance: 'Longevity, sudden changes, occult, inheritance, transformation, research', significanceHi: 'दीर्घायु, अचानक परिवर्तन, गुप्त विद्या, विरासत', color: '#DC2626', badge: 'bg-red' },
  9:  { nameEn: 'Bhagya (Fortune)',   nameHi: 'भाग्य भाव',         significance: 'Fate, father, religion, long journeys, higher learning, guru, philosophy', significanceHi: 'भाग्य, पिता, धर्म, दीर्घ यात्रा, उच्च शिक्षा, गुरु', color: '#059669', badge: 'bg-green' },
  10: { nameEn: 'Karma (Career)',     nameHi: 'कर्म भाव',          significance: 'Profession, status, reputation, government, authority, public life', significanceHi: 'व्यवसाय, सामाजिक स्थिति, सरकारी कार्य, यश', color: '#7C3AED', badge: 'bg-purple' },
  11: { nameEn: 'Labha (Gains)',      nameHi: 'लाभ भाव',           significance: 'Income, gains, elder siblings, social circle, aspirations, left ear', significanceHi: 'आय, लाभ, बड़े भाई-बहन, समाज, महत्वाकांक्षाएं', color: '#059669', badge: 'bg-green' },
  12: { nameEn: 'Vyaya (Loss/Moksha)', nameHi: 'व्यय/मोक्ष भाव', significance: 'Expenditure, foreign residence, liberation, subconscious, left eye, hospitalization', significanceHi: 'व्यय, विदेश निवास, मोक्ष, अवचेतन मन, बायीं आंख', color: '#DC2626', badge: 'bg-red' }
};

// North Indian chart — fixed geometric positions (clockwise from top)
// House positions in the diamond: H1=top, H2=upper-left, H3=left-top, H4=left, H5=left-bottom, H6=lower-left, H7=bottom, H8=lower-right, H9=right-bottom, H10=right, H11=right-top, H12=upper-right
// SVG: 440x440. Center: (220,220). The diamond uses points: top(220,20), right(420,220), bottom(220,420), left(20,220)
const NORTH_HOUSE_PATHS = [
  // House 1 — Top triangle (Lagna)
  { hNum: 1,  path: 'M220,20 L420,220 L20,220 Z',             textX: 220, textY: 110, fsize: 13 },
  // House 2 — Upper left triangle
  { hNum: 2,  path: 'M220,20 L20,220 L20,20 Z',               textX: 87,  textY: 67,  fsize: 11 },
  // House 3 — Left upper rectangle (left of H2)
  { hNum: 3,  path: 'M20,20 L20,220 L120,220 L120,120 Z',     textX: 38,  textY: 185, fsize: 11 },
  // House 4 — Left triangle (West point)
  { hNum: 4,  path: 'M20,220 L220,420 L220,20 Z',             textX: 87,  textY: 315, fsize: 13 },
  // Wait — North Indian chart layout needs to be done differently
  // Let me use a proper cell-based approach
];

// Proper North Indian Diamond — uses 9 cells in a 3x3 grid with center cell and 4 corner cells
// The 12 houses are mapped to triangular/trapezoidal regions around the central diamond
// Standard North Indian positions (house number → grid position):
// H1=top-center-top, H2=top-left-corner, H3=left-center-left, H4=bottom-left-corner...
// Better: use SVG polygon per house with correct coordinates

const NI_HOUSES = [
  // Outer square: 20,20 to 420,420. Center: 220,220.
  // Diamond vertices: T=220,20  R=420,220  B=220,420  L=20,220
  // House 1: Top inner triangle
  { n:1,  poly:'220,20 320,120 220,220 120,120',     tx:220, ty:90,  anchor:'middle' },
  // House 2: Top-left corner square
  { n:2,  poly:'20,20 220,20 120,120 20,120',        tx:75,  ty:52,  anchor:'middle' },
  // House 3: Left-top square
  { n:3,  poly:'20,20 20,120 120,120 120,220',       tx:52,  ty:175, anchor:'middle' },
  // House 4: Left inner triangle
  { n:4,  poly:'20,220 120,120 220,220 120,320',     tx:90,  ty:220, anchor:'middle' },
  // House 5: Left-bottom square
  { n:5,  poly:'20,220 20,320 120,320 120,420',      tx:52,  ty:368, anchor:'middle' },
  // House 6: Bottom-left corner square
  { n:6,  poly:'20,420 220,420 120,320 20,320',      tx:75,  ty:390, anchor:'middle' },
  // House 7: Bottom inner triangle
  { n:7,  poly:'220,420 320,320 220,220 120,320',    tx:220, ty:352, anchor:'middle' },
  // House 8: Bottom-right corner square
  { n:8,  poly:'220,420 420,420 420,320 320,320',    tx:365, ty:390, anchor:'middle' },
  // House 9: Right-bottom square
  { n:9,  poly:'320,220 420,220 420,320 320,320',    tx:388, ty:368, anchor:'middle' },
  // House 10: Right inner triangle
  { n:10, poly:'420,220 320,120 220,220 320,320',    tx:348, ty:220, anchor:'middle' },
  // House 11: Right-top square
  { n:11, poly:'320,120 420,120 420,220 320,220',    tx:388, ty:175, anchor:'middle' },
  // House 12: Top-right corner square
  { n:12, poly:'220,20 420,20 420,120 320,120',      tx:365, ty:52,  anchor:'middle' },
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
  const [chartStyle, setChartStyle] = useState('south');
  const [selectedHouse, setSelectedHouse] = useState(null);

  if (!vedicChart || !vedicChart.houses) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Kundali data calculation in progress...
      </div>
    );
  }

  const { ascendant, houses, planets } = vedicChart;

  // Build a map: houseNumber → list of planet abbreviations
  const housePlanetMap = {};
  (planets || []).forEach(p => {
    if (!housePlanetMap[p.house]) housePlanetMap[p.house] = [];
    const abbr = { Sun:'Su', Moon:'Mo', Mars:'Ma', Mercury:'Me', Jupiter:'Ju', Venus:'Ve', Saturn:'Sa', Rahu:'Ra', Ketu:'Ke' };
    housePlanetMap[p.house].push(abbr[p.key] || p.key.slice(0,2));
  });

  // South Indian grid positions (fixed sign-based, 4×4 grid, middle 2×2 empty)
  // Position order by sign index (0=Aries→top-left-first): Pi,Ar,Ta,Ge / Aq,—,—,Ca / Cp,—,—,Le / Sa,Sc,Li,Vi
  const SI_GRID_ORDER = [
    { signIdx: 11, gr: 0, gc: 0 }, { signIdx: 0,  gr: 0, gc: 1 }, { signIdx: 1,  gr: 0, gc: 2 }, { signIdx: 2,  gr: 0, gc: 3 },
    { signIdx: 10, gr: 1, gc: 0 },                                                                   { signIdx: 3,  gr: 1, gc: 3 },
    { signIdx: 9,  gr: 2, gc: 0 },                                                                   { signIdx: 4,  gr: 2, gc: 3 },
    { signIdx: 8,  gr: 3, gc: 0 }, { signIdx: 7,  gr: 3, gc: 1 }, { signIdx: 6,  gr: 3, gc: 2 }, { signIdx: 5,  gr: 3, gc: 3 },
  ];

  const SIGN_NAMES = ['Ar','Ta','Ge','Ca','Le','Vi','Li','Sc','Sa','Cp','Aq','Pi'];

  return (
    <div style={{ padding: '6px' }}>
      {/* Ascendant + Chart Style Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <span className="pastel-badge badge-lavender" style={{ fontSize: '0.88rem', padding: '6px 14px' }}>
          <Compass size={15} /> &nbsp;Lagna (लग्न): <strong>{ascendant.signEn}</strong> ({ascendant.signHi}) — {ascendant.degreeInSign}° — Ruled by {ascendant.ruler}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setChartStyle('north')} className={chartStyle === 'north' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
            ◇ North Indian 12 Bhava
          </button>
          <button onClick={() => setChartStyle('south')} className={chartStyle === 'south' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
            ⊞ South Indian 12 Rashi
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
                const sign  = hData.signEn ? hData.signEn.slice(0, 3) : `S${hData.signId || n}`;
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
                    {/* House number */}
                    <text x={tx} y={ty - 8} textAnchor={anchor} fill="#4C1D95" fontSize="10" fontWeight="800" fontFamily="system-ui">
                      H{n}
                    </text>
                    {/* Sign abbreviation */}
                    <text x={tx} y={ty + 6} textAnchor={anchor} fill={HOUSE_STROKE[n] || '#5B21B6'} fontSize="11" fontWeight="700" fontFamily="system-ui">
                      {sign}
                    </text>
                    {/* Planet list */}
                    {pList.length > 0 && (
                      <text x={tx} y={ty + 20} textAnchor={anchor} fill="#1E1B4B" fontSize="10" fontWeight="600" fontFamily="system-ui">
                        {pList.join(' ')}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Center diamond label */}
              <text x="220" y="215" textAnchor="middle" fill="#7C3AED" fontSize="12" fontWeight="800" fontFamily="system-ui">🔮</text>
              <text x="220" y="232" textAnchor="middle" fill="#5B21B6" fontSize="9" fontFamily="system-ui">Vedic</text>
            </svg>
          ) : (
            /* ─── South Indian 4×4 Grid ─── */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', gap: '3px', height: '380px', maxWidth: '380px', margin: '0 auto', background: '#8B5CF6', borderRadius: '8px', padding: '3px' }}>
              {SI_GRID_ORDER.map(({ signIdx, gr, gc }) => {
                // Find which house this sign belongs to
                const houseForSign = houses.find(h => h.signId === signIdx + 1);
                const hNum = houseForSign?.house;
                const meta = HOUSE_META[hNum] || {};
                const pList = housePlanetMap[hNum] || [];
                const isSelected = selectedHouse?.house === hNum;
                const SIGN_FULL = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

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
                      H{hNum} · {SIGN_NAMES[signIdx]}
                    </div>
                    <div style={{ fontSize: '0.6rem', color: '#475569', fontWeight: 600 }}>
                      {SIGN_FULL[signIdx]}
                    </div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1E1B4B' }}>
                      {pList.join(' ') || ''}
                    </div>
                  </div>
                );
              })}

              {/* Center 2×2 cells — chart title */}
              <div style={{ gridRow: 2, gridColumn: 2, gridRowEnd: 4, gridColumnEnd: 4, background: 'linear-gradient(135deg, #FAF5FF, #EDE9FE)', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px', border: '1px solid #C4B5FD' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🔮</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4C1D95', textAlign: 'center' }}>9 Grahas in Vedic Kundli</div>
                <div style={{ fontSize: '0.65rem', color: '#7C3AED', marginTop: '2px', textAlign: 'center' }}>12 Bhava / Rashi View</div>
                <div style={{ fontSize: '0.62rem', color: '#5B21B6', marginTop: '4px', textAlign: 'center', fontWeight: 600 }}>{ascendant.signEn}</div>
              </div>
            </div>
          )}

          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '10px' }}>
            💡 Click any house cell to inspect its planetary ruler, significance &amp; Vedic keywords.
          </p>
          <div style={{ marginTop: '14px', textAlign: 'left' }}>
            <h4 style={{ fontSize: '0.82rem', color: '#4C1D95', marginBottom: '8px' }}>9 Grahas (Planets) in this Kundli</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '6px' }}>
              {(planets || []).map((planet) => (
                <div key={planet.key} style={{ background: '#FAF5FF', border: '1px solid #E9D5FF', borderRadius: '7px', padding: '6px 8px', fontSize: '0.72rem', color: '#1E1B4B' }}>
                  <strong>{planet.nameEn}</strong> · H{planet.house}
                  <div style={{ color: '#64748B', fontSize: '0.65rem', marginTop: '2px' }}>{planet.signEn} · {planet.degInSign}°</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── House Inspector ─── */}
        <div className="pastel-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={18} color="#7C3AED" />
            {selectedHouse
              ? `H${selectedHouse.house}: ${lang === 'hi' ? selectedHouse.nameHi : selectedHouse.nameEn}`
              : 'Planetary Placements & Bhava Guide'}
          </h3>

          {selectedHouse ? (
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                <span className="pastel-badge badge-lavender">
                  Sign: {selectedHouse.signEn} ({selectedHouse.signHi})
                </span>
                <span className="pastel-badge badge-mint">
                  Lord: {selectedHouse.ruler}
                </span>
              </div>

              <div style={{ background: '#FAF5FF', borderRadius: '10px', padding: '12px 14px', marginBottom: '10px', border: '1px solid #E9D5FF' }}>
                <p style={{ fontSize: '0.82rem', color: '#1E1B4B', fontWeight: 700, marginBottom: '4px' }}>
                  <Info size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} color="#7C3AED" />
                  {lang === 'hi' ? 'वैदिक महत्व:' : 'House Significance:'}
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {lang === 'hi' ? selectedHouse.significanceHi : selectedHouse.significance}
                </p>
              </div>

              {/* Planets in this house */}
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Planets in House {selectedHouse.house}:</p>
                {(housePlanetMap[selectedHouse.house] || []).length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(planets || []).filter(p => p.house === selectedHouse.house).map((p, i) => (
                      <span key={i} className="pastel-badge badge-sky" style={{ fontSize: '0.75rem' }}>
                        <Star size={11} /> {p.nameEn} ({p.signEn}, {p.degInSign}°) — {p.dignity}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Empty house — unoccupied houses draw energy from their lord's position</span>
                )}
              </div>
            </div>
          ) : (
            /* Show all planets summary when no house selected */
            <div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                Select any house in the chart above to see its detailed analysis. Here's a quick planet summary:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(planets || []).map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAF5FF', borderRadius: '8px', padding: '8px 12px', border: '1px solid #E9D5FF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4C1D95', minWidth: '70px' }}>{p.nameEn}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{p.signEn} ({p.degInSign}°)</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span className="pastel-badge badge-lavender" style={{ fontSize: '0.68rem' }}>H{p.house}</span>
                      <span className="pastel-badge badge-mint" style={{ fontSize: '0.68rem' }}>{p.dignity?.split(' ')[0]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 12 Houses Quick Reference */}
      <div style={{ marginTop: '24px' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4C1D95', marginBottom: '12px' }}>📋 All 12 Bhavas — Quick Reference</h4>
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
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4C1D95' }}>H{h.house}: {h.signEn}</span>
                  <span style={{ fontSize: '0.68rem', color: '#7C3AED', fontWeight: 600 }}>{pList.join(' ') || '∅'}</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{meta.nameEn}</div>
                <div style={{ fontSize: '0.67rem', color: '#94A3B8' }}>Lord: {h.ruler}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
