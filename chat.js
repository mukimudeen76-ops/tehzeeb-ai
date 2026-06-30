parceliableiableironmentironmentapi/chat.js
// Yeh Tehzeeb AI ka asli "dimag" hai — server par chalta hai.
// API key kabhi bhi browser mein nahi jaati, sirf Vercel ke
// Environment Variables mein rehti hai (ANTHROPIC_API_KEY).

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Sirf POST request allowed hai.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('Missing ANTHROPIC_API_KEY in environment');
    return res.status(500).json({
      error:
        'GEMINI_API_KEY environment variable Vercel par set nahi hai. Project Settings > Environment Variables mein daalo and redeploy.'
    });
  }

  try {
    const { messages, model } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array zaroori hai.' });
    }

    // Call Anthropic upstream
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model || 'claude-sonnet-4-6',
        max_tokens: 1000,
        system:
          'Tum "Tehzeeb AI" ho, ek dosti bhare, madadgaar Hinglish-bolne wale assistant. Jawab seedha, garmjoshi se aur zyada lamba kiye bina do.',
        messages
      })
    });

    // Read raw text for better logging and safer parsing
    const upstreamText = await upstream.text();
    console.error('Anthropic upstream status:', upstream.status);
    console.error('Anthropic upstream body:', upstreamText);

    let data = null;
    try {
      data = upstreamText ? JSON.parse(upstreamText) : null;
    } catch (e) {
      // upstream did not return JSON
      data = null;
    }

    if (!upstream.ok) {
      const upstreamMsg = data?.error?.message || data?.message || upstreamText || 'Anthropic API se error aaya.';
      return res.status(upstream.status).json({ error: upstreamMsg });
    }

    // Try to extract reply text from known Anthropic shapes
    let replyText = '';

    if (data) {
      // Newer Anthropic responses might have `completion` or `content`
      if (typeof data.completion === 'string' && data.completion.trim()) {
        replyText = data.completion.trim();
      } else if (Array.isArray(data.content)) {
        replyText = data.content
          .map((block) => (block && block.type === 'text' ? block.text : ''))
          .filter(Boolean)
          .join('\n');
      } else if (typeof data.output_text === 'string' && data.output_text.trim()) {
        replyText = data.output_text.trim();
      }
    }

    // Fallback if nothing parsed
    replyText = replyText || '(khaali jawab mila)';

    return res.status(200).json({ reply: replyText });
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Server error: ' + (err && err.message ? err.message : String(err)) });
  }
}
