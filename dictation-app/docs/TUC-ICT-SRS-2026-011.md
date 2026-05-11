# TUC-ICT-SRS-2026-011: Dictation App
## IEEE 830 / IEEE 29148 Software Requirements Specification

**Document Version:** 1.0  
**Date:** 11 May 2026  
**Author(s):** Daniel Frempong Twum (Head of ICT, TUC)  
**Status:** Active  
**Classification:** TUC Internal

---

## Executive Summary

The **Dictation App** is a browser-based voice note capture and processing tool designed for TUC staff, students, and researchers. Users record verbal thoughts or lectures, which are automatically transcribed and formatted into polished markdown notes using Google Gemini 2.5 Flash API. The app provides real-time visual feedback (waveform + timer), dark/light theming, and automatic recovery from browser crashes via IndexedDB persistence.

**Key Features:**
- Live audio recording with waveform visualization
- AI-powered speech-to-text transcription
- Automatic note polishing (markdown formatting, title extraction)
- Dual-view tabs (polished vs. raw transcript)
- Dark/light theme toggle
- 24-hour crash recovery window
- Transcript history (localStorage persistence)
- Export to TXT and PDF formats
- Automatic note save after successful polishing

**Deployment:** `https://ai-tools.techbridge.edu.gh/dictation/`

---

## 1. INTRODUCTION

### 1.1 Purpose
This SRS specifies the functional and non-functional requirements for the TUC Dictation App, a single-user voice note application deployed at the institution's AI tools portal.

### 1.2 Scope
The app enables users to:
- Record audio via browser microphone
- Transcribe speech to text using Gemini API
- Format notes automatically with markdown
- Edit and view transcriptions in two formats (polished/raw)
- Switch between dark and light UI themes
- Recover unsaved audio if the browser crashes

**Out of Scope:**
- Multi-user collaboration or sharing
- Persistent storage to backend database
- Search or filtering across sessions
- Voice command recognition or automation
- DOCX, CSV, or other specialized formats
- Audio playback or editing
- Voice authentication or biometric features

### 1.3 Document Overview
- **Section 2:** Overall description (user profiles, assumptions, constraints)
- **Section 3:** Functional requirements (features, recording flow, UI)
- **Section 4:** External interface requirements (APIs, dependencies)
- **Section 5:** Non-functional requirements (performance, accessibility, security)
- **Section 6:** Design constraints (colours, fonts, responsive design)
- **Section 7:** Other requirements (error handling, data models)
- **Section 8:** Appendices (data persistence, dependency versions)

---

## 2. OVERALL DESCRIPTION

### 2.1 Product Perspective
The Dictation App is a **standalone web application** deployed as a subpath (`/dictation/`) on TUC's AI tools domain. It is:
- **Not dependent on** other TUC systems (auth, CMS, LMS)
- **Integrated with** Google Gemini API (transcription + polishing)
- **Built with** React 19 (framework), Vite 7 (build tool), Tailwind CSS 4 (styling)
- **Deployed to** Plesk-managed Apache server (66.226.72.199)
- **Accessed via** HTTPS at `https://ai-tools.techbridge.edu.gh/dictation/`

### 2.2 User Profiles

| User Role | Primary Use Case | Frequency | Technical Level |
|-----------|------------------|-----------|-----------------|
| **Lecturer** | Record lecture summaries; create study guides | Daily | Moderate |
| **Student** | Capture class notes; voice journal for assignments | Weekly | Low–Moderate |
| **Researcher** | Dictate observations; voice memos for papers | Weekly | Moderate–High |
| **Administrator** | Monitor deployment; manage API quota | Monthly | High |

### 2.3 Key Assumptions
1. Users have **stable internet connection** (Gemini API requires network)
2. Users grant **microphone permission** when prompted
3. Users have **modern browser** (Chrome 120+, Firefox 120+, Safari 17+, Edge 120+)
4. Users understand that **recordings are not saved** to the server (only in-session, or recovered from IndexedDB)
5. Users are **English speakers** (transcription is English-only)
6. Gemini API **quota is sufficient** for institutional use (no rate limiting expected)

### 2.4 Constraints

| Constraint | Impact | Notes |
|-----------|--------|-------|
| **No backend storage** | Notes exist only in browser memory | Users must copy notes manually or use recovery feature |
| **Microphone required** | Cannot record without hardware access | Browser permission blocking will fail gracefully |
| **24-hour recovery window** | Crashes after 24 hours lose data forever | Auto-expiry prevents IndexedDB bloat |
| **Gemini API quota** | High-volume use may hit rate limits | Not addressed in current version |
| **Webm audio format** | Some browsers may fall back to platform default | Handled transparently by MediaRecorder API |
| **Single language** | Only English transcription supported | Language detection not implemented |
| **No offline mode** | App non-functional without network | No service worker or local processing |

---

## 3. FUNCTIONAL REQUIREMENTS

### 3.1 Recording Features

