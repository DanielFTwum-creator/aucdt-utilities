  
**GrooveRx**

*Therapeutic Groove Streaming Platform*

**SOFTWARE REQUIREMENTS SPECIFICATION**

IEEE Std 830-1998 / IEEE Std 29148-2018 Compliant

| Document Version | 1.0.0 — Initial Release |
| :---- | :---- |
| **Status** | DRAFT — For Review |
| **Prepared By** | ICT Division — Techbridge University College |
| **Prepared For** | GrooveRx Development Team |
| **Date** | 15 March 2026 |
| **Classification** | Internal — Confidential |
| **Document Ref** | TUC-ICT-SRS-GROOVERX-2026-001 |

## **Revision History**

| Version | Date | Author | Description |
| :---- | :---- | :---- | :---- |
| 1.0.0 | 15 Mar 2026 | D.F. Twum, TUC ICT | Initial SRS — full scope definition |

# **1\. Introduction**

## **1.1 Purpose**

This Software Requirements Specification (SRS) defines the complete functional and non-functional requirements for GrooveRx — a therapeutic groove streaming platform designed to deliver continuous, high-danceability music on demand for healing, rehabilitation, and wellbeing purposes.

This document is prepared in conformance with IEEE Std 830-1998 and IEEE Std 29148-2018. It serves as the authoritative contract between stakeholders, designers, and developers throughout the full software development lifecycle.

## **1.2 Document Conventions**

The following conventions apply throughout this specification:

* **SHALL:** Indicates a mandatory requirement that MUST be implemented.

* **SHOULD:** Indicates a recommended requirement; deviation must be documented.

* **MAY:** Indicates an optional feature for future consideration.

* **FR-X.X:** Functional Requirement identifier (e.g., FR-4.1 refers to Section 4, Feature 1).

* **NFR-X.X:** Non-Functional Requirement identifier.

* **Priority: CRITICAL / HIGH / MEDIUM / LOW:** Reflects implementation urgency.

## **1.3 Intended Audience and Reading Suggestions**

| Frontend Engineers | Focus on Sections 3.1, 4.3–4.6, 5.1, 5.4 |
| :---- | :---- |
| **Backend Engineers** | Focus on Sections 3.3–3.4, 4.1–4.2, 4.8–4.9, 5.3, 6.1 |
| **DevOps / Infrastructure** | Focus on Sections 2.4, 3.3, 5.1–5.3, 6.1 |
| **QA / Testers** | Focus on Sections 4 (all), 5.1–5.4, Appendix C |
| **Project Managers** | Focus on Sections 1–2, 5.5, Appendix A |
| **Music Therapists / Advisors** | Focus on Sections 2.1–2.3, 4.2–4.3, Appendix A |

## **1.4 Product Scope**

GrooveRx is a purpose-built music streaming platform that differs fundamentally from general-purpose services such as Spotify or Apple Music. Its primary mission is therapeutic: to harness the scientifically documented healing properties of rhythmic, groovy music — particularly those rooted in Afrobeat, Reggae, Dancehall, Funk, Soca, and related Pan-African and Afro-diasporic traditions — and deliver them as personalised, uninterrupted healing sessions.

The platform provides:

* A curated, metadata-rich music library scored on a proprietary Groove Score (GS) algorithm measuring danceability, rhythm regularity, BPM suitability, bass prominence, and syncopation.

* A Healing Session Engine that maps musical characteristics to specific therapeutic modalities: physical rehabilitation, neurological stimulation (Rhythmic Auditory Stimulation), emotional release, social dance therapy, and mindful movement.

* A continuous, DJ-style audio streaming engine with intelligent crossfading, ensuring zero gaps between tracks and a smooth BPM progression curve throughout each session.

* An AI-powered recommendation engine (integrated with the Anthropic Claude API) that curates personalised healing programmes based on user history, stated goals, and real-time session feedback.

* A comprehensive administrative panel for library management, analytics, and content governance.

## **1.5 References**

* IEEE Std 830-1998: IEEE Recommended Practice for Software Requirements Specifications

* IEEE Std 29148-2018: ISO/IEC/IEEE Systems and Software Engineering — Life Cycle Processes — Requirements Engineering

* Thaut, M.H. (2008). Rhythm, Music, and the Brain. Taylor & Francis — Rhythmic Auditory Stimulation (RAS) framework.

* Levitin, D.J. (2006). This Is Your Brain on Music. Dutton — Neurological basis of music and emotion.

* Spotify Audio Features API Documentation (2024) — Danceability and energy metadata reference.

* WCAG 2.1 Level AA — W3C Web Content Accessibility Guidelines.

* OWASP Top 10 (2021) — Security requirements baseline.

* Spring Boot 3.x Reference Documentation — Backend framework.

* React 19.x Documentation — Frontend framework.

* HLS (RFC 8216\) — HTTP Live Streaming protocol specification.

# **2\. Overall Description**

## **2.1 Product Perspective**

GrooveRx operates as a standalone web application with potential for progressive web app (PWA) extension to mobile platforms. It is not a component of a larger existing system but is designed to integrate with Techbridge University College's broader AI Applications Portal ecosystem.

The system is conceived at the intersection of three domains:

| Music Therapy Science | Audio Streaming Technology | Artificial Intelligence |
| ----- | ----- | ----- |
| RAS, Dance Movement Therapy, Neurologic Music Therapy, BPM-based rehabilitation protocols | HLS adaptive streaming, Web Audio API, real-time crossfade, gapless playback, adaptive bitrate | Claude API session curation, Groove Score ML algorithm, user preference learning, healing pathway prediction |

The system's architecture follows a client-server model with a React 19 TypeScript frontend, a Java Spring Boot 3.x RESTful backend, a MariaDB relational database, a Redis caching layer, MinIO object storage for audio assets, and an HLS streaming engine. All components are containerised using Docker and orchestrated with Docker Compose.

## **2.2 Product Functions**

At a high level, GrooveRx shall provide the following principal functions:

* Music Library Management — curate, upload, tag, and score audio tracks with groove metadata.

* Groove Score Engine — algorithmically evaluate and assign each track a multi-dimensional Groove Score (0–100).

* Healing Session Engine — construct and manage therapeutic sessions with configurable BPM curves, duration, intensity, and healing modality.

* Continuous Audio Streaming — stream tracks gaplessly with crossfade transitions in real time via HLS.

* Intelligent Queue & Playlist Management — dynamically sequence tracks to maintain therapeutic intent.

* On-Demand Player Controls — provide users with a full-featured, accessible audio player.

