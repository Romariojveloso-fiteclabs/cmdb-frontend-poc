export function readParam(name: string): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(name);
}

export function readPageParam(name = 'pagina'): number {
  const page = Number(readParam(name) || 1);
  return Number.isInteger(page) && page > 0 ? page - 1 : 0;
}

export function readFilterParam<T extends string>(
  name: string,
  allowed: readonly T[],
  fallback: T
): T {
  const value = readParam(name) as T | null;
  return value && allowed.includes(value) ? value : fallback;
}

export function writeUrlParams(params: Record<string, string | undefined>): void {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const queryString = search.toString();
  const nextUrl = window.location.pathname + (queryString ? '?' + queryString : '') + window.location.hash;
  window.history.replaceState(window.history.state, '', nextUrl);
}
