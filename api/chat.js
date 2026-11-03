// Free backend (Vercel Edge). Kisi bhi OpenAI-compatible provider ke saath chalta hai.
// Env vars: API_KEY (zaroori), API_BASE, MODEL
export const config = { runtime: 'edge' };

const BASE = () => process.env.API_BASE || 'https://generativelanguage.googleapis.com/v1beta/openai';
const MODEL = () => process.env.MODEL || 'gemini-2.0-flash';
const SYSTEM = 'Aap ek madadgar, dostana AI assistant hain. User jis zabaan mein likhe (Roman Urdu, Urdu, Hindi, English ya koi aur) usi mein saaf aur mukhtasar jawab dein. Code ke liye code blocks istemal karein.';

const hits = new Map(); // simple rate limit (best effort)
const LIMIT = Number(process.env.HOURLY_LIMIT || 40);

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('POST only', { status: 405 });
  if (!process.env.API_KEY) return json({ error: 'Server par API_KEY set nahi hai.' }, 500);

  const ip = req.headers.get('x-forwarded-for') || 'x';
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < 3600000);
  if (arr.length >= LIMIT) return json({ error: 'Is ghante ki limit khatam. Thori der baad try karein.' }, 429);
  arr.push(now); hits.set(ip, arr);

  let body;
  try { body = await req.json(); } catch { return json({ error: 'Galat request.' }, 400); }
  const messages = Array.isArray(body.messages) ? body.messages.slice(-30) : [];
  if (!messages.length) return json({ error: 'Khali message.' }, 400);

  const up = await fetch(BASE() + '/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.API_KEY },
    body: JSON.stringify({ model: MODEL(), stream: true, messages: [{ role: 'system', content: SYSTEM }, ...messages] })
  });
  if (!up.ok) {
    const t = await up.text();
    return json({ error: 'Provider error (' + up.status + '): ' + t.slice(0, 300) }, 502);
  }
  return new Response(up.body, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } });
}

function json(o, s) { return new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } }); }
