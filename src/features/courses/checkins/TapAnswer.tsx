import { useState } from "react";
import type { TapStep } from "../courses";
import type { CheckInProps } from "./CheckIn";
import { AnswerButton, CheckInLayout, markFor } from "./parts";

export function TapAnswer({ step, answered, onAnswer }: CheckInProps<TapStep>) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <CheckInLayout question={step.question}>
      {step.options.map((option, i) => (
        <AnswerButton
          key={option}
          mark={markFor(i, step.answer, picked)}
          locked={answered}
          onClick={() => {
            setPicked(i);
            onAnswer(i === step.answer);
          }}
          className="flex min-h-24 items-center justify-between gap-4 px-7 py-3.5 text-left text-2xl"
        >
          <span>{option}</span>
        </AnswerButton>
      ))}
    </CheckInLayout>
  );
}
