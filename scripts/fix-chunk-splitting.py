"""
Add manualChunks + chunkSizeWarningLimit to vite.config.ts files.
Uses brace-depth counting to safely find the config object's closing brace.
"""
import re
from pathlib import Path

ROOT = Path("c:/Development/aucdt-utilities")

INJECT = """,
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom')) return 'vendor-react-dom';
              if (id.includes('react-router')) return 'vendor-router';
              if (id.includes('react')) return 'vendor-react';
              if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
              if (id.includes('framer-motion') || id.includes('motion')) return 'vendor-motion';
              if (id.includes('lucide') || id.includes('heroicons')) return 'vendor-icons';
              return 'vendor';
            }
          },
        },
      },
    }"""

def find_matching_brace(text: str, open_pos: int) -> int:
    """Given position of '{', return position of matching '}'."""
    depth = 0
    in_str = False
    str_char = None
    i = open_pos
    while i < len(text):
        ch = text[i]
        if in_str:
            if ch == '\\':
                i += 2
                continue
            if ch == str_char:
                in_str = False
        else:
            if ch in ('"', "'", '`'):
                in_str = True
                str_char = ch
            elif ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    return i
        i += 1
    return -1

def fix_config(path: Path) -> str:
    """Returns 'fixed', 'skipped', or 'error:...'"""
    content = path.read_text(encoding="utf-8")

    if "manualChunks" in content or "chunkSizeWarningLimit" in content:
        return "skipped"

    # --- Case 1: already has a build: { } block — inject into it ---
    build_match = re.search(r'\bbuild\s*:\s*\{', content)
    if build_match:
        open_pos = content.index('{', build_match.start())
        close_pos = find_matching_brace(content, open_pos)
        if close_pos == -1:
            return "error: unmatched build brace"

        # Inject before closing }
        new_build_inner = (
            content[open_pos+1:close_pos].rstrip()
            + ",\n      chunkSizeWarningLimit: 1000,\n"
            + "      rollupOptions: {\n"
            + "        output: {\n"
            + "          manualChunks(id) {\n"
            + "            if (id.includes('node_modules')) {\n"
            + "              if (id.includes('react-dom')) return 'vendor-react-dom';\n"
            + "              if (id.includes('react-router')) return 'vendor-router';\n"
            + "              if (id.includes('react')) return 'vendor-react';\n"
            + "              if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';\n"
            + "              if (id.includes('framer-motion') || id.includes('motion')) return 'vendor-motion';\n"
            + "              if (id.includes('lucide') || id.includes('heroicons')) return 'vendor-icons';\n"
            + "              return 'vendor';\n"
            + "            }\n"
            + "          },\n"
            + "        },\n"
            + "      },\n"
            + "    "
        )
        new_content = (
            content[:open_pos+1]
            + new_build_inner
            + content[close_pos:]
        )
        path.write_text(new_content, encoding="utf-8")
        return "fixed-build-block"

    # --- Case 2: no build block — find the config object and inject before its close ---
    # Find "return {" first (arrow function pattern)
    return_match = re.search(r'\breturn\s*\{', content)
    if return_match:
        open_pos = content.index('{', return_match.start())
        close_pos = find_matching_brace(content, open_pos)
        if close_pos == -1:
            return "error: unmatched return brace"
        # Insert INJECT before the closing }
        new_content = content[:close_pos] + INJECT + "\n  " + content[close_pos:]
        path.write_text(new_content, encoding="utf-8")
        return "fixed-return"

    # Find "defineConfig({" pattern (no function wrapper)
    dc_match = re.search(r'defineConfig\s*\(\s*\{', content)
    if dc_match:
        open_pos = content.index('{', dc_match.start())
        close_pos = find_matching_brace(content, open_pos)
        if close_pos == -1:
            return "error: unmatched defineConfig brace"
        new_content = content[:close_pos] + INJECT + "\n" + content[close_pos:]
        path.write_text(new_content, encoding="utf-8")
        return "fixed-defineConfig"

    return "error: no pattern matched"


# First: revert previously broken files (have manualChunks but broken syntax)
# Detect by: has manualChunks but also has `}\n        build:` pattern
broken_pattern = re.compile(r'\}\s*\n\s+build\s*:', re.DOTALL)

configs = list(ROOT.glob("*/vite.config.ts")) + list(ROOT.glob("*/*/vite.config.ts"))
configs = [c for c in configs if "node_modules" not in str(c)]

reverted = 0
for cfg in configs:
    try:
        content = cfg.read_text(encoding="utf-8")
        if "manualChunks" in content and broken_pattern.search(content):
            # Remove everything from the bad injection point to end, restore original close
            # The bad pattern inserts build: block without comma — strip it out
            # Find the injected block: from "\n        build: {" to the end of that block
            new_content = re.sub(
                r',?\n\s{4,8}build\s*:\s*\{[\s\S]*?\},?\n\s*\}(\s*;\s*\n\s*\}\s*\))',
                r'\n  }\1',
                content
            )
            if new_content != content:
                cfg.write_text(new_content, encoding="utf-8")
                reverted += 1
    except Exception:
        pass

print(f"Reverted broken files: {reverted}")

# Now apply the fix correctly
results = {"fixed-build-block": 0, "fixed-return": 0, "fixed-defineConfig": 0, "skipped": 0}
errors = []

for cfg in configs:
    try:
        r = fix_config(cfg)
        if r in results:
            results[r] += 1
        elif r.startswith("error"):
            errors.append(f"{cfg.parent.name}: {r}")
    except Exception as e:
        errors.append(f"{cfg.parent.name}: exception {e}")

print(f"Fixed (had build block): {results['fixed-build-block']}")
print(f"Fixed (return pattern):  {results['fixed-return']}")
print(f"Fixed (defineConfig):    {results['fixed-defineConfig']}")
print(f"Already had fix:         {results['skipped']}")
print(f"Errors: {len(errors)}")
for e in errors[:10]:
    print(f"  {e}")
