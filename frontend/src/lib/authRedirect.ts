export function getLoginRedirect(state: unknown, admin = false, loginSearch = ""): string {
  const fallback = admin ? '/admin/dashboard' : '/dashboard';
  const returnTo = new URLSearchParams(loginSearch).get('returnTo');
  if ((!state || typeof state !== 'object' || !('from' in state)) && returnTo) {
    if (!returnTo.startsWith('/') || returnTo.startsWith('//') || returnTo.includes('\\')) return fallback;
    try {
      const target = new URL(returnTo, 'https://local.invalid');
      if (target.origin !== 'https://local.invalid') return fallback;
      state = { from: { pathname: target.pathname, search: target.search, hash: target.hash } };
    } catch { return fallback; }
  }
  if (!state || typeof state !== 'object' || !('from' in state)) return fallback;
  const from = state.from;
  if (!from || typeof from !== 'object' || !('pathname' in from) || typeof from.pathname !== 'string') return fallback;
  const allowed = admin ? ['/admin/dashboard', '/admin/users'] : ['/dashboard', '/profile'];
  if (!allowed.includes(from.pathname)) return fallback;
  const search = 'search' in from && typeof from.search === 'string' && from.search.startsWith('?') ? from.search : '';
  const hash = 'hash' in from && typeof from.hash === 'string' && from.hash.startsWith('#') ? from.hash : '';
  return from.pathname + search + hash;
}
