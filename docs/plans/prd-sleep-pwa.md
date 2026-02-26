# PRD: Sleep PWA

## Overview

A minimal Progressive Web App that plays a pre-extracted, compressed sleep sound on loop. Built with Vite + VitePWA plugin using vanilla HTML/CSS/JS. Dark OLED-friendly UI with a single play/pause button and volume slider. Supports background audio playback on iOS and Android. GitHub repo setup, Cloudflare Pages deployment, and audio extraction are handled manually by the user.

## Design Reference

Design doc: `docs/plans/2026-02-26-sleep-pwa-design.md`

## User Stories

### Phase 1: Foundation

#### 1: Scaffold Vite project with VitePWA plugin
- **Description:** Initialize the project with Vite and the VitePWA plugin. Configure the service worker (CacheFirst for audio, NetworkFirst for app shell) and the web app manifest (name "Sleep", standalone display, black theme). Set up the build toolchain so `npm run build` produces a deployable `dist/` directory.
- **Files:** `package.json`, `vite.config.js`, `.gitignore`
- **Depends on:** none
- **Acceptance Criteria:**
  - `package.json` exists with `vite` and `vite-plugin-pwa` as devDependencies
  - `vite.config.js` exports a config with VitePWA plugin configured
  - VitePWA manifest includes: `name: "Sleep"`, `short_name: "Sleep"`, `display: "standalone"`, `theme_color: "#000000"`, `background_color: "#000000"`
  - Service worker runtime caching configured with `CacheFirst` for files matching `**/*.opus` and `NetworkFirst` for navigation routes
  - `npm run dev` starts the Vite dev server without errors
  - `npm run build` produces a `dist/` directory with generated service worker and manifest
  - `.gitignore` excludes `node_modules/` and `dist/`

