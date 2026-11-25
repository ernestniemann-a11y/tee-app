import * as m from "framer-motion/m";
import { useState } from "react";
import type { SortStep } from "../courses";
import type { CheckInProps } from "./CheckIn";
import { CheckInLayout } from "./parts";

export function SortIt({ step, answered, onAnswer }: CheckInProps<SortStep>) {
  const [picks, setPicks] = useState<number[]>([]);
  const current = step.items[picks.length];

  function drop(bucket: number) {
    if (!current) return;
    const next = [...picks, bucket];
    setPicks(next);
    if (next.length === step.items.length) onAnswer(next.every((pick, i) => pick === step.items[i]?.bucket));
  }

  return (
    <CheckInLayout question={step.question}>
      {/* Keep the space when the last item is sorted, so nothing jumps. */}
      <div aria-live="polite" className="min-h-[104px]">
        {current && (
          <m.p
            key={current.text}
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex min-h-[104px] items-center justify-center rounded-[14px] bg-lamp px-6 py-4 text-center text-[32px] leading-tight font-bold text-ground"
          >
            {current.text}
          </m.p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {step.buckets.map((bucket, b) => (
          <button
            key={bucket}
            type="button"
            disabled={answered}
            onClick={() => drop(b)}
            className="flex min-h-[230px] flex-col items-stretch gap-3 rounded-[14px] border-2 border-edge bg-panel p-4 text-center enabled:hover:border-white"
          >
            <span className="text-[26px] font-bold">{bucket}</span>
            {step.items.map((item, i) => {
              const pick = picks[i];
              if (pick === undefined || item.bucket !== b) return null;
              const right = pick === item.bucket;
              return (
                <m.span
                  key={item.text}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`rounded-lg border-2 px-3 py-2 text-xl leading-tight font-bold ${right ? "border-correct text-correct" : "border-wrong text-wrong"}`}
                >
                  {item.text}
                  {!right && " (moved here)"}
                </m.span>
              );
            })}
          </button>
        ))}
      </div>
    </CheckInLayout>
  );
}
