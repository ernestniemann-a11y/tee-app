import { domAnimation, LazyMotion, MotionConfig } from "framer-motion";
import { HashRouter, Navigate, Route, Routes } from "react-router";
import { Layout } from "./components/Layout";
import { ToastProvider } from "./components/Toast";
import { LearnPage } from "./features/courses/LearnPage";
import { LessonPage } from "./features/courses/LessonPage";
import { ExplorePage } from "./features/explore/ExplorePage";
import { HomePage } from "./features/home/HomePage";
import { PromptMakerPage } from "./features/prompt-maker/PromptMakerPage";
import { SettingsPage } from "./features/settings/SettingsPage";

// HashRouter keeps every page on one static link, so reloads work on any host.
export function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <HashRouter>
          <ToastProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="prompt-maker" element={<PromptMakerPage />} />
                <Route path="learn" element={<LearnPage />} />
                <Route path="learn/:courseId" element={<LearnPage />} />
                <Route path="explore" element={<ExplorePage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              <Route path="learn/:courseId/:lessonId" element={<LessonPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </HashRouter>
      </MotionConfig>
    </LazyMotion>
  );
}
