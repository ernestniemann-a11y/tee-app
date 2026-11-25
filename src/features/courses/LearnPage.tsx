import { Link, Navigate, useParams } from "react-router";
import { CheckIcon, LockIcon } from "../../components/icons";
import { Bar, darkButton, PageTitle } from "../../components/ui";
import type { Progress } from "../../progress/progress";
import { useProgress } from "../../progress/store";
import { courses, doneCount, lessonPath, lessonStatus, type Course } from "./courses";

export function LearnPage() {
  const { courseId } = useParams();
  const progress = useProgress();
  // With a single course, skip the list: it would only be an extra tap.
  const course = courseId ? courses.find((c) => c.id === courseId) : courses.length === 1 ? courses[0] : undefined;
  if (course) return <CoursePath course={course} progress={progress} />;
  if (courseId) return <Navigate to="/learn" replace />;
  return <CourseList progress={progress} />;
}

const CourseProgress = ({ course, progress }: { course: Course; progress: Progress }) => {
  const done = doneCount(course, progress);
  const total = course.lessons.length;
  return (
    <>
      <Bar value={done} max={total} label={`${done} of ${total} lessons done`} className="h-5 flex-[1_1_200px]" />
      <span className="text-xl font-bold">
        {done} of {total}
      </span>
    </>
  );
};

function CourseList({ progress }: { progress: Progress }) {
  return (
    <main className="mx-auto flex w-full max-w-[1040px] flex-1 flex-col gap-3.5 px-6 pt-5 pb-10 md:px-10">
      <PageTitle tab="Learn" className="mb-3.5 text-[42px] leading-[1.1]">
        Pick a course
      </PageTitle>
      {courses.map((c) => (
        <Link key={c.id} to={`/learn/${c.id}`} className="flex min-h-28 flex-wrap items-center gap-x-7 gap-y-2 rounded-[14px] border-2 border-edge bg-panel px-8 py-4 hover:border-white">
          <span className="text-[28px] font-bold">{c.title}</span>
          <CourseProgress course={c} progress={progress} />
        </Link>
      ))}
    </main>
  );
}

function CoursePath({ course, progress }: { course: Course; progress: Progress }) {
  const row = "flex min-h-[84px] items-center gap-5 rounded-[14px] border-2 border-edge px-7 py-3 text-2xl font-bold";
  return (
    <main className="mx-auto flex w-full max-w-[1040px] flex-1 flex-col gap-3.5 px-6 pt-5 pb-10 md:px-10">
      <div className="mb-3.5 flex flex-wrap items-center gap-x-7 gap-y-3">
        <PageTitle tab="Learn">{course.title}</PageTitle>
        <CourseProgress course={course} progress={progress} />
      </div>
      <ol className="flex flex-1 flex-col gap-3.5">
        {course.lessons.map((lesson, i) => {
          const status = lessonStatus(course, lesson, progress);
          if (status === "current")
            return (
              <li key={lesson.id} className="lit flex min-h-[200px] flex-[0_1_300px] flex-wrap items-center justify-between gap-x-8 gap-y-5 rounded-[14px] bg-lamp px-9 py-8 text-ground">
                <h2 className="text-5xl leading-none font-bold tracking-[-0.02em] xl:text-6xl">{lesson.title}</h2>
                <Link to={lessonPath(course, lesson)} className={`${darkButton} min-h-[68px] px-11 text-2xl`}>
                  {i === 0 ? "Start" : "Continue"}
                </Link>
              </li>
            );
          if (status === "done")
            return (
              <li key={lesson.id}>
                <Link to={lessonPath(course, lesson)} className={`${row} bg-panel hover:border-white`}>
                  <span className="flex text-sky">
                    <CheckIcon size={34} aria-label="Done" />
                  </span>
                  <span className="flex-1">{lesson.title}</span>
                  <span className="text-lg font-normal text-soft">Play again</span>
                </Link>
              </li>
            );
          return (
            <li key={lesson.id} className={`${row} border-dashed text-soft`}>
              <LockIcon size={32} aria-label="Locked" />
              {lesson.title}
            </li>
          );
        })}
      </ol>
    </main>
  );
}
