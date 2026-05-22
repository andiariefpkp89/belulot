# BELULOT — Gemini Chatbot API

## Quick start

```bash
cp .env.example .env   # fill in GEMINI_API_KEY
npm install
npm run dev            # nodemon, hot-reloads on change
```

Server starts on `http://localhost:3000`.

## App structure

- **`index.js`** — Express 5 entrypoint (ESM, `"type": "module"`). Imports `dotenv/config` at top.
- **`public/`** — Vanilla JS chat widget (no framework). Served statically.
- **`@google/genai`** SDK v2.5.0, model `gemini-3.5-flash`, temperature 0.3, system prompt forces Bahasa Indonesia.
- No database, no build step, no TypeScript, no tests, no lint/format/typecheck config.

## API

| Method | Path             | Body / Response                                      |
|--------|------------------|------------------------------------------------------|
| GET    | `/api/greeting`  | `{ "result": "..." }` — welcome message (Indonesian) |
| POST   | `/api/chat`      | `{ "conversation": [{ role, text }] }` → `{ "result": "..." }` |

## Gotchas

- **`/.env` required** before running — server fails silently at startup if `GEMINI_API_KEY` is missing.
- **Express 5** (beta) — router path syntax changed from Express 4; body parsing uses `express.json()` middleware.
- `package-lock.json` is gitignored — don't add it back.
- **No test script** — `npm test` is a placeholder that exits 1.
- All server state is ephemeral; conversation history lives only in the client.
