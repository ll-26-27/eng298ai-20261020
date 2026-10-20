# Phaedrus translation brief (for each subagent)

Source: `phaedrus/source/chunks.json`, a list of chunks. Each has `id`, `pages` (Stephanus page numbers),
`greek` (Burnet's Greek, by page) and `fowler` (Fowler's 1925 English, by page, for reference only).

For each chunk you are given, translate **from the Greek** — not by paraphrasing Fowler — into:
- **English (`en`)**: a fresh, faithful, modern English translation. Plain contemporary prose; no "thee/whither".
- **Korean (`ko`)**: a fresh, faithful, modern Korean translation, also made from the Greek.

Rules (all ten translators follow these, so the pieces join up):
- Translate every page in your chunk(s), keeping the page boundaries exactly. Nothing skipped or summarized.
- Keep the paragraph and speaker breaks of the Greek. Start each speech with its speaker label:
  English `Socrates:` / `Phaedrus:`; Korean `소크라테스:` / `파이드로스:`.
- Korean register: Socrates and Phaedrus are close friends and speak to each other in 반말. Speeches that are
  read out or delivered (Lysias' speech, Socrates' two speeches, the myths) are in written style (-다 체).
- Names (Korean): 뤼시아스, 에로스, 아프로디테, 제우스, 헤라, 아폴론, 무사(여신들), 님프, 보레아스, 오레이튀이아,
  이소크라테스, 페리클레스, 아낙사고라스, 테우트, 타무스, 이집트, 일리소스 강, 헤라클레스. Others: standard Greek-based
  transliteration (ㅂ/ㅍ for β/π, 위 for υ).
- Do not copy Fowler's wording. You may glance at it only to check that your page alignment is right.

Write one JSON file per chunk to `phaedrus/translations/chunk-NN.json` (NN = two-digit id), UTF-8, shaped:

```json
{
  "id": 1,
  "pages": {
    "227": { "en": "Socrates: ...\n\nPhaedrus: ...", "ko": "소크라테스: ...\n\n파이드로스: ..." }
  },
  "terms": [
    { "greek": "ἔρως", "translit": "erōs", "page": "227", "fowler": "love", "en": "desire", "ko": "에로스(사랑)",
      "note": "one short sentence on why you chose these renderings" }
  ],
  "notes": "2–4 sentences on the hardest choices in this chunk"
}
```

`terms`: for each of these key words that occurs in your chunk, one entry for its first important occurrence
(add up to 5 more words you found hard): ἔρως, μανία, ψυχή, λόγος, τέχνη, σωφροσύνη, φιλοσοφία, ῥητορική,
καλός/κάλλος, νοῦς, δαίμων, ἐπιστήμη, δόξα, ἀλήθεια, γράμματα/γραφή, μνήμη.
`fowler` is the word Fowler used at that spot.

Validate the file with `python3 -c "import json;json.load(open('PATH'))"` before you finish.
Report back in one or two lines: the files written and any problem. Do not touch any other file.
