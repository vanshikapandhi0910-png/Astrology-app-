/**
 * API Service for Astrology calculations & Hinglish Q&A
 * Interacts with Node/Express backend at http://localhost:5000
 */

const API_BASE = 'http://localhost:5000/api/astrology';

export async function fetchFullAstrologyReport(userData) {
  try {
    const res = await fetch(`${API_BASE}/calculate-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) throw new Error('Backend calculation failed');
    return await res.json();
  } catch (err) {
    console.warn("Backend unavailable, using client-side fallback calculation:", err);
    return null;
  }
}

export async function submitAstrologyQuestion(query, profile, chartData) {
  try {
    const res = await fetch(`${API_BASE}/ask-question`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, profile, chartData })
    });
    if (!res.ok) throw new Error('Question calculation failed');
    return await res.json();
  } catch (err) {
    console.warn("Backend question endpoint error:", err);
    return null;
  }
}

export async function fetchCompatibilityReport(person1, person2) {
  try {
    const res = await fetch(`${API_BASE}/compatibility`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ person1, person2 })
    });
    if (!res.ok) throw new Error('Compatibility calculation failed');
    return await res.json();
  } catch (err) {
    console.warn("Backend compatibility error:", err);
    return null;
  }
}
