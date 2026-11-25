import { useEffect, useRef, type ReactNode } from "react";

/** The page's one headline. It takes focus on arrival so keyboard and screen reader users start here. */
export function PageTitle({ children, tab, className = "text-[42px] leading-[1.1]" }: { children: ReactNode; tab: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    document.title = `${tab} | TEE`;
    ref.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [tab]);
  return (
    <h1 ref={ref} tabIndex={-1} className={`font-bold ${className}`}>
      {children}
    </h1>
  );
}

export function Bar({ value, max, label, className = "h-5" }: { value: number; max: number; label: string; className?: string }) {
  const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div role="img" aria-label={label} className={`overflow-hidden rounded-full border-2 border-white ${className}`}>
      <div className="h-full bg-sky transition-[width] duration-700 ease-out motion-reduce:transition-none" style={{ width: `${percent}%` }} />
    </div>
  );
}

export function Chip({ on, onClick, children, className = "min-h-[46px] text-[17px]" }: { on: boolean; onClick: () => void; children: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`rounded-lg border-2 px-[15px] font-bold ${on ? "border-sky bg-sky text-ground" : "border-edge hover:border-white"} ${className}`}
    >
      {children}
    </button>
  );
}

/** Extra detail, one tap away and never in the way. */
export function More({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <details className={`text-lg leading-normal ${className}`}>
      <summary className="inline-flex min-h-11 list-none items-center font-bold underline [&::-webkit-details-marker]:hidden">{label}</summary>
      {children}
    </details>
  );
}

const button = "inline-flex items-center justify-center rounded-[10px] px-8 font-bold transition-transform active:scale-[0.98] motion-reduce:transition-none";
export const darkButton = `${button} bg-ground text-white hover:bg-black`;
export const lampButton = `${button} bg-lamp text-ground hover:bg-white`;
