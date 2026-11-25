import type { SVGProps } from "react";

function Icon({ size = 26, children, ...rest }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      aria-hidden={rest["aria-label"] ? undefined : true}
      role={rest["aria-label"] ? "img" : undefined}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      {...rest}
    >
      {children}
    </svg>
  );
}

type Props = { size?: number; "aria-label"?: string };

export const SettingsIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M4 7h9M19 7h1M4 17h1M11 17h9" />
    <circle cx="16" cy="7" r="2.6" />
    <circle cx="8" cy="17" r="2.6" />
  </Icon>
);
export const CheckIcon = (p: Props) => (
  <Icon strokeWidth={3} {...p}>
    <path d="M4.5 12.5l5 5L19.5 7" />
  </Icon>
);
export const LockIcon = (p: Props) => (
  <Icon {...p}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Icon>
);
export const CloseIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M5 5l14 14M19 5L5 19" />
  </Icon>
);
export const BadgeIcon = (p: Props) => (
  <Icon strokeWidth={2} {...p}>
    <circle cx="12" cy="9" r="6" />
    <path d="M8.5 14L7 22l5-3 5 3-1.5-8" />
  </Icon>
);
