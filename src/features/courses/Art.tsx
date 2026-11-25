import * as m from "framer-motion/m";
import type { ReactNode } from "react";
import type { ExplainerCard } from "./courses";

const SHAPES: Record<string, ReactNode> = {
  o: <circle cx="30" cy="30" r="24" fill="currentColor" />,
  s: <rect x="8" y="8" width="44" height="44" />,
  "?": <circle cx="30" cy="30" r="24" strokeDasharray="9 9.8" />,
  v: <path d="M30 6v46M12 35l18 18 18-18" />,
};

const pop = (i: number) => ({
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { delay: 0.1 + i * 0.07, type: "spring" as const, stiffness: 380, damping: 22 },
});

export function Art({ card }: { card?: ExplainerCard }) {
  if (card?.words)
    return (
      <div aria-hidden className="flex flex-wrap justify-center gap-4">
        {card.words.map((word, i) => (
          <m.span key={i} {...pop(i * 2)} className={`rounded-lg border-4 border-ground px-5 py-2.5 text-3xl font-bold ${word === "?" ? "border-dashed px-8" : ""}`}>
            {word}
          </m.span>
        ))}
      </div>
    );
  if (card?.shapes) {
    const columns = Math.max(...card.shapes.map((row) => row.length));
    return (
      <div aria-hidden className="grid gap-5" style={{ gridTemplateColumns: `repeat(${columns}, 72px)` }}>
        {card.shapes.flatMap((row, r) =>
          [...row.padEnd(columns, ".")].map((key, c) => (
            <m.svg key={`${r}-${c}`} {...pop(r * columns + c)} viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
              {SHAPES[key]}
            </m.svg>
          )),
        )}
      </div>
    );
  }
  return <p className="text-3xl font-bold">Animation coming soon</p>;
}
