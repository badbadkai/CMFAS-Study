import json, io, re

items = []
for i in (1, 2, 3):
    with io.open(f"E:/Kai/Projects/CMFAS-Study/scripts/hi_quiz_part{i}.json", encoding="utf-8") as f:
        items.extend(json.load(f))

# validate
ids = set()
letter_pat = re.compile(r"\boption\s+[A-D]\b|\banswer\s+[A-D]\b|\bchoice\s+[A-D]\b", re.I)
leaks = []
calc = 0
for it in items:
    assert it["id"] not in ids, f"dup id {it['id']}"
    ids.add(it["id"])
    opts = it["options"]
    assert set(opts.keys()) == {"A", "B", "C", "D"}, f"bad opts {it['id']}"
    assert it["answer"] in opts, f"answer not in opts {it['id']}"
    vals = list(opts.values())
    assert len(set(vals)) == 4, f"dup option text {it['id']}"
    assert it.get("stem"), f"no stem {it['id']}"
    assert it.get("explanation"), f"no explanation {it['id']}"
    if letter_pat.search(it["explanation"]):
        leaks.append(it["id"])
    if it.get("calc"):
        calc += 1

# ascii check on full serialization
out = json.dumps(items, ensure_ascii=True, indent=2)
non_ascii = [c for c in out if ord(c) > 127]

print(f"total={len(items)} calc={calc} leaks={leaks} non_ascii={len(non_ascii)}")

# answer letter distribution
from collections import Counter
print("answers:", dict(Counter(it["answer"] for it in items)))

if not leaks and not non_ascii:
    with io.open("E:/Kai/Projects/CMFAS-Study/src/data/hi/quiz.json", "w", encoding="utf-8", newline="\n") as f:
        f.write(out)
        f.write("\n")
    print("WROTE quiz.json")
else:
    print("NOT WRITTEN - fix leaks/non-ascii first")
