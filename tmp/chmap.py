import re
txt = open("tmp/res5_ebook.txt",encoding="utf-8").read()
# split into pages
pages = re.split(r"===== PDF PAGE (\d+) =====", txt)
# pages: ['', '1', content1, '2', content2, ...]
pagemap = {}
for i in range(1,len(pages),2):
    pagemap[int(pages[i])] = pages[i+1]
# find chapter-start pages: a page containing "PART ... CHAPTER n" header line + "CHAPTER OUTLINE"
starts = {}
for pno, content in pagemap.items():
    m = re.search(r"PART\s+(?:I{1,3}|IV|V)\s+CHAPTER\s+(\d+)\b", content)
    if m and "CHAPTER OUTLINE" in content:
        ch = int(m.group(1))
        if ch not in starts:
            starts[ch] = pno
last = max(pagemap)
chs = sorted(starts)
for j,ch in enumerate(chs):
    end = (starts[chs[j+1]]-1) if j+1 < len(chs) else last
    print(f"ch{ch}: pdf {starts[ch]}-{end}")
