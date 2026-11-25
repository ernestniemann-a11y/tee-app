import { describe, expect, it } from "vitest";
import { emptyProgress } from "../progress/progress";
import { courses, courseLessonKeys, lessonStatus, nextLesson } from "./courses/courses";
import { deadlineLabel, findOpportunities, opportunities, TYPES } from "./explore/opportunities";
import { buildPrompt, goals, subjects } from "./prompt-maker/buildPrompt";

const unique = (ids: string[]) => expect(new Set(ids).size).toBe(ids.length);

describe("prompts.json", () => {
  it("makes the example prompt from the PRD", () => {
    const p = buildPrompt(subjects.find((s) => s.id === "science")!, goals.find((g) => g.id === "quiz")!, "  photosynthesis ");
    expect(p.before + p.topic + p.after).toBe(
      "Act as my study coach. Ask me 5 questions about photosynthesis for a high school science class, one at a time. Wait for my answer before the next question. If I'm wrong, give me a hint before telling me the answer. Don't write any of my homework for me.",
    );
  });
  it("fills every blank for every subject and goal", () => {
    unique(subjects.map((s) => s.id));
    unique(goals.map((g) => g.id));
    for (const s of subjects)
      for (const g of goals) {
        expect(g.template.split("{topic}")).toHaveLength(2);
        expect(g.template).toContain("{class}");
        const p = buildPrompt(s, g, "x");
        expect(p.before + p.after).not.toMatch(/[{}]/);
      }
  });
  it("leaves odd topics exactly as typed", () => {
    expect(buildPrompt(subjects[0]!, goals[0]!, "{class} $& <b>").topic).toBe("{class} $& <b>");
  });
});

describe("courses.json", () => {
  const lessons = courses.flatMap((c) => c.lessons);
  it("has unique ids", () => {
    unique(courses.map((c) => c.id));
    for (const c of courses) unique(c.lessons.map((l) => l.id));
    for (const l of lessons) unique(l.steps.map((s) => s.id));
  });
  it("gives every lesson an explainer and 2 to 4 playable check-ins", () => {
    for (const l of lessons) {
      expect(l.explainer.video || l.explainer.cards.length).toBeTruthy();
      expect(l.steps.length).toBeGreaterThanOrEqual(2);
      expect(l.steps.length).toBeLessThanOrEqual(4);
      for (const s of l.steps) {
        expect(s.why && s.learnMore).toBeTruthy();
        if (s.type === "tap" || s.type === "thisOrThat") {
          if (s.type === "thisOrThat") expect(s.options).toHaveLength(2);
          unique(s.options);
          expect(s.options[s.answer]).toBeTruthy();
        } else if (s.type === "sort") {
          expect(s.buckets).toHaveLength(2);
          unique(s.items.map((i) => i.text));
          for (const i of s.items) expect(s.buckets[i.bucket]).toBeTruthy();
        } else {
          expect(s.type).toBe("trueFalse");
          expect(typeof s.answer).toBe("boolean");
        }
      }
    }
  });
  it("uses every check-in type in at least 2 lessons", () => {
    for (const type of ["tap", "thisOrThat", "sort", "trueFalse"])
      expect(lessons.filter((l) => l.steps.some((s) => s.type === type)).length).toBeGreaterThanOrEqual(2);
  });
  it("unlocks lessons in order", () => {
    const course = courses[0]!;
    const status = (p = emptyProgress) => course.lessons.map((l) => lessonStatus(course, l, p));
    expect(status()).toEqual(["current", "locked", "locked", "locked"]);
    const keys = courseLessonKeys(course);
    expect(status({ ...emptyProgress, lessonsDone: keys.slice(0, 2) })).toEqual(["done", "done", "current", "locked"]);
    expect(nextLesson({ ...emptyProgress, lessonsDone: keys.slice(0, 1) })?.lesson).toBe(course.lessons[1]);
    expect(nextLesson({ ...emptyProgress, lessonsDone: keys })).toBeNull();
  });
});

describe("opportunities.json", () => {
  it("has 8 to 12 complete listings, samples marked", () => {
    unique(opportunities.map((o) => o.id));
    expect(opportunities.length).toBeGreaterThanOrEqual(8);
    expect(opportunities.length).toBeLessThanOrEqual(12);
    for (const o of opportunities) {
      expect(TYPES).toContain(o.type);
      expect(o.url).toMatch(/^https:\/\//);
      if (o.url.includes("example.org")) expect(o.sample).toBe(true);
      if (o.deadline) expect(Number.isNaN(Date.parse(o.deadline))).toBe(false);
    }
  });
  it("filters by type and by every word typed", () => {
    expect(findOpportunities(opportunities, "All", "")).toHaveLength(opportunities.length);
    expect(findOpportunities(opportunities, "Career", "").every((o) => o.type === "Career")).toBe(true);
    expect(findOpportunities(opportunities, "All", " HOSPITAL  volunteer").map((o) => o.id)).toEqual(["hospital-youth-volunteer"]);
    expect(findOpportunities(opportunities, "All", "zzz")).toEqual([]);
  });
  it("shows the same deadline in every time zone", () => {
    expect(deadlineLabel("2027-03-15")).toBe("Mar 15");
    expect(deadlineLabel(null)).toBe("Rolling");
  });
});