#### **FR-101: Audio Recording**
- **Description:** Users press the record button to begin capturing audio from their microphone
- **Actors:** User (primary), Web Audio API (supporting)
- **Preconditions:** App is loaded; user has granted microphone permission
- **Flow:**
  1. User clicks the red record button
  2. App requests microphone access via `navigator.mediaDevices.getUserMedia({ audio: true })`
  3. Browser prompts user for permission (if not previously granted)
  4. Recording begins; record button shows pulsating waves animation
  5. Live waveform visualization and timer appear in the header
  6. Audio chunks are captured at 100ms intervals via MediaRecorder API
  7. Every 30 seconds, audio chunks are auto-saved to IndexedDB
  8. Recording continues until user presses the record button again (to stop)
- **Postconditions:** Audio chunks are captured and saved; status shows "Processing audio..."
- **Acceptance Criteria:**
  - ✓ Microphone access request appears on first recording attempt
  - ✓ Waveform updates at ≥30 FPS during recording
  - ✓ Timer displays MM:SS.HH format correctly
  - ✓ Audio chunks are persisted to IndexedDB every 30 seconds
  - ✓ User can stop recording at any time

#### **FR-102: Transcription**
- **Description:** Recorded audio is sent to Google Gemini 2.5 Flash for speech-to-text conversion
- **Actors:** App (primary), Gemini API (supporting)
- **Preconditions:** Audio recording is complete (stopped); audio blob is non-empty
- **Flow:**
  1. App converts audio blob to base64 data URL
  2. App constructs Gemini API request with prompt: "Generate a complete, detailed transcript of this audio."
  3. Audio data is sent via HTTP POST to Gemini endpoint
  4. Gemini returns raw transcription text (including filler words, false starts, repetitions)
  5. App displays transcription in the "Raw Transcript" tab
  6. Status updates: "Transcription complete. Polishing note..."
- **Postconditions:** Raw transcription is visible in UI; polishing begins automatically
- **Acceptance Criteria:**
  - ✓ Transcription appears within 5–30 seconds of recording stop
  - ✓ Filler words and false starts are present in raw transcript (unmodified)
  - ✓ API errors are caught and displayed to user
  - ✓ Status text provides real-time feedback

#### **FR-103: Note Polishing**
- **Description:** Gemini API automatically formats the raw transcription into a polished markdown note
- **Actors:** App (primary), Gemini API (supporting)
- **Preconditions:** Raw transcription is complete and non-empty
- **Flow:**
  1. App constructs polishing prompt:
     ```
     Take this raw transcription and create a polished, well-formatted note.
     Remove filler words (um, uh, like), repetitions, and false starts.
     Format any lists or bullet points properly. Use markdown formatting for headings, lists, etc.
     Maintain all the original content and meaning.
     
     Raw transcription: [transcription text]
     ```
  2. App sends prompt to Gemini API
  3. Gemini returns formatted markdown (headings, lists, blockquotes, code blocks, emphasis)
  4. App parses markdown via marked.js library
  5. Polished note is displayed as HTML in the "Polished Note" tab
  6. Status updates: "Note polished. Ready for next recording."
  7. IndexedDB is cleared (audio no longer needed)
- **Postconditions:** Polished note is visible; user can edit manually or record new note
- **Acceptance Criteria:**
  - ✓ Filler words and false starts are removed
  - ✓ Markdown formatting is correctly applied (headings, lists, emphasis)
  - ✓ Original meaning is preserved
  - ✓ Polishing completes within 10–30 seconds
  - ✓ HTML is safely rendered (no XSS vulnerability)

#### **FR-104: Automatic Title Extraction**
- **Description:** App automatically extracts a note title from the polished content
- **Actors:** App (primary)
- **Preconditions:** Polished note is available
- **Flow:**
  1. App scans polished text for markdown heading (h1–h6)
  2. If heading found, extract text and use as title
  3. If no heading, scan for first non-empty line (removal of markdown syntax)
  4. Limit title to 60 characters; append "..." if longer
  5. If no suitable text found, title remains "Untitled Note"
  6. App displays title in the contenteditable title field at top of page
- **Postconditions:** Note title is visible in the note header
- **Acceptance Criteria:**
  - ✓ Title is extracted from h1 heading if present
  - ✓ Title is extracted from first substantial line if no heading
  - ✓ Title is limited to 60 characters
  - ✓ Fallback to "Untitled Note" if no suitable text

#### **FR-105: Live Waveform Visualization**
- **Description:** Real-time visualization of audio frequency spectrum during recording
- **Actors:** App (primary), Web Audio API (supporting)
- **Preconditions:** Recording is in progress
- **Flow:**
  1. App creates AudioContext from the microphone stream
  2. App creates AnalyserNode with FFT size 256 and smoothing constant 0.75
  3. For each frame: getByteFrequencyData() populates frequency array
  4. App renders bar chart on HTML5 canvas with colour from CSS variable `--color-recording`
  5. Canvas updates via requestAnimationFrame (≥30 FPS)
  6. On recording stop, canvas is cleared
