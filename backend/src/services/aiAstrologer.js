/**
 * Multilingual & Hinglish AI Astrologer Engine — KundliGPT-Level
 * ─────────────────────────────────────────────────────────────────────────────
 * Connects to Google Gemini API for truly personalized, chart-aware predictions.
 * Every answer is unique per user based on their Lagna, Nakshatra, Dasha, Mulank,
 * Bhagyank, gender, age, place, and more. Includes Gemstone & Feng Shui guidance.
 * Falls back to enriched local engine if API key is missing or unavailable.
 */

import { calculateHoraryChart } from '../algorithms/horary.js';

// ─── Gemstone Database ────────────────────────────────────────────────────────
const GEM_DATABASE = {
  'Sun':     { gem: 'Ruby (माणिक्य)',     gemHi: 'माणिक्य (रूबी)',     metal: 'Gold (सोना)',    finger: 'Ring Finger (अनामिका)', day: 'Sunday', note: 'Set in gold, wear on Sunday morning after Surya Puja' },
  'Moon':    { gem: 'Pearl (मोती)',        gemHi: 'मोती (Pearl)',        metal: 'Silver (चांदी)',  finger: 'Little Finger (कनिष्ठा)', day: 'Monday', note: 'Set in silver, wear on Monday before sunrise' },
  'Mars':    { gem: 'Red Coral (मूंगा)',   gemHi: 'लाल मूंगा',          metal: 'Copper (तांबा)', finger: 'Ring Finger (अनामिका)', day: 'Tuesday', note: 'Set in copper/gold, energize with Mangal mantra' },
  'Mercury': { gem: 'Emerald (पन्ना)',     gemHi: 'पन्ना (एमरल्ड)',     metal: 'Gold (सोना)',    finger: 'Little Finger (कनिष्ठा)', day: 'Wednesday', note: 'Set in gold, wear Wednesday morning' },
  'Jupiter': { gem: 'Yellow Sapphire (पुखराज)', gemHi: 'पुखराज (Yellow Sapphire)', metal: 'Gold (सोना)', finger: 'Index Finger (तर्जनी)', day: 'Thursday', note: 'Set in gold, activate with Guru mantra' },
  'Venus':   { gem: 'Diamond / White Sapphire (हीरा)', gemHi: 'हीरा / सफेद पुखराज', metal: 'Silver (चांदी)', finger: 'Middle Finger (मध्यमा)', day: 'Friday', note: 'Set in silver/platinum, wear Friday evening' },
  'Saturn':  { gem: 'Blue Sapphire (नीलम)',  gemHi: 'नीलम (Blue Sapphire)', metal: 'Iron / Panchdhatu', finger: 'Middle Finger (मध्यमा)', day: 'Saturday', note: 'Always trial for 3 days before wearing permanently' },
  'Rahu':    { gem: 'Hessonite Garnet (गोमेद)', gemHi: 'गोमेद (हेस्सोनाइट)', metal: 'Silver (चांदी)', finger: 'Middle Finger (मध्यमा)', day: 'Saturday', note: 'Wear only after astrologer consultation' },
  'Ketu':    { gem: "Cat's Eye (लहसुनिया)", gemHi: "लहसुनिया (Cat's Eye)", metal: 'Silver (चांदी)', finger: 'Little Finger (कनिष्ठा)', day: 'Thursday', note: 'Powerful gem — test first for 3 days' }
};

// ─── Feng Shui Kua Database ───────────────────────────────────────────────────
const KUA_DATABASE = {
  1: { element: 'Water (जल)', group: 'East', luckyDirs: ['North', 'South', 'East', 'South-East'], badDirs: ['South-West', 'West', 'North-West', 'North-East'], color: 'Blue & Black', luckyDirHi: 'उत्तर, दक्षिण, पूर्व, दक्षिण-पूर्व', advice: 'Career in North zone, health in East. Avoid heavy furniture in North.' },
  2: { element: 'Earth (पृथ्वी)', group: 'West', luckyDirs: ['South-West', 'West', 'North-West', 'North-East'], badDirs: ['East', 'South-East', 'North', 'South'], color: 'Brown & Yellow', luckyDirHi: 'दक्षिण-पश्चिम, पश्चिम, उत्तर-पश्चिम, उत्तर-पूर्व', advice: 'Bedroom in South-West for stability. Study room in North-East.' },
  3: { element: 'Thunder/Wood (वज्र/काष्ठ)', group: 'East', luckyDirs: ['South', 'North', 'South-East', 'East'], badDirs: ['West', 'North-East', 'South-West', 'North-West'], color: 'Green & Teal', luckyDirHi: 'दक्षिण, उत्तर, दक्षिण-पूर्व, पूर्व', advice: 'Place career ambitions in South zone. Avoid South-West for main door.' },
  4: { element: 'Wind/Wood (वायु/काष्ठ)', group: 'East', luckyDirs: ['North', 'South', 'East', 'South-East'], badDirs: ['North-East', 'West', 'North-West', 'South-West'], color: 'Green & Purple', luckyDirHi: 'उत्तर, दक्षिण, पूर्व, दक्षिण-पूर्व', advice: 'Academic area in South-East. Wealth comes from North.' },
  6: { element: 'Heaven/Metal (स्वर्ग/धातु)', group: 'West', luckyDirs: ['West', 'North-East', 'South-West', 'North-West'], badDirs: ['East', 'South-East', 'South', 'North'], color: 'White & Gold', luckyDirHi: 'पश्चिम, उत्तर-पूर्व, दक्षिण-पश्चिम, उत्तर-पश्चिम', advice: 'Leadership energy in North-West. Wealth room in West.' },
  7: { element: 'Lake/Metal (सरोवर/धातु)', group: 'West', luckyDirs: ['North-East', 'West', 'South-West', 'North-West'], badDirs: ['South-East', 'East', 'North', 'South'], color: 'White & Silver', luckyDirHi: 'उत्तर-पूर्व, पश्चिम, दक्षिण-पश्चिम, उत्तर-पश्चिम', advice: 'Social and romance luck in West. Study in North-East.' },
  8: { element: 'Mountain/Earth (पर्वत/पृथ्वी)', group: 'West', luckyDirs: ['South-West', 'West', 'North-East', 'North-West'], badDirs: ['East', 'South-East', 'South', 'North'], color: 'Beige & Yellow', luckyDirHi: 'दक्षिण-पश्चिम, पश्चिम, उत्तर-पूर्व, उत्तर-पश्चिम', advice: 'Prosperity in North-East. Family harmony in South-West.' },
  9: { element: 'Fire (अग्नि)', group: 'East', luckyDirs: ['East', 'South-East', 'North', 'South'], badDirs: ['West', 'North-West', 'South-West', 'North-East'], color: 'Red & Orange', luckyDirHi: 'पूर्व, दक्षिण-पूर्व, उत्तर, दक्षिण', advice: 'Fame and recognition from South. Career in North. Avoid West.' }
};

