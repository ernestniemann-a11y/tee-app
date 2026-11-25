import { Link } from "react-router";
import { Bar, darkButton, More, PageTitle } from "../../components/ui";
import { BADGES } from "../../progress/badges";
import { currentStreak, localDay, type Progress } from "../../progress/progress";
import { levelOf, XP_PER_LEVEL, xpIntoLevel } from "../../progress/rules";
import { useProgress } from "../../progress/store";
import { courses, doneCount, lessonPath, nextLesson } from "../courses/courses";
import { opportunities } from "../explore/opportunities";

export function HomePage() {
  const progress = useProgress();
  const next = nextLesson(progress);
  return (
    <main className="flex flex-1 flex-wrap gap-8 px-6 pt-5 pb-10 md:px-10">
      {next ? (
        <NextUp
          over={next.course.title}
          title={next.lesson.title}
          to={lessonPath(next.course, next.lesson)}
          action={progress.lessonsDone.length ? "Continue" : "Start"}
          note={`${doneCount(next.course, progress)} of ${next.course.lessons.length} lessons done`}
        />
      ) : (
        <NextUp over="All lessons done" title="Make a study prompt" to="/prompt-maker" action="Start" />
      )}
      <div className="flex flex-[2_1_340px] flex-col gap-4">
        <TabCard letter="T" title="Prompt Maker" note="A study prompt in 3 taps" to="/prompt-maker" />
        <TabCard letter="E" title="Learn" note={courses.length === 1 ? "Short AI lessons" : `${courses.length} courses`} to="/learn" />
        <TabCard letter="E" title="Explore" note={`${opportunities.length} things to try`} to="/explore" />
        <LevelCard progress={progress} />
      </div>
    </main>
  );
}

function NextUp({ over, title, to, action, note }: { over: string; title: string; to: string; action: string; note?: string }) {
  return (
    <section className="lit flex min-h-[420px] flex-[3_1_480px] flex-col justify-between gap-8 rounded-[14px] bg-lamp p-8 text-ground md:p-12">
      <p className="text-xl font-bold">{over}</p>
      <PageTitle tab="Home" className="text-6xl leading-[0.98] tracking-[-0.02em] xl:text-[88px]">
        {title}
      </PageTitle>
      <div className="flex flex-wrap items-center gap-x-7 gap-y-5">
        <Link to={to} className={`${darkButton} min-h-[68px] px-11 text-2xl`}>
          {action}
        </Link>
        {note && <span className="text-xl font-bold">{note}</span>}
      </div>
    </section>
  );
}

function TabCard({ letter, title, note, to }: { letter: string; title: string; note: string; to: string }) {
  return (
    <Link to={to} className="flex min-h-24 flex-1 items-center gap-6 rounded-[14px] border-2 border-edge bg-panel px-7 py-4 hover:border-white">
      <span aria-hidden className="w-11 shrink-0 text-[56px] leading-none font-bold text-sky">
        {letter}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-[25px] font-bold">{title}</span>
        <span className="text-lg text-soft">{note}</span>
      </span>
    </Link>
  );
}

const count = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

function LevelCard({ progress }: { progress: Progress }) {
  const { xp, badges } = progress;
  const into = xpIntoLevel(xp);
  const left = `${XP_PER_LEVEL - into} XP to level ${levelOf(xp) + 1}`;
  return (
    <section className="flex flex-1 flex-col justify-center gap-3 px-1 pt-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h2 className="text-[28px] leading-none font-bold">Level {levelOf(xp)}</h2>
        <span className="text-lg text-soft">{left}</span>
      </div>
      <Bar value={into} max={XP_PER_LEVEL} label={left} />
      <More label={`${currentStreak(progress, localDay())}-day streak, ${count(badges.length, "badge")}`} className="text-soft">
        <ul className="grid gap-1">
          {BADGES.map((b) => (
            <li key={b.id} className={badges.includes(b.id) ? "text-white" : ""}>
              <strong>{b.name}</strong>: {badges.includes(b.id) ? "earned" : b.how}
            </li>
          ))}
        </ul>
      </More>
    </section>
  );
}
