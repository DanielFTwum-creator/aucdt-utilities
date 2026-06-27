# Bridge Radio - Artwork Implementation Directive

## 1. Overview
This directive establishes the standard for handling track artwork within the Bridge Radio ecosystem. All agents modifying the streaming engine or UI must adhere to these protocols to ensure visual consistency and performance.

## 2. Parsing Logic (M3U8 Manifests)
Artwork data is extracted from HLS manifests using a multi-tag strategy.

### 2.1 Supported Tags
- **`#EXT-X-ARTWORK:`**: Direct tag for track-level artwork.
- **`#EXTINF:` Attributes**: Inline attributes within the duration tag.
    - Pattern: `#EXTINF:120 bpm="128" artwork="path/to/image.jpg",Track Name`

### 2.2 Absolute URL Resolution
Agents **MUST** ensure all artwork URLs are absolute before they reach the UI state.
- **Relative Paths**: If the artwork path does not start with `http`, it must be prefixed with the `base` URL of the manifest currently being parsed.
- **Encoding**: Ensure special characters in filenames are correctly URI-encoded if the manifest provides raw paths.

## 3. UI Implementation Standards
Artwork is the primary driver of the "Cinematic 6R" aesthetic.

### 3.1 Hero Background
- **Dynamic Theming**: The active track's artwork must be used as a full-screen background with a `backdrop-blur` and `opacity` overlay.
- **Transitions**: Use `AnimatePresence` with a minimum 1.5s cross-fade duration when switching tracks.

### 3.2 Tracklist Thumbnails
- **Size**: Standardized at `w-10 h-10` (40px).
- **Styling**: Apply `rounded` corners, `border-white/10`, and a subtle `shadow-lg`.
- **Hover State**: Display the raw artwork URL as a native `title` attribute for technical transparency.

### 3.3 Fallback Strategy
- **Default Icon**: If no artwork is found, use the `Music` icon from `lucide-react`.
- **Styling**: Center the icon within a `bg-white/5` container to maintain the grid rhythm.

## 4. Performance & Optimization
- **Lazy Loading**: Use standard browser lazy loading or CSS `background-image` which handles loading natively.
- **Referrer Policy**: Always include `referrerPolicy="no-referrer"` on `<img>` tags if used, to ensure compatibility with restricted CDNs.
- **Caching**: Rely on browser-level caching for artwork assets served via CDN.

## 5. Metadata Synchronization
Artwork must always be bundled with its corresponding `Track` object:
```typescript
interface Track {
  name: string;
  url: string;
  bpm: string;
  artwork?: string; // Absolute URL
  duration?: number;
}
```

**COMPLIANCE IS MANDATORY FOR ALL UI ENHANCEMENTS.**
