import React, { useState, useEffect } from 'react';
import { User, Calendar, Clock, Phone, Home, Sparkles, MapPin, RefreshCw, Trash2 } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function UserInputForm({ formData, setFormData, onCalculate, loading, lang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [mobileError, setMobileError] = useState('');

  // Auto calculate age whenever DOB changes
  useEffect(() => {
    if (formData.dob) {
      const birthYear = new Date(formData.dob).getFullYear();
      const currentYear = new Date().getFullYear();
      if (birthYear && !isNaN(birthYear)) {
        const calculatedAge = Math.max(1, currentYear - birthYear);
        setFormData(prev => ({ ...prev, age: calculatedAge }));
      }
    }
  }, [formData.dob]);

  // Handle Mobile Validation (12 Digits = 2 digit Country Code + 10 digit Mobile)
  const handleMobileChange = (e) => {
    let val = e.target.value.replace(/[^\d+]/g, '');
    const digitsOnly = val.replace(/\D/g, '');
    
    setFormData(prev => ({ ...prev, mobile: val }));

    if (digitsOnly.length > 0 && digitsOnly.length !== 12) {
      setMobileError(`Requires 12 digits (Country Code + 10 Mobile). Current: ${digitsOnly.length} digits.`);
    } else {
      setMobileError('');
    }
  };

  const loadPresetSample = () => {
    setFormData({
      name: "Aarav Sharma",
      dob: "1998-05-15",
      tob: "10:30",
      mobile: "+919876543210",
      houseNo: "108",
      age: 28,
      gender: "male",
      place: "New Delhi, India"
    });
    setMobileError('');
  };

  const clearForm = () => {
    setFormData({
      name: "",
      dob: "",
      tob: "",
      mobile: "",
      houseNo: "",
      age: "",
      gender: "male",
      place: ""
    });
    setMobileError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate();
  };

  return (
    <div className="pastel-card form-card-padding" style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.3rem' }}>📜</span> {t.inputSectionTitle}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Enter your 5+ core parameters. Calculations run purely client-side/in-memory with zero persistent database storage.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={loadPresetSample}
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            <Sparkles size={14} color="#7C3AED" /> Load Sample
          </button>
          <button
            type="button"
            onClick={clearForm}
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            title="Clear all data from browser state"
          >
            <Trash2 size={14} color="#EF4444" /> Clear
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-input-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {/* 1. Full Name */}
          <div>
            <label className="form-label">
              <User size={14} style={{ display: 'inline', marginRight: '4px' }} /> {t.nameLabel} *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Aarav Sharma"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* 2. Date of Birth */}
          <div>
            <label className="form-label">
              <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} /> {t.dobLabel} *
            </label>
            <input
              type="date"
              required
              className="form-input"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            />
          </div>

          {/* 3. Time of Birth (Explicit 12-Hour format with AM/PM toggle) */}
          <div style={{ gridColumn: 'span 1' }}>
            <label className="form-label">
              <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} /> {t.tobLabel} *
            </label>
            <div className="tob-row">
              {/* Hours (1-12) */}
              <select
                className="form-input"
                style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 600, flex: 1 }}
                value={(() => {
                  if (!formData.tob) return '10';
                  const [h] = formData.tob.split(':');
                  const hourNum = parseInt(h, 10);
                  const h12 = hourNum % 12 === 0 ? 12 : hourNum % 12;
                  return String(h12).padStart(2, '0');
                })()}
                onChange={(e) => {
                  const newH12 = parseInt(e.target.value, 10);
                  const currentM = formData.tob ? formData.tob.split(':')[1] || '00' : '00';
                  const currentH = formData.tob ? parseInt(formData.tob.split(':')[0], 10) : 10;
                  const isPM = currentH >= 12;
                  let new24H = isPM ? (newH12 === 12 ? 12 : newH12 + 12) : (newH12 === 12 ? 0 : newH12);
                  setFormData({ ...formData, tob: `${String(new24H).padStart(2, '0')}:${currentM}` });
                }}
              >
                {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(h => (
                  <option key={h} value={h}>{h} Hr</option>
                ))}
              </select>

              <span style={{ fontWeight: 700, color: '#6D28D9' }}>:</span>

              {/* Minutes (00-59) */}
              <select
                className="form-input"
                style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 600, flex: 1 }}
                value={formData.tob ? formData.tob.split(':')[1] || '00' : '00'}
                onChange={(e) => {
                  const newM = e.target.value;
                  const currentH = formData.tob ? formData.tob.split(':')[0] || '10' : '10';
                  setFormData({ ...formData, tob: `${currentH}:${newM}` });
                }}
              >
                {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map(m => (
                  <option key={m} value={m}>{m} Min</option>
                ))}
              </select>

              {/* AM / PM Toggle Buttons */}
              <div className="tob-ampm" style={{ borderRadius: '10px', overflow: 'hidden', border: '1.5px solid #C4B5FD', background: '#F5F3FF' }}>
                <button
                  type="button"
                  onClick={() => {
                    const [h, m] = (formData.tob || '10:00').split(':');
                    let hourNum = parseInt(h, 10);
                    if (hourNum >= 12) hourNum -= 12;
                    setFormData({ ...formData, tob: `${String(hourNum).padStart(2, '0')}:${m || '00'}` });
                  }}
                  style={{
                    padding: '8px 10px',
                    border: 'none',
                    background: (parseInt((formData.tob || '10:00').split(':')[0], 10) < 12) ? 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)' : 'transparent',
                    color: (parseInt((formData.tob || '10:00').split(':')[0], 10) < 12) ? '#FFFFFF' : '#64748B',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  title="AM - Morning / Forenoon"
                >
                  AM ☀️
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const [h, m] = (formData.tob || '10:00').split(':');
                    let hourNum = parseInt(h, 10);
                    if (hourNum < 12) hourNum += 12;
                    setFormData({ ...formData, tob: `${String(hourNum).padStart(2, '0')}:${m || '00'}` });
                  }}
                  style={{
                    padding: '8px 10px',
                    border: 'none',
                    background: (parseInt((formData.tob || '10:00').split(':')[0], 10) >= 12) ? 'linear-gradient(135deg, #EC4899 0%, #BE123C 100%)' : 'transparent',
                    color: (parseInt((formData.tob || '10:00').split(':')[0], 10) >= 12) ? '#FFFFFF' : '#64748B',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  title="PM - Afternoon / Evening / Night"
                >
                  PM 🌙
                </button>
              </div>
            </div>
            {/* Live Visual Time Confirmation */}
            {formData.tob && (
              <div style={{ marginTop: '4px', fontSize: '0.74rem', color: '#6D28D9', fontWeight: 600 }}>
                ⏰ Selected: {(() => {
                  const [h, m] = (formData.tob || '10:00').split(':');
                  const hNum = parseInt(h, 10);
                  const isPM = hNum >= 12;
                  const h12 = hNum % 12 === 0 ? 12 : hNum % 12;
                  return `${String(h12).padStart(2, '0')}:${m || '00'} ${isPM ? 'PM (रात्रिकाल/अपराह्न)' : 'AM (प्रातःकाल/पूर्वाह्न)'} [24h: ${formData.tob}]`;
                })()}
              </div>
            )}
          </div>

          {/* 4. Mobile Number (12 Digits with Country Code) */}
          <div>
            <label className="form-label">
              <Phone size={14} style={{ display: 'inline', marginRight: '4px' }} /> {t.mobileLabel} *
            </label>
            <input
              type="text"
              required
              placeholder="+919876543210 (12 digits)"
              className="form-input"
              value={formData.mobile}
              onChange={handleMobileChange}
              style={{ borderColor: mobileError ? '#FDA4AF' : undefined }}
            />
            {mobileError && (
              <span style={{ fontSize: '0.75rem', color: '#BE123C', marginTop: '3px', display: 'block' }}>
                ⚠️ {mobileError}
              </span>
            )}
          </div>

          {/* 5. House / Flat Number */}
          <div>
            <label className="form-label">
              <Home size={14} style={{ display: 'inline', marginRight: '4px' }} /> {t.houseNoLabel} *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 108 or Flat A-402"
              className="form-input"
              value={formData.houseNo}
              onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
            />
          </div>

          {/* 6. Age */}
          <div>
            <label className="form-label">{t.ageLabel}</label>
            <input
              type="number"
              placeholder="Auto-calculated"
              className="form-input"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>

          {/* 7. Gender */}
          <div>
            <label className="form-label">{t.genderLabel}</label>
            <select
              className="form-input"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            >
              <option value="male">Male (पुरुष)</option>
              <option value="female">Female (महिला)</option>
              <option value="other">Other (अन्य)</option>
            </select>
          </div>

          {/* 8. Birth Place / City */}
          <div>
            <label className="form-label">
              <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} /> {t.placeLabel}
            </label>
            <input
              type="text"
              placeholder="e.g. New Delhi, Mumbai, London"
              className="form-input"
              value={formData.place}
              onChange={(e) => setFormData({ ...formData, place: e.target.value })}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ padding: '12px 28px', fontSize: '0.98rem' }}
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="animate-spin" /> Calculating Cosmic Vibrations...
              </>
            ) : (
              <>
                <Sparkles size={18} /> {t.calculateBtn}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
