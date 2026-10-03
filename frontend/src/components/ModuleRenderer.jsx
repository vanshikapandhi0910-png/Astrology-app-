import React from 'react';
import { HelpCircle, Sparkles, AlertCircle, Award, CheckCircle2, ShieldCheck, Sun, Moon, Compass, Heart, Star } from 'lucide-react';
import KundaliChart from './KundaliChart';
import VastuCompass from './VastuCompass';
import CompatibilityTab from './CompatibilityTab';
import NameOptimizer from './NameOptimizer';

export default function ModuleRenderer({ activeTab, reportData, primaryUser, lang = 'en' }) {
  if (!reportData || !reportData.modules) {
    return (
      <div className="pastel-card" style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>
          Please enter your birth and habitat coordinates above and click <strong>"Generate Cosmic Dossier"</strong>.
        </p>
      </div>
    );
  }

  const mod = reportData.modules[activeTab] || reportData.modules[1];
  const d = mod?.data;

  // Render logic box
  const renderLogicBox = (logicEn, logicHi) => (
    <div style={{
      background: 'linear-gradient(135deg, #F0FDF4 0%, #FAF5FF 100%)',
      border: '1px solid #BBF7D0',
      borderRadius: '14px',
      padding: '16px 20px',
      marginTop: '20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 700, fontSize: '0.88rem', marginBottom: '6px' }}>
        <HelpCircle size={17} />
        <span>Astrological & Mathematical Logic (गणना का गणितीय व ज्योतिषीय आधार):</span>
      </div>
      {(lang === 'en' || lang === 'dual') && (
        <p style={{ fontSize: '0.84rem', color: '#15803D', lineHeight: 1.6, marginBottom: lang === 'dual' ? '8px' : '0' }}>
          <strong>English Logic:</strong> {logicEn}
        </p>
      )}
      {(lang === 'hi' || lang === 'dual') && (
        <p style={{ fontSize: '0.84rem', color: '#15803D', lineHeight: 1.6 }}>
          <strong>हिन्दी तर्क:</strong> {logicHi}
        </p>
      )}
    </div>
  );

  return (
    <div className="pastel-card" style={{ padding: '24px' }}>
      {/* Module Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #F1F5F9', paddingBottom: '14px', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', color: '#1E1B4B' }}>
            {lang === 'hi' ? mod.titleHi : mod.titleEn}
          </h2>
          {lang === 'dual' && (
            <span style={{ fontSize: '0.9rem', color: '#6D28D9', fontWeight: 600 }}>
              {mod.titleHi}
            </span>
          )}
        </div>
        <span className="pastel-badge badge-lavender">
          Module #{activeTab} of 13
        </span>
      </div>

      {/* 1. Mobile Numerology */}
      {activeTab === 1 && d && (
        <div>
          {!primaryUser?.mobile ? (
            <div style={{ background: '#FAF5FF', border: '1.5px dashed #C4B5FD', borderRadius: '16px', padding: '24px', textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📱</div>
              <h3 style={{ fontSize: '1.1rem', color: '#4C1D95', marginBottom: '6px' }}>
                {lang === 'hi' ? 'मोबाइल नंबर दर्ज नहीं किया गया है' : 'Mobile Number Not Provided'}
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 14px' }}>
                {lang === 'hi' 
                  ? '12-अंकीय मोबाइल अंकशास्त्र एवं व्यावसायिक ऊर्जा विश्लेषण के लिए ऊपर फॉर्म में अपना 10 या 12 अंकों का मोबाइल नंबर दर्ज करें।' 
                  : 'Enter your 10 or 12 digit mobile number in the form above to unlock your personalized Mobile Numerology & Business Energy Matrix.'}
              </p>
              <span className="pastel-badge badge-lavender" style={{ fontSize: '0.78rem' }}>
                {lang === 'hi' ? 'केवल नाम और जन्मतिथि अनिवार्य है — मोबाइल नंबर ऐच्छिक है' : 'Only Name & Date of Birth are required — Mobile number is optional'}
              </span>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div className="pastel-card" style={{ padding: '16px', background: '#FFFFFF' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>12-Digit Mobile Number</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E1B4B', marginTop: '4px' }}>{d.inputNumber}</div>
                  <span className="pastel-badge badge-sky" style={{ marginTop: '8px', fontSize: '0.72rem' }}>{d.countryCodeDetected} Country Code</span>
                </div>

                <div className="pastel-card" style={{ padding: '16px', background: '#FFFFFF' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Compound Sum & Root</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#7C3AED', marginTop: '2px' }}>
                    {d.compoundSum} <span style={{ fontSize: '1rem', color: '#94A3B8' }}>&rarr;</span> {d.singleDigit}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#5B21B6', fontWeight: 600 }}>Ruler: {d.planetaryRuler}</span>
                </div>

                <div className="pastel-card" style={{ padding: '16px', background: '#FFFFFF' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Last 4-Digits Energy</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#BE123C', marginTop: '2px' }}>
                    {d.last4Digits} <span style={{ fontSize: '0.9rem', color: '#94A3B8' }}>&rarr; {d.last4Root}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#9F1239' }}>Crucial conversion anchor</span>
                </div>
              </div>

              <div style={{ background: '#FAF5FF', padding: '16px', borderRadius: '12px', border: '1px solid #E9D5FF', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.95rem', color: '#5B21B6', marginBottom: '6px' }}>Business & Wealth Resonance:</h4>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {lang === 'hi' ? d.suitability?.suitabilityHi : d.suitability?.suitabilityEn}
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="pastel-badge badge-mint">{d.suitability?.businessScore}</span>
                  <span className="pastel-badge badge-amber">{d.suitability?.personalScore}</span>
                </div>
              </div>

              {renderLogicBox(d.logicExplanationEn, d.logicExplanationHi)}
            </>
          )}
        </div>
      )}

      {/* 2. DOB Numerology (Mulank, Bhagyank, Kua, Lo Shu Grid) */}
      {activeTab === 2 && d && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div className="pastel-card" style={{ padding: '16px', textAlign: 'center', background: '#FFFFFF' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Mulank (मूलांक / Psychic)</span>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#7C3AED' }}>{d.mulank}</div>
              <span className="pastel-badge badge-lavender" style={{ fontSize: '0.75rem' }}>{d.mulankLord}</span>
            </div>

            <div className="pastel-card" style={{ padding: '16px', textAlign: 'center', background: '#FFFFFF' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Bhagyank (भाग्यांक / Destiny)</span>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#BE123C' }}>{d.bhagyank}</div>
              <span className="pastel-badge badge-rose" style={{ fontSize: '0.75rem' }}>{d.bhagyankLord}</span>
            </div>

            <div className="pastel-card" style={{ padding: '16px', textAlign: 'center', background: '#FFFFFF' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Kua Number (कुआ अंक)</span>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#047857' }}>{d.kuaNumber}</div>
              <span className="pastel-badge badge-mint" style={{ fontSize: '0.75rem' }}>Feng-Shui Power</span>
            </div>

            <div className="pastel-card" style={{ padding: '16px', textAlign: 'center', background: '#FFFFFF' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Personal Year {new Date().getFullYear()}</span>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#B45309' }}>{d.personalYear}</div>
              <span className="pastel-badge badge-amber" style={{ fontSize: '0.75rem' }}>Current Cycle</span>
            </div>
          </div>

          {/* Lo Shu Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'start' }}>
            <div className="pastel-card" style={{ padding: '20px', textAlign: 'center' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', color: '#4C1D95' }}>
                {lang === 'hi' ? '3×3 लो-शू ऊर्जा ग्रिड:' : '3×3 Lo Shu Energy Grid:'}
              </h4>
              <div className="loshu-grid">
                {[4, 9, 2, 3, 5, 7, 8, 1, 6].map((num) => {
                  const count = d.loShuGrid ? d.loShuGrid[num] : 0;
                  return (
                    <div key={num} className={`loshu-cell ${count === 0 ? 'empty' : ''}`}>
                      <span>{num}</span>
                      <span style={{ fontSize: '0.65rem', fontWeight: 500, color: count > 0 ? '#6D28D9' : '#94A3B8' }}>
                        {count > 0 ? `${count}x` : '—'}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '8px' }}>
                {lang === 'hi' ? '— खाली संख्याएं = कमजोर ऊर्जा क्षेत्र' : '— Empty cells = areas needing remedy'}
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', color: '#1E1B4B', marginBottom: '8px' }}>
                {lang === 'hi' ? 'जीवन व्याख्या:' : 'Life Interpretations:'}
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {lang === 'hi' ? d.analysisHi?.mulankText : d.analysisEn?.mulankText}
              </p>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {lang === 'hi' ? d.analysisHi?.bhagyankText : d.analysisEn?.bhagyankText}
              </p>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                {lang === 'hi' ? d.analysisHi?.personalYearText : d.analysisEn?.personalYearText}
              </p>
            </div>
          </div>

          {/* Lo Shu Empty Cell Remedies */}
          {d.loShuGrid && (() => {
            const LOSHU_REMEDIES = {
              1: { planet: 'Sun', planetHi: 'सूर्य', domainEn: 'Confidence & Leadership', domainHi: 'आत्मविश्वास व नेतृत्व', remedyEn: 'Offer water to Sun at sunrise daily. Wear Ruby (Manikya) in gold on Sunday. Chant "Om Suryaya Namah" 12x every morning.', remedyHi: 'प्रतिदिन सूर्योदय पर सूर्य को जल अर्पित करें। रविवार को सोने में माणिक्य धारण करें। प्रातः "ॐ सूर्याय नमः" का 12 बार जप करें।', color: '#DC2626', emoji: '☀️' },
              2: { planet: 'Moon', planetHi: 'चंद्र', domainEn: 'Intuition & Relationships', domainHi: 'अंतर्ज्ञान व संबंध', remedyEn: 'Wear Pearl or white Moonstone on Monday. Drink milk at night. Place silver bowl of water in North-East corner.', remedyHi: 'सोमवार को मोती या मूनस्टोन धारण करें। रात को दूध पिएं। ईशान कोण में चांदी के पात्र में जल रखें।', color: '#0369A1', emoji: '🌙' },
              3: { planet: 'Jupiter', planetHi: 'बृहस्पति', domainEn: 'Wisdom & Growth', domainHi: 'ज्ञान व विकास', remedyEn: 'Wear Yellow Sapphire (Pukhraj) in gold on Thursday. Feed Brahmins on Thursdays. Read Vishnu Sahasranam daily.', remedyHi: 'गुरुवार को सोने में पुखराज धारण करें। गुरुवार को ब्राह्मण को भोजन दें। प्रतिदिन विष्णु सहस्रनाम पढ़ें।', color: '#B45309', emoji: '📚' },
              4: { planet: 'Rahu', planetHi: 'राहु', domainEn: 'Stability & Planning', domainHi: 'स्थिरता व योजना', remedyEn: 'Wear Hessonite Garnet (Gomed) after expert consultation. Donate blue items on Saturdays. Practice daily 10-min meditation.', remedyHi: 'विशेषज्ञ के परामर्श से गोमेद धारण करें। शनिवार को नीले वस्त्र दान करें। प्रतिदिन 10 मिनट ध्यान करें।', color: '#475569', emoji: '🌐' },
              5: { planet: 'Mercury', planetHi: 'बुध', domainEn: 'Communication & Balance', domainHi: 'संवाद व संतुलन', remedyEn: 'Wear Emerald (Panna) in gold on Wednesday. Chant "Om Budhaya Namah" 108x on Wednesdays. Keep green plants at home.', remedyHi: 'बुधवार को सोने में पन्ना धारण करें। "ॐ बुधाय नमः" का बुधवार को 108 बार जप करें। घर में हरे पौधे रखें।', color: '#059669', emoji: '💬' },
              6: { planet: 'Venus', planetHi: 'शुक्र', domainEn: 'Love & Prosperity', domainHi: 'प्रेम व समृद्धि', remedyEn: 'Wear Diamond or Opal (Heera/Opal) on Friday. Offer white flowers to Goddess Lakshmi. Use rose quartz crystals in bedroom.', remedyHi: 'शुक्रवार को हीरा या ओपल धारण करें। माता लक्ष्मी को सफेद फूल अर्पित करें। शयनकक्ष में गुलाब स्फटिक रखें।', color: '#7C3AED', emoji: '💎' },
              7: { planet: 'Ketu', planetHi: 'केतु', domainEn: 'Spirituality & Intuition', domainHi: 'अध्यात्म व अंतर्ज्ञान', remedyEn: "Wear Cat's Eye (Lahsunia) after expert consultation. Practice Yoga and meditation. Visit Shiva temples on Thursdays.", remedyHi: 'विशेषज्ञ परामर्श से लहसुनिया धारण करें। प्रतिदिन योग और ध्यान करें। गुरुवार को शिव मंदिर जाएं।', color: '#6D28D9', emoji: '🧘' },
              8: { planet: 'Saturn', planetHi: 'शनि', domainEn: 'Karma & Discipline', domainHi: 'कर्म व अनुशासन', remedyEn: 'Wear Blue Sapphire (Neelam) after expert consultation. Feed crows and dogs on Saturdays. Donate sesame/oil on Saturdays.', remedyHi: 'विशेषज्ञ परामर्श के बाद नीलम धारण करें। शनिवार को कौवों और कुत्तों को खाना दें। शनिवार को तिल/तेल का दान करें।', color: '#1D4ED8', emoji: '⚖️' },
              9: { planet: 'Mars', planetHi: 'मंगल', domainEn: 'Energy & Courage', domainHi: 'ऊर्जा व साहस', remedyEn: 'Wear Red Coral (Moonga) in copper/gold on Tuesday. Chant "Om Mangalaya Namah" 108x. Offer red flowers to Hanuman ji.', remedyHi: 'मंगलवार को तांबे/सोने में मूंगा धारण करें। "ॐ मंगलाय नमः" का 108 बार जप करें। हनुमान जी को लाल फूल अर्पित करें।', color: '#B91C1C', emoji: '🔥' }
            };
            const emptyCells = [1,2,3,4,5,6,7,8,9].filter(n => !(d.loShuGrid[n] > 0));
            if (emptyCells.length === 0) return (
              <div style={{ marginTop: '16px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>✅</span>
                <span style={{ fontSize: '0.84rem', color: '#166534', fontWeight: 600 }}>
                  {lang === 'hi' ? 'सभी 9 संख्याएं लो-शू ग्रिड में उपस्थित हैं — आपकी ऊर्जा पूर्ण और संतुलित है!' : 'All 9 numbers present in your Lo Shu Grid — your energy matrix is complete and well-balanced!'}
                </span>
              </div>
            );
            return (
              <div style={{ marginTop: '20px', background: 'linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 100%)', border: '1.5px solid #FDE68A', borderRadius: '16px', padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E', fontWeight: 700, fontSize: '0.92rem', marginBottom: '14px' }}>
                  <span style={{ fontSize: '1.1rem' }}>🔧</span>
                  <span>{lang === 'hi' ? `लो-शू ग्रिड में खाली ${emptyCells.length} संख्याओं के उपाय (रत्न + मंत्र + दान):` : `Lo Shu Grid — Remedies for ${emptyCells.length} Missing Number(s) (Gems + Mantras + Seva):`}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
                  {emptyCells.map(num => {
                    const r = LOSHU_REMEDIES[num];
                    if (!r) return null;
                    return (
                      <div key={num} style={{ background: '#FFFFFF', borderRadius: '12px', padding: '12px 14px', border: `1.5px solid ${r.color}30`, borderLeft: `4px solid ${r.color}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                          <span style={{ fontSize: '1.1rem' }}>{r.emoji}</span>
                          <strong style={{ fontSize: '0.85rem', color: r.color }}>
                            {lang === 'hi' ? `अंक ${num} — ${r.planetHi} (${r.domainHi})` : `Number ${num} — ${r.planet} (${r.domainEn})`}
                          </strong>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.55, margin: 0 }}>
                          {lang === 'hi' ? r.remedyHi : r.remedyEn}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <p style={{ fontSize: '0.73rem', color: '#B45309', marginTop: '12px', padding: '8px 12px', background: '#FFFBEB', borderRadius: '8px' }}>
                  {lang === 'hi'
                    ? '💡 लो-शू ग्रिड में जो संख्याएं शून्य हैं वे ग्रह ऊर्जा में कमी दर्शाती हैं। उपरोक्त उपायों से उस ग्रह की ऊर्जा को सक्रिय किया जा सकता है।'
                    : '💡 Missing Lo Shu numbers indicate weak planetary energies. The above remedies activate those planets and restore balance to your life areas.'}
                </p>
              </div>
            );
          })()}

          {/* 💎 Gem Recommendation from Mulank */}
          {d.mulank && (() => {
            const MULANK_GEM = {
              1: { gem: 'Ruby (माणिक्य)',           planet: 'Sun',     metal: 'Gold',   day: 'Sunday',    color: '#DC2626' },
              2: { gem: 'Pearl (मोती)',               planet: 'Moon',    metal: 'Silver', day: 'Monday',    color: '#0369A1' },
              3: { gem: 'Yellow Sapphire (पुखराज)', planet: 'Jupiter', metal: 'Gold',   day: 'Thursday',  color: '#B45309' },
              4: { gem: 'Hessonite (गोमेद)',         planet: 'Rahu',    metal: 'Silver', day: 'Saturday',  color: '#475569' },
              5: { gem: 'Emerald (पन्ना)',            planet: 'Mercury', metal: 'Gold',   day: 'Wednesday', color: '#059669' },
              6: { gem: 'Diamond / Opal (हीरा)',     planet: 'Venus',   metal: 'Silver', day: 'Friday',    color: '#7C3AED' },
              7: { gem: "Cat's Eye (लहसुनिया)",      planet: 'Ketu',    metal: 'Silver', day: 'Thursday',  color: '#6D28D9' },
              8: { gem: 'Blue Sapphire (नीलम)',      planet: 'Saturn',  metal: 'Iron',   day: 'Saturday',  color: '#1D4ED8' },
              9: { gem: 'Red Coral (मूंगा)',          planet: 'Mars',    metal: 'Copper', day: 'Tuesday',   color: '#B91C1C' }
            };
            const KUA_ELEMENT = { 1:'Water',2:'Earth',3:'Wood',4:'Wood',6:'Metal',7:'Metal',8:'Earth',9:'Fire' };
            const KUA_COLOR   = { 1:'Blue & Black',2:'Brown & Yellow',3:'Green & Teal',4:'Green & Purple',6:'White & Gold',7:'Silver & White',8:'Beige & Yellow',9:'Red & Orange' };
            const KUA_DIRS    = { 1:['North','South','East','SE'],2:['SW','West','NW','NE'],3:['South','North','SE','East'],4:['North','South','East','SE'],6:['West','NE','SW','NW'],7:['NE','West','SW','NW'],8:['SW','West','NE','NW'],9:['East','SE','North','South'] };
            const gemInfo = MULANK_GEM[d.mulank];
            const kua = d.kuaNumber;
            return (
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {/* Gemstone card */}
                  <div style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FAF5FF 100%)', border: '1px solid #FDE68A', borderRadius: '14px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E', fontWeight: 700, fontSize: '0.9rem', marginBottom: '10px' }}>
                      💎 Lucky Gemstone (अनुकूल रत्न)
                    </div>
                    {gemInfo && (
                      <>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: gemInfo.color, marginBottom: '4px' }}>{gemInfo.gem}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '8px' }}>Planet: {gemInfo.planet} · Metal: {gemInfo.metal}</div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <span className="pastel-badge badge-amber" style={{ fontSize: '0.72rem' }}>Wear on {gemInfo.day}</span>
                          <span className="pastel-badge badge-lavender" style={{ fontSize: '0.72rem' }}>Ring/Little Finger</span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#78716C', marginTop: '8px' }}>Set in {gemInfo.metal}, energize with {gemInfo.planet} mantra before wearing.</p>
                      </>
                    )}
                  </div>
                  {/* Feng Shui Kua card */}
                  {kua && KUA_ELEMENT[kua] && (
                    <div style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #EFF6FF 100%)', border: '1px solid #BBF7D0', borderRadius: '14px', padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#065F46', fontWeight: 700, fontSize: '0.9rem', marginBottom: '10px' }}>
                        ☯️ Feng Shui Kua {kua} ({KUA_ELEMENT[kua]})
                      </div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#059669', marginBottom: '4px' }}>🎨 {KUA_COLOR[kua]}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '8px' }}>Lucky Directions:</div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {(KUA_DIRS[kua]||[]).map((dir,i) => (
                          <span key={i} className="pastel-badge badge-mint" style={{ fontSize: '0.72rem' }}>{dir}</span>
                        ))}
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#065F46', marginTop: '8px' }}>Face {(KUA_DIRS[kua]||[])[0]} while working or sleeping for best results.</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {renderLogicBox(d.logicExplanationEn, d.logicExplanationHi)}
        </div>
      )}

      {/* 3. Zodiac & Elemental Astrology */}
      {activeTab === 3 && d && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div className="pastel-card" style={{ padding: '18px', background: '#FFFFFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B45309', fontWeight: 700, marginBottom: '6px' }}>
                <Sun size={18} /> Sun Sign (सूर्य राशि)
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E1B4B' }}>{d.sun?.signEn} ({d.sun?.signHi})</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Solar Soul Identity & Core Authority</p>
            </div>

            <div className="pastel-card" style={{ padding: '18px', background: '#FFFFFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563EB', fontWeight: 700, marginBottom: '6px' }}>
                <Moon size={18} /> Moon Sign (चंद्र राशि / जन्म राशि)
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E1B4B' }}>{d.moon?.signEn} ({d.moon?.signHi})</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Nakshatra: <strong>{d.moon?.nakshatra}</strong> (Lord: {d.moon?.nakshatraLord})</p>
            </div>

            <div className="pastel-card" style={{ padding: '18px', background: '#FFFFFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7C3AED', fontWeight: 700, marginBottom: '6px' }}>
                <Compass size={18} /> Ascendant (लग्न)
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E1B4B' }}>{d.ascendant?.signEn} ({d.ascendant?.signHi})</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Element: <strong>{d.ascendant?.element}</strong> | Ruler: {d.ascendant?.ruler}</p>
            </div>
          </div>

          {renderLogicBox("Zodiac calculations are synchronized with Vedic Sidereal Ephemeris accounting for Lahiri Ayanamsha.", "राशि व नक्षत्र की गणना वैदिक निरयण पद्धति और लाहिड़ी अयनांश के आधार पर की गई है।")}
        </div>
      )}

      {/* 4. Birthday Month Archetype */}
      {activeTab === 4 && d && (
        <div>
          <div className="pastel-card" style={{ padding: '20px', background: 'linear-gradient(135deg, #FFF1F2 0%, #FAF5FF 100%)', marginBottom: '16px' }}>
            <span className="pastel-badge badge-rose" style={{ marginBottom: '8px' }}>
              Month: {d.birthMonth} | Ruler: {d.rulingPlanet}
            </span>
            <h3 style={{ fontSize: '1.25rem', color: '#9F1239', marginTop: '4px' }}>
              {lang === 'hi' ? d.archetypeHi : d.archetypeEn}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              {lang === 'hi' ? d.powerQualitiesHi : d.powerQualitiesEn}
            </p>
            <div style={{ marginTop: '12px' }}>
              <span className="pastel-badge badge-amber">Gemstone: {d.gemstone}</span>
            </div>
          </div>
          {renderLogicBox(d.logicExplanationEn, d.logicExplanationHi)}
        </div>
      )}

      {/* 5. Natal Astrology & Planetary Dignities */}
      {activeTab === 5 && (
        <div>
          <KundaliChart vedicChart={reportData.modules[11]?.data} lang={lang} />
          {renderLogicBox("Natal dignity matrix calculates planetary Uchha (exaltation), Neecha (debilitation), and Swakshetra based on Parashari principles.", "ग्रह बल एवं उच्च-नीच राशि का निर्धारण महर्षि पाराशर के बृहत पाराशर होरा शास्त्र के नियमों पर आधारित है।")}
        </div>
      )}

      {/* 6. Horary Astrology (Prashna Kundali) */}
      {activeTab === 6 && d && (
        <div>
          <div className="pastel-card" style={{ padding: '20px', background: '#FFFFFF', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="pastel-badge badge-sky">Instant Prashna Timestamp: {d.formattedTime}</span>
              <span className="pastel-badge badge-mint">{d.confidenceScore} Alignment</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#1E1B4B', marginBottom: '6px' }}>
              Verdict: {lang === 'hi' ? d.verdictHi : d.verdictEn}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#047857', fontWeight: 600, marginBottom: '12px' }}>
              Expected Manifestation: {lang === 'hi' ? d.timingHi : d.timingEn}
            </p>
            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', fontSize: '0.82rem', color: '#475569' }}>
              Prashna Lagna: <strong>{d.prashnaLagna?.signEn}</strong> ({d.prashnaLagna?.signHi}) | Moon in House: <strong>{d.moonPosition?.house}</strong>
            </div>
          </div>
          {renderLogicBox(d.logicExplanationEn, d.logicExplanationHi)}
        </div>
      )}

      {/* 7. Electional Astrology (Shubh Muhurta & Choghadiya) */}
      {activeTab === 7 && d && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            {/* Abhijit Muhurta */}
            <div className="pastel-card" style={{ padding: '18px', background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <div style={{ color: '#166534', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
                🌟 {lang === 'hi' ? d.abhijitMuhurta?.nameHi : d.abhijitMuhurta?.nameEn}
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#15803D' }}>
                {d.abhijitMuhurta?.timeSlot}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#166534', marginTop: '6px' }}>
                {lang === 'hi' ? d.abhijitMuhurta?.descriptionHi : d.abhijitMuhurta?.descriptionEn}
              </p>
            </div>

            {/* Rahu Kaal */}
            <div className="pastel-card" style={{ padding: '18px', background: '#FFF1F2', border: '1px solid #FECDD3' }}>
              <div style={{ color: '#9F1239', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
                ⛔ Rahu Kaal (राहुकाल - वर्जित समय)
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#BE123C' }}>
                {lang === 'hi' ? d.rahuKaal?.timeSlotHi : d.rahuKaal?.timeSlotEn}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#9F1239', marginTop: '6px' }}>
                {lang === 'hi' ? d.rahuKaal?.warningHi : d.rahuKaal?.warningEn}
              </p>
            </div>
          </div>

          {/* Choghadiya Schedule Table */}
          <h4 style={{ fontSize: '0.95rem', marginBottom: '10px', color: '#1E1B4B' }}>Day Choghadiya Timings (दिन का चौघड़िया):</h4>
          <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
            <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                  <th style={{ padding: '6px' }}>Time Slot</th>
                  <th style={{ padding: '6px' }}>Choghadiya</th>
                  <th style={{ padding: '6px' }}>Nature</th>
                  <th style={{ padding: '6px' }}>Significance</th>
                </tr>
              </thead>
              <tbody>
                {d.choghadiyaSchedule?.map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '8px 6px', fontWeight: 600 }}>{c.timeSlot}</td>
                    <td style={{ padding: '8px 6px' }}>
                      <span style={{ color: c.color, fontWeight: 700 }}>{c.nameHi}</span>
                    </td>
                    <td style={{ padding: '8px 6px', color: '#475569' }}>{c.nature}</td>
                    <td style={{ padding: '8px 6px', color: '#64748B' }}>{c.descHi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {renderLogicBox(d.logicExplanationEn, d.logicExplanationHi)}
        </div>
      )}

      {/* 8. Mundane Global Astrology */}
      {activeTab === 8 && d && (
        <div>
          <div className="pastel-card" style={{ padding: '18px', background: 'linear-gradient(135deg, #E0F2FE 0%, #FAF5FF 100%)', marginBottom: '16px' }}>
            <span className="pastel-badge badge-sky" style={{ marginBottom: '6px' }}>Global Macro Cycle</span>
            <h3 style={{ fontSize: '1.15rem', color: '#0369A1' }}>{lang === 'hi' ? d.macroThemeHi : d.macroThemeEn}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              {lang === 'hi' ? d.collectiveAdviceHi : d.collectiveAdviceEn}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {d.majorCycles?.map((c, i) => (
              <div key={i} className="pastel-card" style={{ padding: '16px', background: '#FFFFFF' }}>
                <strong style={{ color: '#4C1D95', fontSize: '0.9rem', display: 'block' }}>{c.planetEn}</strong>
                <span className="pastel-badge badge-lavender" style={{ margin: '6px 0', fontSize: '0.72rem' }}>
                  {lang === 'hi' ? c.transitSignHi : c.transitSignEn}
                </span>
                <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px' }}>
                  {lang === 'hi' ? c.globalImpactHi : c.globalImpactEn}
                </p>
              </div>
            ))}
          </div>
          {renderLogicBox(d.logicExplanationEn, d.logicExplanationHi)}
        </div>
      )}

      {/* 9. Medical Astrology & Astro-Ayurveda */}
      {activeTab === 9 && d && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div className="pastel-card" style={{ padding: '18px', background: '#FFFFFF' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Tri-Dosha Constitutional Balance</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#047857', marginTop: '4px' }}>
                {d.triDoshaBalance}
              </div>
              <p style={{ fontSize: '0.82rem', color: '#15803D', marginTop: '6px' }}>
                {lang === 'hi' ? d.doshaAdviceHi : d.doshaAdviceEn}
              </p>
            </div>

            <div className="pastel-card" style={{ padding: '18px', background: '#FFFFFF' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Primary Sensitive Body Zone</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#BE123C', marginTop: '4px' }}>
                {lang === 'hi' ? d.primaryVulnerableOrgans?.organsHi : d.primaryVulnerableOrgans?.organsEn}
              </div>
              <span className="pastel-badge badge-rose" style={{ marginTop: '8px', fontSize: '0.72rem' }}>
                Ascendant: {d.ascendantSign}
              </span>
            </div>
          </div>

          <div className="pastel-card" style={{ padding: '18px', background: '#FAF5FF', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#5B21B6', marginBottom: '10px' }}>Ayurvedic Astro-Remedies (स्वास्थ्य सुरक्षा निर्देश):</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              {d.preventiveTips?.map((tip, i) => (
                <div key={i} style={{ background: '#FFFFFF', padding: '12px', borderRadius: '10px', border: '1px solid #E9D5FF' }}>
                  <strong style={{ fontSize: '0.82rem', color: '#7C3AED', display: 'block', marginBottom: '4px' }}>
                    {lang === 'hi' ? tip.titleHi : tip.titleEn}
                  </strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {lang === 'hi' ? tip.detailHi : tip.detailEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {renderLogicBox(d.logicExplanationEn, d.logicExplanationHi)}
        </div>
      )}

      {/* 10. Vastu Shastra & Directional Energy + Feng Shui */}
      {activeTab === 10 && d && (
        <div>
          <VastuCompass vastuData={d} lang={lang} />

          {/* ☯️ Feng Shui Kua Section */}
          {d.kuaNumber && (() => {
            const KUA_DB = {
              1: { element:'Water (जल)',    group:'East',  dirs:['North','South','East','SE'], color:'Blue & Black', emoji:'💧', advice:'Career zone in North; health zone in East.' },
              2: { element:'Earth (पृथ्वी)',group:'West',  dirs:['SW','West','NW','NE'],       color:'Brown & Yellow',emoji:'🌍', advice:'Bedroom in SW for stability; study in NE.' },
              3: { element:'Wood/Thunder',  group:'East',  dirs:['South','North','SE','East'], color:'Green & Teal',  emoji:'⚡', advice:'Career zone in South; avoid SW main door.' },
              4: { element:'Wind/Wood',     group:'East',  dirs:['North','South','East','SE'], color:'Green & Purple',emoji:'🌿', advice:'Academic area in SE; wealth from North.' },
              6: { element:'Heaven/Metal',  group:'West',  dirs:['West','NE','SW','NW'],       color:'White & Gold',  emoji:'⚙️', advice:'Leadership energy in NW; wealth room in West.' },
              7: { element:'Lake/Metal',    group:'West',  dirs:['NE','West','SW','NW'],       color:'White & Silver',emoji:'🏔️', advice:'Social luck in West; study in NE.' },
              8: { element:'Mountain/Earth',group:'West',  dirs:['SW','West','NE','NW'],       color:'Beige & Yellow',emoji:'🗻', advice:'Prosperity in NE; family harmony in SW.' },
              9: { element:'Fire (अग्नि)', group:'East',  dirs:['East','SE','North','South'], color:'Red & Orange',  emoji:'🔥', advice:'Fame from South; career in North. Avoid West.' }
            };
            const kd = KUA_DB[d.kuaNumber];
            if (!kd) return null;
            return (
              <div style={{ marginTop: '24px', background: 'linear-gradient(135deg, #F0FDF4 0%, #EFF6FF 100%)', border: '1.5px solid #BBF7D0', borderRadius: '16px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.8rem' }}>{kd.emoji}</span>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', color: '#065F46', fontWeight: 800 }}>☯️ Feng Shui Kua {d.kuaNumber} — {kd.element}</h3>
                    <p style={{ fontSize: '0.78rem', color: '#047857' }}>{kd.group} Group · Complements your Vastu analysis</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div style={{ background: '#FFFFFF', borderRadius: '10px', padding: '14px', border: '1px solid #D1FAE5' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065F46', marginBottom: '6px' }}>🧭 Lucky Power Directions</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {kd.dirs.map((dir, i) => (
                        <span key={i} className="pastel-badge badge-mint" style={{ fontSize: '0.72rem' }}>{i===0?'⭐ ':''}{dir}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: '#FFFFFF', borderRadius: '10px', padding: '14px', border: '1px solid #D1FAE5' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065F46', marginBottom: '6px' }}>🎨 Auspicious Colors</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#059669' }}>{kd.color}</div>
                    <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Use these colors in your home & office decor.</p>
                  </div>
                  <div style={{ background: '#FFFFFF', borderRadius: '10px', padding: '14px', border: '1px solid #D1FAE5' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065F46', marginBottom: '6px' }}>💡 Feng Shui Advice</div>
                    <p style={{ fontSize: '0.8rem', color: '#047857', lineHeight: 1.5 }}>{kd.advice}</p>
                  </div>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#047857', marginTop: '12px', padding: '8px 12px', background: '#ECFDF5', borderRadius: '8px' }}>
                  💡 Kua {d.kuaNumber} is calculated from your year of birth + gender using the Ba-Gua matrix. It complements Vastu Shastra with Chinese Five Element theory for holistic home harmony.
                </p>
              </div>
            );
          })()}

          {renderLogicBox(d.logicExplanationEn, d.logicExplanationHi)}
        </div>
      )}

      {/* 11. Kundli/BirthChart — 12 Bhavas + 12 Rashis + 9 Grahas */}
      {activeTab === 11 && d && (
        <div>
          {/* Educational Banner: 12 Houses vs 12 Signs vs 9 Planets */}
          <div style={{ background: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 100%)', border: '1.5px solid #C4B5FD', borderRadius: '14px', padding: '14px 18px', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.85rem', color: '#4C1D95', fontWeight: 700, marginBottom: '10px' }}>
              {lang === 'hi' ? '🔮 वैदिक कुंडली के तीन स्तंभ — अंतर समझें' : '🔮 Three Pillars of Vedic Kundli — Understanding the Difference'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <div style={{ background: '#FFFFFF', borderRadius: '10px', padding: '10px 12px', border: '1px solid #E9D5FF' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#7C3AED', marginBottom: '4px' }}>🏠 {lang === 'hi' ? '12 भाव (Bhavas / Houses)' : '12 Bhavas (Houses)'}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{lang === 'hi' ? 'जन्म कुंडली के 12 निश्चित स्थान — लग्न से गिने जाते हैं। प्रत्येक भाव जीवन का एक क्षेत्र नियंत्रित करता है।' : 'Fixed structural positions (1–12) from Lagna. Each Bhava governs a specific life domain (wealth, career, marriage etc.)'}</div>
              </div>
              <div style={{ background: '#FFFFFF', borderRadius: '10px', padding: '10px 12px', border: '1px solid #E9D5FF' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#059669', marginBottom: '4px' }}>♈ {lang === 'hi' ? '12 राशियां (Rashis / Zodiac Signs)' : '12 Rashis (Zodiac Signs)'}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{lang === 'hi' ? 'मेष से मीन तक 12 राशियां — ये भावों में स्थित होती हैं और लग्न अनुसार बदलती हैं। भाव और राशि अलग-अलग होते हैं।' : 'Aries to Pisces — 12 zodiac signs rotate into houses based on Lagna. A house and a sign are NOT the same thing.'}</div>
              </div>
              <div style={{ background: '#FFFFFF', borderRadius: '10px', padding: '10px 12px', border: '1px solid #E9D5FF' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#DC2626', marginBottom: '4px' }}>🪐 {lang === 'hi' ? '9 ग्रह (नवग्रह / Planets)' : '9 Navagrahas (Planets)'}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{lang === 'hi' ? 'सूर्य, चंद्र, मंगल, बुध, बृहस्पति, शुक्र, शनि, राहु, केतु — ये 9 ग्रह विभिन्न भावों में स्थित होकर जीवन पर प्रभाव डालते हैं।' : 'Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu & Ketu — these 9 planets occupy the Bhavas and shape every area of life.'}</div>
              </div>
            </div>
          </div>

          {/* 9 Grahas Quick Summary Row */}
          {d.planets && d.planets.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#4C1D95', marginBottom: '8px' }}>
                🪐 {lang === 'hi' ? 'नवग्रह — 9 ग्रहों की वर्तमान भाव स्थिति:' : '9 Navagrahas — Planetary Positions in Your Kundli:'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '6px' }}>
                {d.planets.map((planet) => {
                  const PLANET_COLOR = { Sun: '#DC2626', Moon: '#0369A1', Mars: '#B91C1C', Mercury: '#059669', Jupiter: '#B45309', Venus: '#7C3AED', Saturn: '#1D4ED8', Rahu: '#475569', Ketu: '#6D28D9' };
                  const PLANET_EMOJI = { Sun: '☀️', Moon: '🌙', Mars: '♂️', Mercury: '☿', Jupiter: '♃', Venus: '♀️', Saturn: '♄', Rahu: '🌑', Ketu: '☄️' };
                  const color = PLANET_COLOR[planet.key] || '#4C1D95';
                  const emoji = PLANET_EMOJI[planet.key] || '⭐';
                  return (
                    <div key={planet.key} style={{ background: '#FAFAFA', border: `1.5px solid ${color}25`, borderLeft: `3px solid ${color}`, borderRadius: '8px', padding: '7px 10px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color, marginBottom: '2px' }}>
                        {emoji} {lang === 'hi' ? planet.nameHi : planet.nameEn}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#475569' }}>
                        {lang === 'hi' ? `${planet.house} भाव · ${planet.signHi}` : `H${planet.house} · ${planet.signEn}`}
                      </div>
                      <div style={{ fontSize: '0.62rem', color: '#94A3B8', marginTop: '1px' }}>
                        {planet.degInSign}° · {lang === 'hi' ? (planet.dignityHi || planet.dignity?.split(' ')[0]) : planet.dignity?.split(' ')[0]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <KundaliChart vedicChart={d} lang={lang} />
          {renderLogicBox(d.logicExplanationEn, d.logicExplanationHi)}
        </div>
      )}

      {/* 12. Ashtakoot 36-Guna Compatibility Matcher */}
      {activeTab === 12 && (
        <div>
          <CompatibilityTab primaryUser={primaryUser} lang={lang} />
          {renderLogicBox("Ashtakoota 36 Guna evaluation analyzes 8 Vedic compatibility metrics to determine marital harmony, progeny health, and destiny alignment.", "अष्टकूट 36 गुण मिलान 8 आध्यात्मिक व मनोवैज्ञानिक आयामों के आधार पर दांपत्य सुख व आनुवंशिक स्वास्थ्य का परीक्षण करता है।")}
        </div>
      )}

      {/* 13. Name Decoder & Success Optimizer */}
      {activeTab === 13 && d && (
        <div>
          <NameOptimizer nameData={d} lang={lang} />
          {renderLogicBox(d.logicExplanationEn, d.logicExplanationHi)}
        </div>
      )}
    </div>
  );
}
