import * as m from "framer-motion/m";
import { useState } from "react";
import { lampButton, PageTitle } from "../../components/ui";
import { Art } from "./Art";
import type { Lesson } from "./courses";

/** The explainer slot: a real video when the lesson has one, otherwise a few animated cards. */
export function Explainer({ explainer, title, onDone }: { explainer: Lesson["explainer"]; title: string; onDone: () => void }) {
  const [at, setAt] = useState(0);
  const { video, cards } = explainer;
  const card = video ? undefined : cards[at];
  const last = !card || at === cards.length - 1;

  return (
    <main className="mx-auto flex w-full max-w-[1240px] flex-1 flex-wrap items-center gap-x-14 gap-y-8 px-6 pt-2 pb-10 md:px-10">
      <div className="lit flex min-h-[340px] flex-[1_1_440px] items-center justify-center self-stretch rounded-[14px] bg-lamp p-8 text-ground">
        {video ? <video src={video} controls className="w-full rounded-lg" /> : <Art key={at} card={card} />}
      </div>
      <div className="flex flex-[1_1_360px] flex-col gap-9">
        <PageTitle key={at} tab={title} className="text-5xl leading-[1.05] tracking-[-0.02em] xl:text-6xl">
          <m.span key={at} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="block min-h-[3.15em]">
            {card ? card.text : title}
          </m.span>
        </PageTitle>
        {!video && cards.length > 1 && (
          <div role="img" aria-label={`Card ${at + 1} of ${cards.length}`} className="flex gap-2.5">
            {cards.map((c, i) => (
              <span key={c.text} className={`h-2.5 flex-1 rounded-full border-2 border-sky ${i <= at ? "bg-sky" : ""}`} />
            ))}
          </div>
        )}
        <button type="button" onClick={() => (last ? onDone() : setAt(at + 1))} className={`${lampButton} min-h-[68px] self-start px-14 text-2xl`}>
          {last ? "Try it" : "Next"}
        </button>
      </div>
    </main>
  );
}
