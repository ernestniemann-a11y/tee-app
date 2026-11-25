import { NavLink, Outlet } from "react-router";
import { levelOf } from "../progress/rules";
import { useProgress } from "../progress/store";
import { SettingsIcon } from "./icons";

const TABS = [
  { to: "/", label: "Home" },
  { to: "/prompt-maker", label: "Prompt Maker" },
  { to: "/learn", label: "Learn" },
  { to: "/explore", label: "Explore" },
];

const tab = ({ isActive }: { isActive: boolean }) =>
  `flex min-h-12 items-center border-b-4 px-3.5 text-lg hover:border-edge ${isActive ? "border-lamp! font-bold" : "border-transparent"}`;

export function Layout() {
  const { xp } = useProgress();
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-4 md:px-10">
        <span className="mr-5 text-[28px] font-bold">TEE</span>
        <nav aria-label="Main" className="flex flex-auto flex-wrap gap-2">
          {TABS.map((t) => (
            <NavLink key={t.to} to={t.to} end={t.to === "/"} className={tab}>
              {t.label}
            </NavLink>
          ))}
        </nav>
        <span className="text-lg font-bold text-sky" data-testid="level">
          Level {levelOf(xp)}, {xp} XP
        </span>
        <NavLink
          to="/settings"
          aria-label="Settings"
          className={({ isActive }) => `flex size-12 items-center justify-center border-b-4 ${isActive ? "border-lamp" : "border-transparent"}`}
        >
          <SettingsIcon />
        </NavLink>
      </header>
      <Outlet />
    </div>
  );
}
