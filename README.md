# Tehzeeb AI — Vercel par deploy karne ka tareeka

Yeh project do hisson mein bata hai:

- `index.html` → frontend (3D orb, chat UI). Iske paas koi API key nahi hai.
- `api/chat.js` → "dimag". Yeh Vercel ka serverless function hai jo `ANTHROPIC_API_KEY`
  environment variable use karke seedha Anthropic ko call karta hai. Browser kabhi
  bhi key nahi dekhta — bas `/api/chat` ko hit karta hai.

## AI ko chalne ke liye kya-kya chahiye (checklist)

1. **API key** — Anthropic Console (console.anthropic.com) se ek key banao.
2. **Server jagah** — yeh Vercel ka `api/chat.js` function hai, jo key ko safe rakhta hai.
3. **Environment variable** — key ko code mein nahi, Vercel ke settings mein dalna hai.
4. **Model name** — `claude-sonnet-4-6` (default), ya `claude-haiku-4-5-20251001` /
   `claude-opus-4-6` frontend ke dropdown se select kar sakte ho.
5. **Internet/CORS** — kyunki call browser se nahi, server se ho rahi hai, koi CORS
   dikkat nahi aayegi.

## Deploy steps

1. In teeno/char files (`index.html`, `api/chat.js`, `package.json`, `vercel.json`)
   ko ek GitHub repo mein daal do (ya seedha Vercel CLI se upload karo).
2. [vercel.com](https://vercel.com) par jaake **"Add New Project"** dabao, apna repo
   import karo.
3. Deploy se pehle, **Project Settings → Environment Variables** mein jaake ek
   naya variable banao:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** apni Anthropic API key (jo `sk-ant-...` se shuru hoti hai)
   - **Environment:** Production, Preview, aur Development teeno tick kar do.
4. **Deploy** dabao. Vercel apne aap `index.html` ko static page ki tarah aur
   `api/chat.js` ko serverless function ki tarah deploy kar dega.
5. Deploy hone ke baad apni site kholo, ☰ menu mein "Dimag Check karo" dabao —
   agar "Brain: ON" dikhe to sab sahi hai, ab chat mein kuch bhi type karke
   bhejo, asli Claude jawab dega.

## Local testing (optional)

Agar Vercel CLI install hai:

```bash
npm install -g vercel
vercel dev
```

Phir ek `.env.local` file banao (isko commit mat karna):

```
ANTHROPIC_API_KEY=sk-ant-...
```

## Important

- `.env.local` ya koi bhi file jisme asli key ho, usse `.gitignore` mein
  zaroor daalo — GitHub par kabhi mat push karo.
- Agar key ghoom-fir kar leak ho jaaye, Anthropic Console se turant
  revoke/regenerate kar do.
