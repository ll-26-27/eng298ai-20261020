# Merge source/chunks.json with translations/chunk-NN.json into one page: app/index.html.
import json, glob, os

here = os.path.dirname(os.path.abspath(__file__))
src = json.load(open(os.path.join(here, "source/chunks.json")))
pages, terms, notes, missing = [], [], [], []
for c in src:
    path = os.path.join(here, f"translations/chunk-{c['id']:02d}.json")
    t = json.load(open(path)) if os.path.exists(path) else None
    if t is None: missing.append(c["id"])
    for p in c["pages"]:
        tp = (t or {}).get("pages", {}).get(p, {})
        pages.append({"n": p, "chunk": c["id"], "greek": c["greek"][p], "fowler": c["fowler"][p],
                      "en": tp.get("en", ""), "ko": tp.get("ko", "")})
    if t:
        for term in t.get("terms", []): terms.append({**term, "chunk": c["id"]})
        notes.append({"chunk": c["id"], "pages": f"{c['pages'][0]}–{c['pages'][-1]}", "text": t.get("notes", "")})

data = json.dumps({"pages": pages, "terms": terms, "notes": notes, "missing": missing}, ensure_ascii=False)
html = open(os.path.join(here, "app/template.html")).read().replace("/*DATA*/null", data.replace("</", "<\\/"))
open(os.path.join(here, "app/index.html"), "w").write(html)
print(f"{len(pages)} pages, {len(terms)} terms, missing chunks: {missing or 'none'}")
