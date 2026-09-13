/**
 * Client-Side Vedic Oracle Engine — KundliGPT-Level
 * ─────────────────────────────────────────────────────────────────────────────
 * Mirrors the backend aiAstrologer.js but runs entirely in the browser.
 * Takes (query, userProfile, chartSummary) and returns deeply personalised,
 * parameter-driven astrological responses. Includes Gem & Feng Shui guidance.
 */

// ─── Gem Database ──────────────────────────────────────────────────────────────
const GEM_DB = {
  'Sun':     { gem: 'Ruby (माणिक्य)',              metal: 'Gold',   finger: 'Ring Finger', day: 'Sunday',    color: '#DC2626', bgColor: '#FEF2F2' },
  'Moon':    { gem: 'Pearl (मोती)',                 metal: 'Silver', finger: 'Little Finger', day: 'Monday',  color: '#0369A1', bgColor: '#EFF6FF' },
  'Mars':    { gem: 'Red Coral (मूंगा)',            metal: 'Copper', finger: 'Ring Finger', day: 'Tuesday',   color: '#B91C1C', bgColor: '#FEF2F2' },
  'Mercury': { gem: 'Emerald (पन्ना)',              metal: 'Gold',   finger: 'Little Finger', day: 'Wednesday', color: '#059669', bgColor: '#F0FDF4' },
  'Jupiter': { gem: 'Yellow Sapphire (पुखराज)',    metal: 'Gold',   finger: 'Index Finger', day: 'Thursday', color: '#B45309', bgColor: '#FFFBEB' },
  'Venus':   { gem: 'Diamond / Opal (हीरा/ओपल)',  metal: 'Silver', finger: 'Middle Finger', day: 'Friday',  color: '#7C3AED', bgColor: '#FAF5FF' },
  'Saturn':  { gem: 'Blue Sapphire (नीलम)',        metal: 'Iron',   finger: 'Middle Finger', day: 'Saturday', color: '#1D4ED8', bgColor: '#EFF6FF' },
  'Rahu':    { gem: 'Hessonite Garnet (गोमेद)',    metal: 'Silver', finger: 'Middle Finger', day: 'Saturday', color: '#475569', bgColor: '#F8FAFC' },
  'Ketu':    { gem: "Cat's Eye (लहसुनिया)",        metal: 'Silver', finger: 'Little Finger', day: 'Thursday', color: '#6D28D9', bgColor: '#FAF5FF' }
};

const MULANK_TO_PLANET = { 1:'Sun', 2:'Moon', 3:'Jupiter', 4:'Rahu', 5:'Mercury', 6:'Venus', 7:'Ketu', 8:'Saturn', 9:'Mars' };

// ─── Feng Shui Kua Database ────────────────────────────────────────────────────
const KUA_DB = {
  1: { element:'Water (जल)',         group:'East', dirs:['North','South','East','South-East'], color:'Blue & Black', emoji:'💧' },
  2: { element:'Earth (पृथ्वी)',    group:'West', dirs:['South-West','West','North-West','North-East'], color:'Brown & Yellow', emoji:'🌍' },
  3: { element:'Thunder/Wood',       group:'East', dirs:['South','North','South-East','East'], color:'Green & Teal', emoji:'⚡' },
  4: { element:'Wind/Wood (वायु)',   group:'East', dirs:['North','South','East','South-East'], color:'Green & Purple', emoji:'🌿' },
  6: { element:'Heaven/Metal (धातु)',group:'West', dirs:['West','North-East','South-West','North-West'], color:'White & Gold', emoji:'⚙️' },
  7: { element:'Lake/Metal (सरोवर)',group:'West', dirs:['North-East','West','South-West','North-West'], color:'White & Silver', emoji:'🏔️' },
  8: { element:'Mountain/Earth',     group:'West', dirs:['South-West','West','North-East','North-West'], color:'Beige & Yellow', emoji:'🗻' },
  9: { element:'Fire (अग्नि)',       group:'East', dirs:['East','South-East','North','South'], color:'Red & Orange', emoji:'🔥' }
};

// ─── Calculate Kua Number ─────────────────────────────────────────────────────
function calculateKua(dobString, gender) {
  try {
    const year = new Date(dobString).getFullYear();
    if (isNaN(year)) return null;
    let ys = year.toString().split('').reduce((s,x)=>s+parseInt(x),0);
    while (ys > 9) ys = ys.toString().split('').reduce((s,x)=>s+parseInt(x),0);
    let kua = gender?.toLowerCase()==='female' ? ys+4 : 11-ys;
    while (kua > 9) kua = kua.toString().split('').reduce((s,x)=>s+parseInt(x),0);
    if (kua===5) kua = gender?.toLowerCase()==='female' ? 8 : 2;
    return KUA_DB[kua] ? { kua, ...KUA_DB[kua] } : null;
  } catch { return null; }
}

// ─── Domain Detection ────────────────────────────────────────────────────────
export function detectDomain(query) {
  const lower = (query || '').toLowerCase();
  if (/(study|studies|education|educational|subject|stream|course|degree|college|school|university|academic|learning|padhai|vishay|shiksha|vidya)/i.test(lower))
    return { domain:'education', domainNameEn:'Education & Study Field (शिक्षा व अध्ययन क्षेत्र)', domainNameHi:'शिक्षा व अध्ययन क्षेत्र' };
  if (/(career|job|naukri|promotion|business|vyapar|dhandha|work|kaam|profession|office|interview|startup)/i.test(lower))
    return { domain:'career', domainNameEn:'Career & Professional Ascension (कर्म व आजीविका)', domainNameHi:'कर्म व आजीविका' };
  if (/(marriage|shadi|shaadi|vivah|love|pyar|pyaar|relationship|partner|husband|patni|pati|wife|divorce|rishta)/i.test(lower))
    return { domain:'marriage', domainNameEn:'Love, Marriage & Relationships (दाम्पत्य व प्रेम संबंध)', domainNameHi:'दाम्पत्य व प्रेम संबंध' };
  if (/(money|paisa|paise|wealth|dhan|finance|laxmi|loan|karz|debt|investment|share|profit|income)/i.test(lower))
    return { domain:'wealth', domainNameEn:'Wealth, Prosperity & Inflow (धन व आर्थिक स्थिति)', domainNameHi:'धन व आर्थिक स्थिति' };
  if (/(health|swasthya|bimar|bimari|dard|pain|illness|hospital|depression|anxiety|tension|stomach|headache|pet)/i.test(lower))
    return { domain:'health', domainNameEn:'Health & Ayurvedic Well-being (स्वास्थ्य व आरोग्य)', domainNameHi:'स्वास्थ्य व आरोग्य' };
  if (/(vastu|ghar|makan|flat|house|disha|direction|room|kitchen|pooja|toilet|kuber)/i.test(lower))
    return { domain:'vastu', domainNameEn:'Vastu Shastra & Spatial Harmony (गृह वास्तु व दिशा संतुलन)', domainNameHi:'गृह वास्तु व दिशा संतुलन' };
  if (/(mobile|number|phone|sim|lucky number|ank|mulank|bhagyank)/i.test(lower))
    return { domain:'numerology', domainNameEn:'Numerology & Vibration Matrix (अंक विज्ञान व मोबाइल ऊर्जा)', domainNameHi:'अंक विज्ञान व मोबाइल ऊर्जा' };
  if (/(foreign|videsh|visa|bahar|travel|pr|citizenship|yatra)/i.test(lower))
    return { domain:'travel', domainNameEn:'Foreign Relocation & Travel (विदेश यात्रा व योग)', domainNameHi:'विदेश यात्रा व योग' };
  if (/(muhurta|shubh time|aaj ka time|samay|choghadiya|rahu kaal)/i.test(lower))
    return { domain:'muhurta', domainNameEn:'Electional Shubh Muhurta (शुभ मुहूर्त व पंचांग)', domainNameHi:'शुभ मुहूर्त व पंचांग' };
  if (/(gem|ratna|ratan|stone|ruby|sapphire|pearl|emerald|coral|heera|neelam|pukhraj|moonga|moti)/i.test(lower))
    return { domain:'gem', domainNameEn:'Gemstone & Ratna Recommendation (रत्न विज्ञान)', domainNameHi:'रत्न विज्ञान' };
  if (/(feng|shui|kua|fengshui|bagua|chi|qi)/i.test(lower))
    return { domain:'fengshui', domainNameEn:'Feng Shui & Kua Energy (फेंग शुई व कुआ)', domainNameHi:'फेंग शुई व कुआ ऊर्जा' };
  return { domain:'general', domainNameEn:'Life & General Destiny (सामान्य जीवन व भाग्य)', domainNameHi:'सामान्य जीवन व भाग्य' };
}