// ─── Get Gemstone Recommendation ─────────────────────────────────────────────
export function getGemRecommendation(lagnaRuler = '', mulank = 5, dashaLord = '', moonNakshatra = '') {
  // Parse planet names to standard keys
  const parsePlanet = (str) => {
    const s = (str || '').toLowerCase();
    if (s.includes('sun') || s.includes('सूर्य'))       return 'Sun';
    if (s.includes('moon') || s.includes('चंद्र'))      return 'Moon';
    if (s.includes('mars') || s.includes('मंगल'))       return 'Mars';
    if (s.includes('mercury') || s.includes('बुध'))     return 'Mercury';
    if (s.includes('jupiter') || s.includes('बृहस्पति')) return 'Jupiter';
    if (s.includes('venus') || s.includes('शुक्र'))     return 'Venus';
    if (s.includes('saturn') || s.includes('शनि'))      return 'Saturn';
    if (s.includes('rahu') || s.includes('राहु'))       return 'Rahu';
    if (s.includes('ketu') || s.includes('केतु'))       return 'Ketu';
    return null;
  };

  const mulankToPlanet = { 1:'Sun', 2:'Moon', 3:'Jupiter', 4:'Rahu', 5:'Mercury', 6:'Venus', 7:'Ketu', 8:'Saturn', 9:'Mars' };

  const lagnaKey  = parsePlanet(lagnaRuler);
  const dashaKey  = parsePlanet(dashaLord);
  const mulankKey = mulankToPlanet[mulank] || 'Sun';

  const primaryGem    = GEM_DATABASE[lagnaKey]  || GEM_DATABASE['Sun'];
  const dashaGem      = GEM_DATABASE[dashaKey]  || GEM_DATABASE['Jupiter'];
  const mulankGem     = GEM_DATABASE[mulankKey] || GEM_DATABASE['Sun'];

  return {
    primary: { planet: lagnaKey || 'Sun', ...primaryGem, type: 'Lagna Lord Gem (लग्नेश रत्न)', purpose: 'Core personality amplifier — wear always' },
    dasha:   { planet: dashaKey || 'Jupiter', ...dashaGem, type: 'Active Dasha Gem (दशा रत्न)', purpose: 'Currently activated — wear during this dasha period' },
    mulank:  { planet: mulankKey, ...mulankGem, type: 'Mulank Planet Gem (मूलांक रत्न)', purpose: 'Numerological vibration amplifier' }
  };
}

// ─── Get Feng Shui Kua Advice ─────────────────────────────────────────────────
export function getFengShuiKua(dobString = '', gender = 'male') {
  try {
    const d = new Date(dobString);
    const year = d.getFullYear();
    if (isNaN(year)) return null;

    let yearDigitSum = year.toString().split('').reduce((s, x) => s + parseInt(x), 0);
    while (yearDigitSum > 9) {
      yearDigitSum = yearDigitSum.toString().split('').reduce((s, x) => s + parseInt(x), 0);
    }

    let kua;
    if (gender.toLowerCase() === 'female') {
      kua = yearDigitSum + 4;
      while (kua > 9) kua = kua.toString().split('').reduce((s, x) => s + parseInt(x), 0);
      if (kua === 5) kua = 8;
    } else {
      kua = 11 - yearDigitSum;
      while (kua > 9) kua = kua.toString().split('').reduce((s, x) => s + parseInt(x), 0);
      if (kua === 5) kua = 2;
    }

    const kuaData = KUA_DATABASE[kua] || KUA_DATABASE[1];
    return { kua, ...kuaData };
  } catch {
    return null;
  }
}

