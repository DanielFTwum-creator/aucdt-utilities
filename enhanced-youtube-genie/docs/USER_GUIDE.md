# YouTube Description Genie — User Guide

**Document ID:** TUC-YTG-USER-2026-001
**Version:** 1.0
**Last Updated:** 30 June 2026
**Audience:** TUC staff, faculty, and music creators

## Table of Contents

1. [What Is This Tool?](#what-is-this-tool)
2. [Signing In](#signing-in)
3. [The Song Details Form](#the-song-details-form)
4. [Generating a Description](#generating-a-description)
5. [Using Your Generated Description](#using-your-generated-description)
6. [Generating Another Description](#generating-another-description)
7. [Switching Themes](#switching-themes)
8. [Signing Out](#signing-out)
9. [Troubleshooting](#troubleshooting)

---

## What Is This Tool?

The YouTube Description Genie generates professional, SEO-optimised descriptions for YouTube music videos. You provide details about your song — title, artist, genres, mood, and lyrics — and the tool uses AI to produce a ready-to-paste description tailored for YouTube.

**URL:** `https://ai-tools.techbridge.edu.gh/youtube-genie/`

Access is restricted to authorised Techbridge University College accounts.

---

## Signing In

1. Navigate to `https://ai-tools.techbridge.edu.gh/youtube-genie/`
2. You will see the TUC login screen with a **Continue with Google** button
3. Click the button — you will be redirected to Google's sign-in page
4. Sign in with your `@techbridge.edu.gh` account (or the personal Google account that has been granted access)
5. After signing in, Google redirects you back to the tool and you are logged in automatically

Your session persists across page refreshes. You will not need to sign in again unless you clear your browser data or sign out explicitly.

**No password is required.** Authentication is handled entirely by Google.

---

## The Song Details Form

Once signed in, you will see the **Enter Song Details** form. Fill in the fields below before generating.

### Required Fields

| Field | What to Enter | Example |
|---|---|---|
| **Song Title** | The full title of your song or release | `Run Away Riddim Mix` |
| **Artist Name** | Your artist or stage name | `Kudjo Twum` |
| **YouTube Channel Handle** | Your channel handle, starting with `@` | `@KudjoTwum` |
| **Genres** | One or more genres, separated by commas | `Dub Reggae, Dark Pop, Dancehall` |
| **Vibe Keywords** | Words that describe the mood and feeling | `Eerie, driving, anthemic, raw` |
| **Lyrics** | Your full song lyrics | Paste the complete lyrics |

All required fields are validated before you can generate. If a field is missing or invalid, an error message appears beneath it and the form scrolls to the first problem.

### Optional Fields

| Field | What to Enter |
|---|---|
| **Influences** | Artists or bands that inspired this song (e.g., `Bob Marley, Steel Pulse`) |
| **Key Chorus Line** | The most memorable line from your chorus — the hook that sticks |
| **Credits** | Production credits, one per line (e.g., `Produced by: John Doe`) |

Adding optional fields gives the AI more context and typically produces richer, more specific descriptions. The more you provide, the better the result.

### Auto-Save

Your form data is saved automatically to your browser as you type (with a short delay). If you close the tab and return, your last-entered details will be restored.

---

## Generating a Description

1. Fill in all required fields (and any optional fields you want)
2. Click **Generate Description** at the bottom of the form
3. The right-hand panel shows "AI is crafting your description…" while the request is processed
4. The generated description appears in the panel within a few seconds

Generation typically takes 3 to 8 seconds depending on the length of your lyrics and server load.

**If the API is unavailable**, a status indicator appears at the top of the page. This means the backend connection to the AI service is temporarily down — wait a moment and try again.

---

## Using Your Generated Description

Once the description appears:

1. Read through it and confirm it accurately represents your song
2. Click the **Copy** button in the top-right corner of the description panel
3. The button changes to **Copied!** for 2 seconds to confirm the copy
4. Paste directly into the YouTube Studio description field when uploading or editing your video

**Tip:** YouTube descriptions perform best when they include relevant keywords naturally. The generated description already includes your song title, artist name, genres, and vibe keywords. You may want to add your social media links, website, or a call to action at the end before pasting.

---

## Generating Another Description

After receiving a result, you can:

- **Modify the form and regenerate** — Use the **Generate Another** or back button to return to the form. Your previous inputs are preserved, so you can tweak individual fields (e.g., change the vibe keywords) and generate a new version.
- **Generate a fresh description for a different song** — Clear the form fields and enter new details.

Each generation is counted in the usage statistics visible to ICT administrators.

---

## Switching Themes

The tool supports three colour schemes. Click the **theme toggle button** in the top-right corner of the page to cycle through them:

| Theme | Appearance | Best For |
|---|---|---|
| **Dark** (default) | Dark background, gold accents | Low-light environments, extended use |
| **Light** | Cream background, dark text | Bright offices, printing |
| **High Contrast** | Black background, white text, yellow accents | Accessibility, visual impairment support |

Your theme choice is saved automatically and restored the next time you open the tool.

---

## Signing Out

1. Look for your **account indicator** in the top-right corner of the app
2. Click **Sign Out** (or the logout icon)
3. You will be returned to the login screen

Alternatively, clearing your browser's site data for `ai-tools.techbridge.edu.gh` will remove your session.

---

## Troubleshooting

### I cannot sign in — "Google login failed"

An error code appears beneath the login button.

**Common causes:**

- `access_denied` — Your Google account has not been granted access. Contact the ICT department to add your account to the authorised list.
- `redirect_uri_mismatch` — This is a configuration error. Contact ICT.

If the button simply does nothing, check that pop-ups are not blocked for `ai-tools.techbridge.edu.gh` in your browser settings.

### The Generate button is greyed out

All required fields must be filled before generating. Scroll up and check for red error messages beneath any field. The most commonly missed fields are **Lyrics** (must not be empty) and **YouTube Channel Handle** (must start with `@`).

### I see "Something went wrong" in the output panel

The AI service returned an error. Try the following:

1. Wait 10 seconds and click **Generate Description** again
2. Check that your lyrics are not unusually long (very long lyrics may occasionally time out — try shortening to the key verses and chorus)
3. If the error persists, contact ICT with the time of the attempt

### My form data was lost

Form data is saved to your browser's `localStorage`. It will be lost if you:

- Clear your browser data or cookies
- Use a private / incognito window (data is not saved between sessions)
- Switch to a different browser or device

There is no server-side form saving — the tool is intentionally lightweight.

### The page loads but the form is not visible

Try a hard refresh: press **Ctrl + Shift + R** (Windows) or **Cmd + Shift + R** (Mac). If the issue persists, clear your browser cache for `ai-tools.techbridge.edu.gh`.

### The description does not match my song

The AI generates descriptions based on what you provide. For better results:

- Add more vibe keywords (aim for 5 or more descriptive words)
- Include the key chorus line — it helps the AI identify the song's emotional centre
- Paste the full lyrics rather than an excerpt
- Name specific influences — genre alone is less informative than "influenced by Bob Marley and Steel Pulse"

---

## Contact and Support

For access issues, technical problems, or feature requests:

- **ICT Email:** ict@tuc.edu.gh
- **Head of ICT:** Daniel Frempong Twum — daniel.twum@techbridge.edu.gh
- **Office:** ICT Department, Techbridge University College, Oyibi, Greater Accra, Ghana

---

**Document Status:** Final — Version 1.0
**Next Review Date:** 30 June 2027