* User Profile & Healing Journey Management — persist preferences, session history, and progress metrics.

* AI-Powered Recommendation Engine — use Claude API to generate contextualised healing programmes.

* Administrator Control Panel — manage library, users, content, and system configuration.

* Analytics & Reporting Dashboard — track usage, healing session outcomes, and content performance.

## **2.3 User Classes and Characteristics**

| Guest User | Unauthenticated visitor; may preview platform features but cannot stream or save sessions. Low technical sophistication assumed. |
| :---- | :---- |
| **Registered Listener** | Primary end-user; accesses full streaming, session management, and personal healing programmes. Ranges from tech-savvy individuals to older adults recovering from physical or neurological conditions. |
| **Music Therapist / Curator** | Credentialed professional who curates playlists, annotates tracks with clinical metadata, and reviews session outcome data. Moderate technical sophistication. |
| **Content Administrator** | Manages the music library including uploads, metadata editing, groove scoring, and content moderation. High technical sophistication. |
| **System Administrator** | Manages infrastructure, security, user accounts, and system configuration. Expert technical level; has full backend access. |
| **AI Agent (Claude API)** | Non-human actor that generates session recommendations and personalised healing programmes via API calls. |

## **2.4 Operating Environment**

* Server OS: Ubuntu 24.04 LTS (Plesk-managed or Docker host)

* Application Server: Java 21 LTS / Spring Boot 3.3.x

* Frontend Runtime: Modern web browsers (Chrome 120+, Firefox 120+, Safari 17+, Edge 120+) with ES2020 support

* Database: MariaDB 10.11 LTS (primary) \+ Redis 7.x (session cache and streaming queue)

* Object Storage: MinIO (S3-compatible, self-hosted) for audio file storage

* Streaming Protocol: HTTP Live Streaming (HLS) via hls.js client library

* Container Platform: Docker Engine 26.x \+ Docker Compose 2.x

* Network: Minimum 10 Mbps server uplink; 1 Mbps client connection for 128 kbps HLS stream

* Audio Processing: FFmpeg 6.x for transcoding and HLS segment generation

## **2.5 Design and Implementation Constraints**

* CONSTRAINT-001: The frontend SHALL be implemented in React 19.x with TypeScript 5.x and Vite as the build tool; pnpm as the package manager.

* CONSTRAINT-002: The backend SHALL be implemented in Java 21 with Spring Boot 3.3.x and Maven as the build tool.

* CONSTRAINT-003: All database interactions SHALL use MariaDB 10.11; JPA/Hibernate for ORM; no raw SQL in business logic layers.

* CONSTRAINT-004: Audio streaming SHALL use HLS (HTTP Live Streaming) to ensure broad client compatibility without requiring native audio codecs.

* CONSTRAINT-005: The platform SHALL NOT depend on third-party streaming services (Spotify, Apple Music, etc.) for audio delivery; all audio content is self-hosted on MinIO.

* CONSTRAINT-006: The AI Recommendation Engine SHALL use the Anthropic Claude API exclusively; the model SHALL be claude-sonnet-4-20250514 or latest stable equivalent.

* CONSTRAINT-007: All user-facing interfaces SHALL comply with WCAG 2.1 Level AA accessibility standards.

* CONSTRAINT-008: Authentication SHALL use JSON Web Tokens (JWT) with refresh token rotation; session tokens SHALL expire after 24 hours.

* CONSTRAINT-009: The system SHALL support Light, Dark, and High-Contrast themes switchable without page reload.

* CONSTRAINT-010: UK British English SHALL be used in all user-facing text, documentation, and system messages.

## **2.6 User Documentation**

* End-User Listener Guide — in-app contextual help and onboarding walkthrough

* Music Curator Guide — annotated guide for groove scoring and therapeutic tagging workflows

* Administrator Guide — full admin panel operational reference

* Deployment Guide — Docker Compose setup, environment configuration, FFmpeg pipeline

* API Reference — OpenAPI 3.1 (Swagger) auto-generated documentation

* Testing Guide — Playwright suite execution and screenshot capture procedures

## **2.7 Assumptions and Dependencies**

* **ASS-001:** Audio content is legally licensed or royalty-free; the development team is responsible for rights clearance prior to upload.

* **ASS-002:** An active Anthropic API key with sufficient token quota is available for the Claude recommendation engine.

* **ASS-003:** The server infrastructure provides a minimum of 4 CPU cores, 8 GB RAM, and 500 GB SSD storage for initial deployment.

* **ASS-004:** FFmpeg 6.x is installed on the server environment for audio transcoding and HLS segment generation.

* **ASS-005:** The system is not intended as a registered medical device; it is a wellness aid and makes no clinical diagnostic or prescriptive claims.

* **DEP-001:** hls.js (v1.5.x) — client-side HLS playback library.

* **DEP-002:** Wavesurfer.js (v7.x) — audio waveform visualisation.

* **DEP-003:** Zustand (v4.x) — React state management for player and session state.

* **DEP-004:** Tailwind CSS (v3.x) — utility-first styling framework.

* **DEP-005:** Spring Security 6.x — authentication and authorisation framework.

# **3\. External Interface Requirements**

## **3.1 User Interfaces**

The GrooveRx user interface SHALL be a single-page application (SPA) implemented in React 19 with TypeScript, employing a responsive layout compatible with viewport widths from 320px (mobile) to 2560px (4K desktop). The design language draws from healing aesthetics — deep navy, warm amber, and earthy tones — reflecting Pan-African and Afro-diasporic visual culture.

### **3.1.1 Core UI Screens**

* **Home / Discover:** Hero section with featured healing sessions; quick-start session launcher; mood selector widget.

* **Player Screen:** Full-featured audio player with waveform visualisation, BPM display, Groove Score badge, crossfade indicator, session timer, and queue panel.

* **Session Builder:** Healing modality selector; BPM range slider; session duration picker; energy curve visualiser; AI curate button.

* **Music Library:** Searchable, filterable track browser with Groove Score, BPM, genre, and healing affinity filters.

* **My Journey:** Personal dashboard showing session history, healing streaks, cumulative dance minutes, and progress charts.

* **AI Healing Programmes:** Claude-generated personalised programme cards with rationale, tracklist preview, and one-click launch.

* **Admin Panel:** Tabbed interface: Library Management, User Management, Analytics, System Settings, Audit Log.

### **3.1.2 Accessibility Requirements**

* All interactive elements SHALL have ARIA labels and roles.