#### 2: Create placeholder audio file
- **Description:** Generate a short (5-second) silent Opus audio file at `public/audio/sleep-loop.opus` so development and testing can proceed without the real extracted audio. This placeholder will be replaced manually by the user later.
- **Files:** `public/audio/sleep-loop.opus`
- **Depends on:** 1
- **Acceptance Criteria:**
  - `public/audio/sleep-loop.opus` exists and is a valid Opus audio file
  - File is under 50KB (it's just silence)
  - File plays without errors in a browser `<audio>` element
  - File loops without errors when `<audio loop>` is used

### Phase 2: Core Logic

#### 3: Implement audio playback with loop and volume control
- **Description:** Write the core playback logic in `src/main.js`. Get the `<audio>` element from the DOM, implement play/pause toggle, wire the volume slider to `audio.volume`, and ensure the audio loops via the `loop` attribute. Playback must be initiated from a user gesture (click/tap on the play button).
- **Files:** `src/main.js`
- **Depends on:** 1, 5
- **Acceptance Criteria:**
  - `src/main.js` queries the audio element, play/pause button, and volume slider from the DOM
  - Clicking the play button calls `audio.play()` on first tap (user gesture)
  - Clicking again calls `audio.pause()` — toggling behavior
  - The play/pause button's visual state (icon or class) updates to reflect playing vs paused
  - Changing the volume slider sets `audio.volume` to the slider's normalized value (0.0–1.0)
  - The `<audio>` element has `loop` attribute set so playback restarts automatically
  - No autoplay — audio only starts on explicit user tap

#### 4: Integrate Media Session API for lock screen controls
- **Description:** Add Media Session API integration so lock screen / notification controls work on iOS and Android. Set metadata (title, artist, artwork) and register action handlers for play and pause.
- **Files:** `src/main.js`
- **Depends on:** 3
- **Acceptance Criteria:**
  - `navigator.mediaSession.metadata` is set with title "Sleep Sounds" and artist "Sleep"
  - `navigator.mediaSession.setActionHandler('play', ...)` is registered and calls `audio.play()`
  - `navigator.mediaSession.setActionHandler('pause', ...)` is registered and calls `audio.pause()`
  - Media Session is only configured if `'mediaSession' in navigator` (feature detection)
  - Lock screen shows "Sleep Sounds" metadata when audio is playing (manual verification)

### Phase 3: UI

#### 5: Create HTML entry point with PWA and iOS meta tags
- **Description:** Create `index.html` as the app entry point. Include viewport meta tag, iOS-specific PWA meta tags, link to CSS, script module import for main.js, and the DOM structure: an `<audio>` element pointing to the Opus file, a play/pause button, and a volume slider.
- **Files:** `index.html`
- **Depends on:** 1
- **Acceptance Criteria:**
  - `index.html` has `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
  - `index.html` has `<meta name="apple-mobile-web-app-capable" content="yes">`
  - `index.html` has `<meta name="apple-mobile-web-app-status-bar-style" content="black">`
  - `index.html` has `<meta name="theme-color" content="#000000">`
  - Contains an `<audio>` element with `src` pointing to `/audio/sleep-loop.opus"`, `loop`, and `preload="auto"` attributes
  - Contains a `<button>` element for play/pause with an accessible label
  - Contains an `<input type="range">` for volume control
  - Loads `src/main.js` as a module script
  - Links to `src/style.css`

#### 6: Implement dark minimal UI styles
- **Description:** Create `src/style.css` with the ultra-minimal dark UI. Pure black background, centered layout using flexbox, large play/pause button (~120px tap target), subtle dim volume slider, no text or branding. Responsive and mobile-first.
- **Files:** `src/style.css`
- **Depends on:** 1
- **Acceptance Criteria:**
  - `body` background is `#000000`, margin/padding reset to 0
  - Layout uses `min-height: 100dvh` with flexbox centering (both axes)
  - Play/pause button has a minimum tap target of 120px × 120px
  - Play/pause button uses dim white color (`#888` or similar) that is visible but not bright
  - Volume slider is styled with low contrast (subtle on black background)
  - No scrollbar — content fits viewport without overflow
  - No text elements, no title, no branding visible
  - Looks correct on mobile viewport (375px width)

### Phase 4: Integration

#### 7: Wire UI, playback, and PWA together and verify build
- **Description:** Ensure all pieces work together: UI events trigger playback, Media Session reflects state, service worker caches correctly, and `npm run build` produces a complete deployable PWA. Add any missing PWA icons referenced in the manifest.
- **Files:** `src/main.js`, `index.html`, `public/` (icons if needed), `vite.config.js` (icon references)
- **Depends on:** 2, 3, 4, 5, 6
- **Acceptance Criteria:**
  - `npm run build` succeeds without errors or warnings
  - The `dist/` directory contains: `index.html`, service worker JS, manifest JSON, the audio file, and CSS/JS assets
  - Opening the built site in a browser shows the dark UI with play button and volume slider
  - Clicking play starts audio; clicking again pauses it
  - Volume slider adjusts audio volume
  - PWA manifest in `dist/` has all required fields for installability
  - At least one PWA icon (192×192) is present in the build output
  - Lighthouse PWA audit scores "Installable" (manual check)

## Dependency Graph

### Parallel Batch 1 (no dependencies)
- Story 1: Scaffold Vite project

### Parallel Batch 2 (depends on batch 1)
- Story 2: Placeholder audio
- Story 5: HTML entry point
- Story 6: Dark UI styles

### Parallel Batch 3 (depends on batch 2)
- Story 3: Audio playback logic (depends on 1, 5)

### Parallel Batch 4 (depends on batch 3)
- Story 4: Media Session API (depends on 3)

### Batch 5 — Final (depends on all prior)
- Story 7: Integration and build verification (depends on 2, 3, 4, 5, 6)

## Execution Notes

- **Story 1 is the critical path** — everything depends on the project scaffold being in place first.
- **Stories 2, 5, 6 are fully parallel** — they touch completely separate files and have no shared state.
- **Story 3 depends on story 5** because main.js queries DOM elements defined in index.html. The agent needs to know the element IDs/classes.
- **The audio file is a placeholder** — the user will manually extract and replace it using `yt-dlp` and `ffmpeg` before deployment.
- **Story 7 is the integration gate** — it verifies everything works together as a complete PWA.
- **PWA icons:** Story 7 may need to generate a simple icon (e.g., an SVG moon). This can be a simple inline SVG converted to PNG, or a minimal placeholder.
- **No testing framework** — this app is too small for unit tests. Acceptance criteria are verified by building and manually checking behavior. Lighthouse PWA audit is the key automated check.
- **GitHub and Cloudflare Pages** — handled manually by the user outside this PRD.
