# Sleep PWA Design

## Problem

Need a simple way to play a specific YouTube sleep sound (https://www.youtube.com/watch?v=rCSCPujLs14) on repeat for sleeping. The app should work on both iOS and Android, continue playing audio with the screen locked or app backgrounded, and be installable as a PWA. Hosted on Cloudflare Pages.

## Solution

A minimal PWA built with Vite + VitePWA plugin that plays a pre-extracted, compressed audio loop. No framework — vanilla HTML/CSS/JS.

### Audio Strategy

- Extract audio from the YouTube video using `yt-dlp`
- Trim to ~20 minutes (loopable segment)
- Compress to Opus at 32kbps (~7MB file)
- Serve as a static asset via Cloudflare Pages (well under 25MB file limit)
- Native `<audio loop>` handles seamless looping

### Extraction Commands (one-time manual step)

```bash
yt-dlp -x --audio-format opus https://www.youtube.com/watch?v=rCSCPujLs14 -o raw-audio.opus
ffmpeg -i raw-audio.opus -t 1200 -b:a 32k -vn public/audio/sleep-loop.opus
```

## Architecture

### Project Structure

```
sleep/
├── public/
│   └── audio/
│       └── sleep-loop.opus       # trimmed 15-30 min Opus audio
├── index.html                     # entry point
├── src/
│   ├── main.js                    # playback logic + media session API
│   └── style.css                  # dark minimal UI styles
├── vite.config.js                 # Vite + VitePWA configuration
├── package.json
└── .gitignore
```

### Dependencies

- `vite` — build tool and dev server
- `vite-plugin-pwa` — generates service worker (Workbox) + web app manifest

### UI Design

- Pure black background (`#000`) — OLED friendly, no light in dark room
- Large centered play/pause button (~120px tap target)
- Subtle volume slider below the button (dim white on black)
- No text, no title, no branding
- Full viewport height (`min-height: 100dvh`), flexbox centered, no scroll
- Responsive for mobile

### Audio Playback

- HTML5 `<audio>` element with `loop` and `preload="auto"`
- Playback initiated by user tap (required gesture for iOS/Android autoplay policy)
- Media Session API:
  - Sets metadata (title: "Sleep Sounds", artwork)
  - Registers action handlers (play, pause) for lock screen controls
  - Helps iOS maintain background audio session

### PWA Configuration (VitePWA)

- **Service Worker strategy:**
  - `CacheFirst` for the audio file (large, rarely changes)
  - `NetworkFirst` for HTML/JS/CSS (allows updates to push through)
  - Precaches all assets on first visit — fully offline after that
- **Manifest:**
  - `name`: "Sleep"
  - `short_name`: "Sleep"
  - `display`: "standalone"
  - `theme_color`: "#000000"
  - `background_color`: "#000000"
  - Simple icon (moon or minimal dark icon)

### iOS-Specific Handling

- `<meta name="apple-mobile-web-app-capable" content="yes">`
- `<meta name="apple-mobile-web-app-status-bar-style" content="black">`
- Media Session API for background audio persistence
- Note: iOS background audio in PWAs is improved on iOS 17+ but not guaranteed like native apps. Works most of the time when added to Home Screen.

### Hosting & Deployment

- **GitHub:** Private repository
- **Cloudflare Pages:** Connects to GitHub repo, runs `npm run build`, serves `dist/` directory
- Audio file (~7MB) committed to repo in `public/audio/`
- HTTP Range Requests supported by Cloudflare Pages by default (progressive loading)

## Implementation Notes

- No framework needed — vanilla JS handles a single play button and audio element
- The audio file is the largest asset (~7MB) but fits comfortably within Cloudflare Pages' 25MB per-file limit
- Opus codec chosen for excellent compression at low bitrates; sleep sounds are ambient and don't need high fidelity
- The `loop` attribute on `<audio>` provides gapless looping for ambient content
- If a gap is noticeable at the loop point, the audio should be trimmed at a zero-crossing point using ffmpeg

## Testing Strategy

- Manual testing on iOS Safari (Add to Home Screen), Android Chrome (Install PWA)
- Verify: audio plays, loops seamlessly, continues on screen lock, lock screen controls work
- Verify: offline mode works after first visit (airplane mode test)
- Lighthouse PWA audit for installability score
