# Tehzeeb AI — Agent Guide

## Project Layout

```
/
├── index.html                  # Full app: CSS + HTML + vanilla JS
├── netlify/
│   └── functions/
│       └── chat.mts            # Streaming Anthropic function at /api/chat
├── netlify.toml                # Build config (publish = ".")
├── package.json                # @anthropic-ai/sdk + @netlify/functions
├── README.md
└── AGENTS.md                   # This file
```

## Architecture

This is a single-page app with no build step. The frontend is entirely in `index.html`. The only server-side code is the Netlify Function at `netlify/functions/chat.mts`.

### Frontend (`index.html`)

- **CSS** — CSS custom properties for theming (`--bg`, `--text`, `--cyan`, `--violet`, `--amber`). Dark mode swaps these at runtime via `applyTheme()`.
- **Avatar canvas** — `<canvas id="avatarCanvas">` driven by `drawAvatar()` + `requestAnimationFrame`. Three states: `idle`, `thinking`, `speaking`.
- **Chat state** — stored in `localStorage` under keys `tz_chats`, `tz_current`, `tz_voice`, `tz_model`, `tz_dark`, `tz_pin`. No server-side persistence.
- **Markdown renderer** — `renderMD()` in plain JS: fenced code blocks, inline code, bold/italic, headings, lists, line breaks. Code blocks get "Copy" + "Edit" buttons.
- **Streaming** — `fetch('/api/chat')` with `res.body.getReader()`. Tokens are appended to `.bubble` in real time. Abort via `AbortController`.
- **Owner PIN** — hashed with `crypto.subtle.digest('SHA-256', pin + 'tehzeeb')`. Hash stored in localStorage. No server verification.

### Backend (`netlify/functions/chat.mts`)

- TypeScript Netlify Function using the `@anthropic-ai/sdk`.
- Accepts `POST /api/chat` with body `{ messages, model?, system? }`.
- Uses `anthropic.messages.create({ stream: true })` and pipes the `ReadableStream` directly in the response.
- Model is validated against an allowlist before being passed to Anthropic.
- Uses Netlify AI Gateway — the SDK's default constructor (`new Anthropic()`) automatically picks up `ANTHROPIC_API_KEY` + `ANTHROPIC_BASE_URL` injected by Netlify.

## Coding Conventions

- No framework, no bundler — keep frontend as vanilla HTML/CSS/JS.
- Functions use TypeScript (`.mts`). Keep imports at the top, export `config` at the bottom.
- Use `Netlify.env.get()` if you need env vars inside functions (not `process.env`).
- CSS variables are defined on `:root` and toggled in `applyTheme()`. Don't hardcode colors.
- `esc()` escapes HTML in user-generated content. Always use it before injecting text into innerHTML.

## Non-obvious Decisions

- **AI Gateway over raw env vars**: The `new Anthropic()` constructor is left without arguments intentionally — Netlify injects the key automatically. This means no API key in `.env` is needed.
- **20KB upload truncation**: The original uploaded `index.html` was capped at 20KB, so the JS was missing entirely. The JS was reconstructed from the visible HTML/CSS structure and the Vercel function logic in `chat.js`.
- **Streaming via ReadableStream**: The function returns a `ReadableStream` instead of a buffered JSON response, enabling token-by-token display on the frontend.
- **`publish = "."`**: The site root is the publish directory because `index.html` sits at the repo root.
