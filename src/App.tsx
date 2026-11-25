import { useEffect, useState } from 'react';
import { DayView } from './components/DayView';
import { Layout } from './components/Layout';
import { useRoute } from './lib/router';
import { type AppState, decodeShare } from './lib/state';
import { StoreProvider } from './lib/store';
import { Mentor } from './screens/Mentor';
import { Projects } from './screens/Projects';
import { Revision } from './screens/Revision';
import { Roadmap } from './screens/Roadmap';
import { Settings } from './screens/Settings';
import { Today } from './screens/Today';

function Screens() {
  const route = useRoute();
  return (
    <Layout route={route}>
      {route.name === 'today' && <Today />}
      {route.name === 'roadmap' && <Roadmap focusWeek={route.week} />}
      {route.name === 'day' && <DayView key={route.n} n={route.n} />}
      {route.name === 'revision' && <Revision />}
      {route.name === 'projects' && <Projects />}
      {route.name === 'mentor' && <Mentor />}
      {route.name === 'settings' && <Settings />}
    </Layout>
  );
}

export default function App() {
  // A link like  #/share/<token>  opens a read-only snapshot for a mentor.
  // The token is kept in sessionStorage so in-app navigation and refreshes stay in the snapshot.
  const initialToken = location.hash.startsWith('#/share/') ? location.hash.slice('#/share/'.length) : sessionStorage.getItem('aieos:share');
  const [shared, setShared] = useState<AppState | null | 'loading' | 'error'>(() => (initialToken ? 'loading' : null));

  useEffect(() => {
    if (shared !== 'loading' || !initialToken) return;
    decodeShare(initialToken)
      .then((s) => {
        setShared(s);
        sessionStorage.setItem('aieos:share', initialToken);
        if (location.hash.startsWith('#/share/')) history.replaceState(null, '', `${location.pathname}#/today`);
      })
      .catch(() => setShared('error'));
  }, [shared]);

  if (shared === 'loading') return <div className="flex h-full items-center justify-center text-sm text-zinc-500">Loading shared progress…</div>;
  if (shared === 'error')
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-sm">
        <p>This share link is invalid or truncated.</p>
        <a className="text-violet-500 underline" href="/">
          Open the tracker
        </a>
      </div>
    );

  return (
    <StoreProvider shared={shared ?? undefined}>
      <Screens />
    </StoreProvider>
  );
}