- **Postconditions:** Waveform updates every frame; disappears when recording stops
- **Acceptance Criteria:**
  - ✓ Waveform updates at ≥30 FPS
  - ✓ Waveform reflects audio input (louder audio = taller bars)
  - ✓ Canvas is responsive to window resize
  - ✓ No console errors during rendering

#### **FR-106: Recording Timer**
- **Description:** Digital timer displays elapsed recording time in MM:SS.HH format
- **Actors:** App (primary)
- **Preconditions:** Recording is in progress
- **Flow:**
  1. App captures `recordingStartTime = Date.now()` when recording begins
  2. Every 50ms, app calculates elapsed time: `now - recordingStartTime`
  3. App formats as MM:SS.HH (minutes, seconds, hundredths of a second)
  4. Timer is displayed in the header during live recording
  5. On recording stop, timer is hidden; header returns to normal state
- **Postconditions:** Timer is visible and updating during recording
- **Acceptance Criteria:**
  - ✓ Timer increments correctly
  - ✓ Format is MM:SS.HH (e.g., "02:15.47")
  - ✓ Timer updates at least every 100ms (smooth appearance)

### 3.2 UI/UX Features

#### **FR-201: Dark/Light Theme Toggle**
- **Description:** Users can switch between dark and light UI themes via a button
- **Actors:** User (primary), localStorage (supporting)
- **Preconditions:** App is loaded
- **Flow:**
  1. User clicks sun/moon icon in the header
  2. App toggles `body.light-mode` CSS class
  3. CSS variables auto-update via `:root` and `body.light-mode` selectors
  4. All UI colours (text, background, accents) transition smoothly (0.3s)
  5. Preference is saved to `localStorage.setItem('theme', 'light' | 'dark')`
  6. On next session, app reads localStorage and applies theme at startup
- **Postconditions:** Theme is applied and persisted for future sessions
- **Acceptance Criteria:**
  - ✓ Theme toggles on button click
  - ✓ All UI elements update colour correctly
  - ✓ Preference persists across sessions
  - ✓ Colour transitions are smooth (no flicker)
  - ✓ Light mode meets WCAG AA contrast requirements

#### **FR-202: Note Title Editor**
- **Description:** User can edit the note title inline
- **Actors:** User (primary)
- **Preconditions:** App is loaded; note exists
- **Flow:**
  1. Title field is contenteditable with placeholder support
  2. User clicks title to focus and edit
  3. User types to replace or amend the title
  4. Custom placeholder text appears if field is empty (grey, faded)
  5. On blur, placeholder styling is reapplied if field is empty
- **Postconditions:** Title is updated in-memory; edits are visible
- **Acceptance Criteria:**
  - ✓ Title is editable
  - ✓ Placeholder text displays and hides correctly
  - ✓ Title persists until user clicks "New Note"

#### **FR-203: Polished Note View**
- **Description:** Contenteditable div displays the polished markdown note as formatted HTML
- **Actors:** User (primary), marked.js (supporting)
- **Preconditions:** Polishing is complete
- **Flow:**
  1. marked.js parses polished markdown text
  2. HTML is rendered into the polished note div
  3. User can click to edit any part of the note
  4. Custom CSS applies styling to markdown elements (headings, lists, links, code blocks)
  5. Links are clickable (colour: `--color-accent`)
  6. Code blocks have background colour and rounded corners
- **Postconditions:** Polished note is visible and editable
- **Acceptance Criteria:**
  - ✓ Markdown is correctly parsed and rendered
  - ✓ HTML is safe (no XSS vulnerability)
  - ✓ Styling matches brand colours and accessibility requirements
  - ✓ User can edit the note freely

#### **FR-204: Raw Transcription View**
- **Description:** Tab for viewing the unmodified transcription as plain text
- **Actors:** User (primary)
- **Preconditions:** Transcription is complete
- **Flow:**
  1. "Raw Transcript" tab is available next to "Polished Note"
  2. User clicks tab to switch view
  3. Raw transcription (plain text, with filler words) is displayed
  4. Tab indicator (gold underline) animates to "Raw Transcript"
  5. Polished note is hidden; raw transcript is visible
- **Postconditions:** Raw transcript is displayed
- **Acceptance Criteria:**
  - ✓ Tab switching works smoothly
  - ✓ Tab indicator animates correctly
  - ✓ Content is fully visible without overflow

#### **FR-205: Empty State Hero**
- **Description:** Instructional overlay guides user when no recording exists
- **Actors:** App (primary)
- **Preconditions:** App is on a new note (note-content-wrapper has `state-empty` class)
- **Flow:**
  1. Centred "Start Your Recording" heading appears
  2. Subtitle: "Press the microphone button to dictate. Your note will appear here."
  3. Three-step visual guide with icons:
     - 🎤 Press the mic button to record
     - ✨ Gemini transcribes and polishes it
     - 📄 Edit your note directly
  4. On first recording, hero fades away and content area becomes active
- **Postconditions:** User understands the app workflow
- **Acceptance Criteria:**
  - ✓ Hero appears when note-content-wrapper is empty
  - ✓ Hero fades when content is added
  - ✓ Icons render correctly (Font Awesome)
  - ✓ Text is readable and well-formatted

