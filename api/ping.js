export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Sirf GET allowed hai.' });
  }
  const hasKey = !!process.env.GEMINI_API_KEY;
  return res.status(200).json({ ok: true, hasKey });
}
