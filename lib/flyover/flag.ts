const envFlyover = process.env.NEXT_PUBLIC_FLYOVER_ENABLED?.toLowerCase();

// Default on. Only explicit false/0 disables the feature globally.
export const FLYOVER_ENV_DEFAULT = !(
  envFlyover === "0" || envFlyover === "false"
);

/** Resolve the URL override `?flyover=0|1`. Returns null when no override. */
export function resolveUrlOverride(search: string): boolean | null {
  const params = new URLSearchParams(search);
  const v = params.get("flyover");
  if (v === "1" || v === "true") return true;
  if (v === "0" || v === "false") return false;
  return null;
}
