import { AnimatePresence } from "framer-motion";
import * as m from "framer-motion/m";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { BADGES } from "../progress/badges";
import type { Reward } from "../progress/progress";
import { BadgeIcon } from "./icons";

const ToastContext = createContext<(reward: Reward, parts?: { badges?: boolean }) => void>(() => {});

/** Celebrates level-ups and badges. XP itself is shown right where it was earned. */
export const useCelebrate = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<{ id: number; text: string }[]>([]);
  const nextId = useRef(0);
  const current = queue[0];

  const celebrate = useCallback((reward: Reward, { badges = true }: { badges?: boolean } = {}) => {
    const texts = [
      ...(reward.levelUp ? [`Level ${reward.levelUp}!`] : []),
      ...(badges ? reward.badges.map((id) => `New badge: ${BADGES.find((b) => b.id === id)?.name}`) : []),
    ];
    if (texts.length) setQueue((q) => [...q, ...texts.map((text) => ({ id: nextId.current++, text }))]);
  }, []);

  useEffect(() => {
    if (!current) return;
    const timer = setTimeout(() => setQueue((q) => q.slice(1)), 2600);
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <ToastContext.Provider value={celebrate}>
      {children}
      <div role="status" className="pointer-events-none fixed inset-x-0 top-5 z-10 flex justify-center">
        <AnimatePresence mode="wait">
          {current && (
            <m.div
              key={current.id}
              initial={{ y: -60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
              className="flex items-center gap-3 rounded-[14px] border-2 border-ground bg-sky px-6 py-3 text-[22px] font-bold text-ground"
            >
              <BadgeIcon size={30} /> {current.text}
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