* Keyboard navigation SHALL be fully supported with visible focus indicators.

* Colour contrast ratios SHALL meet WCAG 2.1 AA (4.5:1 for body text, 3:1 for large text).

* Audio player controls SHALL provide screen-reader-compatible labels (e.g., 'Play current track', 'Skip to next track').

* All imagery SHALL include descriptive alt text.

* Motion effects SHALL respect the prefers-reduced-motion media query.

## **3.2 Hardware Interfaces**

* Audio Output: The system interfaces with the host device's audio output hardware via the Web Audio API. No specific hardware is mandated; standard stereo output is assumed.

* Input Devices: Standard keyboard, mouse/trackpad, and touchscreen (for mobile/tablet use). No specialised hardware required.

* Storage (Server): MinIO object storage accessed via S3-compatible API; audio files segmented into HLS chunks by FFmpeg and stored on server-attached or network-attached SSD.

## **3.3 Software Interfaces**

| Anthropic Claude API | RESTful API — claude-sonnet-4-20250514; used for healing session curation and personalised programme generation. Authentication via Bearer API key stored server-side. |
| :---- | :---- |
| **MariaDB 10.11** | JDBC connection via Spring Data JPA / Hibernate; connection pool managed by HikariCP; schema migrations via Flyway. |
| **Redis 7.x** | Lettuce client via Spring Data Redis; stores streaming session state, queue snapshots, and crossfade buffers. |
| **MinIO Object Storage** | S3-compatible REST API via MinIO Java SDK; stores raw audio uploads, HLS segments (.m3u8 manifests \+ .ts chunks), and waveform JSON cache. |
| **FFmpeg 6.x** | Invoked as subprocess from Spring Boot AudioProcessingService; transcodes uploads to AAC 128/256 kbps and generates HLS segment manifests. |
| **hls.js v1.5** | Client-side JavaScript library loaded via npm; handles HLS manifest parsing, segment fetching, and buffer management in the browser. |
| **Wavesurfer.js v7** | Client-side waveform rendering; receives pre-generated waveform peak data JSON from backend. |
| **Spring Security 6** | JWT-based authentication; BCrypt password hashing; CORS configuration; method-level security annotations. |

## **3.4 Communications Interfaces**

* PROTOCOL-001: All client-server communication SHALL use HTTPS (TLS 1.3 minimum). HTTP connections SHALL be redirected to HTTPS.

* PROTOCOL-002: REST API endpoints SHALL use JSON (application/json) for request and response payloads, versioned under /api/v1/.

* PROTOCOL-003: HLS audio streaming SHALL be delivered via standard HTTP/2 GET requests to segment endpoints; stream manifests (.m3u8) SHALL be refreshed every 10 seconds for live session modes.

* PROTOCOL-004: Real-time player state synchronisation (crossfade cue points, queue updates) SHALL use WebSocket connections (STOMP over SockJS) when multiple device sessions are active.

* PROTOCOL-005: The Claude API SHALL be called exclusively from the backend service layer; API keys SHALL never be exposed to the client.

* PROTOCOL-006: Email notifications (session reminders, healing programme updates) SHALL be dispatched via SMTP using Spring Mail; templates in Thymeleaf.

# **4\. System Features**

This section defines all functional requirements organised by system feature. Each feature is described with its purpose, stimulus/response sequences, and a requirements table.

## **4.1 Music Library Management System (SF-001)**

### **4.1.1 Description**

The Music Library Management System provides the foundational data layer for all audio content in GrooveRx. It enables authorised curators and administrators to upload, categorise, annotate, and manage the full catalogue of therapeutic music tracks.

### **4.1.2 Functional Requirements**

| Req ID | Priority | Description |
| :---- | :---- | :---- |
| FR-4.1.1 | CRITICAL | The system SHALL allow authenticated administrators to upload audio files in MP3, FLAC, WAV, and AAC formats up to 200 MB per file. |
| FR-4.1.2 | CRITICAL | Upon upload, the system SHALL automatically transcode audio to AAC 128 kbps (streaming) and AAC 256 kbps (high-quality) using FFmpeg and generate HLS segment manifests. |
| FR-4.1.3 | CRITICAL | Each track SHALL store the following metadata: title, artist, album, genre, year, duration, BPM (auto-detected \+ manual override), energy level (0–10), mood tags, healing affinity tags, cultural origin, and copyright/licence information. |
| FR-4.1.4 | HIGH | The system SHALL automatically detect BPM from uploaded audio using a server-side BPM analysis algorithm (aubio library or equivalent). Administrators SHALL be able to override the detected value. |
| FR-4.1.5 | HIGH | The system SHALL generate and cache a waveform peak data file (JSON) for each track to support client-side Wavesurfer.js visualisation without real-time processing. |
| FR-4.1.6 | HIGH | The system SHALL support bulk metadata import via CSV upload for batch library population. |
| FR-4.1.7 | HIGH | Tracks SHALL be organisable into Curator Playlists and Healing Programme templates by authorised curators. |
| FR-4.1.8 | MEDIUM | The system SHALL support soft deletion of tracks (archived, not permanently deleted) to preserve session history integrity. |
| FR-4.1.9 | MEDIUM | The library SHALL support full-text search across all metadata fields with filters for genre, BPM range, Groove Score range, healing affinity, and cultural origin. |
| FR-4.1.10 | LOW | The system MAY integrate with external metadata providers (MusicBrainz API) to auto-populate artist, album, and genre data. |

## **4.2 Groove Score Engine (SF-002)**

### **4.2.1 Description**

The Groove Score Engine is the intellectual heart of GrooveRx. It evaluates each audio track across six therapeutic danceability dimensions and produces a composite Groove Score (GS) on a scale of 0–100. A score of 70+ is classified as High Dance Factor (HDF) and is prioritised in healing session queues.

### **4.2.2 Groove Score Dimensions**

| Rhythmic Pulse (RP) | Strength and regularity of the rhythmic pulse; 0–100. High RP indicates a clear, unwavering beat essential for Rhythmic Auditory Stimulation. |
| :---- | :---- |
| **BPM Therapeutic Zone (BTZ)** | Proximity of track BPM to optimal therapeutic ranges (70–90 BPM for rehabilitation; 90–130 BPM for active dance therapy); 0–100. |
| **Bass Groove Index (BGI)** | Prominence and groove depth of the bass line; measures low-frequency energy contribution to physical movement impulse; 0–100. |
| **Syncopation Factor (SF)** | Degree of syncopation and off-beat rhythmic interest; high SF correlates with increased dance engagement; 0–100. |
| **Energy Momentum (EM)** | Overall energy trajectory and dynamic range; measures whether the track builds, sustains, or resolves energy — key for session arc management; 0–100. |
| **Cultural Groove Authenticity (CGA)** | Alignment with documented groove vocabularies of specific cultural traditions (Afrobeat, Reggae, Dancehall, Funk, Soca, Cumbia); assessed via trained classifier; 0–100. |