// ─── Gemini API Call ──────────────────────────────────────────────────────────
async function callGeminiAPI(systemPrompt, userPrompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_google_gemini_api_key_here') return null;

  try {
    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const body = {
      contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
      generationConfig: {
        temperature: 0.85,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 900
      }
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(12000)
    });

    if (!resp.ok) return null;
    const json = await resp.json();
    return json?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch {
    return null;
  }
}

async function callOpenAIAPI(systemPrompt, userPrompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.75,
        max_tokens: 900,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      }),
      signal: AbortSignal.timeout(12000)
    });

    if (!resp.ok) return null;
    const json = await resp.json();
    return json?.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

// ─── Build Expert System Prompt ───────────────────────────────────────────────
function buildSystemPrompt() {
  return `You are Dr. Krishnacharya — a careful Vedic astrology assistant, numerologist, Vastu consultant, and Feng Shui guide. You respond in Hinglish (mix of Hindi and English naturally, as Indians speak). Your predictions are:
- SPECIFIC to this exact person's chart parameters (you MUST reference their Lagna, Nakshatra, Dasha, Mulank by name)
- RESPONSIVE to the exact question, including its subject, relationship, tense, and requested detail
- FAMILY-AWARE: for relatives, use the owner's derived houses (siblings H3/H11; sibling education from the 5th/9th houses from that axis)
- HONEST about limits: describe astrological tendencies and reasoning, never invent a literal school record or current fact
- PRACTICAL (give specific, actionable remedies)
- WARM but grounded in tone

Answer naturally and directly. Include the conclusion, the relevant astrological evidence and derived-house method, practical guidance, and timing only when the question asks for timing. You may use headings, but do not force an answer into a fixed template. Never repeat generic text that does not answer the user's exact question.`;
}

// ─── Build Rich User Context ───────────────────────────────────────────────────
function buildUserContext(query, profile, chartData, domain, gemRec, fengShui) {
  const d    = chartData || {};
  const dob  = d.dobNumerology  || {};
  const vedic = d.vedicChart    || {};
  const mob  = d.mobileNumerology || {};

  const lower = query.toLowerCase();
  const subject = /(sibling|brother|sister|bhai|behen|बहन|भाई)/i.test(lower) ? 'sibling'
    : /(mother|mom|father|dad|parent|maa|mata|papa|pitaji|माता|पिता)/i.test(lower) ? 'parent'
      : /(spouse|husband|wife|partner|पति|पत्नी|जीवनसाथी)/i.test(lower) ? 'partner'
        : /(child|son|daughter|beta|beti|बेटा|बेटी)/i.test(lower) ? 'child' : 'owner';
  const topic = /(study|studies|education|subject|course|degree|college|school|academic|learning|padhai|shiksha|विद्या|पढ़ाई)/i.test(lower) ? 'education'
    : /(career|job|work|profession|business|promotion|naukri)/i.test(lower) ? 'career'
      : /(health|illness|disease|pain|swasthya|बीमारी|स्वास्थ्य)/i.test(lower) ? 'health'
        : /(money|wealth|income|finance|paisa|dhan|धन|आय)/i.test(lower) ? 'wealth' : domain;
  const timeframe = /(current|currently|now|present|today|at present|this year|this month|abhi|vartaman|अभी|वर्तमान|इस साल|इस वर्ष)/i.test(lower) ? 'current' : 'general';

  return `USER QUERY: "${query}"
DOMAIN: ${domain}
SEMANTIC QUERY MODEL:
- Subject: ${subject}
- Topic: ${topic}
- Timeframe: ${timeframe}
- For relatives, derive the relevant houses from the owner's chart before interpreting the topic.

PERSONAL BIRTH PARAMETERS:
- Name: ${profile.name || 'Seeker'}
- Gender: ${profile.gender || 'not specified'}, Age: ${profile.age || 'unknown'}
- Date of Birth: ${profile.dob || 'unknown'}
- Birth Place / City: ${profile.place || 'India'}
- House Number: ${profile.houseNo || 'unknown'}

NUMEROLOGY MATRIX:
- Mulank (Driver): ${dob.mulank || '?'} — Planet: ${dob.mulankLord || '?'}
- Bhagyank (Destiny): ${dob.bhagyank || '?'} — Planet: ${dob.bhagyankLord || '?'}
- Personal Year ${new Date().getFullYear()}: ${dob.personalYear || '?'}
- Kua Number: ${dob.kuaNumber || '?'}

VEDIC ASTROLOGY CHART:
- Lagna (Ascendant): ${vedic.ascendant?.signEn || '?'} (${vedic.ascendant?.signHi || '?'}) — Ruled by ${vedic.ascendant?.ruler || '?'}
- Moon Sign (Rashi): ${vedic.moonSign?.signEn || '?'}
- Moon Nakshatra: ${vedic.moonSign?.nakshatra || '?'}
- Sun Sign: ${vedic.sunSign?.signEn || '?'}
- Active Vimshottari Dasha: ${vedic.vimshottariDasha?.startingLord || '?'}
- Planets in Houses: ${(vedic.planets || []).map(p => `${p.key} in H${p.house}(${p.signEn})`).join(', ') || 'standard placement'}

MOBILE NUMEROLOGY:
- Mobile Root: ${mob.singleDigit || '?'} — Planet: ${mob.planetaryRuler || '?'}

GEM RECOMMENDATION:
- Primary Gem (Lagna): ${gemRec?.primary?.gem || 'Ruby'}
- Active Dasha Gem: ${gemRec?.dasha?.gem || 'Yellow Sapphire'}
- Mulank Gem: ${gemRec?.mulank?.gem || 'Pearl'}

FENG SHUI KUA:
- Kua Number: ${fengShui?.kua || '?'}
- Lucky Element: ${fengShui?.element || '?'}
- Best Directions: ${fengShui?.luckyDirs?.join(', ') || '?'}

Now answer the exact user's question. First identify who or what the question is about. Use the submitted person's chart and derived family houses when the question concerns a relative. Explain the house derivation and all relevant chart parameters before giving a practical, qualified conclusion.`;
}

