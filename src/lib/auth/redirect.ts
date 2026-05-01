export const DEFAULT_AUTH_REDIRECT = "/app";

export function getSafeRedirectPath(
  value: string | string[] | null | undefined,
  fallback = DEFAULT_AUTH_REDIRECT,
) {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return fallback;
  }

  return candidate;
}

export function getLoginPath(next?: string | string[] | null) {
  const safeNext = getSafeRedirectPath(next);

  if (safeNext === DEFAULT_AUTH_REDIRECT) {
    return "/login";
  }

  return `/login?next=${encodeURIComponent(safeNext)}`;
}
