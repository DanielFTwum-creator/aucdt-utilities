import os, glob

root = r'c:/Users/DELL/OneDrive/Documents/Downloads/Development/aucdt-utilities'
fixed = 0

for tsx in glob.glob(os.path.join(root, '*/src/**/*.tsx'), recursive=True) + glob.glob(os.path.join(root, '*/src/*.tsx')):
    if 'node_modules' in tsx:
        continue
    try:
        with open(tsx, 'rb') as f:
            raw = f.read()
        # Fix: {\ + ` should be { + `   and   \ + `} should be `}
        needle_open = b'{\x5c\x60'   # {\ `
        needle_close = b'\x5c\x60}'  # \ `}
        if needle_open in raw or needle_close in raw:
            fixed_raw = raw.replace(needle_open, b'{\x60').replace(needle_close, b'\x60}')
            with open(tsx, 'wb') as f:
                f.write(fixed_raw)
            fixed += 1
            print(f'Fixed: {os.path.relpath(tsx, root)}')
    except Exception as e:
        print(f'Error {tsx}: {e}')

print(f'\nTotal fixed: {fixed}')
