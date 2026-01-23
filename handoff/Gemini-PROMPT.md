Gemini Handoff Prompt

Goal
- Automatically clean and enhance audio, then produce enriched metadata and a small demo website showing before/after audio.

Inputs
- Repository: gputnam-music-final-site (files under `public/assets`, `scripts/`, `app/`)
- Representative tracks: choose 3-5 diverse files (acoustic, vocal, ambient) from `public/assets` or advise if none exist.

Required Outputs
1) Audio processing pipeline that: 
   - Removes noise, hum, and clicks
   - Applies transparent EQ and gentle compression
   - Outputs normalized WAV and MP3 versions
   - Produces before/after audio files in `handoff/processed/`

2) Metadata enrichment for selected tracks:
   - Mood labels (from existing `moodTaxonomy.ts` patterns)
   - Instrumentation tags
   - Short description (1-2 sentences)
   - Store results in `handoff/metadata.json`

3) Demo website content:
   - A minimal static page at `app/gemini-demo/page.tsx` or `public/handoff-demo.html` that plays before/after and lists metadata

4) README with reproducible steps and CLI commands

Acceptance tests
- Playable before/after audio with audible improvement
- `metadata.json` contains entries for the selected files
- Demo page loads locally with no build errors

Operational notes
- Preserve originals; write processed files under `handoff/processed/`
- Keep changes scoped to `handoff/` and new demo page

If audio files are missing, report back with a list of recommended sample files and minimal conversion commands to produce WAV masters.