**Composite Formula:** GS \= (0.25 × RP) \+ (0.20 × BTZ) \+ (0.20 × BGI) \+ (0.15 × SF) \+ (0.10 × EM) \+ (0.10 × CGA)

### **4.2.3 Functional Requirements**

| Req ID | Priority | Description |
| :---- | :---- | :---- |
| FR-4.2.1 | CRITICAL | The system SHALL calculate and persist a Groove Score for every track in the library upon upload or when manually triggered by an administrator. |
| FR-4.2.2 | CRITICAL | The Groove Score SHALL be computed from the six weighted dimensions defined in Section 4.2.2 using the composite formula specified above. |
| FR-4.2.3 | HIGH | Tracks with a Groove Score of 70 or above SHALL be flagged with a High Dance Factor (HDF) badge in all library and player views. |
| FR-4.2.4 | HIGH | Administrators and curators SHALL be able to manually override individual dimension scores with justification notes; overrides SHALL be logged in the audit trail. |
| FR-4.2.5 | HIGH | The Groove Score SHALL be recalculated automatically when any dimension input or weighting formula is updated in system settings. |
| FR-4.2.6 | MEDIUM | The system SHALL expose Groove Score as a primary filter parameter in library search and healing session construction. |
| FR-4.2.7 | MEDIUM | The system SHALL display a visual breakdown of all six dimension scores in the track detail view, presented as a radar/spider chart. |
| FR-4.2.8 | LOW | The system MAY train a machine learning model on curator feedback to refine dimension weights over time. |

## **4.3 Healing Session Engine (SF-003)**

### **4.3.1 Description**

The Healing Session Engine constructs and manages therapeutic listening sessions. Each session is defined by a healing modality, a BPM progression curve, a target duration, a minimum Groove Score threshold, and an energy arc (warm-up → peak → cool-down). The engine ensures that the queue of tracks honours these parameters throughout the session.

### **4.3.2 Healing Modalities**

| Physical Rehabilitation (PR) | BPM 70–90; slow BPM ramp; High RP weight; suitable for gait training, motor recovery, post-surgical mobility. Aligned with Rhythmic Auditory Stimulation (RAS) protocols. |
| :---- | :---- |
| **Neurological Stimulation (NS)** | BPM 90–110; steady BPM; High RP \+ BTZ; targets Parkinson's, stroke, and TBI rehabilitation via entrainment. |
| **Emotional Release (ER)** | BPM 80–120; dynamic energy arc; High SF \+ BGI; facilitates emotional processing, trauma-informed movement, and mood elevation. |
| **Active Dance Therapy (ADT)** | BPM 110–135; sustained high energy; All dimensions high; full dance movement therapy; highest Groove Score threshold (≥75). |
| **Social Dance Healing (SDH)** | BPM 100–130; community-focused; varied genre palette; CGA-weighted; for group dance sessions and cultural healing rituals. |
| **Mindful Movement (MM)** | BPM 60–85; gentle arc; lower energy momentum; meditative groove; supports yoga, tai chi, and somatic awareness practices. |

### **4.3.3 Functional Requirements**

| Req ID | Priority | Description |
| :---- | :---- | :---- |
| FR-4.3.1 | CRITICAL | The system SHALL provide the six healing modalities defined in Section 4.3.2 as selectable session types. |
| FR-4.3.2 | CRITICAL | Each session SHALL enforce a BPM range appropriate to its modality; tracks outside the BPM tolerance (±5 BPM from range boundary) SHALL NOT be included in the session queue. |
| FR-4.3.3 | CRITICAL | Each session SHALL define an energy arc: warm-up phase (first 20% of duration, lower energy), peak phase (middle 60%, maximum energy), and cool-down phase (final 20%, declining energy). |
| FR-4.3.4 | HIGH | Users SHALL be able to set session duration from 15 minutes to 120 minutes in 5-minute increments. |
| FR-4.3.5 | HIGH | The system SHALL display a real-time session progress indicator showing phase (warm-up/peak/cool-down), elapsed time, remaining time, and current BPM. |
| FR-4.3.6 | HIGH | Users SHALL be able to pause, resume, and end a healing session; session progress SHALL be saved on pause. |
| FR-4.3.7 | HIGH | Upon session completion, the system SHALL present a session summary: total time, tracks played, average Groove Score, modality completed, and prompt for a mood rating (1–10). |
| FR-4.3.8 | MEDIUM | The system SHALL allow users to set a Minimum Groove Score threshold (default: 65\) below which no tracks are included in their sessions. |
| FR-4.3.9 | MEDIUM | Users SHALL be able to schedule recurring sessions (daily, weekdays, weekends) with optional start time and push/email notification reminder. |
| FR-4.3.10 | LOW | The system MAY support facilitator-guided group sessions where a therapist controls playback and all connected participants stream synchronously. |

## **4.4 Continuous Audio Streaming Engine (SF-004)**

### **4.4.1 Description**

The Continuous Audio Streaming Engine is responsible for delivering uninterrupted, gapless music throughout a healing session. It achieves this through intelligent pre-buffering of the next track, real-time crossfading via the Web Audio API, and HLS-based adaptive bitrate delivery. The listener should experience the platform as a continuously flowing DJ mix, not a playlist of discrete tracks.

### **4.4.2 Functional Requirements**

