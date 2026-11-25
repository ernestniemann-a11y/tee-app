/** Starting values from the PRD. Tune them here. */
export const XP = {
  checkInRight: 10,
  checkInWrong: 5,
  lessonFinished: 50,
  promptCopied: 5,
} as const;

export const XP_PER_LEVEL = 200;

export const levelOf = (xp: number) => Math.floor(xp / XP_PER_LEVEL) + 1;
export const xpIntoLevel = (xp: number) => xp % XP_PER_LEVEL;
