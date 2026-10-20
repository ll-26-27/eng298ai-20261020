"use client";

// ============================================================================================================
//  Build a bot, as a tarot reading.   nextjs/app/build-a-bot/BotPage.jsx
//
//  Each part of the bot is a hand of cards, fanned out as if held. Draw one card from each hand onto the cloth
//  (or shuffle and draw at random), fill in the name card, and the bot's own card is drawn from those choices.
//  The contract is unchanged: submitBot(choices, catalog) gets the keys in contract.js, and
//  <Watcher choices={choices} catalog={catalog} /> stays on the page. What this design adds (mood, color,
//  avatar, greeting) goes into `extras` as JSON.
// ============================================================================================================

import { useState } from "react";
import { submitBot } from "./contract.js";
import Watcher from "./Watcher.jsx";

// The four suits that make up the bot, in the order the data flows.
const SUITS = [
  {
    key: "prompt", title: "Instructions", glyph: "✦",
    note: "Written in front of every conversation, like the HHH prompt of 2021. This is the bot's job description: what kind of poem it writes.",
  },
  {
    key: "pack", title: "Reading", glyph: "❧",
    note: "A course reading the bot can draw on. Its words and ideas become raw material for the poems. “No pack” is the baseline: the model alone.",
  },
  {
    key: "material", title: "How much", glyph: "◑",
    note: "How much of the reading goes in, from a short note on its style to the whole book. More text means more to draw on, and more tokens per message.",
  },
  {
    key: "delivery", title: "Delivery", glyph: "➶",
    note: "How the reading reaches the model: all of it every time, a keyword search, a search by meaning, or a search tool the model decides to use.",
  },
];

// Short explanations and a symbol for each card, keyed by the contract's ids.
const BLURBS = {
  prompt: {
    ghazal: "Couplets that circle one refrain, with longing as the subject and the poet's name in the last line.",
    haiku: "A sequence of short, still poems: three lines each, a season, a cut between two images.",
    sonnet: "Fourteen lines that argue with themselves and turn near the end.",
  },
  pack: {
    phaedrus: "Socrates and Phaedrus by the river: love, madness, speeches, and the trouble with writing.",
    frankenstein: "Shelley's novel of a maker and the creature he abandons.",
    analects: "Sayings of Confucius and his students on learning, ritual, and the good life.",
    none: "No reading. See what the instructions do on their own.",
  },
  material: {
    voice: "A short description of the source's style. No text from the book itself.",
    assigned: "The pages assigned in class.",
    more: "More of the text than was assigned.",
    whole: "The full book, editorial material and all.",
  },
  delivery: {
    full: "Send all the chosen text with every message. Simple, thorough, expensive.",
    lexical: "Find passages that share words with your message, and send the best matches.",
    semantic: "Find passages close in meaning to your message, even with different words.",
    agentic: "Give the model a search tool. It decides whether to look, and for what.",
  },
};
const GLYPHS = {
  prompt: { ghazal: "❦", haiku: "❀", sonnet: "✵" },
  pack: { phaedrus: "⚘", frankenstein: "ϟ", analects: "仁", none: "○" },
  material: { voice: "◔", assigned: "◑", more: "◕", whole: "●" },
  delivery: { full: "◉", lexical: "❝", semantic: "≋", agentic: "☉" },
};

const MOODS = [
  { id: "solemn", label: "Solemn", glyph: "☾", blurb: "Grave and slow, every word weighed." },
  { id: "playful", label: "Playful", glyph: "✺", blurb: "Quick, teasing, fond of a pun." },
  { id: "cryptic", label: "Cryptic", glyph: "⌘", blurb: "Answers in riddles and half-lights." },
  { id: "tender", label: "Tender", glyph: "♡", blurb: "Warm, close, careful with you." },
  { id: "wry", label: "Wry", glyph: "≈", blurb: "Dry humor, raised eyebrow." },
];
const COLORS = ["#7a5bc4", "#b0457a", "#2f7d8f", "#c47a2a", "#4f7a3a", "#3d3a8f"];
const AVATARS = ["🪶", "🦉", "🌙", "🕯️", "🐚", "🌿", "🗝️", "🎭"];

