from pathlib import Path
from PyPDF2 import PdfReader
p = Path(r'c:\Development\aucdt-utilities\stockpulse\StockPulse_SRS.pdf')
r = PdfReader(p)
for i in range(2, 8):
    print('--- PAGE %s ---' % (i+1))
    text = r.pages[i].extract_text() or ''
    print(text[:3200])
