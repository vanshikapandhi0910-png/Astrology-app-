import React, { useState } from 'react';
import { Type, Sparkles, Check, ArrowRight, Wand2 } from 'lucide-react';
import { CHALDEAN_MAP, PYTHAGOREAN_MAP, reduceToSingleDigit, sumOfDigits, PLANETARY_RULERS } from '../utils/clientAlgorithms';

export default function NameOptimizer({ nameData, onApplyName, lang = 'en' }) {
  const [customName, setCustomName] = useState(nameData?.originalName || "Aarav Sharma");

  // Live Chaldean calculation
  const clean = (customName || '').trim().toUpperCase().replace(/[^A-Z]/g, '');
  const letters = clean.split('').map(ch => ({ char: ch, val: CHALDEAN_MAP[ch] || 0 }));
  const compound = letters.reduce((s, l) => s + l.val, 0);
  const root = reduceToSingleDigit(compound);
  const ruler = PLANETARY_RULERS[root] || PLANETARY_RULERS[1];

  // Suggestions for success
  const suggestions = [
    {
      variant: clean + "A",
      compound: compound + 1,
      root: reduceToSingleDigit(compound + 1),
      benefitEn: "Adds solar leadership & decisive authority for career growth.",
      benefitHi: "नेतृत्व क्षमता और सरकारी कार्यों में सफलता के लिए सूर्य ऊर्जा जोड़ता है।"
    },
    {
      variant: clean + "E",
      compound: compound + 5,
      root: reduceToSingleDigit(compound + 5),
      benefitEn: "Connects with Mercury for commercial brilliance, communication, and swift deal-making.",
      benefitHi: "बुध के प्रभाव से व्यापारिक सौदों, वाकपटुता और धन आगमन में वृद्धि।"
    },
    {
      variant: clean + "I",
      compound: compound + 1,
      root: reduceToSingleDigit(compound + 1),
      benefitEn: "Amplifies magnetic recognition, public acclaim, and focus.",
      benefitHi: "सामाजिक मान-सम्मान और जनप्रियता को सुदृढ़ करता है।"
    }
  ];

  return (
    <div style={{ padding: '6px' }}>
      {/* Live Name Input Analyzer */}
      <div className="pastel-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#1E1B4B', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Type size={20} color="#7C3AED" /> Chaldean & Pythagorean Name Decoder
          </h3>
          <span className="pastel-badge badge-lavender">
            Ancient Vibration Science
          </span>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label className="form-label">Analyze / Modify Any Name in Real-Time:</label>
          <input
            type="text"
            className="form-input"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Type name here..."
            style={{ fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.04em' }}
          />
        </div>

        {/* Letter by Letter Breakdown Cards */}
        <div style={{ marginBottom: '18px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
            CHALDEAN LETTER-BY-LETTER NUMERICAL MATRIX:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {letters.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: '#FAF5FF',
                  border: '1.5px solid var(--pastel-lavender-border)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  textAlign: 'center',
                  minWidth: '44px'
                }}
              >
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4C1D95' }}>{item.char}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309', borderTop: '1px solid #E9D5FF', marginTop: '2px', paddingTop: '2px' }}>
                  {item.val}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Vibration Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', background: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Chaldean Compound Sum</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#7C3AED' }}>{compound}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Single Digit Root Number</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#BE123C' }}>
              {root} <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>({ruler.planet})</span>
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Ruling Cosmic Element</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#047857', marginTop: '6px' }}>{ruler.element}</div>
          </div>
        </div>
      </div>

      {/* Suggested Spelling Adjustments for Fame & Wealth */}
      <div className="pastel-card" style={{ padding: '20px' }}>
        <h4 style={{ fontSize: '1.05rem', color: '#B45309', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Wand2 size={18} /> Suggested Spelling Tweaks for Magnetic Success & Prosperity:
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {suggestions.map((sug, idx) => (
            <div
              key={idx}
              style={{
                background: '#FFFFFF',
                border: '1.5px solid var(--pastel-amber-border)',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#78350F' }}>
                    {sug.variant}
                  </span>
                  <span className="pastel-badge badge-amber" style={{ fontSize: '0.75rem' }}>
                    Root {sug.root}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {lang === 'hi' ? sug.benefitHi : sug.benefitEn}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCustomName(sug.variant)}
                className="btn-secondary"
                style={{ marginTop: '12px', width: '100%', justifyContent: 'center', fontSize: '0.78rem', padding: '6px' }}
              >
                <span>Test This Spelling</span> <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