| Req ID | Priority | Description |
| :---- | :---- | :---- |
| FR-4.4.1 | CRITICAL | The system SHALL stream audio via HLS (HTTP Live Streaming) with a minimum segment size of 6 seconds and a playlist window of 3 segments for low-latency switching. |
| FR-4.4.2 | CRITICAL | The streaming engine SHALL pre-buffer the next track beginning at T-minus 30 seconds before the current track ends, ensuring zero-gap transitions. |
| FR-4.4.3 | CRITICAL | The system SHALL implement real-time crossfade transitions between tracks with a configurable overlap duration of 3–12 seconds (default: 8 seconds) using the Web Audio API GainNode. |
| FR-4.4.4 | HIGH | The system SHALL support adaptive bitrate streaming with two quality levels: Standard (AAC 128 kbps) and High (AAC 256 kbps); selection shall be based on measured client bandwidth. |
| FR-4.4.5 | HIGH | If a network interruption occurs during streaming, the player SHALL automatically reconnect and resume from the last known position within 10 seconds. |
| FR-4.4.6 | HIGH | The system SHALL expose streaming endpoints that enforce authentication; unauthenticated HLS segment requests SHALL return HTTP 401\. |
| FR-4.4.7 | HIGH | The Web Audio API processing chain SHALL support: GainNode (volume), DynamicsCompressorNode (loudness normalisation), and BiquadFilterNode (optional bass boost for groove enhancement). |
| FR-4.4.8 | MEDIUM | The system SHALL normalise audio loudness across tracks to \-14 LUFS (EBU R128 standard) during the FFmpeg transcoding pipeline to prevent volume disparities between tracks. |
| FR-4.4.9 | MEDIUM | The player SHALL display a waveform visualisation of the currently playing track using Wavesurfer.js, with a playhead indicator and real-time progress. |
| FR-4.4.10 | LOW | The system MAY support a DJ Groove Mix mode where BPM matching and beat-aligned transitions create professional DJ-style mix transitions between tracks. |

## **4.5 Intelligent Queue & Playlist Engine (SF-005)**

### **4.5.1 Description**

The Queue Engine dynamically sequences tracks to honour the active session's healing parameters. It maintains awareness of the session's current phase (warm-up, peak, cool-down), BPM trajectory, Groove Score history, and user listening patterns to select the optimal next track at each transition point.

### **4.5.2 Functional Requirements**

| Req ID | Priority | Description |
| :---- | :---- | :---- |
| FR-4.5.1 | CRITICAL | The queue engine SHALL select the next track based on a multi-factor scoring function that weights: BPM proximity to target (40%), Groove Score (30%), genre variety (15%), and user listen history avoidance (15%). |
| FR-4.5.2 | CRITICAL | Tracks already played within the current 7-day window SHALL be deprioritised (not excluded) in queue selection to maximise variety. |
| FR-4.5.3 | HIGH | The queue SHALL pre-compute 5 tracks ahead and make the upcoming queue visible to the user in the player's Queue Panel. |
| FR-4.5.4 | HIGH | Users SHALL be able to manually reorder, remove, or insert tracks into the upcoming queue without interrupting current playback. |
| FR-4.5.5 | HIGH | The queue engine SHALL honour the session energy arc; during the warm-up phase it SHALL favour lower-EM tracks, during peak it SHALL select maximum-EM tracks, and during cool-down it SHALL apply a descending EM filter. |
| FR-4.5.6 | MEDIUM | The system SHALL support user-defined playlist pinning: a user may pin up to 10 tracks that SHALL always appear in their sessions for the selected modality. |
| FR-4.5.7 | MEDIUM | The queue engine SHALL avoid repeating the same artist for more than 2 consecutive tracks to maintain variety. |
| FR-4.5.8 | LOW | The system MAY implement a Groove Surge mode: when user mood rating drops below 5, the queue engine immediately advances to the top-rated HDF track available. |

## **4.6 On-Demand Player Controls (SF-006)**

### **4.6.1 Description**

The player provides the primary interaction surface for listeners. It presents a visually rich, accessible interface with full control over playback, session parameters, and audio processing. The player remains persistent across all screens as a fixed footer bar on desktop and a modal on mobile.

### **4.6.2 Functional Requirements**

| Req ID | Priority | Description |
| :---- | :---- | :---- |
| FR-4.6.1 | CRITICAL | The player SHALL provide Play, Pause, Skip Forward, Skip Backward (to start of current track), and Stop controls. |
| FR-4.6.2 | CRITICAL | The player SHALL display: track title, artist, album art, current position, total duration, BPM, Groove Score badge, and session phase indicator. |
| FR-4.6.3 | CRITICAL | Users SHALL be able to adjust playback volume (0–100%) and mute/unmute without interrupting stream buffering. |
| FR-4.6.4 | HIGH | The player SHALL support seeking within the current track via click/tap on the waveform or a timeline scrubber, with the stream resuming from the selected position. |
| FR-4.6.5 | HIGH | Users SHALL be able to toggle a Bass Boost mode that applies a low-shelf filter (+6 dB at 100 Hz) to enhance groove feel for tracks with a BGI below 60\. |
| FR-4.6.6 | HIGH | The player SHALL display the crossfade countdown indicator (e.g., 'Mixing in next track... 8s') during the crossfade window. |
| FR-4.6.7 | HIGH | Users SHALL be able to rate the currently playing track (thumbs up / thumbs down) to inform the queue engine; rating data is persisted to user profile. |
| FR-4.6.8 | MEDIUM | The player SHALL support keyboard shortcuts: Space (play/pause), Arrow Right (skip), Arrow Left (restart), M (mute), B (bass boost toggle). |
| FR-4.6.9 | MEDIUM | The player SHALL expose Media Session API integration so operating system media controls (physical buttons, lock screen) control GrooveRx playback. |
| FR-4.6.10 | LOW | The system MAY support Picture-in-Picture (PiP) mode displaying a compact player widget whilst the user browses other browser tabs. |

## **4.7 User Profile & Healing Journey Management (SF-007)**

### **4.7.1 Description**

The Healing Journey module provides registered listeners with a personalised health and wellness dashboard. It tracks session history, healing streaks, cumulative engagement metrics, and mood progression over time. This data drives the AI Recommendation Engine and provides users with tangible evidence of their healing progress.

### **4.7.2 Functional Requirements**

| Req ID | Priority | Description |
| :---- | :---- | :---- |
| FR-4.7.1 | CRITICAL | The system SHALL record every completed or partially completed session: user ID, modality, start time, end time, tracks played, average Groove Score, and mood rating. |
| FR-4.7.2 | CRITICAL | The system SHALL maintain a Healing Streak counter (consecutive days with at least one completed session ≥15 minutes); the streak resets at midnight if no qualifying session occurred. |
| FR-4.7.3 | HIGH | Users SHALL be able to set and edit Healing Goals from a predefined list: Pain Management, Mood Elevation, Motor Rehabilitation, Sleep Improvement, Anxiety Reduction, Social Connection, Pure Enjoyment. |
| FR-4.7.4 | HIGH | The My Journey dashboard SHALL display: current healing streak, total dance minutes (all-time), sessions completed (this week / all-time), mood trend chart (30-day), and favourite modality. |
| FR-4.7.5 | HIGH | User profiles SHALL store audio preferences: preferred genres, disliked genres, preferred Groove Score minimum, and preferred BPM range. |
| FR-4.7.6 | MEDIUM | Users SHALL be able to export their healing journey data as a CSV or PDF report. |
| FR-4.7.7 | MEDIUM | The system SHALL send a weekly Healing Progress Summary email summarising the week's sessions, streak status, and a new AI-generated programme recommendation. |
| FR-4.7.8 | LOW | The system MAY support sharing a Healing Journey highlight card (image) to social media platforms, showing streak count and milestone achievements. |

