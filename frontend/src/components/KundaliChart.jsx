import React, { useState } from 'react';
import { Compass, Eye, ShieldAlert, Award, Star } from 'lucide-react';

export default function KundaliChart({ vedicChart, lang = 'en' }) {
  const [chartStyle, setChartStyle] = useState('north'); // 'north' or 'south'
  const [selectedHouse, setSelectedHouse] = useState(null);

  if (!vedicChart || !vedicChart.houses) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Kundali data calculation in progress...
      </div>
    );
  }

  const { ascendant, houses, planets } = vedicChart;

  // Short planet abbreviations
  const planetAbbr = {
    Sun: "Su (सूर्य)",
    Moon: "Mo (चंद्र)",
    Mars: "Ma (मंगल)",
    Mercury: "Me (बुध)",
    Jupiter: "Ju (बृहस्पति)",
    Venus: "Ve (शुक्र)",
    Saturn: "Sa (शनि)",
    Rahu: "Ra (राहु)",
    Ketu: "Ke (केतु)"
  };

  return (
    <div style={{ padding: '6px' }}>
      {/* Chart Style Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span className="pastel-badge badge-lavender" style={{ fontSize: '0.85rem' }}>
            <Compass size={14} /> Ascendant (लग्न): {ascendant.signEn} ({ascendant.signHi}) - {ascendant.degreeInSign}°
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setChartStyle('north')}
            className={chartStyle === 'north' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            North Indian Diamond (उत्तर भारतीय)
          </button>
          <button
            onClick={() => setChartStyle('south')}
            className={chartStyle === 'south' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            South Indian Square (दक्षिण भारतीय)
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
        {/* SVG Vedic Kundali Renderer */}
        <div className="pastel-card" style={{ padding: '20px', textAlign: 'center', background: '#FFFFFF' }}>
          {chartStyle === 'north' ? (
            <svg viewBox="0 0 400 400" className="kundali-svg">
              {/* Outer Square */}
              <rect x="10" y="10" width="380" height="380" fill="#FAF5FF" stroke="#8B5CF6" strokeWidth="2.5" />
              
              {/* Diagonals */}
              <line x1="10" y1="10" x2="390" y2="390" stroke="#8B5CF6" strokeWidth="2" />
              <line x1="10" y1="390" x2="390" y2="10" stroke="#8B5CF6" strokeWidth="2" />
              
              {/* Inner Diamond */}
              <polygon points="200,10 390,200 200,390 10,200" fill="#FFF5F7" stroke="#EC4899" strokeWidth="2" opacity="0.9" />

              {/* 12 House Labels & Planets */}
              {/* House 1: Top Diamond (Lagna) */}
              <g onClick={() => setSelectedHouse(houses[0])} style={{ cursor: 'pointer' }}>
                <text x="200" y="70" textAnchor="middle" fill="#5B21B6" fontSize="13" fontWeight="bold">
                  H1 (लग्न): {houses[0].signId}
                </text>
                <text x="200" y="100" textAnchor="middle" fill="#1E1B4B" fontSize="11" fontWeight="600">
                  {houses[0].planets.map(p => p.key).join(', ') || '—'}
                </text>
              </g>

              {/* House 2 */}
              <g onClick={() => setSelectedHouse(houses[1])} style={{ cursor: 'pointer' }}>
                <text x="100" y="45" textAnchor="middle" fill="#5B21B6" fontSize="11" fontWeight="bold">H2: {houses[1].signId}</text>
                <text x="100" y="70" textAnchor="middle" fill="#1E1B4B" fontSize="10">{houses[1].planets.map(p => p.key).join(', ')}</text>
              </g>

              {/* House 3 */}
              <g onClick={() => setSelectedHouse(houses[2])} style={{ cursor: 'pointer' }}>
                <text x="50" y="90" textAnchor="middle" fill="#5B21B6" fontSize="11" fontWeight="bold">H3: {houses[2].signId}</text>
                <text x="50" y="120" textAnchor="middle" fill="#1E1B4B" fontSize="10">{houses[2].planets.map(p => p.key).join(', ')}</text>
              </g>

              {/* House 4 */}
              <g onClick={() => setSelectedHouse(houses[3])} style={{ cursor: 'pointer' }}>
                <text x="110" y="200" textAnchor="middle" fill="#5B21B6" fontSize="12" fontWeight="bold">H4 (सुख): {houses[3].signId}</text>
                <text x="110" y="225" textAnchor="middle" fill="#1E1B4B" fontSize="10">{houses[3].planets.map(p => p.key).join(', ') || '—'}</text>
              </g>

              {/* House 5 */}
              <g onClick={() => setSelectedHouse(houses[4])} style={{ cursor: 'pointer' }}>
                <text x="50" y="310" textAnchor="middle" fill="#5B21B6" fontSize="11" fontWeight="bold">H5: {houses[4].signId}</text>
                <text x="50" y="340" textAnchor="middle" fill="#1E1B4B" fontSize="10">{houses[4].planets.map(p => p.key).join(', ')}</text>
              </g>

              {/* House 6 */}
              <g onClick={() => setSelectedHouse(houses[5])} style={{ cursor: 'pointer' }}>
                <text x="100" y="360" textAnchor="middle" fill="#5B21B6" fontSize="11" fontWeight="bold">H6: {houses[5].signId}</text>
                <text x="100" y="380" textAnchor="middle" fill="#1E1B4B" fontSize="10">{houses[5].planets.map(p => p.key).join(', ')}</text>
              </g>

              {/* House 7: Bottom Diamond */}
              <g onClick={() => setSelectedHouse(houses[6])} style={{ cursor: 'pointer' }}>
                <text x="200" y="330" textAnchor="middle" fill="#5B21B6" fontSize="12" fontWeight="bold">H7 (कलत्र): {houses[6].signId}</text>
                <text x="200" y="360" textAnchor="middle" fill="#1E1B4B" fontSize="11" fontWeight="600">{houses[6].planets.map(p => p.key).join(', ') || '—'}</text>
              </g>

              {/* House 8 */}
              <g onClick={() => setSelectedHouse(houses[7])} style={{ cursor: 'pointer' }}>
                <text x="300" y="360" textAnchor="middle" fill="#5B21B6" fontSize="11" fontWeight="bold">H8: {houses[7].signId}</text>
                <text x="300" y="380" textAnchor="middle" fill="#1E1B4B" fontSize="10">{houses[7].planets.map(p => p.key).join(', ')}</text>
              </g>

              {/* House 9 */}
              <g onClick={() => setSelectedHouse(houses[8])} style={{ cursor: 'pointer' }}>
                <text x="350" y="310" textAnchor="middle" fill="#5B21B6" fontSize="11" fontWeight="bold">H9 (भाग्य): {houses[8].signId}</text>
                <text x="350" y="340" textAnchor="middle" fill="#1E1B4B" fontSize="10">{houses[8].planets.map(p => p.key).join(', ')}</text>
              </g>

              {/* House 10: Right Diamond */}
              <g onClick={() => setSelectedHouse(houses[9])} style={{ cursor: 'pointer' }}>
                <text x="290" y="200" textAnchor="middle" fill="#5B21B6" fontSize="12" fontWeight="bold">H10 (कर्म): {houses[9].signId}</text>
                <text x="290" y="225" textAnchor="middle" fill="#1E1B4B" fontSize="10">{houses[9].planets.map(p => p.key).join(', ') || '—'}</text>
              </g>

              {/* House 11 */}
              <g onClick={() => setSelectedHouse(houses[10])} style={{ cursor: 'pointer' }}>
                <text x="350" y="90" textAnchor="middle" fill="#5B21B6" fontSize="11" fontWeight="bold">H11 (लाभ): {houses[10].signId}</text>
                <text x="350" y="120" textAnchor="middle" fill="#1E1B4B" fontSize="10">{houses[10].planets.map(p => p.key).join(', ')}</text>
              </g>

              {/* House 12 */}
              <g onClick={() => setSelectedHouse(houses[11])} style={{ cursor: 'pointer' }}>
                <text x="300" y="45" textAnchor="middle" fill="#5B21B6" fontSize="11" fontWeight="bold">H12: {houses[11].signId}</text>
                <text x="300" y="70" textAnchor="middle" fill="#1E1B4B" fontSize="10">{houses[11].planets.map(p => p.key).join(', ')}</text>
              </g>
            </svg>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', gap: '4px', height: '360px' }}>
              {houses.map((h, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedHouse(h)}
                  style={{
                    background: '#FAF5FF',
                    border: '1px solid var(--pastel-lavender-border)',
                    borderRadius: '8px',
                    padding: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem'
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#5B21B6' }}>H{h.house} ({h.signEn})</div>
                  <div style={{ color: '#1E1B4B', fontWeight: 600 }}>{h.planets.map(p => p.key).join(', ') || '—'}</div>
                </div>
              ))}
            </div>
          )}

          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '10px' }}>
            💡 Click on any house in the chart to inspect its specific significance and planetary lord.
          </span>
        </div>

        {/* House / Selected Bhava Inspector */}
        <div className="pastel-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={18} color="#7C3AED" />
            {selectedHouse ? `House ${selectedHouse.house}: ${selectedHouse.nameEn}` : "Planetary Placements & Dignities"}
          </h3>

          {selectedHouse ? (
            <div>
              <div className="pastel-badge badge-lavender" style={{ marginBottom: '10px' }}>
                Zodiac Sign: {selectedHouse.signEn} ({selectedHouse.signHi}) | Lord: {selectedHouse.ruler}
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                <strong>Significance:</strong> {selectedHouse.keywordsEn}
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                <strong>वैदिक महत्व:</strong> {selectedHouse.keywordsHi}
              </p>

              <div style={{ background: '#FAF5FF', padding: '12px', borderRadius: '10px', border: '1px solid #E9D5FF' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6D28D9' }}>Planets in this House:</span>
                {selectedHouse.planets.length > 0 ? (
                  <div style={{ marginTop: '6px' }}>
                    {selectedHouse.planets.map((p, idx) => (
                      <div key={idx} style={{ fontSize: '0.82rem', color: '#1E1B4B', padding: '2px 0' }}>
                        ⭐ <strong>{p.nameEn} ({p.nameHi})</strong>: {p.degInSign}° in {p.signEn} | Dignity: <span style={{ color: '#047857', fontWeight: 600 }}>{p.dignity}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '4px' }}>No direct planets; aspected by ruler {selectedHouse.ruler}.</p>
                )}
              </div>
            </div>
          ) : (
            <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
              <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                    <th style={{ padding: '6px 4px' }}>Planet</th>
                    <th style={{ padding: '6px 4px' }}>Sign</th>
                    <th style={{ padding: '6px 4px' }}>House</th>
                    <th style={{ padding: '6px 4px' }}>Dignity</th>
                  </tr>
                </thead>
                <tbody>
                  {planets.map((p, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '8px 4px', fontWeight: 600, color: '#1E1B4B' }}>{p.nameEn} ({p.nameHi})</td>
                      <td style={{ padding: '8px 4px', color: '#475569' }}>{p.signEn} ({p.degInSign}°)</td>
                      <td style={{ padding: '8px 4px', fontWeight: 600, color: '#7C3AED' }}>H{p.house}</td>
                      <td style={{ padding: '8px 4px' }}>
                        <span className={`pastel-badge ${p.dignity.includes('Exalted') ? 'badge-mint' : p.dignity.includes('Debilitated') ? 'badge-rose' : 'badge-lavender'}`} style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                          {p.dignity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
