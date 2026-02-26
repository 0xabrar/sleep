# Sleep

A minimal PWA that plays a sleep sound on loop. Dark OLED-friendly UI, offline support, lock screen controls.

## Setup

```bash
npm install
npm run dev
```

## Replacing the audio

The included audio file is a silent placeholder. Replace it with your own:

```bash
yt-dlp -x --audio-format opus <url> -o raw-audio.opus
ffmpeg -i raw-audio.opus -t 1200 -b:a 32k -vn public/audio/sleep-loop.opus
```

## Build

```bash
npm run build
```

Produces a `dist/` directory ready for deployment (e.g. Cloudflare Pages).

## Stack

- Vite + VitePWA
- Vanilla HTML/CSS/JS
- Opus audio with `<audio loop>`
- Media Session API for lock screen controls