## **4.8 AI-Powered Recommendation Engine — Claude Integration (SF-008)**

### **4.8.1 Description**

The AI Recommendation Engine leverages the Anthropic Claude API (claude-sonnet-4-20250514) to generate intelligent, contextualised healing programmes and session recommendations. The engine synthesises the user's healing goals, session history, mood data, favourite modalities, and the current library's Groove Score distribution to construct personalised therapeutic listening programmes with clinical-quality rationale.

### **4.8.2 Functional Requirements**

| Req ID | Priority | Description |
| :---- | :---- | :---- |
| FR-4.8.1 | CRITICAL | The system SHALL call the Claude API exclusively from the backend RecommendationService; the Anthropic API key SHALL be stored as an encrypted environment variable and SHALL never be transmitted to the client. |
| FR-4.8.2 | CRITICAL | The recommendation engine SHALL generate a personalised Healing Programme (name, description, 5–10 track playlist, modality, BPM range, rationale) on user request. |
| FR-4.8.3 | CRITICAL | The Claude prompt context SHALL include: user healing goals, last 30 sessions summary, mood trend, preferred genres, and a curated list of high-GS tracks from the library relevant to the user's modality preferences. |
| FR-4.8.4 | HIGH | The system SHALL generate a new Weekly Healing Programme automatically every Sunday at 00:00 GMT for all active users with at least 3 completed sessions in the preceding 14 days. |
| FR-4.8.5 | HIGH | The Claude response SHALL be structured as JSON (enforced via system prompt); the backend SHALL validate and parse the response before persisting. |
| FR-4.8.6 | HIGH | Generated programmes SHALL include a plain-language therapeutic rationale (2–4 sentences) explaining why each track was selected relative to the user's healing context. |
| FR-4.8.7 | HIGH | If the Claude API is unavailable, the system SHALL fall back to a rule-based recommendation engine that selects tracks by GS, modality, and BPM range without AI rationale. |
| FR-4.8.8 | MEDIUM | Users SHALL be able to regenerate a programme with a natural-language refinement prompt (e.g., 'Make it more upbeat' or 'Focus on Afrobeat only'). |
| FR-4.8.9 | MEDIUM | All Claude API calls SHALL be logged with: user ID (anonymised), input token count, output token count, latency (ms), and model version. No personally identifiable information SHALL be stored in API logs. |
| FR-4.8.10 | LOW | The system MAY support a Groove Therapist Chat mode where users can converse with Claude about their healing journey and receive contextual music recommendations in natural language. |

## **4.9 Administrator Control Panel (SF-009)**

### **4.9.1 Description**

The Admin Panel provides a secure, role-gated management interface for content administrators and system administrators. It is accessible at /admin and requires authentication with MFA for System Administrator role. All admin actions are recorded in an immutable audit log.

### **4.9.2 Functional Requirements**

| Req ID | Priority | Description |
| :---- | :---- | :---- |
| FR-4.9.1 | CRITICAL | The Admin Panel SHALL be accessible only to users with roles ROLE\_CURATOR, ROLE\_CONTENT\_ADMIN, or ROLE\_SYSTEM\_ADMIN; any other access attempt SHALL return HTTP 403\. |
| FR-4.9.2 | CRITICAL | ROLE\_SYSTEM\_ADMIN login SHALL require Multi-Factor Authentication (MFA) via TOTP (Google Authenticator compatible); MFA cannot be disabled for this role. |
| FR-4.9.3 | CRITICAL | Every administrative action (track upload, metadata edit, user role change, system setting modification) SHALL be recorded in an audit log with: actor user ID, action type, target entity, timestamp, and IP address. |
| FR-4.9.4 | CRITICAL | The audit log SHALL be read-only from the admin UI; direct database modification of audit records SHALL be blocked at the application layer. |
| FR-4.9.5 | HIGH | The Library Management tab SHALL provide: track upload, metadata editing, groove score recalculation, soft delete, restore, and CSV bulk import. |
| FR-4.9.6 | HIGH | The User Management tab SHALL allow administrators to: view all users, modify roles, reset passwords, disable accounts, and view individual user session history. |
| FR-4.9.7 | HIGH | The System Settings tab SHALL allow configuration of: crossfade duration defaults, BPM detection thresholds, Groove Score weighting formula, Claude API model selection, and email notification schedules. |
| FR-4.9.8 | MEDIUM | The Admin Panel SHALL display a system health dashboard: CPU usage, memory usage, active streaming sessions, MinIO storage used, MariaDB connection pool status, and Redis memory. |
| FR-4.9.9 | MEDIUM | Administrators SHALL be able to export the full audit log as CSV for a specified date range. |
| FR-4.9.10 | LOW | The system MAY support a Content Moderation queue where flagged tracks (listener reports) are reviewed and actioned by curators before the report is closed. |

## **4.10 Analytics & Reporting Dashboard (SF-010)**

### **4.10.1 Description**

The Analytics module provides administrators and curators with insights into platform usage, healing session outcomes, content performance, and listener engagement. All analytics are computed server-side and presented via interactive charts in the admin panel.

### **4.10.2 Functional Requirements**

| Req ID | Priority | Description |
| :---- | :---- | :---- |
| FR-4.10.1 | HIGH | The system SHALL track and display: daily/weekly/monthly active listeners, total streaming hours, sessions by modality, average session completion rate, and top-played tracks. |
| FR-4.10.2 | HIGH | The system SHALL display a Healing Outcomes chart: aggregate mood rating trends over time, broken down by healing modality. |
| FR-4.10.3 | HIGH | The Groove Score Distribution chart SHALL show the distribution of GS across the entire library with counts per decile (0–9, 10–19, ..., 90–100). |
| FR-4.10.4 | MEDIUM | The system SHALL provide a Content Performance table showing each track's: total plays, total listen-minutes, average mood impact, skip rate, and thumbs-up/down ratio. |
| FR-4.10.5 | MEDIUM | Administrators SHALL be able to filter all analytics by date range, modality, user cohort (by healing goal), and genre. |
| FR-4.10.6 | LOW | The system MAY generate a monthly Therapeutic Outcomes PDF report summarising aggregate healing progress metrics for sharing with stakeholders. |

