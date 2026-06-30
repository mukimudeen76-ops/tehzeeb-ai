# Tehzeeb AI

A Hinglish AI chat assistant powered by Claude (Anthropic) and deployed on Netlify. Talk to it in Hindi, Urdu, or English — it understands and responds naturally in Hinglish.

## Key Features

- **Streaming responses** — see Claude's reply token-by-token as it arrives
- **Multi-chat sessions** — chat history saved in localStorage
- **Voice synthesis** — three voice options (Ladki 1, Ladki 2, Ladka)
- **Speech recognition** — click the mic and speak your message
- **Code editor** — run JavaScript and preview HTML in-browser
- **File/image attachments** — attach images and text files to your messages
- **Screen capture** — grab a screenshot and attach it to a message
- **Dark / light theme** — toggle from the header
- **Model selector** — switch between Claude Sonnet, Haiku, and Opus
- **Owner PIN** — lock advanced access behind a PIN

## Tech Stack

- Pure HTML/CSS/JS frontend (no framework)
- Netlify Functions (serverless) for the backend
- Anthropic Claude via Netlify AI Gateway (no API key needed in env)
- `@anthropic-ai/sdk` with streaming

## Running Locally

```bash
npm install
netlify dev
```

Then open `http://localhost:8888`.

## Environment Variables

No API key is needed — Netlify AI Gateway injects `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` automatically. If you want to use your own key, set `ANTHROPIC_API_KEY` in **Netlify → Project Settings → Environment Variables**.
