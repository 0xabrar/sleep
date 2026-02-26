# Sleep

A minimal PWA that plays a [sleep sound](https://www.youtube.com/watch?v=rCSCPujLs14) on loop. Dark OLED-friendly UI, offline support, lock screen controls.

## Setup

```bash
bun install
bun run dev
```

## Build & Deploy

```bash
bun run build
```

Produces a `dist/` directory. Deploy to Cloudflare Pages with build command `bun run build` and output directory `dist`.

## Replacing the audio

To swap in a different audio source:

```bash
yt-dlp -x --audio-format opus <url> -o raw-audio.opus
ffmpeg -i raw-audio.opus -t 1200 -b:a 32k -vn public/audio/sleep-loop.opus
```