# **5\. Non-Functional Requirements**

## **5.1 Performance Requirements**

| Req ID | Priority | Description |
| :---- | :---- | :---- |
| NFR-5.1.1 | CRITICAL | The system SHALL support a minimum of 200 concurrent HLS streaming sessions on a 4-core / 8 GB RAM server deployment without degradation of stream quality. |
| NFR-5.1.2 | CRITICAL | API response times for non-streaming endpoints (track metadata, queue updates, user profile) SHALL be under 300 ms at the 95th percentile under normal load. |
| NFR-5.1.3 | CRITICAL | Audio stream initialisation (first HLS segment delivery after play command) SHALL occur within 2 seconds on a 1 Mbps client connection. |
| NFR-5.1.4 | HIGH | FFmpeg audio transcoding of a 5-minute track SHALL complete within 60 seconds on a 4-core server. |
| NFR-5.1.5 | HIGH | The React 19 frontend initial page load (First Contentful Paint) SHALL be under 2.5 seconds on a 4G mobile connection (simulated at 10 Mbps). |
| NFR-5.1.6 | HIGH | Claude API recommendation generation SHALL complete within 15 seconds; the UI SHALL display a loading indicator and SHALL NOT block other interactions during generation. |
| NFR-5.1.7 | MEDIUM | The MariaDB query execution time for the queue selection algorithm SHALL be under 100 ms for a library of up to 50,000 tracks. |

## **5.2 Safety Requirements**

| Req ID | Priority | Description |
| :---- | :---- | :---- |
| NFR-5.2.1 | CRITICAL | GrooveRx SHALL NOT make any clinical medical claims, diagnoses, or prescriptive health recommendations; all session descriptions SHALL include the disclaimer: 'GrooveRx is a wellness aid. Consult a qualified healthcare professional for medical advice.' |
| NFR-5.2.2 | HIGH | The system SHALL cap default playback volume at 85% to mitigate risk of hearing damage; a warning SHALL be displayed when the user attempts to set volume above 85%. |
| NFR-5.2.3 | HIGH | The platform SHALL include a photosensitivity notice in the UI for any visualisation that involves flashing or strobing effects (Groove Score animations). |
| NFR-5.2.4 | MEDIUM | Session durations SHALL be capped at 3 hours per continuous session; the system SHALL present a rest prompt after 3 hours and resume only on user confirmation. |

## **5.3 Security Requirements**

| Req ID | Priority | Description |
| :---- | :---- | :---- |
| NFR-5.3.1 | CRITICAL | All passwords SHALL be hashed using BCrypt with a cost factor of 12 or higher; plaintext passwords SHALL NEVER be stored or logged. |
| NFR-5.3.2 | CRITICAL | JWT access tokens SHALL expire after 1 hour; refresh tokens after 30 days. Refresh token rotation SHALL be enforced. |
| NFR-5.3.3 | CRITICAL | All HLS streaming endpoints SHALL validate JWT on every manifest request; segment URLs SHALL be signed with time-limited HMAC tokens (TTL: 5 minutes) to prevent URL sharing. |
| NFR-5.3.4 | CRITICAL | The system SHALL implement OWASP Top 10 (2021) mitigations: input validation, output encoding, parameterised queries (via JPA), CSRF protection, and security headers (CSP, HSTS, X-Frame-Options). |
| NFR-5.3.5 | CRITICAL | The Anthropic API key SHALL be stored in an encrypted environment variable; it SHALL never appear in application logs, error messages, or API responses. |
| NFR-5.3.6 | HIGH | The system SHALL implement rate limiting on authentication endpoints: maximum 5 failed login attempts per IP per 15 minutes before temporary lockout. |
| NFR-5.3.7 | HIGH | User personal data SHALL be handled in compliance with applicable data protection legislation (Ghana Data Protection Act 2012; GDPR where applicable for EU users). |
| NFR-5.3.8 | HIGH | The admin panel SHALL enforce IP allowlisting for ROLE\_SYSTEM\_ADMIN access as an additional authentication layer. |
| NFR-5.3.9 | MEDIUM | Uploaded audio files SHALL be virus-scanned via ClamAV before transcoding is initiated. |

## **5.4 Software Quality Attributes**

| Availability | The system SHALL target 99.5% uptime (excluding planned maintenance). Planned maintenance SHALL be scheduled during off-peak hours (01:00–04:00 GMT) with 48 hours prior notice to users. |
| :---- | :---- |
| **Reliability** | Stream buffer under-runs shall not exceed 0.5% of total streaming time. Failed API calls to Claude SHALL trigger the fallback recommendation engine within 3 seconds. |
| **Maintainability** | Code coverage via unit tests SHALL be at least 80% for backend services and 70% for React components. All API endpoints SHALL have Swagger documentation. SOLID principles SHALL be enforced via code review. |
| **Scalability** | The architecture SHALL support horizontal scaling of the backend service layer behind a load balancer. Database connection pooling (HikariCP) SHALL be configurable for multi-instance deployments. |
| **Portability** | The entire stack SHALL be deployable via a single Docker Compose file on any Ubuntu 22.04+ or 24.04 host. Environment-specific configuration SHALL be managed via .env files. |
| **Usability** | New listeners SHALL be able to start their first healing session within 3 minutes of registration without external guidance. Onboarding flow SHALL have a maximum of 5 steps. |
| **Internationalisation** | The UI architecture SHALL support i18n via react-i18next; initial launch supports English (GB). Arabic and French (West Africa) are planned for Phase 2\. |

## **5.5 Business Rules**

* BR-001: A track must achieve a minimum Groove Score of 50 to be eligible for inclusion in any healing session queue. Tracks below 50 are stored in the library but excluded from session engines.

* BR-002: Active Dance Therapy (ADT) sessions require a minimum Groove Score threshold of 75; this cannot be lowered by the user.

* BR-003: The system will not surface tracks with no copyright/licence information in the public-facing library; such tracks are held in a 'Pending Clearance' status.

* BR-004: User mood ratings are used solely for personalisation and aggregate analytics; they are not shared with third parties and are not used for medical assessment.

* BR-005: Claude API-generated content (programme rationale, session descriptions) must pass a backend content filter before display; any output mentioning specific medications, diagnoses, or medical procedures must be flagged and withheld.

