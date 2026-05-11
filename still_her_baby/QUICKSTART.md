# Still Her Baby - Video Prompt Dashboard - QUICK START

## 🚀 Fastest Way to Start (No Installation Required)

### Option 1: Standalone HTML File (INSTANT USE)

**Just open `still-her-baby-dashboard.html` in your browser!**

```bash
# On Mac/Linux
open still-her-baby-dashboard.html

# On Windows
start still-her-baby-dashboard.html

# Or just double-click the file
```

✅ **Works immediately** - No npm, no build, no installation
✅ **All features included** - Copy, download, search
✅ **Self-contained** - Everything embedded in one file

---

## 📦 Option 2: Full React Development Setup (Recommended for Customization)

### Prerequisites
- Node.js v16+ ([Download](https://nodejs.org))
- npm (comes with Node.js)

### Installation (3 steps)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# App opens automatically at http://localhost:3000
```

### Build for Production

```bash
npm run build
# Output will be in 'dist/' folder
```

---

## 🎯 How to Use

### 1. Browse Scenes
- **37 complete scenes** from the "Still Her Baby" music video
- **Color-coded cards**: Blue (present), Orange (memories), White (dreams)
- **Click any card** to see full details

### 2. Copy Prompt to Clipboard
1. Click the **📋 Copy icon** on any scene card
2. **JSON is copied** - ready to paste into AI tools
3. **Green checkmark** confirms successful copy

### 3. Download Prompts
- **Single scene**: Click ⬇️ Download icon on card
- **All scenes**: Click "Download All Prompts" button at top

### 4. Search Scenes
- Type in search bar: scene title or lyrics
- Results update instantly as you type

---

## 💻 Using with AI Video Tools

### Runway Gen-3

```javascript
// 1. Click Copy on a scene
// 2. Parse the JSON
const scene = JSON.parse(clipboardContent);

// 3. Generate video
await runwayml.generate({
  prompt: scene.visualPrompt,
  negative_prompt: scene.negativePrompt,
  duration: scene.technicalParams.duration,
  fps: scene.technicalParams.fps,
  aspect_ratio: scene.technicalParams.aspectRatio
});
```

### Kling 1.5

```python
# 1. Copy scene from dashboard
# 2. Use with Kling

import json
scene = json.loads(clipboard_content)

result = kling.generate(
    prompt=scene['visualPrompt'],
    negative=scene['negativePrompt'],
    duration=scene['technicalParams']['duration']
)
```

### Pika 2.0

```javascript
const scene = JSON.parse(clipboardContent);

await pika.createVideo({
  text: scene.visualPrompt,
  negative: scene.negativePrompt,
  duration: scene.technicalParams.duration,
  motion: scene.technicalParams.motionIntensity
});
```

---

##  Copied JSON Structure

When you click copy, you get this structure:

```json
{
  "sceneId": "scene_001",
  "title": "Opening - Stoic Strength",
  "timeCode": {
    "start": "0:00",
    "end": "0:13",
    "duration": 13
  },
  "lyrics": "I don't need no pity.",
  "visualPrompt": "Cinematic close-up portrait of a young Black woman...",
  "negativePrompt": "smiling, happy, bright colors...",
  "style": "Cinematic drama, Barry Jenkins aesthetic...",
  "cameraMovement": "Slow dolly push-in...",
  "lighting": "Harsh side light, Rembrandt lighting...",
  "colorGrade": "Desaturated, cool tones...",
  "technicalParams": {
    "aspectRatio": "16:9",
    "fps": 24,
    "resolution": "3840x2160",
    "duration": 13,
    "motionIntensity": "Low",
    "aiModel": "Runway Gen-3, Kling 1.5, or Pika 2.0"
  },
  "audioSync": {
    "beatSync": false,
    "voiceSync": true,
    "syncPoints": ["Eye blink on 'pity' at 0:13"]
  }
}
```

**Ready to paste into your AI video generation tool!**

---

## 📂 Project Structure

```
still-her-baby-dashboard/
├── 📄 still-her-baby-dashboard.html    ⭐ INSTANT USE - Open this!
├── 📄 QUICKSTART.md                     ⭐ This file
├── 📄 README.md                          Full documentation
├── 📄 package.json                       Dependencies
├── 📄 index.html                         HTML template
├── 📄 vite.config.js                     Vite config
├── 📄 tailwind.config.js                 Tailwind config
├── 📄 postcss.config.js                  PostCSS config
├── 📁 src/
│   ├── App.jsx                           Main app
│   ├── main.jsx                          Entry point
│   ├── index.css                         Global styles
│   ├── VideoPromptDashboard.jsx          Dashboard component
│   └── still-her-baby-scene-database.json Scene database
```

---

## 🎬 Production Workflow

### Step-by-Step Video Generation

1. **Open Dashboard**
   - Use standalone HTML or npm dev server

2. **Select Scene**
   - Browse the 37 scenes
   - Find the one you need (e.g., "Scene 001: Opening")

3. **Copy Prompt**
   - Click 📋 Copy button
   - JSON is in your clipboard

4. **Generate in AI Tool**
   - Open Runway/Kling/Pika
   - Paste the prompt
   - Click generate

5. **Download Video**
   - Save generated video as `scene_001.mp4`

6. **Repeat for All Scenes**
   - Continue through all 37 scenes

7. **Final Assembly**
   - Import all videos into editing software
   - Arrange according to timecodes
   - Add audio track "Still Her Baby"
   - Export final video

### Batch Processing (Advanced)

```javascript
// Download "All Prompts" JSON
// Create automation script

import prompts from './still-her-baby-all-prompts.json';

for (const scene of prompts) {
  console.log(`Generating ${scene.sceneId}...`);
  
  const video = await runwayml.generate({
    prompt: scene.visualPrompt,
    params: scene.technicalParams
  });
  
  await video.save(`output/${scene.sceneId}.mp4`);
}

console.log('✅ All 37 scenes generated!');
```

---

## 🛠️ Troubleshooting

### Standalone HTML Issues

**Problem**: Dashboard won't load
- ✅ **Solution**: Check internet connection (loads React from CDN)
- ✅ **Alternative**: Use npm version (works offline)

**Problem**: Copy button doesn't work
- ✅ **Solution**: Use HTTPS or localhost (clipboard API requirement)
- ✅ **Alternative**: Manually select and copy JSON text

### npm Version Issues

**Problem**: `npm install` fails
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Port 3000 already in use
```bash
# Use different port
npm run dev -- --port 3001
```

**Problem**: Tailwind CSS not working
```bash
# Reinstall Tailwind
npm install -D tailwindcss postcss autoprefixer
```

---

## 📊 Scene Overview

### Total Scenes: 37
- **Intro (0:00-1:14)**: Scenes 1-6
- **Verse 1 (1:14-1:40)**: Scenes 7-13
- **Chorus 1 (1:40-2:10)**: Scenes 14-17
- **Verse 2 (2:10-2:43)**: Scenes 18-23
- **Bridge (2:43-3:02)**: Scenes 24-28
- **Chorus 2 (3:02-3:40)**: Scenes 29-33
- **Outro (3:40-4:15)**: Scenes 34-37

### Color Themes
- 🔵 **Present Day** (Grief): Cool blues, grays, desaturated
- 🟠 **Memories** (Love): Warm golds, sepia, nostalgic
- ⚪ **Dreams** (Hope): Ethereal whites, pastels, soft

### Technical Specs
- **Resolution**: Primarily 4K (3840x2160)
- **Frame Rate**: 24fps (cinema standard)
- **Aspect Ratios**: 16:9, 2.39:1, 1:1, 9:16, 4:3
- **AI Models**: Runway Gen-3, Kling 1.5, Pika 2.0, Midjourney Video

---

## 🎨 Visual Style Guide

### Color Grading
- **Present Day**: Desaturated, cool tones, crushed blacks
- **Memories**: Warm saturation, golden hour, film grain
- **Dreams**: Overexposed, ethereal, reduced contrast

### Camera Work
- **Static shots**: Grief, contemplation, stillness
- **Slow dolly**: Emotional revelation, intimacy
- **Handheld**: Raw emotion, visceral moments
- **360° rotation**: Searching, lost, disorientation

### Lighting
- **Single source**: Isolation, focus, intimacy
- **Window light**: Natural, soft, melancholic
- **Harsh side light**: Drama, contrast, intensity
- **Phone glow**: Modern grief, technology connection

---

## 📞 Support

### Need Help?
- 📖 Read full **README.md** for comprehensive documentation
- 🐛 Check **Troubleshooting** section above
- 💬 Contact: [Your contact info]

### Feedback
- 👍 Working well? Great!
- 👎 Having issues? Let us know
- 💡 Have suggestions? We'd love to hear them

---

## ⚡ TL;DR - 30 Second Start

```bash
# Instant use (no installation)
open still-her-baby-dashboard.html

# OR with npm
npm install && npm run dev

# Click scene → Copy JSON → Paste in AI tool → Generate video
```

**That's it! You're ready to create "Still Her Baby" 🎬**

---

Made with ❤️ for "Still Her Baby" - A tribute to mothers everywhere
TECHBRIDGE University College, Ghana | 2026
