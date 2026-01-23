Preparing samples for Gemini

Run the included script to copy selected tracks from `public/assets/` into `handoff/samples/`, convert them to 24-bit/48k WAV masters, and create 30s preview files.

Requirements
- `ffmpeg` installed and available on PATH

Usage

```bash
chmod +x handoff/prepare_gemini_samples.sh
./handoff/prepare_gemini_samples.sh
```

What the script produces
- `handoff/samples/` — copies of the original source files used
- `handoff/processed/<track>-master.wav` — 24-bit/48k WAV master (converted)
- `handoff/processed/<track>-transparent.wav` — LUFS-normalized transparent version (-14 LUFS)
- `handoff/processed/<track>-preview.mp3` — 30s MP3 preview (192 kbps)
- `handoff/processed/<track>-preview.opus` — 30s Opus preview (128 kbps)

Notes
- The script does NOT perform noise reduction or spectral repair — that's expected to be done by the Gemini workflow. It prepares clean masters and normalized previews so Gemini can operate on consistent inputs.
- If you want different loudness targets or durations, edit the script accordingly.
