import React, { useState } from 'react';
import { Heart, Users, CheckCircle, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import { fetchCompatibilityReport } from '../services/api';
import { calculateCompatibility } from '../utils/clientAlgorithms';

export default function CompatibilityTab({ primaryUser, lang = 'en' }) {
  const [partner, setPartner] = useState({
    name: "Priya Patel",
    dob: "1999-08-22",
    tob: "14:15",
    gender: "female"
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(() => calculateCompatibility(primaryUser, partner));

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetchCompatibilityReport(primaryUser, partner);
    if (res && res.result) {
      setResult(res.result);
    } else {
      setResult(calculateCompatibility(primaryUser, partner));
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '6px' }}>
      {/* Partner Input Form */}
      <div className="pastel-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#1E1B4B', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Heart size={20} color="#EC4899" /> Ashtakoot 36-Guna Milan & Kundali Compatibility
        </h3>

        <form onSubmit={handleCalculate}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div>
              <label className="form-label">Partner's Name</label>
              <input
                type="text"
                required
                className="form-input"
                value={partner.name}
                onChange={(e) => setPartner({ ...partner, name: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Partner's Date of Birth</label>
              <input
                type="date"
                required
                className="form-input"
                value={partner.dob}
                onChange={(e) => setPartner({ ...partner, dob: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Partner's Time of Birth</label>
              <input
                type="time"
                required
                className="form-input"
                value={partner.tob}
                onChange={(e) => setPartner({ ...partner, tob: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', height: '44px', justifyContent: 'center' }}
              >
                {loading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                <span>Calculate 36 Gunas</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Result Display */}
      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {/* Score & Verdict Card */}
          <div className="pastel-card" style={{ padding: '24px', textAlign: 'center', background: '#FFFFFF' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span className="pastel-badge badge-rose" style={{ fontSize: '0.85rem' }}>
                <Users size={14} /> {result.person1.name} + {result.person2.name}
              </span>
            </div>

            {/* Score Ring / Bar */}
            <div style={{ margin: '16px 0' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: '#BE123C', lineHeight: 1 }}>
                {result.obtainedScore} <span style={{ fontSize: '1.5rem', color: '#94A3B8' }}>/ 36</span>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Compatibility Harmony: {result.percentage}%
              </span>

              {/* Visual Progress Bar */}
              <div style={{ width: '100%', height: '10px', background: '#F1F5F9', borderRadius: '5px', overflow: 'hidden', marginTop: '10px' }}>
                <div style={{
                  width: `${result.percentage}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #F43F5E 0%, #10B981 100%)',
                  borderRadius: '5px',
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>

            {/* Verdict */}
            <div style={{ background: '#FFF1F2', padding: '12px', borderRadius: '12px', border: '1px solid #FECDD3', marginTop: '16px' }}>
              <strong style={{ fontSize: '0.92rem', color: '#9F1239', display: 'block' }}>
                {lang === 'hi' ? result.verdictHi : result.verdictEn}
              </strong>
            </div>

            {/* Manglik Status */}
            <div style={{ background: '#FAF5FF', padding: '12px', borderRadius: '12px', border: '1px solid #E9D5FF', marginTop: '12px', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#6D28D9', marginBottom: '4px' }}>
                <Sparkles size={14} /> Manglik Dosha Analysis:
              </div>
              <p style={{ fontSize: '0.8rem', color: '#4C1D95' }}>
                {lang === 'hi' ? result.manglikStatusHi : result.manglikStatusEn}
              </p>
            </div>
          </div>

          {/* 8 Kootas Detailed Table */}
          <div className="pastel-card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', color: '#1E1B4B' }}>
              Ashtakoota 8-Dimension Breakdown:
            </h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                    <th style={{ padding: '6px 4px' }}>Koota Dimension</th>
                    <th style={{ padding: '6px 4px' }}>Max</th>
                    <th style={{ padding: '6px 4px' }}>Score</th>
                    <th style={{ padding: '6px 4px' }}>Significance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.kootaBreakdown.map((k, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '8px 4px', fontWeight: 600, color: '#1E1B4B' }}>
                        {lang === 'hi' ? k.nameHi : k.nameEn}
                      </td>
                      <td style={{ padding: '8px 4px', color: '#64748B' }}>{k.max}</td>
                      <td style={{ padding: '8px 4px', fontWeight: 700, color: k.obtained === k.max ? '#059669' : '#D97706' }}>
                        {k.obtained}
                      </td>
                      <td style={{ padding: '8px 4px', color: '#475569', fontSize: '0.78rem' }}>
                        {lang === 'hi' ? k.descHi : k.descEn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
