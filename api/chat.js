
// api/chat.js
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
    return res.status(500).json({
      error:
        'ANTHROPIC_API_KEY environment variable Vercel par set nahi hai. Project Settings > Environment Variables mein daalo.'
    });
  }

  try {
    const { messages, model } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array zaroori hai.' });
    }

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

    const data = await upstream.json();

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: data?.error?.message || 'Anthropic API se error aaya.'
      });
    }

    const replyText = (data.content || [])
      .map((block) => (block.type === 'text' ? block.text : ''))
      .filter(Boolean)
      .join('\n');

    return res.status(200).json({ reply: replyText || '(khaali jawab mila)' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
}
