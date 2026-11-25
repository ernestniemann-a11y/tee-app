import * as m from "framer-motion/m";
import type { ReactNode } from "react";
import { PageTitle } from "../../../components/ui";

/** Question on the left, the thing to tap on the right. */
export function CheckInLayout({ question, children }: { question: string; children: ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-[1240px] flex-1 flex-wrap items-center gap-x-14 gap-y-8 px-6 py-5 md:px-10">
      <PageTitle tab={question} className="flex-[1_1_340px] text-5xl leading-none tracking-[-0.02em] xl:text-7xl">
        {question}
      </PageTitle>
      <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-4">{children}</div>
    </main>
  );
}

export type Mark = "right" | "wrong" | null;

export function markFor(index: number, answer: number, picked: number | null): Mark {
  if (picked === null) return null;
  if (index === answer) return "right";
  return index === picked ? "wrong" : null;
}

export function AnswerButton({ mark, locked, onClick, className, children }: { mark: Mark; locked: boolean; onClick: () => void; className: string; children: ReactNode }) {
  const look = mark === "right" ? "border-lamp bg-lamp text-ground" : mark === "wrong" ? "border-wrong bg-panel text-wrong" : "border-edge bg-panel enabled:hover:border-white";
  return (
    <m.button
      type="button"
      disabled={locked}
      onClick={onClick}
      animate={mark === "right" ? { scale: [1, 1.04, 1] } : mark === "wrong" ? { x: [0, -8, 8, -5, 5, 0] } : {}}
      transition={{ duration: 0.4 }}
      className={`rounded-[14px] border-2 font-bold ${look} ${className}`}
    >
      {children}
      {mark && <span className="shrink-0 text-[19px]">{mark === "right" ? "Right" : "Not this"}</span>}
    </m.button>
  );
}
