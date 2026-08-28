# Assembles src/data/res5/factbank.ts + quiz.json from tmp/res5_{A,B,C}.json.
# Validates before writing: unique ids, conceptId integrity, 4 distinct options,
# no option-letter refs in explanations, ascii-only, chapters r1..r27 complete.
import json, re, sys

chunks = [json.load(open(f"tmp/res5_{s}.json", encoding="utf-8")) for s in "ABC"]
chapters = [c for ch in chunks for c in ch["chapters"]]
quiz = [q for ch in chunks for q in ch["quiz"]]
chapters.sort(key=lambda c: c["num"])

errs = []
if [c["num"] for c in chapters] != list(range(1, 28)):
    errs.append(f"chapter nums: {[c['num'] for c in chapters]}")
cids = [c["id"] for ch in chapters for c in ch["concepts"]]
if len(set(cids)) != len(cids):
    errs.append("dup concept ids")
qids = [q["id"] for q in quiz]
if len(set(qids)) != len(qids):
    errs.append("dup quiz ids")
cset = set(cids)
for q in quiz:
    i = q["id"]
    if q["conceptId"] not in cset: errs.append(f"{i} bad conceptId {q['conceptId']}")
    if set(q["options"].keys()) != {"A", "B", "C", "D"}: errs.append(f"{i} bad option keys")
    if len(set(q["options"].values())) != 4: errs.append(f"{i} non-distinct options")
    if q["answer"] not in "ABCD": errs.append(f"{i} bad answer")
    if re.search(r"\b[Oo]ption\s+[A-D]\b|\([A-D]\)\s+is", q["explanation"]): errs.append(f"{i} letter ref")
def ascii_check(obj, path):
    if isinstance(obj, str):
        bad = [c for c in obj if ord(c) > 127]
        if bad: errs.append(f"non-ascii at {path}: {bad[:5]}")
    elif isinstance(obj, dict):
        for k, v in obj.items(): ascii_check(v, f"{path}.{k}")
    elif isinstance(obj, list):
        for j, v in enumerate(obj): ascii_check(v, f"{path}[{j}]")
ascii_check(chapters, "chapters"); ascii_check(quiz, "quiz")
if errs:
    print("ERRORS:"); [print(" ", e) for e in errs[:50]]; sys.exit(1)

def ts_str(s):
    return "'" + s.replace("\\", "\\\\").replace("'", "\\'") + "'"

lines = ["import type { Chapter } from '../../types'", "",
         "// RES5 fact bank. Authored from the official RES5 study text (1st Ed v1.1,",
         "// Dec 2024), grounded strictly in the ebook across all 27 chapters.",
         "export const res5Chapters: Chapter[] = ["]
for ch in chapters:
    lines += ["  {", f"    id: {ts_str(ch['id'])},", f"    num: {ch['num']},",
              f"    title: {ts_str(ch['title'])},", f"    page: {ch['page']},", "    concepts: ["]
    for c in ch["concepts"]:
        parts = [f"id: {ts_str(c['id'])}", f"term: {ts_str(c['term'])}", f"fact: {ts_str(c['fact'])}"]
        if c.get("trap"): parts.append(f"trap: {ts_str(c['trap'])}")
        lines.append("      { " + ", ".join(parts) + " },")
    lines += ["    ],", "  },"]
lines += ["]", ""]
open("src/data/res5/factbank.ts", "w", encoding="utf-8").write("\n".join(lines))
json.dump(quiz, open("src/data/res5/quiz.json", "w", encoding="utf-8"), indent=2, ensure_ascii=True)
from collections import Counter
print("OK:", len(chapters), "chapters,", len(cids), "concepts,", len(quiz), "quiz items,",
      sum(1 for q in quiz if q.get("calc")), "calc; answers:", dict(Counter(q["answer"] for q in quiz)))
