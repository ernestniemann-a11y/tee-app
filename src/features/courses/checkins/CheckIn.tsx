import type { Step } from "../courses";
import { SortIt } from "./SortIt";
import { TapAnswer } from "./TapAnswer";
import { ThisOrThat } from "./ThisOrThat";
import { TrueFalse } from "./TrueFalse";

export interface CheckInProps<S extends Step> {
  step: S;
  answered: boolean;
  onAnswer: (right: boolean) => void;
}

/** To add a check-in type: write its component, add its step type in courses.ts, and list it here. */
export function CheckIn({ step, ...rest }: CheckInProps<Step>) {
  switch (step.type) {
    case "tap":
      return <TapAnswer step={step} {...rest} />;
    case "thisOrThat":
      return <ThisOrThat step={step} {...rest} />;
    case "sort":
      return <SortIt step={step} {...rest} />;
    case "trueFalse":
      return <TrueFalse step={step} {...rest} />;
  }
}
