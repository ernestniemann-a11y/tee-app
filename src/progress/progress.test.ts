import { describe, expect, it } from "vitest";
import { answerCheckIn, copyPrompt, currentStreak, emptyProgress, finishLesson, localDay, parseProgress, type Progress } from "./progress";
import { levelOf, xpIntoLevel } from "./rules";

const keys = ["c/1", "c/2"];
const lesson = (p: Progress, key: string, day: string) => finishLesson(p, key, keys, day);

describe("XP", () => {
  it("gives 10 for right, 5 for a wrong first try, and pays each check-in once", () => {
    const right = answerCheckIn(emptyProgress, "c/1/a", true);
    expect(right.reward.xp).toBe(10);
    expect(answerCheckIn(emptyProgress, "c/1/a", false).reward.xp).toBe(5);
    expect(answerCheckIn(right.progress, "c/1/a", true).reward.xp).toBe(0);
  });
  it("gives 50 the first time a lesson is finished and 0 on replay", () => {
    const first = lesson(emptyProgress, "c/1", "2026-11-25");
    expect(first.reward.xp).toBe(50);
    expect(lesson(first.progress, "c/1", "2026-11-25").reward.xp).toBe(0);
  });
  it("gives 5 per copied prompt", () => {
    expect(copyPrompt(emptyProgress, "2026-11-25").reward.xp).toBe(5);
  });
  it("moves up a level every 200 XP", () => {
    expect([levelOf(0), levelOf(199), levelOf(200), levelOf(460)]).toEqual([1, 1, 2, 3]);
    expect(xpIntoLevel(460)).toBe(60);
    const up = copyPrompt({ ...emptyProgress, xp: 195 }, "2026-11-25");
    expect(up.reward.levelUp).toBe(2);
    expect(copyPrompt(up.progress, "2026-11-25").reward.levelUp).toBeNull();
  });
});

describe("streak", () => {
  it("grows once a day and restarts after a missed day", () => {
    let p = copyPrompt(emptyProgress, "2026-11-25").progress;
    p = copyPrompt(p, "2026-11-25").progress;
    expect(p.streak).toBe(1);
    p = lesson(p, "c/1", "2026-11-26").progress;
    expect(p.streak).toBe(2);
    expect(currentStreak(p, "2026-11-27")).toBe(2);
    expect(currentStreak(p, "2026-11-28")).toBe(0);
    expect(copyPrompt(p, "2026-11-28").progress.streak).toBe(1);
  });
  it("crosses months, years and clock changes", () => {
    expect(copyPrompt({ ...emptyProgress, streak: 4, lastDay: "2026-12-31" }, "2027-01-01").progress.streak).toBe(5);
    expect(copyPrompt({ ...emptyProgress, streak: 4, lastDay: "2026-10-31" }, "2026-11-01").progress.streak).toBe(5);
  });
  it("is not lost when the device clock goes backwards", () => {
    const p = { ...emptyProgress, streak: 4, lastDay: "2026-11-25" };
    expect(copyPrompt(p, "2026-11-20").progress.streak).toBe(4);
  });
  it("uses the student's local day", () => {
    expect(localDay(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05");
  });
});

describe("badges", () => {
  it("gives each badge once, at the right moment", () => {
    const one = lesson(emptyProgress, "c/1", "2026-11-25");
    expect(one.reward.badges).toEqual(["first-lesson"]);
    const two = lesson(one.progress, "c/2", "2026-11-25");
    expect(two.reward.badges).toEqual(["course-complete"]);
    expect(lesson(two.progress, "c/2", "2026-11-25").reward.badges).toEqual([]);
  });
  it("gives 3-Day Streak on day 3", () => {
    let p = copyPrompt(emptyProgress, "2026-11-25").progress;
    p = copyPrompt(p, "2026-11-26").progress;
    expect(copyPrompt(p, "2026-11-27").reward.badges).toEqual(["streak-3"]);
  });
  it("gives Prompt Pro on prompt 10", () => {
    let p = emptyProgress;
    for (let i = 0; i < 9; i++) p = copyPrompt(p, "2026-11-25").progress;
    expect(p.badges).toEqual([]);
    expect(copyPrompt(p, "2026-11-25").reward.badges).toEqual(["prompt-pro"]);
  });
});

describe("saved progress", () => {
  it("survives a round trip", () => {
    const p = lesson(emptyProgress, "c/1", "2026-11-25").progress;
    expect(parseProgress(JSON.stringify(p))).toEqual(p);
  });
  it("ignores damaged data", () => {
    for (const bad of [null, "", "{", "null", "5", "[]", '"x"']) expect(parseProgress(bad)).toEqual(emptyProgress);
    expect(parseProgress('{"xp":-5,"badges":["fake","prompt-pro"],"lessonsDone":[1,"c/1","c/1"],"streak":9,"lastDay":"soon"}')).toEqual({
      ...emptyProgress,
      badges: ["prompt-pro"],
      lessonsDone: ["c/1"],
    });
  });
});
