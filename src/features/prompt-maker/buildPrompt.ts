import data from "../../data/prompts.json";

export const { subjects, goals } = data;
export type Subject = (typeof subjects)[number];
export type Goal = (typeof goals)[number];

/** The prompt in three parts, so the topic can be highlighted as the student types. */
export function buildPrompt(subject: Subject, goal: Goal, topic: string): { before: string; topic: string; after: string } {
  const [before = "", after = ""] = goal.template.split("{topic}").map((part) => part.replaceAll("{class}", subject.class));
  return { before, topic: topic.trim().replace(/\s+/g, " "), after };
}
