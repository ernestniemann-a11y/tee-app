import { useState } from "react";
import { darkButton, PageTitle } from "../../components/ui";
import { progressActions } from "../../progress/store";

export function SettingsPage() {
  const [step, setStep] = useState<"idle" | "asking" | "done">("idle");
  return (
    <main className="mx-auto flex w-full max-w-[800px] flex-1 flex-col gap-7 px-6 pt-5 pb-10 md:px-10">
      <PageTitle tab="Settings">Settings</PageTitle>
      {step === "idle" && (
        <section className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 rounded-[14px] border-2 border-edge bg-panel px-8 py-7">
          <p className="flex-[1_1_260px] text-xl">Your progress is saved only in this browser.</p>
          <button type="button" onClick={() => setStep("asking")} className="min-h-[58px] rounded-[10px] border-2 border-wrong px-7 text-xl font-bold text-wrong hover:bg-ground">
            Reset my progress
          </button>
        </section>
      )}
      {step === "asking" && (
        <section role="alert" className="lit flex flex-col gap-6 rounded-[14px] bg-lamp p-9 text-ground">
          <h2 className="text-[34px] leading-tight font-bold">Erase your XP, badges and lessons?</h2>
          <div className="flex flex-wrap gap-3.5">
            <button type="button" autoFocus onClick={() => setStep("idle")} className={`${darkButton} min-h-16 text-[22px]`}>
              Keep my progress
            </button>
            <button
              type="button"
              onClick={() => {
                progressActions.reset();
                setStep("done");
              }}
              className="min-h-16 rounded-[10px] border-2 border-ground px-8 text-[22px] font-bold hover:bg-white"
            >
              Reset my progress
            </button>
          </div>
        </section>
      )}
      {step === "done" && (
        <p role="status" className="rounded-[14px] border-2 border-edge bg-panel px-8 py-7 text-2xl font-bold">
          Progress reset
        </p>
      )}
    </main>
  );
}
