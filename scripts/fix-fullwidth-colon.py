import os, glob

root = r'c:/Users/DELL/OneDrive/Documents/Downloads/Development/aucdt-utilities'
fixed = 0

for tsx in glob.glob(os.path.join(root, '*/src/**/*.tsx'), recursive=True) + glob.glob(os.path.join(root, '*/src/*.tsx')) + glob.glob(os.path.join(root, '*/*.tsx')):
    if 'node_modules' in tsx:
        continue
    try:
        with open(tsx, 'rb') as f:
            raw = f.read()
        # Fix: full-width colon U+FF1A (0xEF 0xBC 0x9A) → regular colon
        if b'\xef\xbc\x9a' in raw:
            fixed_raw = raw.replace(b'\xef\xbc\x9a', b':')
            with open(tsx, 'wb') as f:
                f.write(fixed_raw)
            fixed += 1
            print(f'Fixed: {os.path.relpath(tsx, root)}')
    except Exception as e:
        print(f'Error {tsx}: {e}')

print(f'\nTotal fixed: {fixed}')
