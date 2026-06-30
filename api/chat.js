import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Sirf POST request allowed hai.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Missing GEMINI_API_KEY in environment');
    return res.status(500).json({
      error:
        'GEMINI_API_KEY environment variable set nahi hai. Vercel/Netlify mein apna Gemini API key (GEMINI_API_KEY) add karein aur redeploy karein.'
    });
  }

  try {
    const { messages, model, system } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array zaroori hai.' });
    }

    // Build a simple text prompt combining system + messages
    let prompt = '';
    if (system && String(system).trim()) prompt += `System: ${String(system).trim()}\n\n`;
    for (const m of messages) {
      const role = (m.role || 'user').toString().toUpperCase();
      const content = (m.content || '').toString();
      prompt += `${role}: ${content}\n`;
    }

    // Choose Gemini model (default to gemini-1.5-flash)
    const modelId = model || 'gemini-1.5-flash';

    const clientModel = genAI.getGenerativeModel({ model: modelId });

    // Use the SDK's generateContent as in the snippet the user provided
    // Some SDK versions accept a string; follow the provided usage.
    const result = await clientModel.generateContent(prompt);
    const response = await result.response;

    // response.text() per snippet
    const replyText = typeof response?.text === 'function' ? await response.text() : String(response || '');

    return res.status(200).json({ reply: replyText || '(khaali jawab mila)' });
  } catch (err) {
    console.error('Handler error (Gemini):', err);
    return res.status(500).json({ error: 'Server error: ' + (err && err.message ? err.message : String(err)) });
  }
}