const ROMAN = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];
const plain = (text = "") => text.replace(/^#+\s*/gm, "").replace(/[*_`>]/g, "").replace(/\s+/g, " ").trim();
const shuffled = (list) => { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (list) => list[Math.floor(Math.random() * list.length)];
// The bot's arcanum number (0–XXI), read from its name so the same name always draws the same number.
const arcanum = (name) => { const n = name.trim(); if (!n) return "?"; let h = 0; for (const ch of n) h = (h * 31 + ch.codePointAt(0)) % 9973; return ROMAN[h % 22]; };

const CSS = `
@import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&display=swap");
html:has(.reset-plain .bb), body:has(.reset-plain .bb) { background: #1d1530; }
.reset-plain:has(.bb) { background: #1d1530; color: #efe8fb; }
.reset-plain:has(.bb) .reset-undo { color: #cbbcf0; }
.bb { --night: #1d1530; --cloth: #2a1f44; --lav: #cbbcf0; --lav-dim: #9d8cc8; --gold: #c9a24a; --gold-soft: #e6cf8f;
  --parch: #f7f0e1; --parch-edge: #e6d9bd; --ink: #2b2140; --muted: #6a5d80;
  --display: Cinzel, "Trajan Pro", Georgia, serif; --body: "Cormorant Garamond", Garamond, Georgia, serif;
  --card-w: 150px; --card-h: 230px; --spread: 70px; --tilt: 7deg; --drop: 7px;
  position: relative; max-width: 1180px; margin: 0 auto; padding: 32px 20px 140px; color: #efe8fb;
  font: 500 19px/1.5 var(--body); }
.bb::before { content: ""; position: fixed; inset: 0; z-index: -1; pointer-events: none;
  background: radial-gradient(90% 50% at 50% -10%, rgba(203, 188, 240, .28), transparent 70%),
    radial-gradient(1px 1px at 20% 30%, #fff8 50%, transparent 51%), radial-gradient(1px 1px at 70% 12%, #fff6 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 85% 60%, #fff5 50%, transparent 51%), radial-gradient(1px 1px at 40% 80%, #fff6 50%, transparent 51%),
    radial-gradient(1px 1px at 10% 70%, #fff5 50%, transparent 51%), radial-gradient(1.5px 1.5px at 55% 45%, #fff4 50%, transparent 51%),
    var(--night); }
.bb h1, .bb h2, .bb .display { font-family: var(--display); font-weight: 700; letter-spacing: .06em; }
.bb .eyebrow { margin: 0; color: var(--gold); font: 700 13px/1 var(--display); letter-spacing: .3em; text-transform: uppercase; }
.bb h1 { margin: 12px 0 0; color: var(--lav); font-size: clamp(34px, 6vw, 64px); line-height: 1.05; letter-spacing: .04em; text-shadow: 0 0 30px rgba(203, 188, 240, .35); }
.bb h1 em { color: var(--gold-soft); font-style: normal; }
.bb .lede { max-width: 700px; margin: 14px 0 0; color: #d9d0ea; font-size: 21px; font-style: italic; }
.bb .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 22px; }
.bb .btn { padding: 11px 20px; border: 1px solid var(--gold); border-radius: 999px; background: transparent; color: var(--gold-soft);
  font: 700 13px/1 var(--display); letter-spacing: .16em; text-transform: uppercase; cursor: pointer; transition: background .2s, color .2s; }
.bb .btn:hover, .bb .btn:focus-visible { background: var(--gold); color: var(--night); outline: none; }
.bb .btn.small { padding: 7px 14px; font-size: 11px; }

/* The cloth: four slots, one per suit */
.bb .cloth { margin-top: 30px; padding: 24px; border: 1px solid #4a3a6e; border-radius: 26px;
  background: radial-gradient(120% 90% at 50% 0%, #3a2c5e, var(--cloth)); box-shadow: inset 0 0 60px rgba(0, 0, 0, .45), 0 20px 50px rgba(0, 0, 0, .35); }
.bb .spread { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; }
.bb .slot { display: grid; align-content: start; justify-items: center; gap: 10px; text-align: center; }
.bb .slot-title { color: var(--gold-soft); font: 700 13px/1 var(--display); letter-spacing: .22em; text-transform: uppercase; }
.bb .slot-empty { display: grid; place-items: center; width: var(--card-w); height: var(--card-h); padding: 16px; border: 1.5px dashed #7d6aa8;
  border-radius: 12px; color: #bfb2db; font-size: 15px; font-style: italic; line-height: 1.35; }
.bb .slot-empty span { display: block; margin-bottom: 8px; color: var(--gold); font-size: 30px; font-style: normal; }
.bb .slot .take { padding: 0; border: 0; background: none; color: var(--lav); font: italic 600 16px var(--body); cursor: pointer; text-decoration: underline; text-underline-offset: 3px; }

/* A tarot card face (hands and slots) */
.bb .tcard { position: relative; display: grid; grid-template-rows: auto 1fr auto; justify-items: center; width: var(--card-w); height: var(--card-h);
  padding: 24px 22px 26px; border: 1px solid var(--parch-edge); border-radius: 12px; background: var(--parch); color: var(--ink);
  font-family: var(--body); text-align: center; box-shadow: 0 2px 0 #c9b98f, 0 10px 24px rgba(0, 0, 0, .35); }
.bb .tcard::before { content: ""; position: absolute; inset: 6px; border: 1px solid var(--gold); border-radius: 8px; pointer-events: none; }
.bb .tcard .idx { position: absolute; display: grid; justify-items: center; gap: 1px; color: var(--accent, #6b4fa8); font: 700 12px/1 var(--display); }
.bb .tcard .idx.tl { top: 10px; left: 11px; }
.bb .tcard .idx.br { right: 11px; bottom: 10px; transform: rotate(180deg); }
.bb .tcard .idx i { font-style: normal; font-size: 13px; }
.bb .tcard .big { align-self: center; color: var(--accent, #6b4fa8); font-size: 44px; line-height: 1; }
.bb .tcard b { font: 700 12.5px/1.25 var(--display); letter-spacing: .08em; text-transform: uppercase; }
.bb .tcard small { margin-top: 6px; color: var(--muted); font-size: 14px; font-style: italic; line-height: 1.25;
  display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
.bb .slot .tcard { animation: bb-land .45s cubic-bezier(.2, .8, .3, 1.2); box-shadow: 0 0 0 2px var(--gold), 0 0 26px rgba(230, 207, 143, .35), 0 10px 24px rgba(0, 0, 0, .4); }
@keyframes bb-land { from { transform: translateY(60px) rotate(-8deg) scale(.9); opacity: 0; } }

/* The hands, fanned like cards held in front of you */
.bb .hands { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 500px), 1fr)); gap: 20px 28px; margin-top: 36px; }
.bb .hand { padding: 18px 16px 16px; border-radius: 22px; background: rgba(42, 31, 68, .55); border: 1px solid #3c2f5c; }
.bb .hand-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 12px; }
.bb .hand-head h2 { margin: 0; color: var(--lav); font-size: 18px; }
.bb .hand-head h2 span { color: var(--gold); }
.bb .fan { position: relative; height: calc(var(--card-h) + 70px); margin-top: 12px; }
.bb .fan .tcard { position: absolute; left: 50%; top: 34px; cursor: pointer; transform-origin: 50% 140%;
  transform: translateX(calc(-50% + var(--d) * var(--spread))) translateY(calc(var(--d2) * var(--drop))) rotate(calc(var(--d) * var(--tilt)));
  transition: transform .45s cubic-bezier(.3, .8, .3, 1), box-shadow .2s; }
.bb .fan .tcard:hover, .bb .fan .tcard:focus-visible { z-index: 30 !important; outline: none;
  transform: translateX(calc(-50% + var(--d) * var(--spread))) translateY(calc(var(--d2) * var(--drop) - 34px)) rotate(calc(var(--d) * var(--tilt) * .4)) scale(1.04);
  box-shadow: 0 0 0 2px var(--lav), 0 18px 34px rgba(0, 0, 0, .5); }
.bb .fan .tcard[aria-pressed="true"] { transform: translateX(calc(-50% + var(--d) * var(--spread))) translateY(calc(var(--d2) * var(--drop) - 22px)) rotate(calc(var(--d) * var(--tilt)));
  box-shadow: 0 0 0 2px var(--gold), 0 0 24px rgba(230, 207, 143, .5), 0 10px 24px rgba(0, 0, 0, .4); }
.bb .fan.gathered .tcard { transition-duration: .3s; }
.bb .drawn { min-height: 2.8em; margin: 4px 0 0; color: #d9d0ea; font-size: 17px; font-style: italic; text-align: center; }
.bb .drawn b { color: var(--gold-soft); font-style: normal; font-family: var(--display); font-size: 13px; letter-spacing: .1em; text-transform: uppercase; }

/* The name card and the bot's own card */
.bb .lower { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 380px); gap: 30px; margin-top: 40px; align-items: start; }
.bb .panel { padding: 26px; border: 1px solid #4a3a6e; border-radius: 22px; background: rgba(42, 31, 68, .7); }
.bb .panel h2 { margin: 0; color: var(--lav); font-size: 22px; }
.bb .explain { margin: 6px 0 0; color: #c9bfdc; font-size: 17px; font-style: italic; }
.bb label.field, .bb .field { display: grid; gap: 6px; margin-top: 18px; color: var(--gold-soft); font: 700 12px/1.3 var(--display); letter-spacing: .14em; text-transform: uppercase; }
.bb .field span.hint { color: #a99cc4; font: italic 500 15px var(--body); letter-spacing: 0; text-transform: none; }
.bb input[type=text], .bb textarea { width: 100%; padding: 10px 14px; border: 1px solid #6b5a92; border-radius: 10px; background: var(--parch);
  color: var(--ink); font: 600 18px/1.35 var(--body); letter-spacing: 0; text-transform: none; }
.bb input[type=text]:focus, .bb textarea:focus { outline: 2px solid var(--gold); outline-offset: 1px; }
.bb .picker { display: flex; flex-wrap: wrap; gap: 9px; }
.bb .swatch { width: 34px; height: 34px; border: 3px solid var(--parch); border-radius: 50%; cursor: pointer; }
.bb .swatch[aria-pressed="true"] { box-shadow: 0 0 0 3px var(--gold); }
.bb .face { width: 44px; height: 44px; border: 1px solid #6b5a92; border-radius: 12px; background: var(--parch); font-size: 22px; cursor: pointer; }
.bb .face[aria-pressed="true"] { box-shadow: 0 0 0 3px var(--gold); }
.bb .preview { position: sticky; top: 16px; display: grid; gap: 16px; }
.bb .arcana { position: relative; aspect-ratio: 7 / 12; padding: 14px; border-radius: 18px; background: var(--parch); color: var(--ink);
  box-shadow: 0 0 0 1px var(--parch-edge), 0 0 40px rgba(203, 188, 240, .25), 0 24px 50px rgba(0, 0, 0, .5); }
.bb .arcana-frame { position: relative; display: grid; grid-template-rows: auto 1fr auto; height: 100%; border: 2px solid var(--gold); border-radius: 10px; }
.bb .arcana-frame::before { content: ""; position: absolute; inset: 5px; border: 1px solid var(--gold); border-radius: 6px; pointer-events: none; }
.bb .arcana .num { padding-top: 16px; text-align: center; font: 900 22px/1 var(--display); letter-spacing: .12em; }
.bb .arcana .corner { position: absolute; z-index: 1; display: grid; justify-items: center; gap: 3px; font: 700 15px/1 var(--display); }
.bb .arcana .corner i { font-style: normal; font-size: 16px; }
.bb .arcana .corner.tl { top: 12px; left: 13px; }
.bb .arcana .corner.br { right: 13px; bottom: 12px; transform: rotate(180deg); }
.bb .arcana svg { display: block; width: 100%; height: 100%; }
.bb .arcana .banner { margin: 0 40px 22px; padding: 10px 6px 8px; border-top: 1px solid var(--gold); border-bottom: 1px solid var(--gold); text-align: center; }
.bb .arcana .banner b { display: block; font: 900 clamp(15px, 2.4vw, 19px)/1.15 var(--display); letter-spacing: .14em; text-transform: uppercase; overflow-wrap: anywhere; }
.bb .arcana .banner span { display: block; margin-top: 4px; color: var(--muted); font-size: 15px; font-style: italic; }
.bb .reading { padding: 18px 20px; border: 1px solid #4a3a6e; border-radius: 18px; background: rgba(42, 31, 68, .7); }
.bb .flow { display: grid; gap: 4px; margin: 0; padding: 0; list-style: none; font-size: 17px; }
.bb .flow li { display: flex; gap: 10px; align-items: baseline; }
.bb .flow li::before { content: attr(data-glyph); width: 18px; color: var(--gold); text-align: center; }
.bb .flow b { color: var(--gold-soft); font: 700 11.5px var(--display); letter-spacing: .12em; text-transform: uppercase; }
.bb .flow .empty { color: #8f82ad; font-style: italic; }
.bb .deal { width: 100%; padding: 17px; border: 1px solid var(--gold-soft); border-radius: 14px;
  background: linear-gradient(#d8b65e, #b48a32); color: #2a1a08; font: 900 16px/1 var(--display); letter-spacing: .2em; text-transform: uppercase;
  cursor: pointer; box-shadow: 0 0 24px rgba(230, 207, 143, .3), 0 4px 0 #7a5a1c; }
.bb .deal:hover:not(:disabled) { filter: brightness(1.08); }
.bb .deal:disabled { opacity: .6; cursor: wait; }
.bb .result { margin: 0; padding: 12px 14px; border-radius: 12px; font-size: 17px; }
.bb .result.ok { background: #1f3b2b; color: #b9ecc8; }
.bb .result.bad { background: #4a1f2a; color: #ffc2cc; }
.bb > details { margin-top: 44px; color: #c9bfdc; font-size: 17px; }
.bb > details summary { cursor: pointer; color: var(--gold-soft); font: 700 13px var(--display); letter-spacing: .14em; text-transform: uppercase; }
.bb > details a { color: var(--lav); }
@media (max-width: 960px) {
  .bb .spread { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .bb .lower { grid-template-columns: 1fr; }
  .bb .preview { position: static; max-width: 400px; width: 100%; justify-self: center; }
}
@media (max-width: 560px) {
  .bb { --card-w: 108px; --card-h: 172px; --spread: 32px; --tilt: 5deg; --drop: 5px; padding: 22px 16px 140px; }
  .bb .cloth { padding: 16px 10px; }
  .bb .spread { gap: 18px 10px; }
  .bb .tcard small { display: none; }
  .bb .tcard .big { font-size: 34px; }
  .bb .tcard b { font-size: 10.5px; }
  .bb .tcard { padding: 22px 16px 22px; }
  .bb .hand { padding: 14px 8px 12px; }
}
@media (prefers-reduced-motion: reduce) { .bb *, .bb *::before { animation: none !important; transition: none !important; } }
`;

export default function BotPage({ catalog }) {
  const [base, setBase] = useState({ botName: "", studentName: "", prompt: "", pack: "", material: "", delivery: "" });
  const [extra, setExtra] = useState({ mood: "", color: COLORS[0], avatar: AVATARS[0], greeting: "" });
  const [result, setResult] = useState(null);
  const [sending, setSending] = useState(false);

  // What the watcher checks and submitBot sends: the six contract keys, plus this design's extras as JSON.
  const choices = { ...base, extras: JSON.stringify(extra) };

  // Each hand's cards: { id, label, blurb, glyph }, in catalog order.
  const decks = {
    prompt: Object.keys(catalog.prompts).map((id) => ({ id, label: catalog.promptLabels[id] ?? id, blurb: BLURBS.prompt[id] ?? plain(catalog.prompts[id]).slice(0, 110) + "…", glyph: GLYPHS.prompt[id] ?? "✦" })),
    pack: Object.entries(catalog.packLabels).map(([id, label]) => ({ id, label, blurb: BLURBS.pack[id] ?? "", glyph: GLYPHS.pack[id] ?? "❧" })),
    material: Object.entries(catalog.materialLabels).map(([id, label]) => ({ id, label, blurb: BLURBS.material[id] ?? "", glyph: GLYPHS.material[id] ?? "◑" })),
    delivery: Object.entries(catalog.deliveryLabels).map(([id, label]) => ({ id, label, blurb: BLURBS.delivery[id] ?? "", glyph: GLYPHS.delivery[id] ?? "➶" })),
    mood: MOODS.map((m) => ({ ...m })),
  };
  const [order, setOrder] = useState(() => Object.fromEntries(Object.entries(decks).map(([k, d]) => [k, d.map((c) => c.id)])));
  const [gathered, setGathered] = useState({});
  const cardOf = (key, id) => decks[key].find((c) => c.id === id);
  const value = (key) => (key === "mood" ? extra.mood : base[key]);

  const setKey = (key, v) => { setBase((b) => ({ ...b, [key]: v })); setResult(null); };
  const setExtraKey = (key, v) => { setExtra((x) => ({ ...x, [key]: v })); setResult(null); };
  const choose = (key, id) => {
    const next = value(key) === id ? "" : id;
    if (key === "mood") setExtraKey("mood", next); else setKey(key, next);
  };

  // Gather the hand into a stack, reorder it, then fan it out again.
  function shuffle(keys) {
    setGathered((g) => ({ ...g, ...Object.fromEntries(keys.map((k) => [k, true])) }));
    setTimeout(() => {
      setOrder((o) => ({ ...o, ...Object.fromEntries(keys.map((k) => [k, shuffled(o[k])])) }));
      setGathered((g) => ({ ...g, ...Object.fromEntries(keys.map((k) => [k, false])) }));
    }, 380);
  }
  function shuffleAndDraw() {
    const keys = Object.keys(decks);
    shuffle(keys);
    setTimeout(() => {
      setBase((b) => ({ ...b, ...Object.fromEntries(SUITS.map((s) => [s.key, pick(decks[s.key]).id])) }));
      setExtra((x) => ({ ...x, mood: pick(MOODS).id, color: pick(COLORS), avatar: pick(AVATARS) }));
      setResult(null);
    }, 520);
  }

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    try { setResult(await submitBot(choices, catalog)); }
    catch (error) { setResult({ ok: false, error: error.message }); }
    setSending(false);
  }

  const hands = [...SUITS.map((s, i) => ({ ...s, n: i + 1 })), { key: "mood", title: "Mood", glyph: "☆", n: null }];
  const played = SUITS.filter((s) => base[s.key]).length;

  return (
    <div className="bb">
      <style>{CSS}</style>
      <p className="eyebrow">Activity D · Build a bot</p>
      <h1>The <em>Poet’s</em> Spread</h1>
      <p className="lede">A custom bot is a handful of choices laid side by side. Draw one card from each hand onto the cloth, give your bot a face and a voice, and its own card is drawn from what you chose.</p>
      <div className="actions">
        <button type="button" className="btn" onClick={shuffleAndDraw}>✧ Shuffle and draw</button>
        <button type="button" className="btn" onClick={() => shuffle(Object.keys(decks))}>Shuffle every hand</button>
      </div>

      <section className="cloth" aria-label="The spread: your bot's four choices">
        <div className="spread">
          {SUITS.map((s, i) => {
            const c = base[s.key] && cardOf(s.key, base[s.key]);
            return (
              <div key={s.key} className="slot">
                <div className="slot-title">{ROMAN[i + 1]} · {s.title}</div>
                {c
                  ? <>
                      <CardFace key={c.id} card={c} rank={ROMAN[decks[s.key].indexOf(c) + 1]} />
                      <button type="button" className="take" onClick={() => setKey(s.key, "")}>Return to the hand</button>
                    </>
                  : <div className="slot-empty"><div><span>{s.glyph}</span>{s.note}</div></div>}
              </div>
            );
          })}
        </div>
      </section>

      <div className="hands">
        {hands.map((h) => {
          const ids = order[h.key];
          const mid = (ids.length - 1) / 2;
          const chosen = value(h.key) && cardOf(h.key, value(h.key));
          return (
            <section key={h.key} className="hand" aria-label={`${h.title} cards`}>
              <div className="hand-head">
                <h2><span>{h.glyph}</span> {h.n ? `${ROMAN[h.n]}. ` : ""}{h.title}{h.n ? "" : " (optional)"}</h2>
                <button type="button" className="btn small" onClick={() => shuffle([h.key])}>Shuffle</button>
              </div>
              <div className={`fan${gathered[h.key] ? " gathered" : ""}`}>
                {ids.map((id, i) => {
                  const c = cardOf(h.key, id);
                  const d = gathered[h.key] ? 0 : i - mid;
                  return (
                    <CardFace key={id} card={c} rank={ROMAN[decks[h.key].indexOf(c) + 1]} as="button"
                      pressed={value(h.key) === id} onClick={() => choose(h.key, id)}
                      style={{ "--d": d, "--d2": d * d, zIndex: i + 1 }} />
                  );
                })}
              </div>
              <p className="drawn">{chosen ? <><b>{chosen.label}</b> · {chosen.blurb}</> : h.n ? SUITS[h.n - 1].note : "How your bot carries itself. Saved with your bot as an extra."}</p>
            </section>
          );
        })}
      </div>

      <form className="lower" onSubmit={submit}>
        <div className="panel">
          <h2>The Name Card</h2>
          <p className="explain">A name and a face are all a 2023 “GPT” or “Gem” added on top of the cards above. Submitting again with the same bot name updates your bot.</p>
          <label className="field">Bot name <span className="hint">Up to 80 characters. The name also decides the card’s number.</span>
            <input type="text" value={base.botName} onChange={(e) => setKey("botName", e.target.value)} maxLength={80} placeholder="The Ghazal of the Plane Tree" />
          </label>
          <label className="field">Your name
            <input type="text" value={base.studentName} onChange={(e) => setKey("studentName", e.target.value)} maxLength={120} />
          </label>
          <div className="field">Color
            <div className="picker" role="group" aria-label="Card color">
              {COLORS.map((c) => <button key={c} type="button" className="swatch" style={{ background: c }} aria-pressed={extra.color === c} aria-label={c} onClick={() => setExtraKey("color", c)} />)}
            </div>
          </div>
          <div className="field">Face
            <div className="picker" role="group" aria-label="Avatar">
              {AVATARS.map((a) => <button key={a} type="button" className="face" aria-pressed={extra.avatar === a} onClick={() => setExtraKey("avatar", a)}>{a}</button>)}
            </div>
          </div>
          <label className="field">Greeting <span className="hint">The first thing your bot says. Optional.</span>
            <textarea rows={2} value={extra.greeting} onChange={(e) => setExtraKey("greeting", e.target.value)} maxLength={280} placeholder="Sit with me by the river, and tell me what to sing." />
          </label>
        </div>

        <aside className="preview" aria-label="Your bot's card">
          <BotCard base={base} extra={extra} cardOf={cardOf} />
          <div className="reading">
            <ul className="flow" aria-label="How a message flows through your bot">
              {SUITS.map((s) => {
                const c = base[s.key] && cardOf(s.key, base[s.key]);
                return <li key={s.key} data-glyph={c ? c.glyph : s.glyph}>{c ? <span><b>{s.title}</b> {c.label}</span> : <span className="empty">{s.title}: not drawn yet</span>}</li>;
              })}
            </ul>
            <p className="explain">{flowSentence(base, (k, id) => cardOf(k, id)?.label)}</p>
          </div>
          <button type="submit" className="deal" disabled={sending}>{sending ? "Sending…" : played === 4 ? "Play this hand" : `Play this hand · ${played}/4`}</button>
          {result && (result.ok
            ? <p className="result ok"><b>Saved.</b> Your bot is in the class table{result.slug ? ` as “${result.slug}”` : ""}. Play again with the same name to update it.</p>
            : <p className="result bad"><b>Not saved:</b> {result.error} {result.fields ? Object.values(result.fields).join(" ") : ""}</p>)}
        </aside>
      </form>

      <details>
        <summary>Where your bot goes</summary>
        <p>Pressing “Play this hand” sends one record to the class’s Airtable table: your instructions’ full text, the reading’s voice note, your four choices, and your extras (mood, color, face, greeting). The Ensemble picks your bot up from there. The box in the corner checks, as you play, that the record is one the server would accept.</p>
        <p>For ideas about what else this page could be, see <a href="/history">Interfaces</a>, sixty years of chat screens.</p>
      </details>

      <Watcher choices={choices} catalog={catalog} />
    </div>
  );
}

// One small tarot card: corner indices, a central symbol, the name, and a line on what it does.
function CardFace({ card, rank, as, pressed, onClick, style }) {
  const inner = (
    <>
      <span className="idx tl" aria-hidden="true">{rank}<i>{card.glyph}</i></span>
      <span className="idx br" aria-hidden="true">{rank}<i>{card.glyph}</i></span>
      <b>{card.label}</b>
      <span className="big" aria-hidden="true">{card.glyph}</span>
      <small>{card.blurb}</small>
    </>
  );
  if (as === "button") return <button type="button" className="tcard" aria-pressed={pressed} onClick={onClick} style={style} title={card.blurb}>{inner}</button>;
  return <div className="tcard">{inner}</div>;
}

// The bot's own card: arcanum number, corner indices from its instructions and reading, a name banner, and a
// center drawn from the choices (rays = poem form, ray style = delivery, rings = how much, seals = reading,
// stars = mood, all in the chosen color around the bot's face).
function BotCard({ base, extra, cardOf }) {
  const color = extra.color;
  const promptGlyph = cardOf("prompt", base.prompt)?.glyph ?? "✦";
  const packGlyph = cardOf("pack", base.pack)?.glyph ?? "❧";
  const mood = MOODS.find((m) => m.id === extra.mood);
  const num = arcanum(base.botName);
  return (
    <div className="arcana" style={{ "--accent": color }}>
      <div className="arcana-frame">
        <span className="corner tl" style={{ color }} aria-hidden="true">{num}<i>{promptGlyph}</i><i>{packGlyph}</i></span>
        <span className="corner br" style={{ color }} aria-hidden="true">{num}<i>{promptGlyph}</i><i>{packGlyph}</i></span>
        <div className="num" style={{ color }}>{num}</div>
        <Sigil base={base} extra={extra} />
        <div className="banner">
          <b>{base.botName.trim() || "The Unnamed"}</b>
          <span>{base.studentName.trim() ? `drawn by ${base.studentName.trim()}` : "drawn by …"}{mood ? ` · ${mood.label.toLowerCase()}` : ""}</span>
          {extra.greeting.trim() && <span>“{extra.greeting.trim()}”</span>}
        </div>
      </div>
    </div>
  );
}

function Sigil({ base, extra }) {
  const c = extra.color, gold = "#c9a24a", cx = 100, cy = 110;
  const rays = { ghazal: 10, haiku: 17, sonnet: 14 }[base.prompt] ?? 0;
  const rings = { voice: 1, assigned: 2, more: 3, whole: 4 }[base.material] ?? 0;
  const r0 = 30 + rings * 6 + 4, r1 = 84;
  const at = (deg, r) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
  const mood = MOODS.find((m) => m.id === extra.mood);
  const packGlyph = GLYPHS.pack[base.pack];

  const rayEls = Array.from({ length: rays }, (_, k) => {
    const a = -90 + (k * 360) / rays;
    const [x0, y0] = at(a, r0), [x1, y1] = at(a, r1);
    switch (base.delivery) {
      case "full": {
        const [lx, ly] = at(a - 5, r0), [rx, ry] = at(a + 5, r0);
        return <polygon key={k} points={`${lx},${ly} ${x1},${y1} ${rx},${ry}`} fill={c} opacity=".85" />;
      }
      case "lexical":
        return <line key={k} x1={x0} y1={y0} x2={x1} y2={y1} stroke={c} strokeWidth="2.4" strokeDasharray="3 4" strokeLinecap="round" />;
      case "semantic": {
        const pts = Array.from({ length: 16 }, (_, t) => {
          const f = t / 15, r = r0 + (r1 - r0) * f, off = 4 * Math.sin(f * Math.PI * 3);
          const [x, y] = at(a, r), rad = ((a + 90) * Math.PI) / 180;
          return `${x + off * Math.cos(rad)},${y + off * Math.sin(rad)}`;
        });
        return <polyline key={k} points={pts.join(" ")} fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" />;
      }
      case "agentic": {
        const [tx, ty] = at(a, k % 2 ? 68 : r1);
        return <g key={k}><line x1={x0} y1={y0} x2={tx} y2={ty} stroke={c} strokeWidth="1.8" /><circle cx={tx} cy={ty} r="3.4" fill={gold} stroke={c} strokeWidth="1" /></g>;
      }
      default:
        return <line key={k} x1={x0} y1={y0} x2={x1} y2={y1} stroke={c} strokeWidth="1" opacity=".4" />;
    }
  });

  return (
    <svg viewBox="0 0 200 220" role="img" aria-label="The bot's sigil, drawn from its choices">
      {mood && [[22, 26], [178, 26], [22, 200], [178, 200]].map(([x, y], i) => (
        <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="14" fill={c} opacity=".55">{mood.glyph}</text>
      ))}
      <circle cx={cx} cy={cy} r="94" fill="none" stroke={gold} strokeWidth=".8" strokeDasharray="1 3" />
      <circle cx={cx} cy={cy} r="89" fill="none" stroke={gold} strokeWidth="1.4" />
      {rayEls}
      {Array.from({ length: rings }, (_, j) => <circle key={j} cx={cx} cy={cy} r={30 + (j + 1) * 6} fill="none" stroke={gold} strokeWidth="1.2" />)}
      {packGlyph && [0, 90, 180, 270].map((a) => {
        const [x, y] = at(a - 90, 89);
        return <g key={a}><circle cx={x} cy={y} r="9.5" fill="#f7f0e1" stroke={gold} strokeWidth="1.2" /><text x={x} y={y + .5} textAnchor="middle" dominantBaseline="central" fontSize="10.5" fill="#2b2140">{packGlyph}</text></g>;
      })}
      <circle cx={cx} cy={cy} r="27" fill={c} stroke={gold} strokeWidth="2" />
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="central" fontSize="28">{extra.avatar}</text>
      {!rays && <text x={cx} y={cy + 66} textAnchor="middle" fontSize="11" fill="#6a5d80" fontStyle="italic">draw an instructions card</text>}
    </svg>
  );
}

// One plain sentence on what happens to a message, built from whatever is on the cloth so far.
function flowSentence(base, labelOf) {
  if (!base.prompt) return "Draw an instructions card to begin: it decides what kind of poem your bot writes.";
  const genre = labelOf("prompt", base.prompt);
  if (!base.pack) return `Every message arrives after the ${genre} instructions. Now draw a reading, or “No pack”.`;
  if (base.pack === "none") return `Every message arrives after the ${genre} instructions, and the model writes from what it already knows. No reading is added.`;
  const reading = labelOf("pack", base.pack);
  const amount = base.material ? labelOf("material", base.material).toLowerCase() : "some";
  const how = {
    full: "all of it rides along with every message",
    lexical: "a keyword search picks the passages that share your words",
    semantic: "a search by meaning picks the passages closest to what you said",
    agentic: "the model decides for itself whether to search it, and for what",
  }[base.delivery] ?? "draw a card for how it reaches the model";
  return `Every message arrives after the ${genre} instructions, with ${reading} (${amount}) on hand: ${how}.`;
}
