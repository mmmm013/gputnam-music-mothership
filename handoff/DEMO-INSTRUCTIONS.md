Demo Page Instructions

Purpose
- Provide a simple demo that plays "before" and "after" versions of processed tracks and shows enriched metadata.

Required files
- `handoff/processed/<track>-before.wav`
- `handoff/processed/<track>-after.wav`
- `handoff/metadata.json`

Suggested demo layout
- Header: "Gemini Audio Demo"
- For each track: title, play controls (before/after), waveform (optional), metadata list
- Footer: link back to repo and brief processing notes

Local test
1. Place processed audio and `metadata.json` in `handoff/processed/` and `handoff/`
2. Run dev server: `npm run dev` (Next.js app)
3. Visit `/gemini-demo` (or open `public/handoff-demo.html` if static)

Notes
- Keep UI minimal — audio playback + short metadata display is sufficient
- If using Next.js page, ensure imports are client-safe (use dynamic/no-SSR for audio player if needed)