export function understandQuery(query = '') {
  const text = query.trim();
  const lower = text.toLowerCase();
  const relationship = /(sibling|brother|sister|bhai|behen|बहन|भाई)/i.test(lower) ? 'sibling'
    : /(mother|mom|father|dad|parent|maa|mata|papa|pitaji|माता|पिता)/i.test(lower) ? 'parent'
      : /(spouse|husband|wife|partner|पति|पत्नी|जीवनसाथी)/i.test(lower) ? 'partner'
        : /(child|son|daughter|beta|beti|बेटा|बेटी)/i.test(lower) ? 'child' : 'owner';
  const timeframe = /(current|currently|now|present|today|at present|this year|this month|abhi|vartaman|अभी|वर्तमान|इस साल|इस वर्ष)/i.test(lower) ? 'current'
    : /(when|kab|date|timing|time|period|कब|समय)/i.test(lower) ? 'timing' : 'general';
  const topic = /(study|studies|education|subject|course|degree|college|school|academic|learning|padhai|shiksha|विद्या|पढ़ाई)/i.test(lower) ? 'education'
    : /(career|job|work|profession|business|promotion|naukri|career)/i.test(lower) ? 'career'
      : /(marriage|love|relationship|shadi|vivah|विवाह|प्रेम)/i.test(lower) ? 'relationship'
        : /(health|illness|disease|pain|health|swasthya|बीमारी|स्वास्थ्य)/i.test(lower) ? 'health'
          : /(money|wealth|income|finance|financial|finances|paisa|dhan|धन|आय)/i.test(lower) ? 'wealth'
            : /(travel|foreign|visa|relocation|videsh|विदेश)/i.test(lower) ? 'travel'
              : /(gem|stone|ratna|रत्न)/i.test(lower) ? 'gem'
                : /(vastu|feng|shui|direction|house|ghar|कुआ|वास्तु)/i.test(lower) ? 'space' : 'general';
  return {
    original: text,
    subject: relationship,
    topic,
    timeframe,
    asksFor: /(what|which|kaunsa|kya|क्या|कौन)/i.test(lower) ? 'interpretation' : 'guidance',
    needsDerivedFamilyHouses: relationship !== 'owner'
  };
}

// ─── Extract All Parameters ────────────────────────────────────────────────────
function extractParams(userProfile = {}, chartSummary = {}) {
  const dob     = userProfile.dob || '';
  const dobData = chartSummary?.dobNumerology   || {};
  const vedic   = chartSummary?.vedicChart      || {};
  const mobile  = chartSummary?.mobileNumerology || {};
  const vastu   = chartSummary?.vastu           || {};
  const medical = chartSummary?.medicalAstro    || {};
  const nameData= chartSummary?.nameDecoder     || {};
  const birth   = chartSummary?.birthdayMonth   || {};

  const name    = userProfile.name   || 'Priya Jataka';
  const gender  = userProfile.gender || 'male';
  const age     = userProfile.age    || (dob ? Math.max(0, new Date().getFullYear() - new Date(dob).getFullYear()) : '');
  const place   = userProfile.place  || '';
  const houseNo = userProfile.houseNo || '';

  const mulank     = dobData.mulank    ?? 5;
  const bhagyank   = dobData.bhagyank  ?? 3;
  const personalYr = dobData.personalYear || '';
  const mulankLord = dobData.mulankLord   || 'Mercury (बुध)';
  const bhagyankLord = dobData.bhagyankLord || 'Jupiter (बृहस्पति)';
  const loShu     = dobData.loShuGrid    || {};
  const kuaNumber = dobData.kuaNumber || null;

  const lagnaEn   = vedic?.ascendant?.signEn  || '';
  const lagnaHi   = vedic?.ascendant?.signHi  || '';
  const lagnaRuler= vedic?.ascendant?.ruler   || '';
  const moonSignEn= vedic?.moonSign?.signEn   || '';
  const moonSignHi= vedic?.moonSign?.signHi   || '';
  const moonNak   = vedic?.moonSign?.nakshatra || '';
  const sunSignEn = vedic?.sunSign?.signEn    || '';
  const dasha     = vedic?.vimshottariDasha?.startingLord || '';
  const planets   = vedic?.planets            || [];
  const houses    = vedic?.houses              || [];

  const mobileDigit  = mobile?.singleDigit   || '';
  const mobilePlanet = mobile?.planetaryRuler || '';
  const mobileNature = mobile?.nature        || '';
  const mobileSuit   = mobile?.suitability?.businessScore || '';

  const houseRoot   = vastu?.houseNumberRoot || houseNo;
  const houseRuler  = vastu?.houseRuler      || '';
  const dosha       = medical?.triDoshaBalance || '';
  const ascSignMed  = medical?.ascendantSign   || lagnaEn;
  const chaldean    = nameData?.chaldeanCompound || '';

  // ─ Gem recommendation ─
  const parsePlanet = (str) => {
    const s = (str||'').toLowerCase();
    if (s.includes('sun')||s.includes('सूर्य'))        return 'Sun';
    if (s.includes('moon')||s.includes('चंद्र'))       return 'Moon';
    if (s.includes('mars')||s.includes('मंगल'))        return 'Mars';
    if (s.includes('mercury')||s.includes('बुध'))      return 'Mercury';
    if (s.includes('jupiter')||s.includes('बृहस्पति')) return 'Jupiter';
    if (s.includes('venus')||s.includes('शुक्र'))      return 'Venus';
    if (s.includes('saturn')||s.includes('शनि'))       return 'Saturn';
    if (s.includes('rahu')||s.includes('राहु'))        return 'Rahu';
    if (s.includes('ketu')||s.includes('केतु'))        return 'Ketu';
    return null;
  };
  const lagnaKey  = parsePlanet(lagnaRuler)  || 'Sun';
  const dashaKey  = parsePlanet(dasha)       || 'Jupiter';
  const mulankKey = MULANK_TO_PLANET[mulank] || 'Mercury';

  const primaryGem = GEM_DB[lagnaKey];
  const dashaGem   = GEM_DB[dashaKey];
  const mulankGem  = GEM_DB[mulankKey];

  const gemRec = {
    primary: { planet: lagnaKey, ...primaryGem, type: 'Lagna Lord Gem (लग्नेश रत्न)' },
    dasha:   { planet: dashaKey, ...dashaGem,   type: 'Active Dasha Gem (दशा रत्न)' },
    mulank:  { planet: mulankKey, ...mulankGem, type: 'Mulank Gem (मूलांक रत्न)' }
  };

  // ─ Feng Shui ─
  const fengShui = calculateKua(dob, gender) || (kuaNumber ? { kua: kuaNumber, ...KUA_DB[kuaNumber] } : null);

  // ─ Timing — use date/lunar cycle for variety ─
  const now     = new Date();
  const dayOfM  = now.getDate();
  const timeVar = (dayOfM + mulank + (bhagyank * 3)) % 7;
  const timingWeeks = 2 + timeVar;
  const timingDays  = timingWeeks * 7;
  const timing    = `${timingDays - 7} to ${timingDays + 10} days`;
  const timingHi  = `${timingDays - 7} से ${timingDays + 10} दिनों में`;

  const nowHour   = now.getHours();
  const verdict   = nowHour < 12 ? 'Highly Favorable ✨' : 'Moderately Favorable 🌙';
  const verdictHi = nowHour < 12 ? 'अत्यधिक अनुकूल ✨' : 'सामान्यतः अनुकूल 🌙';

  return {
    name, gender, age, place, houseNo,
    mulank, bhagyank, mulankLord, bhagyankLord, personalYr, loShu,
    lagnaEn, lagnaHi, lagnaRuler, moonSignEn, moonSignHi, moonNak,
    sunSignEn, dasha, planets, houses,
    mobileDigit, mobilePlanet, mobileNature, mobileSuit,
    houseRoot, houseRuler,
    dosha, ascSignMed,
    chaldean, birth,
    verdict, verdictHi, timing, timingHi,
    gemRec, fengShui
  };
}

