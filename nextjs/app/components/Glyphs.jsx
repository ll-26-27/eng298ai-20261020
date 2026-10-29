// Abstract objects, one per part of the site, drawn as thin strokes in the current text color. No pictures of people
// or dolls: a bot is three shapes (a ring for its instructions, stacked sheets for its knowledge, a box with an arrow
// leaving it for its tools), and the three activities get a mirror, a spiral, and a line of dots.

const common = { fill: "none", stroke: "currentColor", strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" };

function Frame({ title, children, className }) {
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={title} className={className} {...common}>
      <title>{title}</title>
      {children}
    </svg>
  );
}

// The ring: a boundary drawn around everything the bot will say.
export function Instructions({ className }) {
  return (
    <Frame title="Instructions" className={className}>
      <circle cx="50" cy="50" r="34" />
      <circle cx="50" cy="50" r="5" fill="currentColor" stroke="none" />
    </Frame>
  );
}

// The sheets: texts laid in front of the model, one on top of another.
export function Knowledge({ className }) {
  return (
    <Frame title="Knowledge" className={className}>
      <rect x="30" y="18" width="46" height="56" rx="3" />
      <rect x="22" y="26" width="46" height="56" rx="3" fill="var(--paper, #2a2225)" />
      <rect x="14" y="34" width="46" height="56" rx="3" fill="var(--paper, #2a2225)" />
      <path d="M24 50h26M24 60h26M24 70h16" />
    </Frame>
  );
}

// The box with an arrow leaving it: something the model can reach outside the conversation to use.
export function Tools({ className }) {
  return (
    <Frame title="Tools" className={className}>
      <path d="M22 36v42h42V56" />
      <path d="M22 36h18" />
      <path d="M46 54 82 18" />
      <path d="M62 18h20v20" />
    </Frame>
  );
}

// The mirror: ELIZA reflects your words back.
export function Mirror({ className }) {
  return (
    <Frame title="A mirror" className={className}>
      <path d="M50 14v72" strokeDasharray="4 5" />
      <path d="M44 30 18 50l26 20z" />
      <path d="M56 30l26 20-26 20z" fill="currentColor" fillOpacity=".35" />
    </Frame>
  );
}

// The spiral: a base model that continues and continues.
export function Spiral({ className }) {
  const points = [];
  for (let i = 0; i <= 260; i++) {
    const t = (i / 260) * Math.PI * 6;
    const r = 2 + t * 2.05;
    points.push(`${(50 + r * Math.cos(t)).toFixed(1)},${(50 + r * Math.sin(t)).toFixed(1)}`);
  }
  return (
    <Frame title="A spiral" className={className}>
      <polyline points={points.join(" ")} />
    </Frame>
  );
}

// The line: a history with dates on it.
export function Line({ className }) {
  return (
    <Frame title="A timeline" className={className}>
      <path d="M12 50h76" />
      {[20, 38, 56, 74].map((x, i) => <circle key={x} cx={x} cy="50" r={i === 3 ? 6 : 4} fill={i === 3 ? "currentColor" : "var(--paper, #2a2225)"} />)}
      <path d="M84 44l6 6-6 6" />
    </Frame>
  );
}

// The window: a screen with a text box at the bottom.
export function Window({ className }) {
  return (
    <Frame title="A chat window" className={className}>
      <rect x="16" y="18" width="68" height="64" rx="4" />
      <path d="M26 36h26M26 46h36M46 56h28" />
      <rect x="24" y="66" width="52" height="8" rx="4" />
    </Frame>
  );
}

// The three parts of a bot, side by side, for the guide and the home page.
export function BotParts({ className }) {
  return (
    <span className={className}>
      <Instructions />
      <Knowledge />
      <Tools />
    </span>
  );
}
