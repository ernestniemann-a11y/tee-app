export const BADGES = [
  { id: "first-lesson", name: "First Lesson", how: "Finish a lesson" },
  { id: "streak-3", name: "3-Day Streak", how: "Come back 3 days in a row" },
  { id: "prompt-pro", name: "Prompt Pro", how: "Copy 10 prompts" },
  { id: "course-complete", name: "Course Complete", how: "Finish a course" },
] as const;

export type BadgeId = (typeof BADGES)[number]["id"];

export const PROMPT_PRO_COUNT = 10;
export const STREAK_BADGE_DAYS = 3;