#### **FR-206: Status Indicator**
- **Description:** Real-time status messages inform user of app state
- **Actors:** App (primary)
- **Preconditions:** App is running
- **Flow:**
  1. Status text displays in a rounded badge in the header
  2. Status updates as recording/processing progresses:
     - "Ready to record" (initial)
     - "Requesting microphone access..." (on record click)
     - "Processing audio..." (on record stop)
     - "Converting audio..." (base64 conversion)
     - "Getting transcription..." (Gemini request)
     - "Transcription complete. Polishing note..." (after transcription)
     - "Polishing note..." (formatting)
     - "Note polished. Ready for next recording." (complete)
   3. Error messages replace status if process fails
- **Postconditions:** User always knows the current state
- **Acceptance Criteria:**
  - ✓ Status updates are timely and clear
  - ✓ Error messages are user-friendly (no tech jargon)

#### **FR-207: Responsive Layout**
- **Description:** App adapts to different screen sizes (320px–1920px)
- **Actors:** App (primary), CSS media queries (supporting)
- **Preconditions:** App is loaded on any device
- **Flow:**
  1. On mobile (<768px): Reduced padding, compact tabs, smaller fonts
  2. On desktop (≥768px): Full padding, wider content area, standard fonts
  3. Header adjusts height dynamically during live recording (expands to show waveform)
  4. Waveform canvas scales to fit available width (max 400px)
  5. Main content area scrolls independently from header
- **Postconditions:** App is usable on all screen sizes
- **Acceptance Criteria:**
  - ✓ App is usable on phones (320px) through large desktops (1920px)
  - ✓ No text is cut off or overlapping
  - ✓ Touch targets are ≥44px on mobile
  - ✓ Header height is appropriate for each breakpoint

#### **FR-208: Contenteditable Placeholders**
- **Description:** Custom placeholder text displays when editable fields are empty
- **Actors:** App (primary)
- **Preconditions:** Any contenteditable field (title, transcript, polished note)
- **Flow:**
  1. Field has HTML attribute `placeholder="..."`
  2. When field is empty and unfocused, app adds `placeholder-active` class
  3. CSS displays placeholder text in lighter colour (`--color-text-tertiary`)
  4. On focus, placeholder is cleared
  5. On blur, if field is empty, placeholder is restored
- **Postconditions:** User sees helpful placeholder guidance
- **Acceptance Criteria:**
  - ✓ Placeholder text is visible when field is empty
  - ✓ Placeholder disappears on focus
  - ✓ Placeholder reappears on blur if field remains empty

### 3.3 Recovery & Session Management

#### **FR-301: Create New Note**
- **Description:** User clicks "New" button to start a fresh note
- **Actors:** User (primary)
- **Preconditions:** App is running
- **Flow:**
  1. User clicks the "+" button in the header
  2. App clears IndexedDB (calls `store.clear()`)
  3. App resets all fields:
     - Title: "Untitled Note" (placeholder)
     - Raw Transcript: placeholder text
     - Polished Note: placeholder text
     - Status: "Ready to record"
  4. Hero instructions overlay becomes visible
  5. A new `Note` object is created with fresh timestamp
- **Postconditions:** User can start recording immediately
- **Acceptance Criteria:**
  - ✓ All fields are cleared
  - ✓ IndexedDB is cleared (no recovery banner on next load)
  - ✓ Hero appears
  - ✓ Status resets to "Ready to record"

#### **FR-302: Recovery Banner**
- **Description:** If app detects unsaved audio chunks on startup, user is offered recovery options
- **Actors:** App (primary), IndexedDB (supporting)
- **Preconditions:** App loads; IndexedDB has saved chunks from a previous session
- **Flow:**
  1. On app startup, app calls `store.load()`
  2. If chunks are found and older than 24 hours, they are auto-deleted silently
  3. If chunks are found and younger than 24 hours:
     - Calculate elapsed time: `(now - startedAt) / 60000` minutes
     - Display recovery banner: "A recording from X minute(s) ago was not processed."
     - Offer two buttons: "Recover & Process" and "Discard"
  4. User clicks "Recover & Process":
     - Audio blob is reconstructed from chunks
     - `processAudio()` is called (transcription → polishing)
     - IndexedDB is cleared after successful polishing
  5. User clicks "Discard":
     - IndexedDB is cleared immediately
     - Banner dismisses
- **Postconditions:** User has recovered their audio or discarded it
- **Acceptance Criteria:**
  - ✓ Recovery banner appears only for unsaved audio
  - ✓ Stale recordings (>24hrs) are auto-deleted
  - ✓ "Recover" button triggers transcription + polishing
  - ✓ "Discard" button clears data without processing
  - ✓ After either action, banner is dismissed

