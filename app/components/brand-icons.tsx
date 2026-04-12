/**
 * Brand logos — inlined because lucide-react (>=1.x) no longer ships
 * third-party brand marks. Keep these visually consistent with lucide's
 * 24x24 viewbox so they sit naturally next to other icons.
 */

type IconProps = {
  className?: string;
  "aria-hidden"?: boolean;
};

export function GithubIcon({ className = "h-5 w-5", ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      {...rest}
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12A11.5 11.5 0 0 0 8.36 22.92c.58.1.79-.25.79-.56v-2.17c-3.2.7-3.88-1.35-3.88-1.35-.53-1.33-1.29-1.68-1.29-1.68-1.06-.72.08-.7.08-.7 1.17.08 1.8 1.2 1.8 1.2 1.04 1.8 2.73 1.28 3.4.98.1-.76.4-1.28.74-1.57-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.3-.51-1.5.11-3.13 0 0 .97-.31 3.17 1.18A10.97 10.97 0 0 1 12 6.05c.97 0 1.94.13 2.85.38 2.2-1.49 3.17-1.18 3.17-1.18.62 1.63.23 2.83.11 3.13.74.8 1.19 1.83 1.19 3.08 0 4.41-2.7 5.39-5.27 5.67.41.36.78 1.08.78 2.18v3.24c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

export function LinkedinIcon({ className = "h-5 w-5", ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      {...rest}
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.38 4.27 5.47v6.27zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z" />
    </svg>
  );
}
