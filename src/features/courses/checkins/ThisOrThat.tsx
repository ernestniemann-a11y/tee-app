import { useState } from "react";
import type { ThisOrThatStep } from "../courses";
import type { CheckInProps } from "./CheckIn";
import { AnswerButton, CheckInLayout, markFor } from "./parts";

export function ThisOrThat({ step, answered, onAnswer }: CheckInProps<ThisOrThatStep>) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <CheckInLayout question={step.question}>
      <div className="grid grid-cols-2 gap-4">
        {step.options.map((option, i) => (
          <AnswerButton
            key={option}
            mark={markFor(i, step.answer, picked)}
            locked={answered}
            onClick={() => {
              setPicked(i);
              onAnswer(i === step.answer);
            }}
            className="flex min-h-[300px] flex-col items-center justify-center gap-3 p-5 text-center text-[32px] leading-tight"
          >
            <span>{option}</span>
          </AnswerButton>
        ))}
      </div>
    </CheckInLayout>
  );
}