#### **FR-303: Auto-Persist to IndexedDB**
- **Description:** Audio chunks are automatically saved every 30 seconds during recording
- **Actors:** App (primary), IndexedDB (supporting)
- **Preconditions:** Recording is in progress
- **Flow:**
  1. When recording starts, app saves an empty slot to IndexedDB: `store.save([], mimeType, startedAt)`
  2. Every 30 seconds, app saves the current `audioChunks` array: `store.save([...audioChunks], mimeType, startedAt)`
  3. When recording stops, the persist interval is cleared
  4. If the browser crashes mid-recording, the last saved checkpoint (≤30 sec old) survives
  5. On next app load, recovery flow begins (see FR-302)
- **Postconditions:** Audio is persisted; user can recover on next load
- **Acceptance Criteria:**
  - ✓ Chunks are saved every 30 seconds (±1 sec tolerance)
  - ✓ Interval clears when recording stops
  - ✓ Saved data includes mimeType and timestamp
  - ✓ Recovery is possible up to 24 hours after the crash

#### **FR-304: Transcript History**
- **Description:** All successfully processed notes are automatically saved to IndexedDB for future reference and cross-session persistence
- **Actors:** App (primary), IndexedDB (supporting)
- **Preconditions:** A note has been successfully polished
- **Flow:**
  1. When polishing completes successfully, app calls `saveNote()`
  2. `saveNote()` updates the current note's `rawTranscription` and `polishedNote` fields
  3. `store.saveNote(note)` persists the note to IndexedDB `history` object store
  4. On app startup, `checkForRecovery()` calls `store.loadHistory()` to populate `notes[]` array
  5. Notes are sorted by timestamp (newest first)
  6. Multiple notes can be stored (limited by IndexedDB quota, typically 50MB+)
- **Postconditions:** User can access all historical notes across browser sessions
- **Acceptance Criteria:**
  - ✓ Notes persist across page reloads
  - ✓ Notes persist across browser tab closures
  - ✓ Newest notes appear first in history
  - ✓ Each note retains title, raw transcript, polished content, and timestamp

#### **FR-305: Export to TXT**
- **Description:** User can download the current note as a plain text (.txt) file
- **Actors:** User (primary), Browser download API (supporting)
- **Preconditions:** A note has been successfully processed (not in empty state)
- **Flow:**
  1. User clicks the "📄 Export as TXT" button in the header
  2. App constructs text content:
     - Title (from `.editor-title`)
     - Timestamp (ISO locale string)
     - "POLISHED NOTE:" section with HTML-rendered content
     - "RAW TRANSCRIPT:" section with raw text
  3. Content is wrapped in a Blob with MIME type `text/plain`
  4. Browser downloads file with name pattern: `note-{noteId}.txt`
  5. Download is triggered via temporary `<a>` element (no new tab)
  6. ObjectURL is revoked after download completes
- **Postconditions:** User has a portable text file of the note
- **Acceptance Criteria:**
  - ✓ File downloads with correct filename format
  - ✓ Content includes title, timestamp, polished note, and raw transcript
  - ✓ Formatting is plain text (no HTML tags)
  - ✓ Button is disabled if note is empty (placeholder state)

#### **FR-306: Export to PDF**
- **Description:** User can download the current note as a formatted PDF document
- **Actors:** User (primary), html2pdf.js library (supporting)
- **Preconditions:** A note has been successfully processed (not in empty state)
- **Flow:**
  1. User clicks the "📰 Export as PDF" button in the header
  2. App constructs HTML content:
     - Large heading with note title
     - Subtitle with creation timestamp (grey text)
     - Horizontal divider
     - "Polished Note" section with markdown-rendered HTML (retained)
     - Horizontal divider
     - "Raw Transcript" section with monospace formatting and light grey background
  3. HTML is injected into a temporary `<div>` element
  4. html2pdf.js library is invoked with options:
     - Margin: 10mm
     - Filename: `note-{noteId}.pdf`
     - Image quality: 0.98 (JPEG)
     - HTML2Canvas scale: 2 (high resolution)
     - Format: A4 portrait
  5. PDF is generated and automatically downloaded
  6. Temporary element is cleaned up
- **Postconditions:** User has a shareable, formatted PDF of the note
- **Acceptance Criteria:**
  - ✓ PDF renders with correct title, timestamp, and content
  - ✓ Markdown formatting (headings, lists, bold, italics) is preserved in PDF
  - ✓ Filename follows `note-{noteId}.pdf` pattern
  - ✓ PDF is properly paginated for multi-page notes
  - ✓ Button is disabled if note is empty (placeholder state)

---

## 4. EXTERNAL INTERFACE REQUIREMENTS

### 4.1 User Interfaces
- **Browser UI:** HTML5, CSS3, JavaScript (ES2020+)
- **Accessibility:** WCAG 2.1 AA (keyboard navigation, screen reader support, colour contrast)
- **Device Support:** Desktop, tablet, mobile (responsive)
- **Input Methods:** Touch (mobile), mouse (desktop), keyboard (tabs, focus)

### 4.2 Software Interfaces

