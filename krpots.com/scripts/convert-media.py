#!/usr/bin/env python3
"""
convert-media.py
Converts HEIC and JPG files from media/pots by kr/ -> public/media/pots-by-kr/ as WebP.
WebP delivers ~30% smaller files than PNG at equivalent quality, supported by all modern browsers.
"""
import sys
from pathlib import Path
from pillow_heif import register_heif_opener
from PIL import Image

register_heif_opener()

ROOT    = Path(__file__).parent.parent
SRC_DIR = ROOT / "media" / "pots by kr"
OUT_DIR = ROOT / "public" / "media" / "pots-by-kr"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Remove stale PNGs so we don't serve both formats
for old in OUT_DIR.glob("*.png"):
    old.unlink()
    print(f"  CLEAN {old.name}")

files = sorted(SRC_DIR.iterdir())
print(f"Found {len(files)} source files in {SRC_DIR}")

converted = 0
skipped   = 0
errors    = []

for f in files:
    if f.suffix.upper() not in (".HEIC", ".JPG", ".JPEG", ".PNG"):
        skipped += 1
        continue

    out_path = OUT_DIR / (f.stem + ".webp")

    try:
        img = Image.open(f)
        if img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGB")
        # Cap at 1600px wide — good for web display, smaller file
        max_w = 1600
        if img.width > max_w:
            ratio = max_w / img.width
            img = img.resize((max_w, int(img.height * ratio)), Image.LANCZOS)
        # quality=85 is the WebP sweet spot: visually lossless, ~70% smaller than PNG
        img.save(out_path, "WEBP", quality=85, method=6)
        size_kb = out_path.stat().st_size // 1024
        print(f"  OK    {f.name} -> {out_path.name} ({size_kb} KB)")
        converted += 1
    except Exception as e:
        print(f"  ERROR {f.name}: {e}")
        errors.append(f.name)

print(f"\nDone: {converted} converted, {skipped} skipped, {len(errors)} errors")
if errors:
    print("Errors:", errors)
    sys.exit(1)