// ─── Build Gem + Feng Shui Remedies ───────────────────────────────────────────
function gemAndFsRemedies(p) {
  const g = p.gemRec?.primary;
  const fs = p.fengShui;
  const remedies = [];
  if (g) {
    remedies.push(`💎 Wear ${g.gem} set in ${g.metal} on your ${g.finger} every ${g.day} — activates ${g.planet} energy (your Lagna lord).`);
  }
  if (fs) {
    remedies.push(`☯️ Feng Shui (Kua ${fs.kua} — ${fs.element}): Face ${fs.dirs[0]} while working. Use ${fs.color} accents in your workspace.`);
  }
  return remedies;
}

// ─── Domain Response Generators ───────────────────────────────────────────────
function careerResponse(p) {
  const planet10th = p.planets.find(pl => pl.house === 10)?.nameEn || 'karmic planet';
  const extraRemedies = gemAndFsRemedies(p);
  return {
    answerHinglish: `Namaste ${p.name} ji! Aapki kundali mein Lagna '${p.lagnaHi}' aur 10th Bhava (Karma Bhava) mein ${planet10th} ki sthiti ek bahut strong career signal de rahi hai. Aapka Mulank ${p.mulank} (${p.mulankLord}) aur Bhagyank ${p.bhagyank} (${p.bhagyankLord}) ka powerful combination professional growth ke liye exceptional hai. ${p.dasha} Mahadasha chal rahi hai jo career ascension ka best period hai. ${p.place ? p.place + ' mein' : ''} ${p.timing} mein promotion ya naya opportunity aane ke strong yoga hain.`,
    answerEn: `Greetings ${p.name}! Your ${p.lagnaEn} Ascendant (ruled by ${p.lagnaRuler}) with ${p.dasha} Mahadasha energizes the 10th house (Karma Bhava). ${planet10th} in the 10th creates strong professional momentum. Mulank ${p.mulank} (${p.mulankLord}) + Bhagyank ${p.bhagyank} (${p.bhagyankLord}) form a career success matrix. Personal Year ${p.personalYr} is an action cycle. Expected: recognition & new opportunities in ${p.timing}.`,
    answerHi: `नमस्ते ${p.name} जी! आपकी कुंडली में ${p.lagnaHi} लग्न और दशम भाव (कर्म भाव) में ${planet10th} की सुदृढ़ स्थिति है। ${p.dasha} महादशा और मूलांक ${p.mulank} (${p.mulankLord}) का संयोग पदोन्नति के प्रबल योग बनाता है। ${p.timingHi} में नए व्यावसायिक अवसर आएंगे।`,
    astrologicalLogicEn: `10th lord receiving ${p.dasha} Dasha gaze in ${p.lagnaEn} Lagna. Moon Nakshatra ${p.moonNak} shows focus & ambition. Personal Year ${p.personalYr} is a peak manifestation cycle. Horary verdict: ${p.verdict}.`,
    astrologicalLogicHi: `दशमेश पर ${p.dasha} दशा की दृष्टि। ${p.moonNak} नक्षत्र में चंद्र की एकाग्रता। व्यक्तिगत वर्ष ${p.personalYr} शीर्ष कर्म चक्र। प्रश्न फल: ${p.verdictHi}।`,
    practicalRemedies: [
      ...extraRemedies,
      `🌞 Offer water to Sun every morning — ${p.mulankLord} strengthens your Karma Bhava.`,
      `🧭 Keep work desk facing North or East — aligns with ${p.lagnaEn} Lagna energy.`,
      `📿 Chant 'Om ${(p.mulankLord||'').split(' ')[0] || 'Suryaya'} Namah' 108 times on ${p.gemRec?.primary?.day || 'Sunday'}.`
    ],
    practicalRemediesHi: [
      `💎 ${p.gemRec?.primary?.gem || 'अनुकूल रत्न'} ${p.gemRec?.primary?.metal || 'सोने'} में ${p.gemRec?.primary?.day || 'रविवार'} को धारण करें।`,
      `🌞 प्रातःकाल तांबे के लोटे से ${p.mulankLord} को जल अर्पित करें।`,
      `🧭 कार्यस्थल की मेज उत्तर या पूर्व की ओर रखें।`,
      `📿 ${p.gemRec?.primary?.day || 'रविवार'} को 108 बार 'ॐ ${(p.mulankLord||'').split(' ')[0] || 'सूर्याय'} नमः' जप करें।`
    ]
  };
}

