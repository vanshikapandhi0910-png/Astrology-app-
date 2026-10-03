import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Mic, MicOff, Send, Sparkles, Volume2, VolumeX, CheckCircle, HelpCircle, Bot, Gem, Compass, Star } from 'lucide-react';
import { submitAstrologyQuestion } from '../services/api';
import { processQueryClient } from '../utils/clientAstrologer';

export default function AskQuestionModal({ isOpen, setIsOpen, userProfile, chartSummary, lang }) {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results).map(r => r[0].transcript).join('');
        setQuery(transcript);
      };
      recognition.onerror = (e) => { console.warn("Speech recognition error:", e); setIsListening(false); };
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) { alert("Voice input not supported. Please use Chrome/Edge or type your question."); return; }
    if (isListening) recognitionRef.current.stop(); else recognitionRef.current.start();
  };

  const handleAsk = async (questionText = query) => {
    const activeText = questionText || query;
    if (!activeText.trim()) return;
    setLoading(true);
    setResponse(null);

    const clientResponse = processQueryClient(activeText, userProfile, chartSummary);
    const apiResponse = await submitAstrologyQuestion(activeText, userProfile, chartSummary);
    // Use Gemini when configured and successfully parsed; otherwise retain the
    // deterministic chart-aware answer so the feature works offline too.
    const providerResponse = apiResponse?.response;
    setResponse(providerResponse?.source === 'gemini-ai' || providerResponse?.source === 'openai' ? providerResponse : clientResponse);
    setLoading(false);
  };

  const toggleSpeech = (text) => {
    if (!window.speechSynthesis) return;
    if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); }
    else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <>
      {/* Floating "+" Button */}
      <button className="floating-plus-btn" onClick={() => setIsOpen(true)} aria-label="Ask Astrologer Question" title="Ask Astrologer (+)">
        <Plus size={32} />
      </button>

      {/* Floating Tooltip */}
      {!isOpen && (
        <div className="floating-tooltip">
          <span>✨ Ask Oracle (+) / प्रश्न पूछें</span>
        </div>
      )}

      {/* Modal Drawer */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-inner-padding">

              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #DDD6FE 0%, #FBCFE8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                    🔮
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Vedic Oracle & AI Astrologer</h3>
                    <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                      Answers personalized to YOUR Lagna, Nakshatra, Dasha & Mulank · Type or Speak
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', flexShrink: 0 }}>
                  <X size={22} />
                </button>
              </div>

              {/* Quick Query Chips */}
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  {lang === 'hi' ? 'त्वरित प्रश्न (क्लिक करें):' : 'QUICK QUESTIONS (Click to ask):'}
                </span>
                <div className="chip-row">
                  {[
                    { label: "📚 Study Field",         text: lang === 'hi' ? "मेरा अध्ययन क्षेत्र कौन सा है?" : "What is my ideal study field?" },
                    { label: "💼 Career & Growth",     text: lang === 'hi' ? "मेरा करियर और प्रमोशन कब होगा?" : "Mera career aur promotion kab grow hoga?" },
                    { label: "💍 Marriage & Love",     text: lang === 'hi' ? "मेरी शादी के योग कब हैं?" : "Meri shadi aur relationship ke yoga kab hain?" },
                    { label: "💰 Wealth Inflow",       text: lang === 'hi' ? "मेरे जीवन में धन-लाभ कब होगा?" : "Dhan labh aur financial growth kab aayegi?" },
                    { label: "🏡 Vastu + Feng Shui",   text: lang === 'hi' ? "मेरे घर में वास्तु और फेंग शुई के उपाय क्या हैं?" : "Mere ghar me Vastu aur Feng Shui remedies kya hain?" },
                    { label: "💎 Lucky Gemstone",      text: lang === 'hi' ? "मेरा शुभ रत्न कौन सा है?" : "Mera lucky ratna (gemstone) kaunsa hai?" },
                    { label: "🩺 Health Advice",       text: lang === 'hi' ? "स्वास्थ्य समस्या के लिए ज्योतिष उपाय बताएं?" : "Health me problem aa rahi hai, astro remedies batayein?" },
                    { label: "☯️ Feng Shui Tips",      text: lang === 'hi' ? "मेरा फेंग शुई कुआ नंबर और उपाय क्या हैं?" : "Mera Feng Shui Kua number kya hai aur remedies kya hain?" },
                    { label: "📱 Mobile Vibration",    text: lang === 'hi' ? "क्या मेरा मोबाइल नंबर व्यवसाय के लिए शुभ है?" : "Kya mera mobile number business ke liye lucky hai?" },
                    { label: "✈️ Foreign Travel",      text: lang === 'hi' ? "मेरे विदेश यात्रा के योग कब हैं?" : "Mere chart mein foreign travel ke yoga kab hain?" },
                    { label: "🎯 General Destiny",     text: lang === 'hi' ? "मेरे जीवन का सामान्य भविष्य क्या है?" : "What does my overall chart say about my destiny?" }
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setQuery(chip.text); handleAsk(chip.text); }}
                      style={{ padding: '5px 11px', borderRadius: '16px', border: '1px solid var(--pastel-lavender-border)', background: '#FAF5FF', color: '#4C1D95', fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Form */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                  <textarea
                    className="form-input"
                    rows={2}
                    placeholder={lang === 'hi'
                      ? "यहाँ अपना प्रश्न लिखें — हिन्दी, हिंग्लिश या अंग्रेजी में। जैसे: मेरी शादी कब होगी? मेरा lucky रत्न क्या है? Mera career kab grow hoga?"
                      : "Ask anything — Hindi, Hinglish or English. e.g. Mera career kab grow hoga? What is my Kua number? My lucky gemstone? When will I get married?"}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk(); } }}
                    style={{ paddingRight: '45px', resize: 'none', fontFamily: 'inherit', lineHeight: 1.5 }}
                  />
                  <button
                    type="button"
                    onClick={toggleVoice}
                    style={{ position: 'absolute', right: '8px', top: '10px', background: isListening ? '#EF4444' : '#EDE9FE', color: isListening ? '#FFFFFF' : '#6D28D9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                    title={isListening ? "Listening... Click to stop" : "Speak in any language"}
                  >
                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                </div>
                <button type="button" className="btn-primary" onClick={() => handleAsk()} disabled={loading || !query.trim()} style={{ padding: '0 18px', whiteSpace: 'nowrap', flexShrink: 0, alignSelf: 'flex-end', height: '42px' }}>
                  {loading ? <Sparkles size={16} className="animate-spin" /> : <Send size={16} />}
                  <span>{lang === 'hi' ? 'पूछें' : 'Ask'}</span>
                </button>
              </div>

              {/* Listening Status */}
              {isListening && (
                <div className="pastel-badge badge-rose" style={{ width: '100%', justifyContent: 'center', marginBottom: '14px', padding: '6px' }}>
                  <Mic size={14} className="animate-pulse" />
                  <span>Listening... Speak freely in Hindi, Hinglish, or English</span>
                </div>
              )}

              {/* ─── Oracle Response Display ─── */}
              {response && (
                <div style={{ background: '#FAF7FD', borderRadius: '16px', border: '1.5px solid var(--pastel-lavender-border)', padding: '20px', animation: 'fadeIn 0.3s ease' }}>

                  {/* Header: Domain + Audio */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <span className="pastel-badge badge-lavender" style={{ fontSize: '0.78rem' }}>
                      <Bot size={13} /> {response.domainNameEn}
                    </span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {(response.source === 'gemini-ai' || response.source === 'openai') && (
                        <span className="pastel-badge badge-mint" style={{ fontSize: '0.7rem' }}>
                          <Star size={11} /> {response.source === 'gemini-ai' ? 'Gemini AI' : 'OpenAI'}
                        </span>
                      )}
                      <button onClick={() => toggleSpeech(response.answerHinglish || response.answerEn)} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                        {isSpeaking ? <VolumeX size={14} color="#EF4444" /> : <Volume2 size={14} color="#7C3AED" />}
                        <span>{isSpeaking ? "Stop Voice" : "Listen"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Confidence Badge */}
                  {response.confidence && (
                    <div style={{ marginBottom: '10px' }}>
                      <span className="pastel-badge badge-mint" style={{ fontSize: '0.72rem' }}>
                        ✅ {response.confidence}
                      </span>
                    </div>
                  )}

                  {/* 1. Hinglish Answer */}
                  {response.answerHinglish && (
                    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        🌟 Hinglish Guidance (मार्गदर्शन):
                      </span>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.65 }}>
                        {response.answerHinglish}
                      </p>
                    </div>
                  )}

                  {/* 2. English Analysis */}
                  {(lang === 'en' || lang === 'dual') && response.answerEn && (
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>English Analysis:</span>
                      <p style={{ fontSize: '0.87rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.6 }}>{response.answerEn}</p>
                    </div>
                  )}

                  {/* 3. Hindi Analysis */}
                  {(lang === 'hi' || lang === 'dual') && response.answerHi && (
                    <div style={{ marginBottom: '14px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>हिन्दी विश्लेषण:</span>
                      <p style={{ fontSize: '0.87rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.6 }}>{response.answerHi}</p>
                    </div>
                  )}

                  {/* 4. Astrological Logic */}
                  <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '12px 16px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: 700, fontSize: '0.82rem', marginBottom: '4px' }}>
                      <HelpCircle size={14} />
                      <span>Astrological Logic (गणितीय व ज्योतिषीय तर्क):</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#15803D', lineHeight: 1.5 }}>
                      {lang === 'hi' ? response.astrologicalLogicHi : response.astrologicalLogicEn}
                    </p>
                  </div>

                  {/* 5. 💎 Gem Recommendation Panel */}
                  {response.gemRecommendation && (
                    <div style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FAF5FF 100%)', border: '1px solid #FDE68A', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#92400E', fontWeight: 700, fontSize: '0.82rem', marginBottom: '10px' }}>
                        💎 <span>Gemstone (Ratna) Recommendation — Personalized for Your Chart:</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px' }}>
                        {[
                          { label: 'Lagna Lord Gem', data: response.gemRecommendation.primary, icon: '⭐' },
                          { label: 'Active Dasha Gem', data: response.gemRecommendation.dasha, icon: '🔮' },
                          { label: 'Mulank Gem', data: response.gemRecommendation.mulank, icon: '🔢' }
                        ].map(({ label, data, icon }) => data && (
                          <div key={label} style={{ background: '#FFFFFF', borderRadius: '8px', padding: '8px 10px', border: `1px solid ${data.color || '#E9D5FF'}30` }}>
                            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#92400E', marginBottom: '2px' }}>{icon} {label}</div>
                            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: data.color || '#7C3AED', marginBottom: '1px' }}>{data.gem}</div>
                            <div style={{ fontSize: '0.65rem', color: '#64748B' }}>{data.metal} · {data.finger}</div>
                            <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>Wear on {data.day}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 6. ☯️ Feng Shui Panel */}
                  {response.fengShui && (
                    <div style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #EFF6FF 100%)', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#065F46', fontWeight: 700, fontSize: '0.82rem', marginBottom: '8px' }}>
                        ☯️ <span>Feng Shui Kua {response.fengShui.kua} ({response.fengShui.emoji || ''} {response.fengShui.element}):</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        <span className="pastel-badge badge-mint" style={{ fontSize: '0.7rem' }}>Group: {response.fengShui.group}</span>
                        {(response.fengShui.luckyDirections || []).map((d, i) => (
                          <span key={i} className="pastel-badge badge-sky" style={{ fontSize: '0.7rem' }}>{d}</span>
                        ))}
                        <span className="pastel-badge badge-lavender" style={{ fontSize: '0.7rem' }}>🎨 {response.fengShui.color}</span>
                      </div>
                    </div>
                  )}

                  {/* 7. Vedic Remedies */}
                  {response.practicalRemedies && (
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#B45309', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <CheckCircle size={14} /> Remedial Action Plan (सरल वैदिक उपाय):
                      </span>
                      <ul style={{ paddingLeft: '20px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {(lang === 'hi' ? (response.practicalRemediesHi || response.practicalRemedies) : response.practicalRemedies)
                          .filter(r => r && r.trim())
                          .map((rem, i) => (
                            <li key={i} style={{ marginBottom: '5px', lineHeight: 1.5 }}>{rem}</li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
