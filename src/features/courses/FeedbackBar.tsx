import * as m from "framer-motion/m";
import { useEffect, useRef } from "react";
import { lampButton, More } from "../../components/ui";

export function FeedbackBar({ right, gain, why, learnMore, onContinue }: { right: boolean; gain: number; why: string; learnMore: string; onContinue: () => void }) {
  const next = useRef<HTMLButtonElement>(null);
  useEffect(() => next.current?.focus(), []);
  return (
    <m.section
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      className="sticky bottom-0 border-t-2 border-edge bg-panel px-6 py-5 md:px-10"
    >
      <div className="mx-auto flex max-w-[1160px] flex-wrap items-center gap-x-8 gap-y-3">
        <div role="status" className="contents">
          <span className="text-[32px] font-bold">{right ? "Nice!" : "Good try"}</span>
          {gain > 0 && (
            <m.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: "spring", stiffness: 500, damping: 18 }} className="text-[28px] font-bold text-sky">
              +{gain} XP
            </m.span>
          )}
          <div className="flex-[1_1_280px]">
            <p className="text-xl">{why}</p>
            <More label="Learn more" className="text-soft">
              {learnMore}
            </More>
          </div>
        </div>
        <button ref={next} type="button" onClick={onContinue} className={`${lampButton} min-h-[68px] px-12 text-2xl`}>
          Continue
        </button>
      </div>
    </m.section>
  );
}