function educationResponse(p, query = '') {
  const asksAboutSibling = /(sibling|brother|sister|bhai|behen|बहन|भाई)/i.test(query);
  if (asksAboutSibling) {
    // From the owner's chart, siblings are read through H3/H11. Their
    // education is then judged through the 5th and 9th houses from that point.
    const siblingHouses = [3, 11];
    const siblingEducationHouses = [7, 9, 11, 3];
    const siblingPlanets = p.planets.filter(pl => siblingHouses.includes(pl.house));
    const educationPlanets = p.planets.filter(pl => siblingEducationHouses.includes(pl.house));
    const indicators = [...siblingPlanets, ...educationPlanets]
      .filter((planet, index, planets) => planets.findIndex(item => item.key === planet.key) === index);
    const siblingIndicators = indicators.map(pl => `${pl.nameEn} in H${pl.house} (${pl.signEn})`).join(', ') || 'the sibling and education house rulers';
    const signalText = indicators.map(pl => `${pl.key} ${pl.signEn || ''}`).join(' ');
    const likelyField = /Mercury|Gemini|Virgo/i.test(signalText)
      ? 'commerce, computing, languages, data, or communication'
      : /Mars|Aries|Scorpio/i.test(signalText)
        ? 'engineering, medicine, technology, or applied sciences'
        : /Jupiter|Sagittarius|Pisces/i.test(signalText)
          ? 'law, teaching, finance, research, or higher academic studies'
          : /Venus|Taurus|Libra/i.test(signalText)
            ? 'design, media, arts, psychology, or management'
            : 'a structured academic field with analysis and practical application';
    return {
      answerHinglish: `Aapke sibling ke studies ke liye pehle 3rd/11th Bhava se sibling axis aur uske baad us axis se 5th/9th education houses dekhe jaate hain. Aapke chart mein ${siblingIndicators} ke pattern se ${likelyField} ka strong inclination dikh raha hai. ${p.dasha} Dasha, ${p.moonNak} Nakshatra aur Mulank ${p.mulank} is tendency ko support karte hain; current course ka final result unke actual interest aur performance se confirm hoga.`,
      answerEn: `For your sibling, I read the 3rd and 11th houses from your chart for the sibling axis, then derive that sibling's 5th and 9th education houses. The combined pattern (${siblingIndicators}) points most strongly toward ${likelyField}. Your active ${p.dasha} Dasha, ${p.moonNak} Nakshatra, and Mulank ${p.mulank} reinforce the learning tendency. This is a chart-based direction, not a claim about a school record that was not supplied.`,
      answerHi: `आपके भाई या बहन की पढ़ाई देखने के लिए आपकी कुंडली में पहले तीसरे और ग्यारहवें भाव से sibling axis और फिर उससे पंचम व नवम शिक्षा भाव निकाले जाते हैं। ${siblingIndicators} के संयुक्त संकेत ${likelyField} की ओर झुकाव दिखाते हैं। ${p.dasha} दशा, ${p.moonNak} नक्षत्र और मूलांक ${p.mulank} इस अध्ययन प्रवृत्ति को बल देते हैं।`,
      astrologicalLogicEn: `Owner chart method: sibling axis = H3/H11; sibling education derivative = H7/H9/H11/H3. Observed placements: ${siblingIndicators}. Cross-check: ${p.lagnaEn} Lagna, Moon Nakshatra ${p.moonNak}, Dasha ${p.dasha}, Mulank ${p.mulank}, Bhagyank ${p.bhagyank}.`,
      astrologicalLogicHi: `गणना: sibling axis = तीसरा/ग्यारहवां भाव; sibling education derivative = सातवां/नवम/ग्यारहवां/तीसरा भाव। ग्रह स्थिति: ${siblingIndicators}। लग्न ${p.lagnaEn}, नक्षत्र ${p.moonNak}, दशा ${p.dasha} और मूलांक ${p.mulank} से cross-check किया गया।`,
      practicalRemedies: [`📚 Encourage the sibling toward ${likelyField}, then compare it with their marks and genuine interests.`, `🧠 Use a weekly study plan and active recall during the current ${p.dasha} period.`, `🗣️ Ask the sibling directly about their preferred subject before making a course decision.`],
      practicalRemediesHi: [`📚 भाई या बहन की रुचि और अंकों से ${likelyField} संकेत का मिलान करें।`, '🧠 साप्ताहिक अध्ययन योजना और active recall अपनाएं।', '🗣️ विषय चुनने से पहले उनकी वास्तविक पसंद अवश्य पूछें।']
    };
  }
  const fifth = p.planets.find(pl => pl.house === 5);
  const ninth = p.planets.find(pl => pl.house === 9);
  const mercury = p.planets.find(pl => pl.key === 'Mercury');
  const jupiter = p.planets.find(pl => pl.key === 'Jupiter');
  const fieldSignals = [fifth?.signEn, ninth?.signEn, mercury?.signEn, jupiter?.signEn].filter(Boolean).join(', ');
  const field = /Mercury|Gemini|Virgo/i.test(fieldSignals)
    ? 'computer science, data, commerce, communication, or languages'
    : /Mars|Aries|Scorpio/i.test(fieldSignals)
      ? 'engineering, medicine, technology, or practical problem-solving fields'
      : /Jupiter|Sagittarius|Pisces/i.test(fieldSignals)
        ? 'law, teaching, research, finance, philosophy, or higher studies'
        : /Venus|Taurus|Libra/i.test(fieldSignals)
          ? 'design, media, arts, psychology, or business management'
          : 'a knowledge-led field combining analysis, communication, and structured learning';
  const extraRemedies = gemAndFsRemedies(p);
  return {
    answerHinglish: `Namaste ${p.name} ji! Aapke 5th Bhava (buddhi) aur 9th Bhava (higher education) ke signals ke anusaar ${field} aapke liye suitable dikhte hain. Mercury ${mercury ? `H${mercury.house} mein ${mercury.signEn}` : 'aur Jupiter'} ki influence learning aur subject selection ko guide karti hai. Current ${p.dasha} Dasha mein ek primary field choose karke specialization karna beneficial rahega.`,
    answerEn: `Based on your ${p.lagnaEn} Ascendant, the 5th-house intellect axis, 9th-house higher-education axis, and Mercury/Jupiter indicators, your strongest study direction is ${field}. ${mercury ? `Mercury is placed in house ${mercury.house} (${mercury.signEn})` : 'Mercury is a key academic significator'}${jupiter ? ` and Jupiter in house ${jupiter.house} (${jupiter.signEn})` : ''}. Treat this as an astrological aptitude signal, then confirm it with your interests, marks, and real-world guidance.`,
    answerHi: `नमस्ते ${p.name} जी! पंचम भाव की बुद्धि और नवम भाव की उच्च शिक्षा के संकेतों के अनुसार आपके लिए ${field} उपयुक्त दिखाई देता है। बुध और गुरु की स्थिति अध्ययन, तर्क और विषय चयन को प्रभावित करती है। ${p.dasha} दशा में एक मुख्य क्षेत्र चुनकर नियमित अभ्यास करना लाभदायक रहेगा।`,
    astrologicalLogicEn: `5th-house planet: ${fifth?.nameEn || 'not occupied'}; 9th-house planet: ${ninth?.nameEn || 'not occupied'}; Mercury: ${mercury?.signEn || 'not available'}; Jupiter: ${jupiter?.signEn || 'not available'}. These are the chart indicators used for the study-field suggestion.`,
    astrologicalLogicHi: `पंचम भाव: ${fifth?.nameEn || 'कोई ग्रह नहीं'}; नवम भाव: ${ninth?.nameEn || 'कोई ग्रह नहीं'}; बुध: ${mercury?.signEn || 'उपलब्ध नहीं'}; गुरु: ${jupiter?.signEn || 'उपलब्ध नहीं'}। इन्हीं संकेतों से अध्ययन क्षेत्र का सुझाव दिया गया है।`,
    practicalRemedies: [...extraRemedies, `📚 Study facing ${p.fengShui?.dirs?.[0] || 'East or North'} and keep one fixed daily study block.`, '🧠 Use active recall and weekly revision for stronger retention.'],
    practicalRemediesHi: [`📚 ${p.fengShui?.dirs?.[0] || 'पूर्व या उत्तर'} दिशा की ओर मुख करके पढ़ाई करें।`, '🧠 सक्रिय पुनरावृत्ति और साप्ताहिक रिविजन अपनाएं।']
  };
}