#### **Google Gemini API**
- **Service:** Google AI Studio (generative AI)
- **Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
- **Authentication:** API key injected via Vite `process.env.GEMINI_API_KEY`
- **Protocol:** HTTPS REST (POST)
- **Request Format:**
  ```json
  {
    "model": "gemini-2.5-flash",
    "contents": [
      {
        "text": "Generate a complete, detailed transcript of this audio."
      },
      {
        "inlineData": {
          "mimeType": "audio/webm",
          "data": "[base64-encoded-audio]"
        }
      }
    ]
  }
  ```
- **Response Format:** JSON with `text` field containing transcription
- **Error Handling:** Catches network errors, API errors; displays user-friendly message
- **Rate Limits:** Not specified; assumed sufficient for institutional use
- **Cost:** Per-token billing (Gemini API free tier + paid usage)

#### **Web Audio API**
- **Interface:** Browser native (`window.AudioContext` or `window.webkitAudioContext`)
- **Methods Used:**
  - `createMediaStreamSource(stream)` — converts microphone input to audio context
  - `createAnalyser()` — frequency analysis for waveform visualization
  - `getByteFrequencyData(array)` — populates frequency array
- **Constraints:** Same-origin policy; requires microphone permission

#### **MediaRecorder API**
- **Interface:** Browser native (`new MediaRecorder(stream)`)
- **MIME Types:** Attempts `audio/webm`; falls back to browser default if unsupported
- **Timeslice:** 100ms (data chunks emitted every 100ms)
- **Constraints:** Requires active MediaStream from `getUserMedia()`

#### **IndexedDB**
- **Database:** `tuc-dictation-db` (version 1)
- **Object Store:** `recordings` (key: `id`)
- **Record Schema:**
  ```typescript
  {
    id: 'current',
    chunks: Blob[],
    mimeType: string,
    startedAt: number,
    chunkCount: number
  }
  ```
- **Operations:** `open()`, `put()`, `get()`, `delete()`
- **Quota:** Browser-dependent (typically 50MB+); no overflow handling
- **Error Handling:** Silently fails if unavailable (e.g., private browsing); app still functional

#### **localStorage**
- **Keys:**
  - `theme` — "dark" | "light" (theme preference only)
- **Quota:** 5–10MB per origin
- **Persistence:** Survives browser restart
- **Note:** Theme preference stored here; all note data stored in IndexedDB instead

#### **IndexedDB (Combined Usage)**
- **Database:** `tuc-dictation-db` (version 2)
- **Object Stores:**
  1. `recordings` — In-progress audio chunks (crash recovery)
     - Key: `'current'` (single slot)
     - Data: `{ id, chunks: Blob[], mimeType, startedAt, chunkCount }`
  2. `history` — Completed notes (transcript history)
     - Key: auto-incremented ID
     - Data: `{ id: string, rawTranscription, polishedNote, timestamp }`
- **Quota:** 50MB+ per origin (sufficient for 1000+ notes)
- **Persistence:** Survives browser restart, more reliable than localStorage
- **Advantage over localStorage:** Larger quota, Blob support for audio chunks, better for structured data

### 4.3 Hardware Interfaces
- **Microphone:** Required; accessed via `navigator.mediaDevices.getUserMedia({ audio: true })`
- **Speaker:** Optional (users listen to their own recording during playback—not implemented)
- **Display:** Any resolution 320px–1920px wide

### 4.4 Communication Protocols
- **HTTP/HTTPS:** All communication to Gemini API uses HTTPS
- **CORS:** App runs on same domain as Gemini origin (no CORS issues expected)
- **TLS:** Minimum TLS 1.2 (Google default)

---

## 5. NON-FUNCTIONAL REQUIREMENTS

### 5.1 Performance

| Metric | Target | Notes |
|--------|--------|-------|
| **App load time** | <2 seconds | Includes splash screen fade (1.2s) |
| **Recording startup latency** | <1 second | Time from button click to actual recording |
| **Waveform frame rate** | ≥30 FPS | Via requestAnimationFrame |
| **Transcription time** | 5–30 seconds | Depends on audio length and Gemini latency |
| **Polishing time** | 5–30 seconds | Depends on transcription length |
| **Total processing time** | <2 minutes | For typical 5–10 minute recording |
| **IndexedDB write latency** | <100ms | Async; does not block recording |
| **Tab switch animation** | <300ms | CSS transition smooth |
| **Theme toggle transition** | <300ms | CSS custom properties update smoothly |
| **Memory footprint** | <50MB | In-memory state + audio chunks |

### 5.2 Scalability
- **Single User:** App is designed for one user per browser instance
- **Concurrent Sessions:** Multiple browser tabs will share IndexedDB (last-write-wins)
- **Recording Duration:** No hard limit; tested up to 30 minutes
- **Audio Quality:** Up to 48kHz sample rate (browser-dependent)

### 5.3 Reliability

| Aspect | Target | Mechanism |
|--------|--------|-----------|
| **Availability** | 99.5% | Depends on Gemini API uptime + server status |
| **MTBF** (Mean Time Between Failures) | N/A | Single-session app; no persistent state |
| **MTTR** (Mean Time To Recover) | <2 seconds | Recovery banner on app reload |
| **Graceful Degradation** | IndexedDB failure | App continues without persistence |
| **Error Recovery** | User-initiated | Recovery banner offers explicit "Recover" action |