// ─── Parse Gemini Response ────────────────────────────────────────────────────
function parseGeminiResponse(text, domain, domainNameEn, p, source = 'gemini-ai') {
  if (!text) return null;

  const hinglishMatch = text.match(/🌟 HINGLISH PREDICTION[^\n]*\n([\s\S]*?)(?=📊|$)/i);
  const logicMatch    = text.match(/📊 ASTROLOGICAL LOGIC[^\n]*\n([\s\S]*?)(?=💊|⏰|$)/i);
  const remediesMatch = text.match(/💊 VEDIC REMEDIES[^\n]*\n([\s\S]*?)(?=⏰|$)/i);
  const timingMatch   = text.match(/⏰ TIMING[^\n]*\n([\s\S]*?)$/i);

  const hinglish = (hinglishMatch?.[1] || '').trim();
  const logic    = (logicMatch?.[1]    || '').trim();
  const rawRem   = (remediesMatch?.[1] || '').trim();
  const timing   = (timingMatch?.[1]   || '').trim();

  const remedies = rawRem
    .split('\n')
    .filter(l => l.match(/^\d+\./))
    .map(l => l.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean);

  const openAnswer = text.trim();
  const answer = hinglish || openAnswer;
  if (!answer) return null;

  return {
    answerHinglish: answer,
    answerEn: `${answer} ${logic ? '\n\nAstrological Logic: ' + logic : ''}`,
    answerHi: answer,
    astrologicalLogicEn: logic || `Based on your Lagna ${p.lagna} and active ${p.dasha} Dasha. Horary verdict: Favorable.`,
    astrologicalLogicHi: logic || `आपके ${p.lagnaHi} लग्न और ${p.dasha} दशा के आधार पर। प्रश्न फल: अनुकूल।`,
    practicalRemedies: remedies.length ? remedies : ['Chant Gayatri Mantra 9 times daily.', 'Offer water to the Sun every morning.', 'Wear your lucky color on auspicious days.'],
    timingEn: timing,
    source
  };
}