function familyResponse(p, intent) {
  const houseMap = {
    sibling: [3, 11],
    parent: [4, 9],
    partner: [7],
    child: [5]
  };
  const relevantHouses = houseMap[intent.subject] || [];
  const derivedHouses = intent.topic === 'education' ? relevantHouses.flatMap(house => [(house + 4) % 12 || 12, (house + 8) % 12 || 12]) : relevantHouses;
  const placements = p.planets.filter(planet => [...relevantHouses, ...derivedHouses].includes(planet.house));
  const placementText = placements.length
    ? placements.map(planet => `${planet.nameEn} in H${planet.house} (${planet.signEn})`).join(', ')
    : 'the relevant house rulers and their condition';
  const subjectLabel = { sibling: 'your sibling', parent: 'your parent', partner: 'your partner', child: 'your child' }[intent.subject] || 'your family member';
  const topicLabel = { education: 'education and learning', career: 'career and direction', relationship: 'relationships', health: 'health tendencies', wealth: 'finances', travel: 'travel and relocation', space: 'home and environment' }[intent.topic] || 'the area asked about';
  const currentText = intent.timeframe === 'current' ? ' for the current phase' : '';
  return {
    answerHinglish: `Aapke ${subjectLabel} ke ${topicLabel}${currentText} ko owner chart ke derived houses se dekha jaata hai. ${placementText} is pattern ko influence karte hain. ${p.dasha} Dasha, ${p.moonNak} Nakshatra, Mulank ${p.mulank}, Bhagyank ${p.bhagyank} aur ${p.lagnaEn} Lagna ko saath mein dekhne par is area mein ek meaningful tendency banti hai; exact real-world result ko family member ki situation ke saath verify karein.`,
    answerEn: `For ${subjectLabel}'s ${topicLabel}${currentText}, I am using derived family houses from the owner's chart rather than applying the owner's reading directly. Relevant placements are ${placementText}. Cross-checking ${p.lagnaEn} Ascendant, Moon Nakshatra ${p.moonNak}, ${p.dasha} Dasha, Mulank ${p.mulank}, Bhagyank ${p.bhagyank}, and the requested timeframe gives a chart-based tendency, not an invented literal record.`,
    answerHi: `आपके ${subjectLabel} के ${topicLabel} को स्वामी की कुंडली से derived family houses द्वारा देखा गया है। संबंधित ग्रह स्थिति: ${placementText}। लग्न, नक्षत्र, दशा, मूलांक और भाग्यांक को साथ देखकर संकेत निकाला गया है; वास्तविक स्थिति से इसका मिलान करें।`,
    astrologicalLogicEn: `Question model: subject=${intent.subject}, topic=${intent.topic}, timeframe=${intent.timeframe}. Primary family houses: ${relevantHouses.join(', ') || 'none'}; derived topic houses: ${derivedHouses.join(', ') || 'none'}. Placements used: ${placementText}.`,
    astrologicalLogicHi: `प्रश्न मॉडल: विषय=${intent.subject}, क्षेत्र=${intent.topic}, समय=${intent.timeframe}। मुख्य family houses: ${relevantHouses.join(', ') || 'none'}; derived houses: ${derivedHouses.join(', ') || 'none'}। ग्रह स्थिति: ${placementText}।`,
    practicalRemedies: [`Discuss the question directly with the ${subjectLabel} and compare the chart tendency with facts.`, `Use the relevant ${topicLabel} houses as guidance, not as a substitute for decisions or professional advice.`, `Revisit the interpretation when the Dasha or life circumstances change.`],
    practicalRemediesHi: [`${subjectLabel} से सीधे बात करके संकेतों का वास्तविक स्थिति से मिलान करें।`, 'ज्योतिषीय संकेत को मार्गदर्शन मानें, अंतिम प्रमाण नहीं।']
  };
}

function marriageResponse(p) {
  const extraRemedies = gemAndFsRemedies(p);
  return {
    answerHinglish: `Namaste ${p.name} ji! Aapka Moon ${p.moonSignEn} rashi mein ${p.moonNak} nakshatra par hai — emotional depth aur deep bonding ki exceptional nishani. 7th Bhava (Kalatra Bhava) aur Venus ka ${p.lagnaHi} lagna ke saath harmony ek strong relationship yoga banata hai. ${p.dasha} Mahadasha ke dauran ${p.timing} mein ${p.gender === 'female' ? 'vivah ke shubh proposals' : 'rishton mein positive developments'} expect karo.`,
    answerEn: `Greetings ${p.name}! Moon in ${p.moonSignEn} (${p.moonNak} Nakshatra) creates deep emotional intelligence. Your ${p.lagnaEn} Ascendant with ${p.dasha} Dasha activates the 7th house (Kalatra Bhava). Strong relationship/marriage yoga visible in ${p.timing}.`,
    answerHi: `नमस्ते ${p.name} जी! चंद्र ${p.moonSignHi} राशि में ${p.moonNak} नक्षत्र पर है — भावनात्मक गहराई असाधारण है। ${p.dasha} महादशा में 7वें भाव की सक्रियता से ${p.timingHi} में विवाह/प्रेम में शुभ योग हैं।`,
    astrologicalLogicEn: `Moon in ${p.moonNak} nakshatra + Venus in 7th house = strong partnership yoga. ${p.dasha} Dasha lord activates Kalatra Bhava. Horary: ${p.verdict}.`,
    astrologicalLogicHi: `${p.moonNak} नक्षत्र में चंद्र + सप्तम भाव में शुक्र = विवाह योग। ${p.dasha} दशेश की कृपा। प्रश्न फल: ${p.verdictHi}।`,
    practicalRemedies: [
      ...extraRemedies,
      `🌸 Offer white flowers to Goddess Lakshmi every Friday evening.`,
      `📿 Chant 'Om Shukraya Namah' 108 times on Fridays — Venus (Shukra) rules your 7th.`,
      `🔷 Place rose quartz crystal in South-West (Nairitya) zone of bedroom.`
    ],
    practicalRemediesHi: [
      `💎 ${p.gemRec?.primary?.gem || 'हीरा/सफेद पुखराज'} धारण करें।`,
      `🌸 शुक्रवार संध्या माता लक्ष्मी को सफेद फूल व खीर अर्पित करें।`,
      `📿 शुक्रवार को 108 बार 'ॐ शुक्राय नमः' का जप करें।`,
      `🔷 शयनकक्ष के नैऋत्य कोण में गुलाब स्फटिक रखें।`
    ]
  };
}

function wealthResponse(p) {
  const extraRemedies = gemAndFsRemedies(p);
  return {
    answerHinglish: `Namaste ${p.name} ji! Dhana Bhava (2nd) aur Labha Bhava (11th) ka matrix aapke Bhagyank ${p.bhagyank} (${p.bhagyankLord}) ke saath multiple income streams ka strong yoga bana raha hai. ${p.houseNo ? `Ghar number ${p.houseNo} (moolaank ${p.houseRoot})` : 'Aapka Vastu'} optimize hone par cash inflow multiply hoga. ${p.timing} mein financial breakthrough expected hai.`,
    answerEn: `Greetings ${p.name}! Bhagyank ${p.bhagyank} (${p.bhagyankLord}) governs your wealth potential. ${p.lagnaEn} Ascendant energizes the 2nd (Dhana) & 11th (Labha) houses. ${p.dasha} Dasha is supportive. Financial inflows in ${p.timing}.`,
    answerHi: `नमस्ते ${p.name} जी! भाग्यांक ${p.bhagyank} (${p.bhagyankLord}) आर्थिक स्थिरता का मुख्य संकेतक है। ${p.lagnaHi} लग्न में ${p.dasha} दशा से द्वितीय और एकादश भाव सक्रिय हैं। ${p.timingHi} में आर्थिक सफलता के प्रबल योग हैं।`,
    astrologicalLogicEn: `Bhagyank ${p.bhagyank} lord ${p.bhagyankLord} activates financial trine (2-6-10). ${p.dasha} Dasha is wealth-supportive. Personal Year ${p.personalYr} = abundance cycle. Horary: ${p.verdict}.`,
    astrologicalLogicHi: `भाग्यांक ${p.bhagyank} (${p.bhagyankLord}) का धन त्रिकोण पर सक्रिय प्रभाव। ${p.dasha} दशा अनुकूल। प्रश्न फल: ${p.verdictHi}।`,
    practicalRemedies: [
      ...extraRemedies,
      `💰 Keep cash locker opening toward North (Kubera's wealth zone).`,
      `📿 Chant 'Om Shreem Hreem Kleem Mahalaxmyai Namah' 21 times on Fridays.`,
      `${p.houseNo ? `🏠 House No. ${p.houseNo} (root ${p.houseRoot}): ` : ''}Place green money plant in North zone.`
    ],
    practicalRemediesHi: [
      `💎 ${p.gemRec?.primary?.gem || 'अनुकूल रत्न'} धारण करें — ${p.gemRec?.primary?.planet || 'अनुकूल ग्रह'} की ऊर्जा सक्रिय होगी।`,
      `💰 धन की तिजोरी का मुख उत्तर दिशा में रखें।`,
      `📿 शुक्रवार को 21 बार 'ॐ श्रीं ह्रीं क्लीं महालक्ष्म्यै नमः' जप करें।`,
      `🌿 उत्तर कोने में हरा मनी प्लांट रखें।`
    ]
  };
}

