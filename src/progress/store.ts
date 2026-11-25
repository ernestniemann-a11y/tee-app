import { useSyncExternalStore } from "react";
import * as rules from "./progress";
import { emptyProgress, localDay, parseProgress, type Progress, type Reward, type Update } from "./progress";

const KEY = "tee-progress";
const listeners = new Set<() => void>();

function read(): Progress {
  try {
    return parseProgress(localStorage.getItem(KEY));
  } catch {
    return emptyProgress; // storage blocked: TEE still works, it just forgets on reload
  }
}

let state = read();

function set(next: Progress) {
  if (next === state) return;
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage blocked or full
  }
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") {
  // Keep two open tabs in step.
  window.addEventListener("storage", (e) => {
    if (e.key !== KEY && e.key !== null) return;
    state = read();
    listeners.forEach((l) => l());
  });
}

function apply({ progress, reward }: Update): Reward {
  set(progress);
  return reward;
}

/** What features call. Each returns what the student just earned. */
export const progressActions = {
  answerCheckIn: (stepKey: string, right: boolean) => apply(rules.answerCheckIn(state, stepKey, right)),
  finishLesson: (lessonKey: string, courseLessonKeys: string[]) =>
    apply(rules.finishLesson(state, lessonKey, courseLessonKeys, localDay())),
  copyPrompt: () => apply(rules.copyPrompt(state, localDay())),
  reset: () => set(emptyProgress),
};

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => void listeners.delete(listener);
}

export const useProgress = () => useSyncExternalStore(subscribe, () => state);