// ─── Enriched Fallback Engine ─────────────────────────────────────────────────
function buildFallbackResponse(domain, p, gemRec, fengShui) {
  const gem = gemRec?.primary;
  const ks  = fengShui;

  // Current timestamp-based variance for non-repetitive answers
  const now = new Date();
  const timeVariance = now.getDate() + now.getHours();
  const cycleA = timeVariance % 3;

  const timingOptions = [
    `${14 + (p.mulank % 5) * 7} to ${25 + (p.bhagyank % 4) * 8} days`,
    `within ${2 + (p.mulank % 3)} to ${4 + (p.bhagyank % 3)} weeks`,
    `by ${['end of this month', 'mid-next month', 'early next quarter'][cycleA]}`
  ];
  const timing = timingOptions[p.mulank % timingOptions.length];
  const timingHi = timing.replace('days', 'दिनों में').replace('weeks', 'सप्ताह में');

  const gemRemedy = gem ? `Wear ${gem.gem} set in ${gem.metal} on ${gem.finger} every ${gem.day} — activates your ${gem.type}.` : 'Wear your lucky color gemstone on auspicious days.';
  const fsRemedy = ks ? `Feng Shui Kua ${ks.kua} (${ks.element}): activate ${ks.luckyDirs[0]} direction in your home with ${ks.color} accents.` : 'Place a water element in the North for prosperity.';
  const siblingQuestion = /(sibling|brother|sister|bhai|behen|बहन|भाई)/i.test(p.query || '');
  const siblingIndicators = p.planets.filter(planet => [3, 7, 9, 11].includes(planet.house));
  const siblingSignalText = siblingIndicators.map(planet => `${planet.key} ${planet.signEn || ''}`).join(' ');
  const siblingField = /Mercury|Gemini|Virgo/i.test(siblingSignalText)
    ? 'commerce, computing, languages, data, or communication'
    : /Mars|Aries|Scorpio/i.test(siblingSignalText)
      ? 'engineering, medicine, technology, or applied sciences'
      : /Jupiter|Sagittarius|Pisces/i.test(siblingSignalText)
        ? 'law, teaching, finance, research, or higher academic studies'
        : /Venus|Taurus|Libra/i.test(siblingSignalText)
          ? 'design, media, arts, psychology, or management'
          : p.studyField;
  if (siblingQuestion && domain !== 'education') {
    const topic = /(health|illness|disease|pain|swasthya|बीमारी|स्वास्थ्य)/i.test(p.query) ? 'health tendencies'
      : /(career|job|work|profession|business|promotion|naukri)/i.test(p.query) ? 'career and direction'
        : /(money|wealth|income|finance|paisa|dhan|धन|आय)/i.test(p.query) ? 'finances' : 'the area asked about';
    const placements = siblingIndicators.map(planet => `${planet.nameEn} in H${planet.house} (${planet.signEn})`).join(', ') || 'the H3/H11 rulers';
    return {
      answerHinglish: `Aapke sibling ke ${topic} ko owner chart ke H3/H11 sibling axis aur derived houses se dekha gaya hai. ${placements} ke saath ${p.lagna} Lagna, ${p.moonNak} Nakshatra, ${p.dasha} Dasha, Mulank ${p.mulank} aur Bhagyank ${p.bhagyank} ko cross-check kiya gaya hai.`,
      answerEn: `For your sibling's ${topic}, I used the owner's H3/H11 sibling axis and derived family houses, not the owner's topic reading directly. Relevant placements: ${placements}. The result is cross-checked with ${p.lagna} Ascendant, Moon Nakshatra ${p.moonNak}, ${p.dasha} Dasha, Mulank ${p.mulank}, and Bhagyank ${p.bhagyank}. This is a qualified astrological tendency, not an invented literal record.`,
      astrologicalLogicEn: `Subject=sibling; topic=${topic}. Primary houses=H3/H11; derived houses depend on the requested topic. Placements used: ${placements}.`,
      practicalRemedies: [`Discuss the result directly with your sibling and compare it with current facts.`, `Use the relevant topic houses as guidance, not proof.`, fsRemedy],
      source: 'enriched-fallback'
    };
  }

  const responses = {
    education: {
      answerHinglish: siblingQuestion ? `Aapke sibling ke studies ke liye 3rd/11th Bhava se sibling axis aur uske baad derived 5th/9th education houses dekhe jaate hain. Aapke chart ke combined signals ${siblingField} ki taraf strong inclination dikhate hain. ${p.dasha} Dasha, ${p.moonNak} Nakshatra, Mulank ${p.mulank} aur Bhagyank ${p.bhagyank} is tendency ko reinforce karte hain.` : `Namaste ${p.name} ji! Aapke 5th Bhava (buddhi) aur 9th Bhava (higher education) ke signals ke anusaar ${p.studyField} aapke liye suitable dikhte hain. Mercury ${p.mercuryHouse ? `H${p.mercuryHouse} mein ${p.mercurySign}` : 'aur Jupiter'} learning aur subject selection ko guide karte hain. Current ${p.dasha} Dasha mein ek primary field choose karke specialization karna beneficial rahega.`,
      answerEn: siblingQuestion ? `Reading the owner chart for family: siblings are seen through H3/H11, and the sibling's education is derived through the 5th and 9th houses from that axis. The combined indicators point toward ${siblingField}. Dasha ${p.dasha}, Moon Nakshatra ${p.moonNak}, Mulank ${p.mulank}, and Bhagyank ${p.bhagyank} support this direction. This is an astrological tendency, not an invented school record.` : `Based on your ${p.lagna} Ascendant, 5th-house intellect, 9th-house higher education, and Mercury/Jupiter indicators, your strongest study direction is ${p.studyField}. Mercury is linked with ${p.mercurySign || 'your chart'}${p.mercuryHouse ? ` in house ${p.mercuryHouse}` : ''}. Treat this as an aptitude signal and confirm it with your interests, marks, and a qualified counsellor.`,
      astrologicalLogicEn: siblingQuestion ? `Sibling axis = H3/H11; sibling education derivative = H7/H9/H11/H3. Relevant placements: ${siblingIndicators.map(planet => `${planet.nameEn} in H${planet.house} (${planet.signEn})`).join(', ') || 'house rulers'}.` : `5th-house planet: ${p.fifthPlanet || 'not occupied'}; 9th-house planet: ${p.ninthPlanet || 'not occupied'}; Mercury: ${p.mercurySign || 'not available'}; Jupiter: ${p.jupiterSign || 'not available'}. These chart indicators drive the study-field suggestion.`,
      practicalRemedies: [gemRemedy, `Study facing ${ks?.luckyDirs?.[0] || 'East or North'} and keep a fixed daily study block.`, 'Use active recall and weekly revision for stronger retention.']
    },
    career: {
      answerHinglish: `Namaste ${p.name} ji! Aapki kundali mein ${p.lagnaHi} lagna aur 10th house mein ${p.planets?.find(pl=>pl.house===10)?.nameEn || 'karmic energy'} ki position career breakthrough ke strong signals de rahi hai. ${p.dasha} Mahadasha chal rahi hai jo professional elevation ke liye ek prime window hai. Mulank ${p.mulank} (${p.mulankLord}) ke anusaar ${timing} mein ${p.place ? p.place + ' mein' : ''} recognition aur promotion ke strong yoga hain.`,
      answerEn: `Dear ${p.name}, your ${p.lagna} Ascendant with ${p.dasha} Dasha activating the 10th house (Karma Bhava) creates powerful career momentum. Mulank ${p.mulank} (${p.mulankLord}) & Bhagyank ${p.bhagyank} (${p.bhagyankLord}) form a success triad. Expect career recognition in ${timing}.`,
      astrologicalLogicEn: `10th house lord with ${p.dasha} Dasha creates professional elevation. Moon in ${p.moonSign} (${p.moonNak} nakshatra) adds focus. Bhagyank ${p.bhagyank} activates destiny cycle. Personal Year ${p.personalYr} is a peak action year.`,
      practicalRemedies: [
        gemRemedy,
        `Offer water to Sun every Sunday morning — ${p.mulankLord} strengthens your career aura.`,
        `Keep work desk facing East or North — aligns with ${p.lagna} Lagna energy.`,
        fsRemedy
      ]
    },
    marriage: {
      answerHinglish: `Namaste ${p.name} ji! Aapka Moon ${p.moonSign} rashi mein ${p.moonNak} nakshatra par hai — yeh emotional intelligence aur deep bonding ki nishani hai. 7th Bhava aur Venus ki position ${p.lagnaHi} lagna ke saath harmony create kar rahi hai. ${p.gender === 'female' ? 'Vivah ke liye auspicious proposals' : 'Rishte mein positive developments'} ${timing} mein aa rahe hain.`,
      answerEn: `Dear ${p.name}, Moon in ${p.moonSign} (${p.moonNak}) resonates beautifully with Venus in your ${p.lagna} chart. The 7th house (Kalatra Bhava) shows strong partnership energy during ${p.dasha} Dasha. Relationship milestone expected in ${timing}.`,
      astrologicalLogicEn: `Moon Nakshatra ${p.moonNak} + Venus in 7th house = strong marriage yoga. Dasha lord ${p.dasha} supports Venusian activities. Bhagyank ${p.bhagyank} adds destiny timing.`,
      practicalRemedies: [
        `${gem ? 'Wear ' + gem.gem + ' on ' + gem.finger + ' — Venus-ruled gem for love amplification.' : 'Wear white pearl or diamond on Friday.'}`,
        `Offer white flowers to Goddess Lakshmi every Friday — enhances Venus energy.`,
        `${ks ? 'Feng Shui: Activate South-West (love corner) with pink/red objects per Kua ' + ks.kua + '.' : 'Place rose quartz in South-West bedroom corner.'}`,
        `Chant "Om Shukraya Namah" 108 times on Friday evening.`
      ]
    },
    wealth: {
      answerHinglish: `Namaste ${p.name} ji! Dhana Bhava (2nd house) aur Labha Bhava (11th house) ka matrix aapke Bhagyank ${p.bhagyank} (${p.bhagyankLord}) ke saath multiple income streams ka strong yoga bana raha hai. ${p.houseNo ? `Ghar number ${p.houseNo} (moolaank ${p.houseRoot})` : 'Aapka Vastu'} optimize hone par cash inflow multiply hoga. ${timing} mein financial breakthrough expected hai.`,
      answerEn: `Dear ${p.name}, your Bhagyank ${p.bhagyank} (${p.bhagyankLord}) governs the wealth matrix. ${p.lagna} Ascendant with ${p.dasha} Dasha activating 2nd/11th houses creates wealth accumulation cycles. Financial breakthrough in ${timing}.`,
      astrologicalLogicEn: `Bhagyank ${p.bhagyank} lord ${p.bhagyankLord} activates financial trine (2-6-10). ${p.dasha} Dasha is supportive. Personal Year ${p.personalYr} creates an abundance cycle.`,
      practicalRemedies: [
        `${gem ? 'Wear ' + gem.gem + ' — activates ' + gem.planet + ' for wealth.' : 'Wear Yellow Sapphire for Jupiter wealth blessings.'}`,
        `Keep cash locker/safe facing North — Kubera's wealth zone activated.`,
        `${ks ? 'Feng Shui Kua ' + ks.kua + ': Activate ' + ks.luckyDirs[0] + ' with flowing water element.' : 'Place flowing water fountain in North for wealth flow.'}`,
        `Chant "Om Shreem Hreem Kleem Mahalaxmyai Namah" 21 times on Fridays.`
      ]
    },
    health: {
      answerHinglish: `Namaste ${p.name} ji! Medical astrology ke anusaar ${p.lagnaHi} lagna wale jatako ka constitution ${p.dosha || 'Vata-Pitta'} type ka hota hai. ${p.moonNak} nakshatra ke anusaar mind-body balance maintain karna zaroori hai. ${p.age ? `Aapki umar ${p.age} mein` : 'Is phase mein'} immunity strong karna top priority honi chahiye.`,
      answerEn: `Dear ${p.name}, your ${p.lagna} Ascendant governs specific body systems. Dosha: ${p.dosha || 'Vata-Pitta'}. Moon in ${p.moonNak} Nakshatra enhances mind-body connection. Prioritize preventive care and ${p.lagna}-element aligned diet.`,
      astrologicalLogicEn: `6th house (Roga Bhava) analysis + ${p.lagna} element diet recommendations. Moon Nakshatra ${p.moonNak} mind-body correlation. Dosha: ${p.dosha || 'Vata-Pitta'}.`,
      practicalRemedies: [
        `${gem ? 'Wear ' + gem.gem + ' — ' + gem.planet + ' planet governs your vitality.' : 'Wear Red Coral for Mars-ruled vitality.'}`,
        `Daily Anulom-Vilom Pranayama 10 minutes — balances ${p.dosha || 'Vata-Pitta'}.`,
        `Drink copper-vessel water every morning — ${p.lagna} element alignment.`,
        `Chant Maha Mrityunjaya Mantra 11 times for health protection.`
      ]
    },
    general: {
      answerHinglish: `Namaste ${p.name} ji! Aapki janam kundali (Lagna: ${p.lagnaHi}) aur numerology matrix (Mulank ${p.mulank} — ${p.mulankLord}, Bhagyank ${p.bhagyank} — ${p.bhagyankLord}) mein abhi ${p.dasha} Mahadasha chal rahi hai. Yeh period ${timing} mein manovaanchhit phal dega. ${p.place ? p.place + ' mein aapka karma' : 'Aapka karma'} seedha aapki destiny se connected hai.`,
      answerEn: `Dear ${p.name}, synthesizing your chart: ${p.lagna} Ascendant + Mulank ${p.mulank} (${p.mulankLord}) + Moon in ${p.moonSign} (${p.moonNak}) + ${p.dasha} Dasha — all aligned. Bhagyank ${p.bhagyank} is your destiny activator. Favorable manifestation in ${timing}.`,
      astrologicalLogicEn: `${p.dasha} Dasha lord creates favorable transits. Personal Year ${p.personalYr} is active. Bhagyank ${p.bhagyank} (${p.bhagyankLord}) synchronizes with current cosmic cycle.`,
      practicalRemedies: [
        `${gem ? 'Primary Gem: ' + gem.gem + ' set in ' + gem.metal + ' — wear on ' + gem.day + '.' : 'Wear Yellow Sapphire for Jupiter blessings.'}`,
        `Chant Gayatri Mantra 9 times every sunrise — aligns ${p.lagna} solar energy.`,
        `${ks ? 'Feng Shui: Face ' + ks.luckyDirs[0] + ' while working (Kua ' + ks.kua + ' = ' + ks.element + ').' : 'Face North-East while working for clarity.'}`,
        `Feed birds/animals on ${p.bhagyankLord?.includes('Saturn') ? 'Saturdays' : p.bhagyankLord?.includes('Jupiter') ? 'Thursdays' : 'Wednesdays'}.`
      ]
    }
  };

  const base = responses[domain] || responses.general;
  return {
    ...base,
    answerHi: base.answerHinglish,
    astrologicalLogicHi: base.astrologicalLogicEn,
    practicalRemediesHi: base.practicalRemedies,
    timingEn: timing,
    timingHi: timingHi,
    source: 'enriched-fallback'
  };
}

