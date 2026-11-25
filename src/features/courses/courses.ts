import data from "../../data/courses.json";
import type { Progress } from "../../progress/progress";

interface StepBase {
  id: string;
  /** One line shown after answering. */
  why: string;
  learnMore: string;
}
export interface TapStep extends StepBase {
  type: "tap";
  question: string;
  options: string[];
  answer: number;
}
export interface ThisOrThatStep extends StepBase {
  type: "thisOrThat";
  question: string;
  options: string[];
  answer: number;
}
export interface SortStep extends StepBase {
  type: "sort";
  question: string;
  buckets: string[];
  items: { text: string; bucket: number }[];
}
export interface TrueFalseStep extends StepBase {
  type: "trueFalse";
  statement: string;
  answer: boolean;
}
export type Step = TapStep | ThisOrThatStep | SortStep | TrueFalseStep;

/** A card draws either `words` or `shapes`. With neither, it shows "Animation coming soon". */
export interface ExplainerCard {
  text: string;
  words?: string[];
  /** Rows of: o circle, s square, ? unknown circle, v down arrow, . gap */
  shapes?: string[];
}
export interface Lesson {
  id: string;
  title: string;
  /** Add `video` (a file in /public) to replace the cards with a real animation. */
  explainer: { video?: string; cards: ExplainerCard[] };
  steps: Step[];
}
export interface Course {
  id: string;
  title: string;
  lessons: Lesson[];
}

export const courses = data as unknown as Course[];

export const lessonKey = (course: Course, lesson: Lesson) => `${course.id}/${lesson.id}`;
export const stepKey = (course: Course, lesson: Lesson, step: Step) => `${lessonKey(course, lesson)}/${step.id}`;
export const courseLessonKeys = (course: Course) => course.lessons.map((l) => lessonKey(course, l));
export const lessonPath = (course: Course, lesson: Lesson) => `/learn/${course.id}/${lesson.id}`;

export const doneCount = (course: Course, p: Progress) => courseLessonKeys(course).filter((k) => p.lessonsDone.includes(k)).length;

export type LessonStatus = "done" | "current" | "locked";

export function lessonStatus(course: Course, lesson: Lesson, p: Progress): LessonStatus {
  if (p.lessonsDone.includes(lessonKey(course, lesson))) return "done";
  return course.lessons.find((l) => !p.lessonsDone.includes(lessonKey(course, l))) === lesson ? "current" : "locked";
}

/** Where "Continue" goes: the first unfinished lesson, preferring a course already started. */
export function nextLesson(p: Progress, list = courses): { course: Course; lesson: Lesson } | null {
  const open = list.filter((c) => doneCount(c, p) < c.lessons.length);
  const course = open.find((c) => doneCount(c, p) > 0) ?? open[0];
  const lesson = course?.lessons.find((l) => lessonStatus(course, l, p) === "current");
  return course && lesson ? { course, lesson } : null;
}
