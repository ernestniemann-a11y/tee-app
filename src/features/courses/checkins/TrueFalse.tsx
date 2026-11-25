import * as m from "framer-motion/m";
import { useState } from "react";
import { PageTitle } from "../../../components/ui";
import type { TrueFalseStep } from "../courses";
import type { CheckInProps } from "./CheckIn";

const face = "col-start-1 row-start-1 flex items-center rounded-[14px] p-8 backface-hidden md:p-12";

/** A card that flips over to show the answer. */
export function TrueFalse({ step, answered, onAnswer }: CheckInProps<TrueFalseStep>) {
  const [flipped, setFlipped] = useState(false);
  const pick = (value: boolean) => {
    setFlipped(true);
    onAnswer(value === step.answer);
  };
  return (
    <main className="mx-auto flex w-full max-w-[1000px] flex-1 flex-col justify-center gap-5 px-6 py-5 [perspective:1600px] md:px-10">
      <m.div initial={false} animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.5 }} className="grid min-h-[300px] transform-3d">
        <div className={`${face} border-2 border-edge bg-panel`}>
          <PageTitle tab={step.statement} className="text-5xl leading-[1.08] tracking-[-0.02em] xl:text-6xl">
            {step.statement}
          </PageTitle>
        </div>
        <div aria-hidden={!flipped} className={`${face} rotate-y-180 justify-center bg-lamp text-[88px] leading-none font-bold text-ground`}>
          {step.answer ? "True" : "False"}
        </div>
      </m.div>
      <div className={`grid grid-cols-2 gap-5 ${answered ? "invisible" : ""}`}>
        {[true, false].map((value) => (
          <button key={String(value)} type="button" disabled={answered} onClick={() => pick(value)} className="min-h-[100px] rounded-[14px] border-2 border-edge bg-panel text-[32px] font-bold hover:border-white">
            {value ? "True" : "False"}
          </button>
        ))}
      </div>
    </main>
  );
}
