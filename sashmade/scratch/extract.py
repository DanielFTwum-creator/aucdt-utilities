import fitz
import os

pdf_path = r"c:\Development\aucdt-utilities\sashmade\docs\REMEMBER SASHMADE.pdf"
out_dir = r"c:\Development\aucdt-utilities\sashmade\public\images"

os.makedirs(out_dir, exist_ok=True)

doc = fitz.open(pdf_path)
for i in range(len(doc)):
    for img in doc.get_page_images(i):
        xref = img[0]
        pix = fitz.Pixmap(doc, xref)
        
        # Determine format
        if pix.n - pix.alpha < 4:       # this is GRAY or RGB
            pix.save(os.path.join(out_dir, f"p{i}_{xref}.png"))
        else:               # CMYK: convert to RGB first
            pix1 = fitz.Pixmap(fitz.csRGB, pix)
            pix1.save(os.path.join(out_dir, f"p{i}_{xref}.png"))
            pix1 = None
        pix = None

print("Images extracted successfully.")