function healthResponse(p) {
  const organ = p.planets.find(pl => pl.house === 6)?.signEn || p.lagnaEn;
  const extraRemedies = gemAndFsRemedies(p);
  return {
    answerHinglish: `Namaste ${p.name} ji! Medical astrology ke anusaar ${p.lagnaHi} lagna wale jatakon ka constitution ${p.dosha || 'Vata-Pitta'} type ka hota hai. ${p.moonNak} nakshatra mein chandra hone se mind-body connection exceptionally strong hai. ${p.age ? 'Umar ' + p.age + ' ke hisab se' : 'Is phase mein'} preventive Ayurveda aur ${p.lagnaEn}-element diet sabse zaroori hai.`,
    answerEn: `Greetings ${p.name}! ${p.lagnaEn} Ascendant governs specific body systems. 6th house lord in ${organ} shows sensitive zones. Dosha: ${p.dosha || 'Vata-Pitta'} — favor grounding, warm diet. Moon in ${p.moonNak} nakshatra boosts mind-body resilience.`,
    answerHi: `नमस्ते ${p.name} जी! ${p.lagnaHi} लग्न सिर, नेत्र और तंत्रिका तंत्र को नियंत्रित करता है। ${p.dosha || 'वात-पित्त'} संतुलन की आवश्यकता है। ${p.moonNak} नक्षत्र के अनुकूल जड़ी-बूटियों से स्वास्थ्य लाभ होगा।`,
    astrologicalLogicEn: `6th house (Roga Bhava) lord in ${organ}. Moon Nakshatra ${p.moonNak} = mind-body link. Lagna ${p.lagnaEn} element diet. Dosha: ${p.dosha || 'Vata-Pitta'}. Horary: ${p.verdict}.`,
    astrologicalLogicHi: `षष्ठ भाव ${organ} में। ${p.moonNak} नक्षत्र मन-शरीर संबंध। ${p.lagnaHi} तत्त्व दोष। प्रश्न फल: ${p.verdictHi}।`,
    practicalRemedies: [
      ...extraRemedies,
      `🧘 Daily Anulom-Vilom Pranayama 10 min — balances ${p.dosha || 'Vata-Pitta'}.`,
      `🥛 Drink copper-vessel water every morning — aligns ${p.lagnaEn} element.`,
      `📿 Chant Maha Mrityunjaya Mantra 11 times daily for vitality.`
    ],
    practicalRemediesHi: [
      `💎 ${p.gemRec?.primary?.gem || 'मूंगा/मोती'} धारण करें — जीवनी शक्ति बढ़ेगी।`,
      `🧘 प्रातः 10 मिनट अनुलोम-विलोम प्राणायाम करें।`,
      `🥛 तांबे के पात्र में रखा जल प्रातः पिएं।`,
      `📿 प्रतिदिन 11 बार महामृत्युंजय मंत्र जप करें।`
    ]
  };
}

function vastuResponse(p) {
  const extraRemedies = gemAndFsRemedies(p);
  const fs = p.fengShui;
  return {
    answerHinglish: `Namaste ${p.name} ji! ${p.houseNo ? `Aapke ghar ka number ${p.houseNo} (Moolaank: ${p.houseRoot}, Ruler: ${p.houseRuler})` : 'Aapka Vastu'} aur ${p.lagnaHi} lagna ke anusaar North (Kuber zone) aur North-East (Ishanya) clear rakhna sabse auspicious hai. ${fs ? `Feng Shui ke anusaar Kua Number ${fs.kua} (${fs.element}) ke liye ${fs.dirs[0]} direction sabse lucky hai.` : ''}`,
    answerEn: `Greetings ${p.name}! ${p.houseNo ? `House No. ${p.houseNo} (root ${p.houseRoot}, ${p.houseRuler})` : 'Your Vastu'} combined with ${p.lagnaEn} Ascendant prescribes: North-East pristine for clarity; South-West anchored for stability. ${fs ? `Feng Shui Kua ${fs.kua} (${fs.element}): Activate ${fs.dirs[0]} direction.` : ''}`,
    answerHi: `नमस्ते ${p.name} जी! ${p.houseNo ? `मकान अंक ${p.houseNo} (मूलांक ${p.houseRoot}, स्वामी ${p.houseRuler})` : 'वास्तु'} और ${p.lagnaHi} लग्न के अनुसार ईशान कोण स्वच्छ रखें व नैऋत्य में भारी वस्तुएं रखें। ${fs ? `फेंग शुई कुआ ${fs.kua} — ${fs.dirs[0]} दिशा सर्वाधिक अनुकूल है।` : ''}`,
    astrologicalLogicEn: `House root ${p.houseRoot} (${p.houseRuler}) aligns Pancha Mahabhuta with ${p.lagnaEn} Lagna element. ${fs ? `Feng Shui Kua ${fs.kua} confirms ${fs.dirs[0]} as power direction.` : ''} Horary: ${p.verdict}.`,
    astrologicalLogicHi: `मकान मूलांक ${p.houseRoot} (${p.houseRuler}) ${p.lagnaHi} तत्त्व से मेल। ${fs ? `कुआ ${fs.kua} — ${fs.dirs[0]} शक्ति दिशा।` : ''} प्रश्न फल: ${p.verdictHi}।`,
    practicalRemedies: [
      ...extraRemedies,
      `🪴 Place brass bowl of clean water in North-East — activates Ishanya blessings.`,
      `🕯️ Light ghee lamp in South-East (Agni corner) every evening.`,
      `${p.houseNo ? `🏠 House root ${p.houseRoot}: ` : ''}Keep Brahmasthan (center) uncluttered and well-lit.`,
      `${fs ? `☯️ Kua ${fs.kua}: Use ${fs.color} colors in your ${fs.dirs[0]} room.` : ''}`.trim()
    ].filter(Boolean),
    practicalRemediesHi: [
      `💎 ${p.gemRec?.primary?.gem || 'अनुकूल रत्न'} धारण करें।`,
      `🪴 ईशान कोण में शुद्ध जल का पीतल पात्र रखें।`,
      `🕯️ संध्या आग्नेय में देसी घी का दीपक जलाएं।`,
      `☯️ ${fs ? `कुआ ${fs.kua} के अनुसार ${fs.dirs[0]} दिशा में ${fs.color} रंग का प्रयोग करें।` : 'घर का ब्रह्मस्थान खुला और प्रकाशित रखें।'}`
    ]
  };
}

function gemResponse(p) {
  const g = p.gemRec;
  return {
    answerHinglish: `Namaste ${p.name} ji! Aapke ${p.lagnaHi} lagna ke lagna lord ${p.lagnaRuler} ke anusar aapka PRIMARY ratna ${g.primary.gem} hai. Isko ${g.primary.metal} mein set karke ${g.primary.finger} par ${g.primary.day} ko dharan karo. Active ${p.dasha} dasha ke liye ${g.dasha.gem} (${g.dasha.metal} mein) bahut effective hai. Mulank ${p.mulank} ke anusar ${g.mulank.gem} aapki numerological frequency amplify karta hai.`,
    answerEn: `Greetings ${p.name}! Based on your ${p.lagnaEn} Ascendant (lord: ${p.lagnaRuler}), active ${p.dasha} Dasha, and Mulank ${p.mulank}:\n\n• Primary: ${g.primary.gem} — set in ${g.primary.metal}, wear on ${g.primary.finger} every ${g.primary.day}\n• Dasha Gem: ${g.dasha.gem} — activated by ${p.dasha} Mahadasha\n• Mulank Gem: ${g.mulank.gem} — enhances your ${g.mulank.planet} planet`,
    answerHi: `नमस्ते ${p.name} जी! आपके ${p.lagnaHi} लग्न (स्वामी: ${p.lagnaRuler}) और ${p.dasha} महादशा के अनुसार:\n\n• प्राथमिक रत्न: ${g.primary.gem} — ${g.primary.metal} में ${g.primary.finger} पर ${g.primary.day} को धारण करें\n• दशा रत्न: ${g.dasha.gem} — ${p.dasha} महादशा में विशेष प्रभावी\n• मूलांक रत्न: ${g.mulank.gem} — ${g.mulank.planet} ऊर्जा बढ़ाता है`,
    astrologicalLogicEn: `Lagna lord ${p.lagnaRuler} → ${g.primary.gem}. Active Dasha lord ${p.dasha} → ${g.dasha.gem}. Mulank ${p.mulank} (${g.mulank.planet}) → ${g.mulank.gem}. All three gems together create a powerful cosmic frequency amplifier.`,
    astrologicalLogicHi: `लग्नेश ${p.lagnaRuler} → ${g.primary.gem}। ${p.dasha} दशेश → ${g.dasha.gem}। मूलांक ${p.mulank} (${g.mulank.planet}) → ${g.mulank.gem}। तीनों रत्न साथ में अत्यंत शक्तिशाली ऊर्जा क्षेत्र बनाते हैं।`,
    practicalRemedies: [
      `💎 Primary: ${g.primary.gem} in ${g.primary.metal} on ${g.primary.finger} — wear every ${g.primary.day} morning after puja.`,
      `💎 Dasha Gem: ${g.dasha.gem} in ${g.dasha.metal} — activated by current ${p.dasha} Dasha.`,
      `💎 Mulank Gem: ${g.mulank.gem} — amplifies your Mulank ${p.mulank} (${g.mulank.planet}) vibration.`,
      `⚠️ Always purchase untreated, natural gems from certified sources. Test all gems for 3 days before permanent wear.`
    ]
  };
}

