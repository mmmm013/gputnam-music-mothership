#!/usr/bin/env bash
set -euo pipefail

# prepare_gemini_samples.sh
# Copies selected audio from public/assets into handoff/samples
# Converts to 24-bit/48k WAV masters and creates 30s previews (MP3 + Opus)

mkdir -p handoff/samples handoff/processed

FILES=(
  "public/assets/Fly Again.mp3"
  "public/assets/103 - KLEIGH - DOWN BABY.mp3"
  "public/assets/Lilli O'Dowd - Here in the Night.mp3"
)

for f in "${FILES[@]}"; do
  if [ ! -f "$f" ]; then
    echo "Warning: source file not found: $f"
    continue
  fi
  name=$(basename "$f")
  safe=$(echo "$name" | tr ' ' '-' | tr -cd '[:alnum:].-_')
  cp "$f" "handoff/samples/$name"
  out_base="handoff/processed/${safe%.*}"
  echo "Processing $name -> $out_base"

  # Convert to 24-bit 48kHz WAV master
  ffmpeg -v warning -y -i "$f" -ar 48000 -ac 2 -c:a pcm_s24le "$out_base-master.wav"

  # Produce a LUFS-normalized transparent version (integrated target -14 LUFS)
  ffmpeg -v warning -y -i "$out_base-master.wav" -af "loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 -ac 2 -c:a pcm_s24le "$out_base-transparent.wav"

  # Create 30s MP3 preview
  ffmpeg -v warning -y -i "$out_base-transparent.wav" -t 30 -b:a 192k "$out_base-preview.mp3"

  # Create 30s Opus preview for web streaming
  ffmpeg -v warning -y -i "$out_base-transparent.wav" -t 30 -c:a libopus -b:a 128k "$out_base-preview.opus"

done

echo "Done. Masters and previews are in handoff/processed/ and originals copied to handoff/samples/"