### 5.4 Accessibility (WCAG 2.1 AA)

| Requirement | Implementation |
|------------|-----------------|
| **Keyboard Navigation** | All buttons focusable; tabs operable via arrow keys (native) |
| **Screen Reader Support** | ARIA labels on all interactive elements; `role` attributes on sections |
| **Colour Contrast** | Dark mode: 7:1 (text `#F8F6F0` on `#1A100C`); light mode: 9:1 (text `#2C1810` on `#F8F6F0`) |
| **Focus Indicators** | Browser default (outline); enhanced with CSS in hover states |
| **Non-text Content** | Decorative elements have `aria-hidden="true"` |
| **Form Labels** | Placeholders + explicit `aria-label` on buttons |
| **Error Messages** | User-friendly text; no numbers/codes without explanation |
| **Page Structure** | Semantic HTML (`<header>`, `<main>`, `<nav>`); proper heading hierarchy |

### 5.5 Usability
- **Learning Curve:** <2 minutes (simple three-step workflow)
- **Error Recovery:** All errors have clear, actionable messages
- **Feedback:** Real-time status updates and visual feedback (waveform, timer)
- **Consistency:** Same UI patterns across light/dark themes
- **Documentation:** In-app hero instructions + status messages

### 5.6 Security

#### **Data Security**
- **In Transit:** HTTPS/TLS for all Gemini API calls
- **At Rest:** Audio chunks stored in IndexedDB (browser-local only; unencrypted)
- **API Key:** Injected at build time; never exposed in client code (Vite `define`)
- **Session Auth:** No authentication required (app is public within institution)

#### **Threat Mitigations**
- **XSS:** Polished note uses marked.js (trusted markdown library); HTML content is scoped to the note div
- **CSRF:** No state-changing operations on external servers (Gemini is read-only for this app)
- **Microphone Abuse:** Users grant explicit permission; revocable in browser settings
- **Quota Exhaustion:** Assumed institutional API quota; no rate limiting implemented

### 5.7 Browser Compatibility

| Browser | Min Version | Notes |
|---------|------------|-------|
| **Chrome** | 120+ | Full support |
| **Firefox** | 120+ | Full support |
| **Safari** | 17+ | Full support |
| **Edge** | 120+ | Full support |
| **IE / Legacy Versions** | N/A | Not supported |

### 5.8 Device Compatibility
- **Desktop:** Windows, macOS, Linux
- **Mobile:** iOS (Safari 17+), Android (Chrome 120+)
- **Screen Sizes:** 320px (mobile) to 1920px (desktop)
- **Input:** Touch (mobile), mouse (desktop), keyboard (all)

---

## 6. DESIGN CONSTRAINTS

### 6.1 Brand & Visual Identity

#### **Colour Palette (Dark Mode)**
- Background: `#1A100C` (ink)
- Text Primary: `#F8F6F0` (cream)
- Text Secondary: `#E6D5C7` (warm beige)
- Text Tertiary: rgba(230, 213, 199, 0.6) (faded)
- Accent: `#D4AF37` (gold)
- Accent Alt: `#8B1538` (burgundy)
- Recording: `#8B1538` (burgundy)
- Border: rgba(212, 175, 55, 0.2) (gold, transparent)
- Surface: rgba(139, 21, 56, 0.1) (burgundy, transparent)

#### **Colour Palette (Light Mode)**
- Background: `#F8F6F0` (cream)
- Text Primary: `#2C1810` (warm brown)
- Text Secondary: rgba(44, 24, 16, 0.7) (faded brown)
- Text Tertiary: rgba(44, 24, 16, 0.5) (lighter)
- Accent: `#D4AF37` (gold)
- Accent Alt: `#8B1538` (burgundy)
- Recording: `#8B1538` (burgundy)
- Border: rgba(44, 24, 16, 0.1) (brown, transparent)
- Surface: `#FFFFFF` (white)

### 6.2 Typography

| Element | Font Family | Size | Weight | Notes |
|---------|------------|------|--------|-------|
| **Headings (h1–h3)** | Poppins | 1.8–2.5rem | 600–700 | Bold, premium feel |
| **Body Text** | Poppins | 1rem | 400–500 | Primary readable font |
| **Code Blocks** | SF Mono / monospace | 0.9rem | 400 | Technical content |
| **Buttons** | Poppins | 1rem | 500 | Consistent with body |
| **Placeholder** | Poppins | inherit | 400 | Faded text |

### 6.3 Responsive Breakpoints
- **Mobile (<768px):** Single-column, compact padding, small fonts, full-width buttons
- **Tablet (768–1024px):** Increased padding, medium fonts, widening of content
- **Desktop (>1024px):** Max-width container (900px), generous spacing, full-size components

