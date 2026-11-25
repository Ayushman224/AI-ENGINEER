import { useEffect, useState } from 'react';

export type Route =
  | { name: 'today' }
  | { name: 'roadmap'; week?: number }
  | { name: 'day'; n: number }
  | { name: 'revision' }
  | { name: 'projects' }
  | { name: 'mentor' }
  | { name: 'settings' };

export function parseHash(h: string): Route {
  const parts = h.replace(/^#\/?/, '').split('/');
  switch (parts[0]) {
    case 'roadmap':
      return { name: 'roadmap', week: parts[1] ? Number(parts[1]) : undefined };
    case 'day': {
      const n = Number(parts[1]);
      return n >= 1 && n <= 280 ? { name: 'day', n } : { name: 'today' };
    }
    case 'revision':
    case 'projects':
    case 'mentor':
    case 'settings':
      return { name: parts[0] };
    default:
      return { name: 'today' };
  }
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(location.hash));
  useEffect(() => {
    const on = () => {
      setRoute(parseHash(location.hash));
      document.getElementById('main')?.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

export const go = (path: string) => {
  location.hash = path;
};
