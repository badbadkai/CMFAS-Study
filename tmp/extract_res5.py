import fitz, sys
src = r"E:/Kairos Home/References & Kairos/References/CMFAS/Ebooks/RES5 1st Edition Version 1.1_Full Study Text (Dec 2024).pdf"
doc = fitz.open(src)
out = []
for i, page in enumerate(doc):
    out.append(f"\n===== PDF PAGE {i+1} =====\n")
    out.append(page.get_text())
open("tmp/res5_ebook.txt","w",encoding="utf-8").write("".join(out))
print("pages:", doc.page_count, "chars:", sum(len(x) for x in out))
