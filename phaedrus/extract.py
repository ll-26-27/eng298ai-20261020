# Pull Stephanus pages (227–279) from the Perseus TEI files and group them into ~1000-word chunks.
import json, re, xml.etree.ElementTree as ET
NS = {"t": "http://www.tei-c.org/ns/1.0"}

def pages(path):
    root = ET.parse(path).getroot()
    out = {}
    for div in root.iterfind(".//t:div[@subtype='section']", NS):
        # Drop footnotes and citation labels but keep the text that follows them (ElementTree stores it on the note's tail).
        for parent in div.iter():
            kids = list(parent)
            for i, c in enumerate(kids):
                if c.tag.endswith(("}note", "}bibl")):
                    tail = c.tail or ""
                    if i: kids[i - 1].tail = (kids[i - 1].tail or "") + tail
                    else: parent.text = (parent.text or "") + tail
                    parent.remove(c)
        for el in div.iter():  # verse lines: keep a space between them
            if el.tag.endswith("}l"): el.tail = " " + (el.tail or "")
        paras = []
        for p in div.iter():
            if p.tag.endswith("}p"):
                t = re.sub(r"\s+", " ", "".join(p.itertext())).strip()
                if t: paras.append(t)
        if not paras:
            paras = [re.sub(r"\s+", " ", "".join(div.itertext())).strip()]
        out[div.get("n")] = "\n\n".join(paras)
    return out

grc, eng = pages("source/greek.xml"), pages("source/fowler.xml")
assert list(grc) == list(eng)
words = lambda s: len(s.split())
total = sum(words(eng[k]) for k in eng)
chunks, cur = [], []
for k in eng:
    cur.append(k)
    if sum(words(eng[x]) for x in cur) >= 1000:
        chunks.append(cur); cur = []
if cur:
    if sum(words(eng[x]) for x in cur) < 500 and chunks: chunks[-1] += cur
    else: chunks.append(cur)
data = [{"id": i + 1, "pages": c, "greek": {p: grc[p] for p in c}, "fowler": {p: eng[p] for p in c},
         "fowler_words": sum(words(eng[p]) for p in c)} for i, c in enumerate(chunks)]
json.dump(data, open("source/chunks.json", "w"), ensure_ascii=False, indent=1)
print("total Fowler words", total, "chunks", len(data))
for d in data: print(d["id"], d["pages"][0], "-", d["pages"][-1], d["fowler_words"])
