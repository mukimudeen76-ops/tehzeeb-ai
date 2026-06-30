// api/ping.js
// Simple debug endpoint to verify Vercel function runtime and presence of ANTHROPIC_API_KEY

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Sirf GET allowed hai.' });
  }

  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  // Do NOT log or return the key itself. Only return presence boolean.
  return res.status(200).json({ ok: true, hasKey });
}
