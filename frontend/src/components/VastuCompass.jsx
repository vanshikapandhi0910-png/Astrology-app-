import React, { useState } from 'react';
import { Compass, Home, Sparkles, CheckCircle2, AlertTriangle, Shield } from 'lucide-react';

export default function VastuCompass({ vastuData, lang = 'en' }) {
  const [selectedZone, setSelectedZone] = useState(0);

  if (!vastuData || !vastuData.directionalMap) {
    return <div>Calculating Vastu parameters...</div>;
  }

  const activeZone = vastuData.directionalMap[selectedZone];

  return (
    <div style={{ padding: '6px' }}>
      {/* House Number Resonance Banner */}
      <div className="pastel-card" style={{ padding: '18px', marginBottom: '20px', background: 'linear-gradient(135deg, #FEF3C7 0%, #EDE9FE 100%)', border: '1px solid #FCD34D' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              🏠
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: '#78350F' }}>
                House No. '{vastuData.inputHouseNo}' Resonance: Root Number {vastuData.houseNumberRoot}
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#92400E' }}>
                Ruling Energy: <strong>{vastuData.houseRuler}</strong> ({vastuData.element}) | Synergy: <strong>{vastuData.synergyScore}</strong>
              </p>
            </div>
          </div>

          <span className="pastel-badge badge-mint" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
            <Sparkles size={14} /> {vastuData.synergyScoreHi}
          </span>
        </div>
      </div>

      {/* Interactive 8-Direction Compass Wheel & Zone Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Direction Selectors Grid */}
        <div className="pastel-card" style={{ padding: '18px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#4C1D95', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
            🧭 8 Cardinal & Inter-Cardinal Vastu Zones (Click to inspect):
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {vastuData.directionalMap.map((zone, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedZone(idx)}
                style={{
                  padding: '12px 6px',
                  borderRadius: '12px',
                  border: selectedZone === idx ? '2px solid #7C3AED' : '1px solid #E2E8F0',
                  background: selectedZone === idx ? '#EDE9FE' : '#FFFFFF',
                  color: selectedZone === idx ? '#4C1D95' : '#334155',
                  fontWeight: selectedZone === idx ? 700 : 500,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedZone === idx ? '0 4px 12px rgba(124, 58, 237, 0.15)' : 'none'
                }}
              >
                <div>{zone.direction.split(' ')[0]}</div>
                <div style={{ fontSize: '0.68rem', color: selectedZone === idx ? '#6D28D9' : '#64748B', marginTop: '2px' }}>
                  {zone.element.split(' ')[0]}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Zone Analysis Card */}
        {activeZone && (
          <div className="pastel-card" style={{ padding: '20px', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#1E1B4B' }}>
                {activeZone.direction}
              </h3>
              <span className="pastel-badge badge-lavender" style={{ fontSize: '0.75rem' }}>
                Deity: {activeZone.rulingDeity}
              </span>
            </div>

            {/* Ideal for & Avoid */}
            <div style={{ marginBottom: '12px', background: '#F0FDF4', padding: '12px', borderRadius: '10px', border: '1px solid #BBF7D0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: 700, fontSize: '0.8rem', marginBottom: '2px' }}>
                <CheckCircle2 size={15} /> Ideal Placements (श्रेष्ठ उपयोग):
              </div>
              <p style={{ fontSize: '0.82rem', color: '#15803D' }}>{lang === 'hi' ? activeZone.idealForHi : activeZone.idealForEn}</p>
            </div>

            <div style={{ marginBottom: '14px', background: '#FFF1F2', padding: '12px', borderRadius: '10px', border: '1px solid #FECDD3' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9F1239', fontWeight: 700, fontSize: '0.8rem', marginBottom: '2px' }}>
                <AlertTriangle size={15} /> Avoid in this Zone (वर्जित वस्तुएं):
              </div>
              <p style={{ fontSize: '0.82rem', color: '#BE123C' }}>{lang === 'hi' ? activeZone.avoidHi : activeZone.avoidEn}</p>
            </div>

            <div style={{ background: '#FAF5FF', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E9D5FF' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6D28D9' }}>💰 Wealth & Energy Impact:</span>
              <p style={{ fontSize: '0.82rem', color: '#4C1D95', marginTop: '2px' }}>
                {lang === 'hi' ? activeZone.wealthImpactHi : activeZone.wealthImpactEn}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Practical Vastu Remedies List */}
      <div className="pastel-card" style={{ padding: '18px', marginTop: '20px' }}>
        <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', color: '#B45309', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={16} /> Tailored Vastu Remedies for Wealth & Prosperity (गृह शांति एवं धन वृद्धि उपाय):
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          {vastuData.practicalRemedies.map((rem, idx) => (
            <div key={idx} style={{ background: '#FAF7FD', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <strong style={{ fontSize: '0.82rem', color: '#4C1D95', display: 'block', marginBottom: '4px' }}>
                📍 {lang === 'hi' ? rem.itemHi : rem.itemEn}
              </strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {lang === 'hi' ? rem.remedyHi : rem.remedyEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
