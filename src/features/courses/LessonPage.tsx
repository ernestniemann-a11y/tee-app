import { useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import { CloseIcon } from "../../components/icons";
import { useCelebrate } from "../../components/Toast";
import { Bar } from "../../components/ui";
import type { Reward } from "../../progress/progress";
import { progressActions, useProgress } from "../../progress/store";
import { CheckIn } from "./checkins/CheckIn";
import { courseLessonKeys, courses, lessonKey, lessonStatus, stepKey, type Course, type Lesson } from "./courses";
import { Explainer } from "./Explainer";
import { FeedbackBar } from "./FeedbackBar";
import { LessonComplete } from "./LessonComplete";

export function LessonPage() {
  const { courseId, lessonId } = useParams();
  const progress = useProgress();
  const course = courses.find((c) => c.id === courseId);
  const lesson = course?.lessons.find((l) => l.id === lessonId);
  if (!course || !lesson || lessonStatus(course, lesson, progress) === "locked") return <Navigate to="/learn" replace />;
  return <LessonPlayer key={lessonKey(course, lesson)} course={course} lesson={lesson} />;
}

/** Plays one lesson: the explainer, then each check-in, then the lesson complete screen. */
function LessonPlayer({ course, lesson }: { course: Course; lesson: Lesson }) {
  const { xp } = useProgress();
  const celebrate = useCelebrate();
  const [at, setAt] = useState(0);
  const [answer, setAnswer] = useState<{ right: boolean; gain: number } | null>(null);
  const [earned, setEarned] = useState(0);
  const [finished, setFinished] = useState<Reward | null>(null);

  if (finished) return <LessonComplete course={course} lesson={lesson} earned={earned} badges={finished.badges} />;

  const total = lesson.steps.length + 1;
  const step = at > 0 ? lesson.steps[at - 1] : undefined;

  function onAnswer(right: boolean) {
    if (!step || answer) return;
    const reward = progressActions.answerCheckIn(stepKey(course, lesson, step), right);
    celebrate(reward);
    setAnswer({ right, gain: reward.xp });
    setEarned((n) => n + reward.xp);
  }

  function onContinue() {
    setAnswer(null);
    if (at < lesson.steps.length) return setAt(at + 1);
    const reward = progressActions.finishLesson(lessonKey(course, lesson), courseLessonKeys(course));
    celebrate(reward, { badges: false }); // badges get their own spot on the next screen
    setEarned((n) => n + reward.xp);
    setFinished(reward);
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center gap-5 px-6 py-5 md:px-10">
        <Link to="/learn" aria-label="Leave lesson" className="-ml-3 flex size-12 items-center justify-center">
          <CloseIcon size={28} />
        </Link>
        <Bar value={at + (answer ? 1 : 0)} max={total} label={`Step ${at + 1} of ${total}`} className="h-5 flex-1" />
        <span className="text-xl font-bold text-sky" data-testid="xp">
          {xp} XP
        </span>
      </header>
      {step ? (
        <CheckIn key={step.id} step={step} answered={answer !== null} onAnswer={onAnswer} />
      ) : (
        <Explainer explainer={lesson.explainer} title={lesson.title} onDone={onContinue} />
      )}
      {step && answer && <FeedbackBar key={`${step.id}-feedback`} right={answer.right} gain={answer.gain} why={step.why} learnMore={step.learnMore} onContinue={onContinue} />}
    </div>
  );
}
