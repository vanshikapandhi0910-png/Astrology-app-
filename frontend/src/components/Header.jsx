import React from 'react';
import { Sparkles, ShieldCheck, Globe, Printer, Moon, Sun } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function Header({ lang, setLang, onPrint }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <header className="pastel-card" style={{ padding: '16px 24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        {/* Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #DDD6FE 0%, #FBCFE8 50%, #BAE6FD 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)',
            fontSize: '24px'
          }}>
            🪐
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 className="vedic-font" style={{ fontSize: '1.6rem', fontWeight: 800, background: 'linear-gradient(135deg, #4C1D95 0%, #831843 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                JyotishVeda <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#6D28D9', WebkitTextFillColor: '#6D28D9' }}>ज्योतिषवेद</span>
              </h1>
              <span className="pastel-badge badge-lavender" style={{ fontSize: '0.72rem' }}>
                <Sparkles size={12} /> 13 Vedic Domains
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right Actions: Privacy, Language Selector, Print */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Privacy Guarantee Badge */}
          <div className="pastel-badge badge-mint" title="Zero User Data Stored in Any Database">
            <ShieldCheck size={14} />
            <span>Zero-Storage Privacy</span>
          </div>

          {/* Language Selector */}
          <div style={{
            display: 'flex',
            background: '#F1F5F9',
            padding: '3px',
            borderRadius: '12px',
            border: '1px solid #E2E8F0'
          }}>
            <button
              onClick={() => setLang('en')}
              style={{
                padding: '6px 12px',
                borderRadius: '9px',
                border: 'none',
                background: lang === 'en' ? '#FFFFFF' : 'transparent',
                color: lang === 'en' ? '#4C1D95' : '#64748B',
                fontWeight: lang === 'en' ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: lang === 'en' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              English
            </button>
            <button
              onClick={() => setLang('hi')}
              style={{
                padding: '6px 12px',
                borderRadius: '9px',
                border: 'none',
                background: lang === 'hi' ? '#FFFFFF' : 'transparent',
                color: lang === 'hi' ? '#4C1D95' : '#64748B',
                fontWeight: lang === 'hi' ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: lang === 'hi' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLang('dual')}
              style={{
                padding: '6px 12px',
                borderRadius: '9px',
                border: 'none',
                background: lang === 'dual' ? '#FFFFFF' : 'transparent',
                color: lang === 'dual' ? '#4C1D95' : '#64748B',
                fontWeight: lang === 'dual' ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: lang === 'dual' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              Dual (द्विभाषी)
            </button>
          </div>

          {/* Print Dossier */}
          {onPrint && (
            <button
              onClick={onPrint}
              className="btn-secondary"
              style={{ padding: '7px 14px', fontSize: '0.82rem' }}
              title="Print / Save PDF Dossier"
            >
              <Printer size={15} />
              <span>Dossier</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