* BR-006: A user's healing journey data is owned by the user; they may request full data export or deletion at any time, which must be fulfilled within 30 days.

# **6\. Other Requirements**

## **6.1 Database Requirements**

The following core entities SHALL be implemented in the MariaDB schema. All tables SHALL include created\_at, updated\_at, and created\_by audit columns.

| tracks | id, title, artist, album, genre, bpm, duration\_seconds, groove\_score, rp\_score, btz\_score, bgi\_score, sf\_score, em\_score, cga\_score, hdf\_flag, cultural\_origin, licence\_type, audio\_path\_hls, audio\_path\_hq, waveform\_json\_path, status (ACTIVE/ARCHIVED/PENDING) |
| :---- | :---- |
| **healing\_sessions** | id, user\_id, modality, start\_time, end\_time, duration\_planned, duration\_actual, avg\_groove\_score, mood\_rating, status (COMPLETED/PARTIAL/ABANDONED) |
| **session\_tracks** | id, session\_id, track\_id, played\_at, play\_duration, skipped, user\_rating |
| **users** | id, email, password\_hash, display\_name, role, mfa\_secret, mfa\_enabled, healing\_goals, preferred\_genres, min\_groove\_score\_preference, preferred\_bpm\_min, preferred\_bpm\_max, streak\_count, streak\_last\_updated |
| **healing\_programmes** | id, user\_id, name, description, modality, rationale\_text, generated\_by (AI/RULE\_BASED), claude\_model\_version, created\_at |
| **programme\_tracks** | id, programme\_id, track\_id, position, rationale |
| **audit\_log** | id, actor\_user\_id, action\_type, target\_entity, target\_id, detail\_json, ip\_address, created\_at (IMMUTABLE) |
| **playlists** | id, creator\_user\_id, name, description, modality\_tag, is\_public |
| **playlist\_tracks** | id, playlist\_id, track\_id, position |

## **6.2 Internationalisation Requirements**

* All UI strings SHALL be externalised to JSON language resource files loaded via react-i18next.

* Date and time display SHALL respect the user's locale setting (ISO 8601 format internally; localised display for UK English: DD/MM/YYYY).

* BPM values, Groove Scores, and session durations SHALL be locale-agnostic numerics.

* Right-to-left (RTL) layout support SHALL be architected from the start using CSS logical properties, in preparation for Arabic language support in Phase 2\.

## **6.3 Legal and Compliance Requirements**

* LEGAL-001: All audio content uploaded to GrooveRx must be covered by a valid licence (Creative Commons, royalty-free purchase, or institutional licence). The licence type and reference number must be recorded in the tracks table.

* LEGAL-002: GrooveRx must comply with the Ghana Data Protection Act 2012 with respect to personal data collection, processing, and storage.

* LEGAL-003: The platform must display a Terms of Service and Privacy Policy accessible from the footer; users must actively accept these upon registration.

* LEGAL-004: The system must provide data subject access request (DSAR) functionality enabling users to export or delete their personal data within 30 days of request.

* LEGAL-005: The wellness disclaimer (Section 5.2 NFR-5.2.1) must appear on every session launch screen and in the registration flow.

# **Appendix A: Glossary**

| ADT | Active Dance Therapy — healing modality for full dance movement therapy at BPM 110–135. |
| :---- | :---- |
| **BGI** | Bass Groove Index — Groove Score dimension measuring bass line prominence. |
| **BTZ** | BPM Therapeutic Zone — Groove Score dimension measuring BPM proximity to therapeutic optima. |
| **CGA** | Cultural Groove Authenticity — Groove Score dimension measuring alignment with cultural groove traditions. |
| **Claude** | Anthropic's large language model; used for AI-powered healing programme generation. |
| **EM** | Energy Momentum — Groove Score dimension measuring energy trajectory and dynamic range. |
| **GS** | Groove Score — composite danceability and therapeutic suitability score (0–100). |
| **HDF** | High Dance Factor — designation for tracks with Groove Score ≥ 70\. |
| **HLS** | HTTP Live Streaming — Apple's adaptive streaming protocol used for audio delivery. |
| **LUFS** | Loudness Units relative to Full Scale — standard unit for measuring audio loudness. |
| **MM** | Mindful Movement — healing modality for meditative groove at BPM 60–85. |
| **MFA** | Multi-Factor Authentication — additional login verification beyond password. |
| **NS** | Neurological Stimulation — healing modality targeting neurological rehabilitation. |
| **PR** | Physical Rehabilitation — healing modality for gait and motor recovery. |
| **RAS** | Rhythmic Auditory Stimulation — evidence-based music therapy technique using rhythmic cues. |
| **RP** | Rhythmic Pulse — Groove Score dimension measuring beat clarity and regularity. |
| **SF** | Syncopation Factor — Groove Score dimension measuring off-beat rhythmic complexity. |

# **Appendix B: System Context Diagram (Narrative)**

GrooveRx sits at the centre of a constellation of interacting systems. The Listener (end-user) interacts via a React 19 SPA served from the Spring Boot backend. The backend orchestrates all business logic, calls FFmpeg for audio processing, reads/writes MariaDB for persistent data, caches session state in Redis, retrieves audio segments from MinIO, and calls the Anthropic Claude API for recommendation generation. The Admin User interacts with a dedicated secure panel served by the same backend. External dependencies — Claude API, MinIO, MariaDB, Redis — are containerised within the same Docker network for development and staged for cloud migration in production.

# **Appendix C: Open Issues**

| ISSUE-001 | OPEN — Beat-aligned crossfade (DJ Groove Mix mode) requires BPM grid synchronisation at the Web Audio API level; feasibility study required before FR-4.4.10 implementation. |
| :---- | :---- |
| **ISSUE-002** | OPEN — CGA (Cultural Groove Authenticity) scoring model training dataset not yet defined. An initial curated dataset of 500 tracks per tradition is required. Consult with musicologists specialising in Afrobeat, Reggae, Dancehall, and Funk. |
| **ISSUE-003** | OPEN — Facilitator-guided group sessions (FR-4.3.10) require WebRTC or RTMP synchronisation research; scope tentatively deferred to Phase 2\. |
| **ISSUE-004** | OPEN — Virus scanning via ClamAV (NFR-5.3.9) adds latency to the upload pipeline; acceptable upload completion time to be agreed with the operations team. |
| **ISSUE-005** | OPEN — Licensing clearance workflow and tracking beyond metadata fields not yet defined; legal team to specify full rights management requirements. |

