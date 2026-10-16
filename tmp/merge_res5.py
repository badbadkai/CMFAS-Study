"""Validate the 4 authored RES5 hard papers and (optionally) merge into mocks.json.

Usage:
  python -X utf8 tmp/merge_res5.py check     # validate + report only
  python -X utf8 tmp/merge_res5.py merge     # validate; if clean, write mocks.json
"""
import json, re, sys, unicodedata, random
from collections import Counter

PAPERS = [5, 6, 7, 8]
SRC = "tmp/res5_p{}.json"
MOCKS = "src/data/res5/mocks.json"
LETTERS = ["A", "B", "C", "D"]

LETTER_REF = re.compile(r"\b(option|choice|answer|response)s?\s+(is\s+|are\s+)?[A-D]\b", re.I)
BARE_LETTER = re.compile(r"\boption\s+[A-D]\b", re.I)

def non_ascii(s):
    return sorted({c for c in s if ord(c) > 126})

def load(p):
    with open(SRC.format(p), encoding="utf-8") as f:
        return json.load(f)

def validate(paper, items):
    errs, warns = [], []
    if len(items) != 150:
        errs.append(f"expected 150 questions, got {len(items)}")
    ans = Counter()
    stems = {}
    for i, q in enumerate(items, 1):
        qid = q.get("id", f"?{i}")
        tag = f"P{paper} Q{i} ({qid})"
        # id / num
        if q.get("id") != f"RES5-P{paper}-Q{i}":
            errs.append(f"{tag}: id mismatch -> {q.get('id')}")
        if q.get("num") != i:
            errs.append(f"{tag}: num mismatch -> {q.get('num')}")
        # options
        opts = q.get("options", {})
        if set(opts) != set(LETTERS):
            errs.append(f"{tag}: options keys {sorted(opts)}")
            continue
        vals = [str(opts[L]).strip() for L in LETTERS]
        if any(not v for v in vals):
            errs.append(f"{tag}: empty option")
        low = [v.lower() for v in vals]
        if len(set(low)) != 4:
            errs.append(f"{tag}: duplicate options")
        for L in LETTERS:
            wl = len(str(opts[L]).split())
            if wl > 26:
                warns.append(f"{tag}: option {L} long ({wl} words)")
        # answer
        a = q.get("answer")
        if a not in LETTERS:
            errs.append(f"{tag}: bad answer {a}")
        else:
            ans[a] += 1
        # stem
        stem = str(q.get("stem", "")).strip()
        if len(stem) < 15:
            errs.append(f"{tag}: stem too short")
        key = re.sub(r"\W+", " ", stem.lower()).strip()
        if key in stems:
            errs.append(f"{tag}: duplicate stem of Q{stems[key]}")
        else:
            stems[key] = i
        # explanation
        expl = str(q.get("explanation", "")).strip()
        if len(expl) < 20:
            errs.append(f"{tag}: explanation missing/short")
        if BARE_LETTER.search(expl):
            errs.append(f"{tag}: explanation has 'option X' letter ref -> {LETTER_REF.search(expl).group()}")
        elif LETTER_REF.search(expl):
            warns.append(f"{tag}: explanation possible letter ref -> {LETTER_REF.search(expl).group()}")
        # ascii
        for field, txt in [("stem", stem), ("expl", expl)] + [(f"opt{L}", opts[L]) for L in LETTERS]:
            na = non_ascii(str(txt))
            if na:
                errs.append(f"{tag}: non-ascii in {field}: {[unicodedata.name(c,'?')+' '+hex(ord(c)) for c in na][:4]}")
    # answer spread
    if ans:
        lo, hi = min(ans.values()), max(ans.values())
        if hi > 55 or lo < 25:
            warns.append(f"P{paper}: answer spread skewed {dict(ans)}")
    return errs, warns, ans

def rebalance(paper, items):
    """Reposition option contents so the correct answer is spread evenly across
    A/B/C/D in a seeded-random (non-cyclic) order. Safe because explanations
    reference option CONTENT, never letters."""
    n = len(items)
    base = n // 4
    targets = (["A", "B", "C", "D"] * (base + 1))[:n]
    # exact even multiset: e.g. 150 -> 38,38,37,37
    targets = ["A"] * ((n + 3) // 4) + ["B"] * ((n + 2) // 4) + ["C"] * ((n + 1) // 4) + ["D"] * (n // 4)
    rng = random.Random(1000 + paper)
    rng.shuffle(targets)
    for q, tgt in zip(items, targets):
        old = q["answer"]
        if old == tgt:
            continue
        opts = q["options"]
        opts[old], opts[tgt] = opts[tgt], opts[old]
        q["answer"] = tgt
    return items


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "check"
    sel = [int(a) for a in sys.argv[2:] if a.isdigit()]
    papers = sel or PAPERS
    all_ok = True
    loaded = {}
    for p in papers:
        try:
            items = load(p)
        except FileNotFoundError:
            print(f"[P{p}] MISSING tmp/res5_p{p}.json")
            all_ok = False
            continue
        except json.JSONDecodeError as e:
            print(f"[P{p}] JSON ERROR: {e}")
            all_ok = False
            continue
        errs, warns, ans = validate(p, items)
        loaded[p] = items
        print(f"\n=== Paper {p}: {len(items)} Qs | answers {dict(ans)} | {len(errs)} errors, {len(warns)} warnings ===")
        for e in errs[:40]:
            print("  ERR ", e)
        if len(errs) > 40:
            print(f"  ... +{len(errs)-40} more errors")
        for w in warns[:15]:
            print("  warn", w)
        if errs:
            all_ok = False
    # cross-paper duplicate stem check
    seen = {}
    dups = 0
    for p in papers:
        for q in loaded.get(p, []):
            key = re.sub(r"\W+", " ", str(q.get("stem", "")).lower()).strip()
            if key in seen:
                dups += 1
                if dups <= 10:
                    print(f"  cross-dup: P{p} Q{q.get('num')} == {seen[key]}")
            else:
                seen[key] = f"P{p} Q{q.get('num')}"
    if dups:
        print(f"\nCross-paper duplicate stems: {dups}")

    if mode == "merge":
        if not all_ok:
            print("\nREFUSING TO MERGE - fix errors first.")
            sys.exit(1)
        with open(MOCKS, encoding="utf-8") as f:
            data = json.load(f)
        existing = {pp["paper"] for pp in data["papers"]}
        for p in papers:
            if p in existing:
                print(f"Paper {p} already present - skipping (delete it first to replace).")
                continue
            items = rebalance(p, loaded[p])
            post = Counter(q["answer"] for q in items)
            print(f"Paper {p} rebalanced -> {dict(post)}")
            data["papers"].append({"paper": p, "questions": items})
        data["papers"].sort(key=lambda pp: pp["paper"])
        with open(MOCKS, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=True, indent=1)
        print(f"\nMERGED. mocks.json now has papers: {[pp['paper'] for pp in data['papers']]}")
    else:
        print(f"\n{'ALL CLEAN' if all_ok else 'ERRORS PRESENT'} (check mode, nothing written)")

if __name__ == "__main__":
    main()
