# Sleep

A minimal PWA that plays a sleep sound on loop. Dark OLED-friendly UI, offline support, lock screen controls.

## Setup

```bash
bun install
bun run dev
```

## Audio

The included audio is a 20-minute Opus loop extracted from [this YouTube video](https://www.youtube.com/watch?v=rCSCPujLs14) at 32kbps (~5MB).

To replace it:

```bash
yt-dlp -x --audio-format opus <url> -o raw-audio.opus
ffmpeg -i raw-audio.opus -t 1200 -b:a 32k -vn public/audio/sleep-loop.opus
```

## Build

```bash
bun run build
```

Produces a `dist/` directory ready for deployment (e.g. Cloudflare Pages).

## Stack

- Vite + VitePWA
- Vanilla HTML/CSS/JS
- Opus audio with `<audio loop>`
- Media Session API for lock screen controls