function fengShuiResponse(p) {
  const fs = p.fengShui;
  if (!fs) {
    return {
      answerHinglish: `Namaste ${p.name} ji! Feng Shui mein Kua number calculate karne ke liye accurate DOB zaroori hai. Please apni DOB enter karein.`,
      answerEn: `Please enter your date of birth to calculate your Feng Shui Kua number.`,
      answerHi: `कृपया फेंग शुई कुआ संख्या की गणना के लिए अपनी जन्मतिथि दर्ज करें।`,
      astrologicalLogicEn: `Kua number requires year of birth and gender for calculation.`,
      astrologicalLogicHi: `कुआ संख्या के लिए जन्म वर्ष और लिंग आवश्यक है।`,
      practicalRemedies: [`Enter your date of birth to unlock Feng Shui recommendations.`]
    };
  }
  const g = p.gemRec;
  return {
    answerHinglish: `Namaste ${p.name} ji! Aapka Feng Shui Kua Number ${fs.kua} hai (${fs.element} element, ${fs.group} group). Aapke liye sabse lucky directions hain: ${fs.dirs.join(', ')}. Ghar aur office mein ${fs.color} colors use karo. ${fs.dirs[0]} direction mein study/career zone activate karne se success aur prosperity milegi. Vedic astrology ke saath Feng Shui ka combination aapke ${p.lagnaHi} lagna ko aur enhance karta hai.`,
    answerEn: `Greetings ${p.name}! Your Feng Shui Kua Number is ${fs.kua} (${fs.element}, ${fs.group} Group). Lucky directions: ${fs.dirs.join(', ')}. Use ${fs.color} colors. Activate ${fs.dirs[0]} for career and ${fs.dirs[1]} for health. Your ${p.lagnaEn} Lagna aligns perfectly with Kua ${fs.kua}'s ${fs.element} element.`,
    answerHi: `नमस्ते ${p.name} जी! आपका फेंग शुई कुआ नंबर ${fs.kua} है (${fs.element}, ${fs.group} समूह)। शुभ दिशाएं: ${fs.dirs.join(', ')}। ${fs.color} रंग का प्रयोग करें। ${fs.dirs[0]} दिशा में करियर और ${fs.dirs[1]} में स्वास्थ्य क्षेत्र सक्रिय करें।`,
    astrologicalLogicEn: `Kua ${fs.kua} = ${fs.element} element. DOB year + gender matrix calculation. ${fs.group} group aligns with specific Ba-Gua sectors. Your ${p.lagnaEn} Lagna's element synergizes with Kua energy.`,
    astrologicalLogicHi: `कुआ ${fs.kua} = ${fs.element} तत्त्व। जन्म वर्ष + लिंग मैट्रिक्स गणना। ${p.lagnaHi} लग्न तत्त्व कुआ ऊर्जा से सिनर्जी करता है।`,
    practicalRemedies: [
      `☯️ Kua ${fs.kua} (${fs.emoji}): Face ${fs.dirs[0]} while working for career luck.`,
      `🎨 Use ${fs.color} colors in your main living area — matches your Kua element.`,
      `🛏️ Bedroom door should open from ${fs.dirs[0] || 'East'} side for best health.`,
      g ? `💎 Wear ${g.primary.gem} — combines Vedic + Feng Shui power for maximum impact.` : `Combine Vastu remedies with Feng Shui for maximum results.`
    ]
  };
}

function numerologyResponse(p) {
  const extraRemedies = gemAndFsRemedies(p);
  return {
    answerHinglish: `Namaste ${p.name} ji! Aapka mobile root digit ${p.mobileDigit || p.mulank} (${p.mobilePlanet || p.mulankLord}) hai. ${p.mobileSuit ? `Business suitability: ${p.mobileSuit}.` : ''} Mulank ${p.mulank} (${p.mulankLord}) aur Bhagyank ${p.bhagyank} (${p.bhagyankLord}) ka powerful triangle ban raha hai. ${p.mobileNature ? `Vibration nature: ${p.mobileNature}.` : ''}`,
    answerEn: `Greetings ${p.name}! Mobile vibration root ${p.mobileDigit || p.mulank} (${p.mobilePlanet || p.mulankLord}) resonates with Mulank ${p.mulank} and Bhagyank ${p.bhagyank}. Name Chaldean: ${p.chaldean || 'calculated'}. Together these form your unique cosmic frequency matrix.`,
    answerHi: `नमस्ते ${p.name} जी! मोबाइल मूलांक ${p.mobileDigit || p.mulank} (${p.mobilePlanet || p.mulankLord}), जन्म मूलांक ${p.mulank} और भाग्यांक ${p.bhagyank} का शक्तिशाली त्रिकोण बनता है।`,
    astrologicalLogicEn: `Mobile root ${p.mobileDigit} + Mulank ${p.mulank} + Bhagyank ${p.bhagyank} = Combined Cosmic Frequency. Lagna ${p.lagnaEn} amplifies ${p.mobilePlanet || p.mulankLord} energy.`,
    astrologicalLogicHi: `मोबाइल मूलांक + मूलांक ${p.mulank} + भाग्यांक ${p.bhagyank} = संयुक्त ब्रह्मांडीय आवृत्ति।`,
    practicalRemedies: [
      ...extraRemedies,
      `📅 Plan key calls & meetings on ${p.gemRec?.primary?.day || 'your lucky day'} — ${p.mulankLord} is strongest.`,
      `🎨 Wear ${p.gemRec?.primary?.color ? 'your lucky color' : 'colors matching Mulank ' + p.mulank} on important days.`,
      `💾 Save important contacts starting with digits matching Bhagyank ${p.bhagyank}.`
    ]
  };
}

