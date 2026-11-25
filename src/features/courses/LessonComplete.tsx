import * as m from "framer-motion/m";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { BadgeIcon } from "../../components/icons";
import { Bar, lampButton, PageTitle } from "../../components/ui";
import { BADGES, type BadgeId } from "../../progress/badges";
import { useProgress } from "../../progress/store";
import { doneCount, lessonPath, lessonStatus, type Course, type Lesson } from "./courses";

export function LessonComplete({ course, lesson, earned, badges }: { course: Course; lesson: Lesson; earned: number; badges: BadgeId[] }) {
  const progress = useProgress();
  const done = doneCount(course, progress);
  const total = course.lessons.length;
  const next = course.lessons.find((l) => lessonStatus(course, l, progress) === "current");

  // Start the bar where it was and let it fill up.
  const [shown, setShown] = useState(earned > 0 ? done - 1 : done);
  useEffect(() => {
    const timer = setTimeout(() => setShown(done), 450);
    return () => clearTimeout(timer);
  }, [done]);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[1240px] flex-wrap items-stretch gap-8 px-6 py-10 md:px-10">
      <section className="flex min-h-[300px] flex-[3_1_460px] flex-col justify-between gap-6 rounded-[14px] bg-lamp p-8 text-ground md:p-12">
        <PageTitle tab={lesson.title} className="text-[42px] leading-[1.1]">
          Lesson complete
        </PageTitle>
        <m.p
          data-testid="earned"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 16 }}
          className="origin-bottom-left text-7xl leading-[0.95] font-bold tracking-[-0.03em] xl:text-[120px]"
        >
          {earned > 0 ? `+${earned} XP` : lesson.title}
        </m.p>
      </section>
      <div className="flex flex-[2_1_340px] flex-col justify-center gap-7">
        <section className="flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-bold">{course.title}</h2>
            <span className="text-xl font-bold">
              {done} of {total}
            </span>
          </div>
          <Bar value={shown} max={total} label={`${done} of ${total} lessons done`} className="h-6" />
        </section>
        {badges.map((id, i) => (
          <m.section
            key={id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 + i * 0.2 }}
            className="flex min-h-[88px] items-center gap-4 rounded-[14px] border-2 border-edge bg-panel px-6 py-3.5"
          >
            <span className="flex text-sky">
              <BadgeIcon size={46} />
            </span>
            <span className="flex flex-col">
              <span className="text-[17px] text-soft">New badge</span>
              <span className="text-2xl font-bold">{BADGES.find((b) => b.id === id)?.name}</span>
            </span>
          </m.section>
        ))}
        <Link to={next ? lessonPath(course, next) : "/"} className={`${lampButton} min-h-[72px] text-2xl`}>
          {next ? "Next lesson" : "Done"}
        </Link>
      </div>
    </main>
  );
}