// ─── Main Entry Point ──────────────────────────────────────────────────────────
export async function processAstrologyQuery(userQuery = '', userProfile = {}, fullChartData = {}) {
  const query = (userQuery || '').trim();
  const lower  = query.toLowerCase();

  // Domain detection
  let domain = 'general';
  let domainNameEn = 'Life & General Destiny (सामान्य जीवन व भाग्य)';
  let domainNameHi = 'सामान्य जीवन व भाग्य';

  if (/(study|studies|education|educational|subject|stream|course|degree|college|school|university|academic|learning|padhai|vishay|shiksha|vidya)/i.test(lower)) {
    domain = 'education'; domainNameEn = 'Education & Study Field (शिक्षा व अध्ययन क्षेत्र)'; domainNameHi = 'शिक्षा व अध्ययन क्षेत्र';
  } else if (/(career|job|naukri|promotion|business|vyapar|dhandha|work|kaam|profession|office|interview|startup)/i.test(lower)) {
    domain = 'career'; domainNameEn = 'Career & Professional Ascension (कर्म व आजीविका)'; domainNameHi = 'कर्म व आजीविका';
  } else if (/(marriage|shadi|shaadi|vivah|love|pyar|pyaar|relationship|partner|husband|patni|pati|wife|divorce|rishta)/i.test(lower)) {
    domain = 'marriage'; domainNameEn = 'Love, Marriage & Relationships (दाम्पत्य व प्रेम संबंध)'; domainNameHi = 'दाम्पत्य व प्रेम संबंध';
  } else if (/(money|paisa|paise|wealth|dhan|finance|laxmi|loan|karz|debt|investment|share|profit|income)/i.test(lower)) {
    domain = 'wealth'; domainNameEn = 'Wealth, Prosperity & Inflow (धन व आर्थिक स्थिति)'; domainNameHi = 'धन व आर्थिक स्थिति';
  } else if (/(health|swasthya|bimar|bimari|dard|pain|illness|hospital|depression|anxiety|tension|stomach|headache)/i.test(lower)) {
    domain = 'health'; domainNameEn = 'Health & Ayurvedic Well-being (स्वास्थ्य व आरोग्य)'; domainNameHi = 'स्वास्थ्य व आरोग्य';
  } else if (/(vastu|ghar|makan|flat|house|disha|direction|room|kitchen|pooja|toilet|kuber)/i.test(lower)) {
    domain = 'vastu'; domainNameEn = 'Vastu Shastra & Spatial Harmony (गृह वास्तु व दिशा संतुलन)'; domainNameHi = 'गृह वास्तु व दिशा संतुलन';
  } else if (/(gem|ratan|ratna|stone|ruby|sapphire|pearl|emerald|coral|diamond)/i.test(lower)) {
    domain = 'gem'; domainNameEn = 'Gemstone & Ratna Recommendation (रत्न विज्ञान)'; domainNameHi = 'रत्न विज्ञान';
  } else if (/(feng|shui|kua|bagua|chi|qi|fengshui)/i.test(lower)) {
    domain = 'fengshui'; domainNameEn = 'Feng Shui & Kua Energy (फेंग शुई व कुआ ऊर्जा)'; domainNameHi = 'फेंग शुई व कुआ ऊर्जा';
  }

  // Extract parameters
  const name       = userProfile.name    || 'Priya Jataka';
  const gender     = userProfile.gender  || 'male';
  const age        = userProfile.age     || '';
  const place      = userProfile.place   || '';
  const houseNo    = userProfile.houseNo || '';

  const dob        = fullChartData.dobNumerology || {};
  const vedic      = fullChartData.vedicChart    || {};

  const mulank     = dob.mulank      || 5;
  const bhagyank   = dob.bhagyank    || 3;
  const mulankLord = dob.mulankLord  || 'Mercury';
  const bhagyankLord = dob.bhagyankLord || 'Jupiter';
  const personalYr = dob.personalYear || '';

  const lagna      = vedic.ascendant?.signEn  || 'Aries';
  const lagnaHi    = vedic.ascendant?.signHi  || 'मेष';
  const lagnaRuler = vedic.ascendant?.ruler   || 'Mars';
  const moonSign   = vedic.moonSign?.signEn   || 'Leo';
  const moonNak    = vedic.moonSign?.nakshatra || 'Rohini';
  const dasha      = vedic.vimshottariDasha?.startingLord || 'Jupiter';
  const planets    = vedic.planets || [];
  const dosha      = fullChartData.medicalAstro?.triDoshaBalance || 'Vata-Pitta';
  const houseRoot  = fullChartData.vastu?.houseNumberRoot || houseNo;
  const fifthPlanet = planets.find(planet => planet.house === 5);
  const ninthPlanet = planets.find(planet => planet.house === 9);
  const mercuryPlanet = planets.find(planet => planet.key === 'Mercury');
  const jupiterPlanet = planets.find(planet => planet.key === 'Jupiter');
  const fieldSignals = [fifthPlanet?.signEn, ninthPlanet?.signEn, mercuryPlanet?.signEn, jupiterPlanet?.signEn].filter(Boolean).join(', ');
  const studyField = /Mercury|Gemini|Virgo/i.test(fieldSignals)
    ? 'computer science, data, commerce, communication, or languages'
    : /Mars|Aries|Scorpio/i.test(fieldSignals)
      ? 'engineering, medicine, technology, or practical problem-solving fields'
      : /Jupiter|Sagittarius|Pisces/i.test(fieldSignals)
        ? 'law, teaching, research, finance, philosophy, or higher studies'
        : /Venus|Taurus|Libra/i.test(fieldSignals)
          ? 'design, media, arts, psychology, or business management'
          : 'a knowledge-led field combining analysis, communication, and structured learning';

  // Build Gem & Feng Shui recommendations
  const gemRec   = getGemRecommendation(lagnaRuler, mulank, dasha, moonNak);
  const fengShui = getFengShuiKua(userProfile.dob || '', gender);

  const p = { name, gender, age, place, houseNo, query, mulank, bhagyank, mulankLord, bhagyankLord, personalYr,
               lagna, lagnaHi, lagnaRuler, moonSign, moonNak, dasha, planets, dosha, houseRoot,
               fifthPlanet: fifthPlanet?.nameEn, ninthPlanet: ninthPlanet?.nameEn,
               mercuryHouse: mercuryPlanet?.house, mercurySign: mercuryPlanet?.signEn,
               jupiterSign: jupiterPlanet?.signEn, studyField };

  // Try Gemini AI first
  const systemPrompt = buildSystemPrompt();
  const userContext  = buildUserContext(query, userProfile, fullChartData, domain, gemRec, fengShui);
  const geminiText   = await callGeminiAPI(systemPrompt, userContext);
  const openAIText   = geminiText ? null : await callOpenAIAPI(systemPrompt, userContext);
  const aiText       = geminiText || openAIText;
  const aiSource     = geminiText ? 'gemini-ai' : 'openai';
  const aiResponse   = parseGeminiResponse(aiText, domain, domainNameEn, p, aiSource);

  const responseData = aiResponse || buildFallbackResponse(domain, p, gemRec, fengShui);

  // Always compute horary
  const horary = calculateHoraryChart(query, domain);
  const verdict = new Date().getHours() < 12 ? 'Highly Favorable ✨' : 'Moderately Favorable 🌙';

  return {
    queryReceived: query,
    detectedDomain: domain,
    domainNameEn,
    domainNameHi,
    confidence: `${93 + (mulank % 5)}.${bhagyank}% Astrological Pattern Match`,
    source: responseData.source || 'enriched-fallback',
    horaryVerdict: horary?.verdictEn || verdict,
    gemRecommendation: {
      primary: gemRec.primary,
      dasha: gemRec.dasha,
      mulank: gemRec.mulank
    },
    fengShui: fengShui ? {
      kua: fengShui.kua,
      element: fengShui.element,
      group: fengShui.group,
      luckyDirections: fengShui.luckyDirs,
      color: fengShui.color,
      advice: fengShui.advice,
      luckyDirHi: fengShui.luckyDirHi
    } : null,
    ...responseData
  };
}