function travelResponse(p) {
  const foreignPlanet = p.planets.find(pl => pl.house === 9 || pl.house === 12);
  const extraRemedies = gemAndFsRemedies(p);
  return {
    answerHinglish: `Namaste ${p.name} ji! 9th house (Bhagya/Long Journeys) aur 12th house (Videsh Bhava) ki sthiti ${foreignPlanet ? `${foreignPlanet.nameEn} ke saath` : 'benefic grahas ke saath'} foreign travel ke strong yoga de rahi hai. ${p.lagnaEn} lagna aur ${p.dasha} dasha ke hisab se ${p.timing} mein international opportunity aa sakti hai.`,
    answerEn: `Greetings ${p.name}! 9th and 12th houses activated in your ${p.lagnaEn} Lagna chart. ${foreignPlanet ? `${foreignPlanet.nameEn} in house ${foreignPlanet.house} supports foreign movement.` : 'Planetary support for travel present.'} Strong yoga for international opportunities in ${p.timing}.`,
    answerHi: `नमस्ते ${p.name} जी! नवम और द्वादश भाव ${p.lagnaHi} लग्न में सक्रिय हैं। ${p.timingHi} में विदेश यात्रा या प्रवास के प्रबल योग हैं।`,
    astrologicalLogicEn: `9th & 12th lords with ${p.dasha} Dasha support foreign movement. Moon Nakshatra ${p.moonNak} indicates adaptability. Horary: ${p.verdict}.`,
    astrologicalLogicHi: `नवम व द्वादशेश की ${p.dasha} दशा से अनुकूलता। ${p.moonNak} नक्षत्र नए परिवेश में अनुकूलन की क्षमता देता है।`,
    practicalRemedies: [
      ...extraRemedies,
      `🙏 Worship Lord Ganesha before any international travel.`,
      `📿 Chant 'Om Namo Narayanaya' 108 times before departing.`,
      `✈️ Choose travel dates on your lucky day (${p.gemRec?.primary?.day || 'auspicious weekday'}).`
    ]
  };
}

function muhurtaResponse(p) {
  return {
    answerHinglish: `Namaste ${p.name} ji! Aaj ka Abhijit Muhurta (11:48 AM - 12:36 PM) sabse powerful time hai — Mulank ${p.mulank} (${p.mulankLord}) ke saath exceptional resonance hai. Aapke lucky days ${p.mulankLord} planet ke anusar select karein. Rahu Kaal strictly avoid karein naye kaam ke liye.`,
    answerEn: `Greetings ${p.name}! For Mulank ${p.mulank} (${p.mulankLord}): Best windows — Abhijit Muhurta (11:48–12:36) and Amrit Choghadiya (7:30–9:00 AM). Moon in ${p.moonSignEn} makes mornings especially auspicious.`,
    answerHi: `नमस्ते ${p.name} जी! मूलांक ${p.mulank} (${p.mulankLord}) के लिए आज अभिजीत मुहूर्त (11:48–12:36) और प्रातः अमृत चौघड़िया (7:30–9:00) सर्वश्रेष्ठ हैं।`,
    astrologicalLogicEn: `Abhijit Muhurta aligns with Sun's 10th celestial position. Mulank ${p.mulank} lord ${p.mulankLord} is most potent during its planetary hour. Avoid Rahu Kaal.`,
    astrologicalLogicHi: `अभिजीत मुहूर्त सूर्य की दशम स्थिति से संरेखित। मूलांक ${p.mulank} (${p.mulankLord}) ग्रह होरा में सर्वाधिक शक्तिशाली।`,
    practicalRemedies: [
      `⏰ Start all important work 11:48 AM – 12:36 PM (Abhijit Muhurta).`,
      `⛔ Avoid new financial decisions 4:30 – 6:00 PM (Rahu Kaal).`,
      `🕯️ Light a lamp to ${p.mulankLord} deity on your lucky day before starting work.`,
      p.gemRec?.primary ? `💎 Wear ${p.gemRec.primary.gem} on ${p.gemRec.primary.day} for maximum Muhurta benefit.` : ''
    ].filter(Boolean)
  };
}

function generalResponse(p) {
  const fortunePlanet = p.planets.find(pl => pl.house === 9)?.nameEn || p.bhagyankLord;
  const extraRemedies = gemAndFsRemedies(p);
  return {
    answerHinglish: `Namaste ${p.name} ji! Aapki janam kundali (Lagna: ${p.lagnaHi}, Moon in ${p.moonSignEn} — ${p.moonNak} Nakshatra) aur numerology (Mulank ${p.mulank} — ${p.mulankLord}, Bhagyank ${p.bhagyank} — ${p.bhagyankLord}) mein ${p.dasha} Mahadasha chal rahi hai. ${p.timing} mein manovaanchhit phal milenge. ${p.place ? p.place + ' mein aapka karma' : 'Aapka karma'} seedha destiny se connected hai.`,
    answerEn: `Greetings ${p.name}! Synthesizing: ${p.lagnaEn} Ascendant, Moon in ${p.moonSignEn} (${p.moonNak}), Mulank ${p.mulank} (${p.mulankLord}), Bhagyank ${p.bhagyank} (${p.bhagyankLord}), ${p.dasha} Dasha — cosmic frequencies aligned. Fortune planet ${fortunePlanet} active in 9th Bhagya Bhava. Positive manifestation in ${p.timing}.`,
    answerHi: `सादर प्रणाम ${p.name} जी! ${p.lagnaHi} लग्न, चंद्र ${p.moonSignHi} (${p.moonNak}), मूलांक ${p.mulank} (${p.mulankLord}), भाग्यांक ${p.bhagyank} (${p.bhagyankLord}) और ${p.dasha} महादशा — सभी अनुकूल हैं। ${p.timingHi} में मनोवांछित फल प्राप्त होंगे।`,
    astrologicalLogicEn: `${p.dasha} Dasha activates favorable transits. Personal Year ${p.personalYr} = manifestation cycle. Fortune planet ${fortunePlanet} in 9th Bhava. Horary: ${p.verdict}.`,
    astrologicalLogicHi: `${p.dasha} दशेश की शुभ दृष्टि। व्यक्तिगत वर्ष ${p.personalYr} फल-प्राप्ति चक्र। भाग्य ग्रह ${fortunePlanet} नवम भाव में। प्रश्न फल: ${p.verdictHi}।`,
    practicalRemedies: [
      ...extraRemedies,
      `📿 Chant Gayatri Mantra 9 times every morning — aligns ${p.lagnaEn} solar energy.`,
      `🎨 Wear Mulank ${p.mulank} lucky colors (${p.mulankLord} ruled) on your lucky days.`,
      `🦅 Feed birds/animals on ${p.bhagyankLord?.includes('Saturn') ? 'Saturdays' : p.bhagyankLord?.includes('Jupiter') ? 'Thursdays' : 'Wednesdays & Saturdays'}.`
    ]
  };
}

// ─── Main Entry Point ────────────────────────────────────────────────────────
export function processQueryClient(userQuery = '', userProfile = {}, chartSummary = null) {
  const query = (userQuery || '').trim();
  const intent = understandQuery(query);
  const { domain, domainNameEn, domainNameHi } = detectDomain(query);
  const p = extractParams(userProfile, chartSummary || {});
  p.query = query;

  let responseData;
  if (intent.subject !== 'owner') {
    responseData = familyResponse(p, intent);
  } else switch (domain) {
    case 'education': responseData = educationResponse(p, query); break;
    case 'career':    responseData = careerResponse(p);     break;
    case 'marriage':  responseData = marriageResponse(p);   break;
    case 'wealth':    responseData = wealthResponse(p);     break;
    case 'health':    responseData = healthResponse(p);     break;
    case 'vastu':     responseData = vastuResponse(p);      break;
    case 'numerology':responseData = numerologyResponse(p); break;
    case 'travel':    responseData = travelResponse(p);     break;
    case 'muhurta':   responseData = muhurtaResponse(p);    break;
    case 'gem':       responseData = gemResponse(p);        break;
    case 'fengshui':  responseData = fengShuiResponse(p);   break;
    default:          responseData = generalResponse(p);    break;
  }

  return {
    queryReceived: query,
    queryIntent: intent,
    detectedDomain: domain,
    domainNameEn,
    domainNameHi,
    confidence: `${93 + (p.mulank % 5)}.${p.bhagyank}% Astrological Pattern Match`,
    gemRecommendation: p.gemRec,
    fengShui: p.fengShui ? {
      kua: p.fengShui.kua,
      element: p.fengShui.element,
      group: p.fengShui.group,
      luckyDirections: p.fengShui.dirs,
      color: p.fengShui.color,
      emoji: p.fengShui.emoji
    } : null,
    ...responseData
  };
}
