import json, io

parts = []
for i in (1, 2, 3):
    with io.open(f"E:/Kai/Projects/CMFAS-Study/scripts/hi_fact_part{i}.json", encoding="utf-8") as f:
        parts.extend(json.load(f))

parts.sort(key=lambda c: c["num"])

# validate: unique chapter ids, unique concept ids, 4-field concepts
seen_ch, seen_c = set(), set()
for ch in parts:
    assert ch["id"] not in seen_ch, f"dup chapter {ch['id']}"
    seen_ch.add(ch["id"])
    for c in ch["concepts"]:
        assert c["id"] not in seen_c, f"dup concept {c['id']}"
        seen_c.add(c["id"])
        assert c["term"] and c["fact"], f"empty {c['id']}"

total = sum(len(ch["concepts"]) for ch in parts)


def jstr(s):
    # emit a TS single-quoted string, escaping backslash and single quote
    return "'" + s.replace("\\", "\\\\").replace("'", "\\'") + "'"


lines = [
    "import type { Chapter } from '../../types'",
    "",
    "// HI fact bank. Authored from the official HI study text (8th Ed, Dec 2024),",
    "// grounded strictly in the ebook across all 15 chapters.",
    "export const hiChapters: Chapter[] = [",
]
for ch in parts:
    lines.append("  {")
    lines.append(f"    id: '{ch['id']}',")
    lines.append(f"    num: {ch['num']},")
    lines.append(f"    title: {jstr(ch['title'])},")
    lines.append(f"    page: {ch['page']},")
    lines.append("    concepts: [")
    for c in ch["concepts"]:
        seg = f"{{ id: '{c['id']}', term: {jstr(c['term'])}, fact: {jstr(c['fact'])}"
        if c.get("trap"):
            seg += f", trap: {jstr(c['trap'])}"
        seg += " }"
        lines.append("      " + seg + ",")
    lines.append("    ],")
    lines.append("  },")
lines.append("]")
lines.append("")

out = "\n".join(lines)
# ensure pure ASCII
non_ascii = [(i, ch) for i, ch in enumerate(out) if ord(ch) > 127]
assert not non_ascii, f"non-ascii at {non_ascii[:5]}"

with io.open("E:/Kai/Projects/CMFAS-Study/src/data/hi/factbank.ts", "w", encoding="utf-8", newline="\n") as f:
    f.write(out)

print(f"chapters={len(parts)} concepts={total}")
