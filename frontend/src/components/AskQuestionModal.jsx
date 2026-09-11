import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Mic, MicOff, Send, Sparkles, Volume2, VolumeX, CheckCircle, HelpCircle, Bot } from 'lucide-react';
import { submitAstrologyQuestion } from '../services/api';

export default function AskQuestionModal({ isOpen, setIsOpen, userProfile, chartData, lang }) {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);

  // Quick Query Chips in Hinglish
  const quickChips = [
    { label: "💼 Career & Growth", text: "Mera career aur promotion kab grow hoga?" },
    { label: "💍 Marriage & Love", text: "Meri shadi aur relationship ke yoga kab hain?" },
    { label: "💰 Wealth Inflow", text: "Dhan labh aur financial growth kab aayegi?" },
    { label: "🏡 Vastu Remedies", text: "Mere ghar me Vastu balance aur money remedies kya hain?" },
    { label: "🩺 Health Advice", text: "Health me problem aa rahi hai, astro remedies batayein?" },
    { label: "📱 Mobile Lucky Vibration", text: "Kya mera mobile number business ke liye lucky hai?" }
  ];

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN'; // Supports Hindi, Hinglish, & English natural voice

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(r => r[0].transcript)
          .join('');
        setQuery(transcript);
      };
      recognition.onerror = (e) => {
        console.warn("Speech recognition error:", e);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. Please use Chrome/Edge or type your question.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleAsk = async (questionText = query) => {
    const activeText = questionText || query;
    if (!activeText.trim()) return;

    setLoading(true);
    setResponse(null);

    // Call API / Engine
    const res = await submitAstrologyQuestion(activeText, userProfile, chartData);
    if (res && res.response) {
      setResponse(res.response);
    } else {
      // Local fallback interpretation
      setResponse({
        queryReceived: activeText,
        detectedDomain: "career",
        domainNameEn: "General & Career Prediction",
        domainNameHi: "सामान्य एवं कर्म फलादेश",
        answerHinglish: `Namaste ${userProfile.name || "Seeker"} ji! Aapka query receive hua hai. Aapki Kundali aur Mulank ke mutabiq agle 3-4 months me positive yog ban rahe hain.`,
        answerEn: `Greetings! Your natal planetary aspects indicate favorable progress. Alignment of your 10th and 11th houses promises steady growth.`,
        answerHi: `सादर प्रणाम! आपकी कुंडली के शुभ भावों में ग्रहों का संचार सकारात्मक परिवर्तन और प्रगति का संकेत दे रहा है।`,
        astrologicalLogicEn: `Astrological Reasoning: Ascendant and Prashna Horary indicators show benefic Jupiter gaze, assuring resolution.`,
        astrologicalLogicHi: `ज्योतिषीय कारण (तर्क): प्रश्न लग्न में गुरु व चंद्र की शुभ दृष्टि मनोवांछित फल प्राप्ति में सहायक है।`,
        practicalRemedies: [
          "Offer water to the Sun every morning.",
          "Chant Gayatri Mantra 9 times daily.",
          "Keep North direction clean for financial flow."
        ],
        practicalRemediesHi: [
          "प्रातःकाल सूर्य देव को अर्घ्य दें।",
          "प्रतिदिन 9 बार गायत्री मंत्र का जप करें।",
          "उत्तर दिशा को स्वच्छ व प्रकाशित रखें।"
        ]
      });
    }
    setLoading(false);
  };

  // Text to Speech
  const toggleSpeech = (text) => {
    if (!window.speechSynthesis) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
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
      <button
        className="floating-plus-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Ask Astrologer Question"
        title="Ask Astrologer (+)"
      >
        <Plus size={32} />
      </button>

      {/* Floating Tooltip Helper */}
      {!isOpen && (
        <div className="floating-tooltip">
          <span>✨ Ask Oracle (+) / प्रश्न पूछें</span>
        </div>
      )}

      {/* Modal Drawer */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: '24px' }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #DDD6FE 0%, #FBCFE8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  🔮
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                    Vedic Oracle & Hinglish Astrologer
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Ask anything in Hinglish, Hindi, or English. Type or use Voice!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Quick Query Chips */}
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                SUGGESTED HINGLISH QUESTIONS:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {quickChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(chip.text);
                      handleAsk(chip.text);
                    }}
                    style={{
                      padding: '5px 11px',
                      borderRadius: '16px',
                      border: '1px solid var(--pastel-lavender-border)',
                      background: '#FAF5FF',
                      color: '#4C1D95',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form with Voice Button */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Mera career kab grow hoga? / When will I buy a house?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAsk();
                  }}
                  style={{ paddingRight: '45px' }}
                />
                <button
                  type="button"
                  onClick={toggleVoice}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: isListening ? '#EF4444' : '#EDE9FE',
                    color: isListening ? '#FFFFFF' : '#6D28D9',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  title={isListening ? "Listening... Click to stop" : "Speak your question in any language/accent"}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={() => handleAsk()}
                disabled={loading || !query.trim()}
                style={{ padding: '0 18px', whiteSpace: 'nowrap' }}
              >
                {loading ? <Sparkles size={16} className="animate-spin" /> : <Send size={16} />}
                <span>Ask</span>
              </button>
            </div>

            {/* Voice Status indicator */}
            {isListening && (
              <div className="pastel-badge badge-rose" style={{ width: '100%', justifyContent: 'center', marginBottom: '14px', padding: '6px' }}>
                <Mic size={14} className="animate-pulse" />
                <span>Listening to your voice in real-time... Speak freely in Hindi, Hinglish, or English</span>
              </div>
            )}

            {/* Astrological Answer Display */}
            {response && (
              <div style={{
                background: '#FAF7FD',
                borderRadius: '16px',
                border: '1.5px solid var(--pastel-lavender-border)',
                padding: '20px',
                animation: 'fadeIn 0.3s ease'
              }}>
                {/* Domain & Audio Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <span className="pastel-badge badge-lavender" style={{ fontSize: '0.8rem' }}>
                    <Bot size={13} /> {response.domainNameEn}
                  </span>

                  <button
                    onClick={() => toggleSpeech(response.answerHinglish || response.answerEn)}
                    className="btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    title="Read Aloud"
                  >
                    {isSpeaking ? <VolumeX size={14} color="#EF4444" /> : <Volume2 size={14} color="#7C3AED" />}
                    <span>{isSpeaking ? "Stop Voice" : "Listen (बोलकर सुनें)"}</span>
                  </button>
                </div>

                {/* 1. Hinglish Conversational Response */}
                {response.answerHinglish && (
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '14px',
                    marginBottom: '14px'
                  }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      🌟 Hinglish Guidance (मार्गदर्शन):
                    </span>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                      {response.answerHinglish}
                    </p>
                  </div>
                )}

                {/* 2. Dual Language Detailed Sections */}
                {(lang === 'en' || lang === 'dual') && (
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                      English Analysis:
                    </span>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {response.answerEn}
                    </p>
                  </div>
                )}

                {(lang === 'hi' || lang === 'dual') && (
                  <div style={{ marginBottom: '14px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                      हिन्दी विश्लेषण:
                    </span>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {response.answerHi}
                    </p>
                  </div>
                )}

                {/* 3. Astrological Logic (Kyun & Kaise) */}
                <div style={{
                  background: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: 700, fontSize: '0.82rem', marginBottom: '4px' }}>
                    <HelpCircle size={14} />
                    <span>Astrological Logic & Reason (गणितीय व ज्योतिषीय तर्क):</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#15803D', lineHeight: 1.5 }}>
                    {lang === 'hi' ? response.astrologicalLogicHi : response.astrologicalLogicEn}
                  </p>
                </div>

                {/* 4. Actionable Vedic Remedies */}
                {response.practicalRemedies && (
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#B45309', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <CheckCircle size={14} /> Remedial Action Plan (सरल वैदिक उपाय):
                    </span>
                    <ul style={{ paddingLeft: '20px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {(lang === 'hi' ? (response.practicalRemediesHi || response.practicalRemedies) : response.practicalRemedies).map((rem, i) => (
                        <li key={i} style={{ marginBottom: '4px' }}>{rem}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
