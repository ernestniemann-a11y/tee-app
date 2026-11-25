import { BADGES, PROMPT_PRO_COUNT, STREAK_BADGE_DAYS, type BadgeId } from "./badges";
import { levelOf, XP } from "./rules";

/** Everything TEE remembers. It holds no names, text or anything else personal. */
export interface Progress {
  xp: number;
  /** "course/lesson" */
  lessonsDone: string[];
  /** "course/lesson/step", so a check-in only pays out once. */
  stepsDone: string[];
  promptsCopied: number;
  badges: BadgeId[];
  streak: number;
  /** Local day of the last lesson or prompt, like "2026-11-25". */
  lastDay: string;
}

export interface Reward {
  xp: number;
  /** The new level, if this moved the student up. */
  levelUp: number | null;
  badges: BadgeId[];
}

export const emptyProgress: Progress = {
  xp: 0,
  lessonsDone: [],
  stepsDone: [],
  promptsCopied: 0,
  badges: [],
  streak: 0,
  lastDay: "",
};

export type Update = { progress: Progress; reward: Reward };

export function localDay(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

/** The streak to show today. It drops to 0 once a whole day is missed. */
export function currentStreak(p: Progress, today: string): number {
  if (!p.lastDay) return 0;
  return daysBetween(p.lastDay, today) <= 1 ? p.streak : 0;
}

function withActivity(p: Progress, today: string): Progress {
  if (!p.lastDay) return { ...p, streak: 1, lastDay: today };
  const gap = daysBetween(p.lastDay, today);
  // gap < 0 means the device clock went backwards: keep what they earned.
  if (gap <= 0) return p;
  return { ...p, streak: gap === 1 ? p.streak + 1 : 1, lastDay: today };
}

function finish(before: Progress, after: Progress, earned: BadgeId[]): Update {
  const badges = earned.filter((b) => !before.badges.includes(b));
  const progress = badges.length ? { ...after, badges: [...after.badges, ...badges] } : after;
  const level = levelOf(progress.xp);
  return {
    progress,
    reward: { xp: progress.xp - before.xp, levelUp: level > levelOf(before.xp) ? level : null, badges },
  };
}

const streakBadge = (p: Progress): BadgeId[] => (p.streak >= STREAK_BADGE_DAYS ? ["streak-3"] : []);

export function answerCheckIn(p: Progress, stepKey: string, right: boolean): Update {
  if (p.stepsDone.includes(stepKey)) return finish(p, p, []);
  const xp = p.xp + (right ? XP.checkInRight : XP.checkInWrong);
  return finish(p, { ...p, xp, stepsDone: [...p.stepsDone, stepKey] }, []);
}

export function finishLesson(p: Progress, lessonKey: string, courseLessonKeys: string[], today: string): Update {
  const first = !p.lessonsDone.includes(lessonKey);
  const after = withActivity(
    first ? { ...p, xp: p.xp + XP.lessonFinished, lessonsDone: [...p.lessonsDone, lessonKey] } : p,
    today,
  );
  const earned: BadgeId[] = ["first-lesson", ...streakBadge(after)];
  if (courseLessonKeys.every((key) => after.lessonsDone.includes(key))) earned.push("course-complete");
  return finish(p, after, earned);
}

export function copyPrompt(p: Progress, today: string): Update {
  const after = withActivity({ ...p, xp: p.xp + XP.promptCopied, promptsCopied: p.promptsCopied + 1 }, today);
  const earned = streakBadge(after);
  if (after.promptsCopied >= PROMPT_PRO_COUNT) earned.push("prompt-pro");
  return finish(p, after, earned);
}

/** Reads saved progress, ignoring anything missing or damaged. */
export function parseProgress(raw: string | null): Progress {
  let saved: unknown;
  try {
    saved = JSON.parse(raw ?? "null");
  } catch {
    return emptyProgress;
  }
  if (typeof saved !== "object" || saved === null) return emptyProgress;
  const s = saved as Record<string, unknown>;
  const count = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0);
  const strings = (v: unknown) => (Array.isArray(v) ? [...new Set(v.filter((x) => typeof x === "string"))] : []);
  const known = BADGES.map((b) => b.id);
  const lastDay = typeof s.lastDay === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s.lastDay) ? s.lastDay : "";
  return {
    xp: count(s.xp),
    lessonsDone: strings(s.lessonsDone),
    stepsDone: strings(s.stepsDone),
    promptsCopied: count(s.promptsCopied),
    badges: known.filter((id) => strings(s.badges).includes(id)),
    streak: lastDay ? count(s.streak) : 0,
    lastDay,
  };
}
