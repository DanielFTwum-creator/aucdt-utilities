from pathlib import Path
from PyPDF2 import PdfReader
p = Path('StockPulse_SRS.pdf')
reader = PdfReader(p)
text = '\n'.join((reader.pages[i].extract_text() or '') for i in range(len(reader.pages)))
lines = [line.strip() for line in text.splitlines() if line.strip()]
reqs = []
current = None
for line in lines:
    if line.startswith('FR-') or line.startswith('NFR-'):
        if current:
            reqs.append(current)
        current = {'id': line, 'text': ''}
    elif current is not None:
        current['text'] = (current['text'] + ' ' + line).strip()
if current:
    reqs.append(current)
for r in reqs:
    print(f"{r['id']}|{r['text']}")