### 6.4 Layout Constraints
- **Header Height:** 90px (normal), 300px max (expanded during recording)
- **Content Max-Width:** 900px
- **Padding:** 1.5rem–2rem on desktop; 1rem on mobile
- **Gap/Spacing:** 1rem–2rem between major sections
- **Border Radius:** 4–8px (buttons, cards, code blocks)
- **Shadows:** Subtle (0 2px 8px rgba(0,0,0,0.2) to 0 8px 24px rgba(0,0,0,0.4))
- **Transitions:** 0.2–0.45s cubic-bezier easing for smooth interactions

### 6.5 Icon System
- **Library:** Font Awesome 6.4.0 (CDN)
- **Icons Used:**
  - `fa-microphone` (record button)
  - `fa-stop` (stop recording state)
  - `fa-sun` (light theme toggle)
  - `fa-moon` (dark theme toggle)
  - `fa-plus` (new note)
  - `fa-wand-magic-sparkles` (polishing step)
  - `fa-file-lines` (editing step)
  - `fa-triangle-exclamation` (recovery alert)

---

## 7. OTHER REQUIREMENTS

### 7.1 Error Handling & User-Facing Messages

| Error Type | User Message | Recovery |
|-----------|--------------|----------|
| **Microphone denied** | "Microphone permission denied. Please check browser settings and reload page." | Reload page; grant permission in browser settings |
| **No microphone** | "No microphone found. Please connect a microphone." | Connect microphone; reload |
| **Microphone in use** | "Cannot access microphone. It may be in use by another application." | Close other apps using microphone; reload |
| **No audio captured** | "No audio data captured. Please try again." | Re-record; check microphone levels |
| **Transcription failed** | "Error getting transcription. Please try again." | Retry; check internet connection |
| **Polishing failed** | "Error polishing note. Please try again." | Retry; raw transcription is still visible |
| **Recovery available** | "A recording from X minute(s) ago was not processed." | "Recover & Process" or "Discard" |
| **IndexedDB unavailable** | (Silent—app continues) | (App works without persistence) |

### 7.2 Data Model

#### **Note Interface**
```typescript
interface Note {
  id: string;                    // unique identifier (note_${timestamp})
  rawTranscription: string;      // unmodified speech-to-text
  polishedNote: string;          // formatted markdown
  timestamp: number;             // creation time (Date.now())
}
```

#### **Recording Session**
```typescript
RecordingStore: {
  id: 'current',
  chunks: Blob[],                // audio data
  mimeType: string,              // 'audio/webm' or browser default
  startedAt: number,             // timestamp when recording began
  chunkCount: number             // number of chunks (informational)
}
```

### 7.3 Logging & Monitoring
- **Console Logging:** Errors and warnings logged for developer debugging
- **No Remote Telemetry:** App does not send usage data to external services
- **User Feedback:** Status messages and error alerts are the only feedback mechanism
- **IndexedDB Quota:** Not monitored; silently fails if quota exceeded

### 7.4 Backup & Recovery
- **User Data:** Not backed up (single-session, in-memory)
- **Recording Recovery:** IndexedDB auto-backup (24-hour window)
- **Notes:** User must manually copy/export notes (not implemented)
- **Server Deployment:** Standard git-based deployment; no database backup required

---

## 8. APPENDICES

### A. Dependency Versions
```json
{
  "dependencies": {
    "@google/genai": "^1.45.0",
    "marked": "^4.0.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.1.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.2.2",
    "@vitest/ui": "^3.0.0",
    "tailwindcss": "^4.2.2",
    "typescript": "~5.8.2",
    "vite": "7.3.1",
    "vitest": "^3.0.0"
  }
}
```

### B. IndexedDB Schema
```sql
Database: tuc-dictation-db
Version: 1

ObjectStore: recordings
  KeyPath: 'id'
  AutoIncrement: false
  
Record:
  {
    id: string ('current'),
    chunks: Blob[],
    mimeType: string,
    startedAt: number,
    chunkCount: number
  }
```

### C. Environment Variables
```
GEMINI_API_KEY=<Google API key>
VITE_API_URL=http://localhost:5000 (development)
```

### D. Deployment Configuration
- **Base URL:** `/dictation/`
- **Server:** Apache 2.4+ (Plesk-managed)
- **SSL:** HTTPS (TLS 1.2+)
- **File Ownership:** `techbridge.edu.gh_md:psacln`
- **File Permissions:** 755 (directories), 644 (files)

### E. Glossary
- **Gemini API:** Google's generative AI service (speech-to-text + formatting)
- **IndexedDB:** Browser-native key-value database for persistent storage
- **MediaRecorder API:** Browser API for capturing audio streams
- **Web Audio API:** Browser API for audio processing (AnalyserNode, etc.)
- **Waveform:** Real-time visualization of audio frequency spectrum
- **Polishing:** Automatic formatting of raw transcription into markdown
- **Recovery Banner:** UI element offering to re-process unsaved audio on app reload

---

## 9. SIGN-OFF

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **Prepared by** | Daniel Frempong Twum | — | 11 May 2026 |
| **Reviewed by** | — | — | — |
| **Approved by** | — | — | — |

---

**Document Status:** Active  
**Last Updated:** 11 May 2026 v1.0  
**Next Review Date:** 11 August 2026

---
