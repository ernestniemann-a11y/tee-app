import { useEffect, useRef, useState } from "react";
import { Chip, darkButton, More, PageTitle } from "../../components/ui";
import { useCelebrate } from "../../components/Toast";
import { progressActions } from "../../progress/store";
import { buildPrompt, goals, subjects } from "./buildPrompt";
import { copyText } from "./copyText";

// Copying the same prompt again doesn't earn again. Kept in memory only: what students type is never saved.
const rewarded = new Set<string>();

type Status = { kind: "idle" | "needsTopic" | "failed" } | { kind: "copied"; xp: number };

export function PromptMakerPage() {
  const [subject, setSubject] = useState(subjects.find((s) => s.id === "science") ?? subjects[0]!);
  const [goal, setGoal] = useState(goals[0]!);
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const input = useRef<HTMLInputElement>(null);
  const celebrate = useCelebrate();
  const prompt = buildPrompt(subject, goal, topic);

  useEffect(() => {
    if (status.kind !== "copied") return;
    const timer = setTimeout(() => setStatus({ kind: "idle" }), 2500);
    return () => clearTimeout(timer);
  }, [status]);

  async function copy() {
    if (!prompt.topic) {
      setStatus({ kind: "needsTopic" });
      input.current?.focus();
      return;
    }
    const text = prompt.before + prompt.topic + prompt.after;
    if (!(await copyText(text))) return setStatus({ kind: "failed" });
    if (rewarded.has(text)) return setStatus({ kind: "copied", xp: 0 });
    rewarded.add(text);
    const reward = progressActions.copyPrompt();
    celebrate(reward);
    setStatus({ kind: "copied", xp: reward.xp });
  }

  const changed = <T,>(set: (value: T) => void) => (value: T) => {
    set(value);
    setStatus({ kind: "idle" });
  };

  return (
    <main className="flex flex-1 flex-wrap gap-10 px-6 pt-3 pb-5 md:px-10">
      <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-3.5">
        <PageTitle tab="Prompt Maker">Make a study prompt</PageTitle>
        <Choices label="Subject" options={subjects} value={subject} onPick={changed(setSubject)} />
        <Choices label="Goal" options={goals} value={goal} onPick={changed(setGoal)} />
        <div className="flex flex-col gap-2.5">
          <div className="flex items-baseline gap-4">
            <label htmlFor="topic" className="text-xl font-bold">
              Topic
            </label>
            <p id="topic-error" role="alert" className="text-lg font-bold text-wrong">
              {status.kind === "needsTopic" && "Type a topic first"}
            </p>
          </div>
          <input
            ref={input}
            id="topic"
            type="text"
            autoComplete="off"
            maxLength={120}
            value={topic}
            onChange={(e) => changed(setTopic)(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void copy()}
            placeholder="photosynthesis"
            aria-invalid={status.kind === "needsTopic"}
            aria-describedby="topic-error"
            className="h-[58px] w-full rounded-lg border-2 border-edge bg-panel px-4 text-xl font-bold aria-invalid:border-wrong"
          />
        </div>
      </div>
      <section aria-label="Your prompt" className="lit flex min-w-0 flex-[1_1_420px] flex-col justify-between gap-7 rounded-[14px] bg-lamp p-8 text-ground md:p-10">
        <p data-testid="prompt" className="text-[27px] leading-[1.42] break-words">
          {prompt.before}
          <strong className="underline decoration-[3px] underline-offset-[5px]">{prompt.topic || "your topic"}</strong>
          {prompt.after}
        </p>
        <div className="flex flex-col gap-3">
          <button type="button" onClick={() => void copy()} className={`${darkButton} min-h-[72px] text-[25px]`}>
            <span aria-live="polite">
              {status.kind === "copied" ? (status.xp ? `Copied! +${status.xp} XP` : "Copied!") : status.kind === "failed" ? "Select the text to copy it" : "Copy"}
            </span>
          </button>
          <More label="Why this works">{goal.why}</More>
        </div>
      </section>
    </main>
  );
}

function Choices<T extends { id: string; label: string }>({ label, options, value, onPick }: { label: string; options: T[]; value: T; onPick: (value: T) => void }) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-xl font-bold">{label}</legend>
      <div className="flex flex-wrap gap-2.5">
        {options.map((o) => (
          <Chip key={o.id} on={o.id === value.id} onClick={() => onPick(o)}>
            {o.label}
          </Chip>
        ))}
      </div>
    </fieldset>
  );
}
