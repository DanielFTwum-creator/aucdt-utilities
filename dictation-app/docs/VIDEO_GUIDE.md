# Video Guide — Dictation App Login Background

How the campus background video for the login page was produced, hosted, and made
resilient. UK British English.

## Source

- Source clip: `https://techbridge.edu.gh/static/campus_tour.mp4`
- Properties: 1920×1080, ~83 s, ~110 MB (unsuitable to ship as-is).

A 14-second segment (`-ss 8 -t 14`) was selected and re-encoded for the web. Audio is
stripped (`-an`) — it is a muted background.

## ffmpeg commands used

ffmpeg 8.1.1 (Gyan build). The source was copied locally as `_campus_src.mp4` (not committed).

**Still fallback** (instant render; shown before/instead of video):

```bash
ffmpeg -y -ss 00:00:08 -i _campus_src.mp4 -frames:v 1 \
  -vf "scale=1920:-2" -q:v 4 public/assets/campus-bg-fallback.jpg
```

**WebM (VP9)** — Chrome, Firefox, Edge, Android:

```bash
ffmpeg -y -ss 8 -t 14 -i _campus_src.mp4 -an \
  -c:v libvpx-vp9 -crf 33 -b:v 0 -vf "scale=1920:-2" -row-mt 1 \
  public/assets/campus.webm
```

**MP4 (H.265/HEVC)** — Safari, iOS (`-tag:v hvc1` for Apple compatibility):

```bash
ffmpeg -y -ss 8 -t 14 -i _campus_src.mp4 -an \
  -c:v libx265 -crf 28 -preset medium -vf "scale=1920:-2" \
  -movflags +faststart -tag:v hvc1 public/assets/campus.mp4
```

## Final assets (`public/assets/`, served at `/dictation/assets/`)

| File | Codec | Size | Purpose |
|---|---|---|---|
| `campus.webm` | VP9 | ~5.2 MB | Primary for Chrome/Firefox/Edge/Android |
| `campus.mp4` | H.265 (hvc1) | ~2.0 MB | Safari / iOS |
| `campus-bg-fallback.jpg` | JPEG | ~173 KB | Instant still + `poster` + reduced-motion |

## Markup (in `src/auth/FormLoginViewBase.tsx`)

- Page root carries `background-image: url(campus-bg-fallback.jpg)` (`bg-cover bg-center`) —
  renders instantly, no layout shift.
- `<video autoPlay muted loop playsInline preload="auto" poster={fallback}>` with
  `<source webm>` first, then `<source mp4>`. WebM wins on Chromium/Firefox; HEVC on Safari.
- `prefers-reduced-motion: reduce` → the `<video>` is not rendered; the still remains.

## Browser compatibility matrix

| Browser | Plays | Notes |
|---|---|---|
| Chrome / Edge (desktop, Android) | WebM (VP9) | ✅ |
| Firefox | WebM (VP9) | ✅ |
| Safari (macOS) / iOS | MP4 (H.265, hvc1) | ✅ `playsInline` required for iOS |
| Reduced-motion / autoplay blocked / data-saver | Still fallback | ✅ no blank page |

## Re-encoding notes

- `campus.webm` is marginally above the 5 MB target (~5.2 MB). To tighten, raise VP9 CRF
  (e.g. `-crf 36`) or shorten the segment; quality/size trade-off.
- Keep the still in sync with the chosen frame if the segment changes.
