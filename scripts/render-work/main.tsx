// The page `pnpm render-work` screenshots. Renders one still or one motion
// frame from src/content/work/<slug>/screens/index.tsx at its exact size.
import '../../src/styles/app.css';
import { type ComponentType, useState } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import type { ScreenProps, ScreenSet } from '../../src/content/screens';

declare global {
  interface Window {
    __manifest: () => Promise<{
      stills: Record<string, { width: number; height: number }>;
      motion: Record<string, { width: number; height: number; duration: number; fps: number; outputWidth: number }>;
    }>;
    __ready: Promise<void>;
    __setTime: (time: number) => Promise<void>;
  }
}

const sets = import.meta.glob<{ default: ScreenSet }>('../../src/content/work/*/screens/index.tsx');
const params = new URLSearchParams(location.search);
const slug = params.get('slug') ?? '';
const kind = params.get('kind');
const name = params.get('name') ?? '';
const loader = sets[`../../src/content/work/${slug}/screens/index.tsx`];
const frames = () => new Promise<void>((done) => requestAnimationFrame(() => requestAnimationFrame(() => done())));

async function settle() {
  await new Promise((done) => setTimeout(done, 60));
  await document.fonts.ready;
  await Promise.all([...document.images].map((image) => image.decode().catch(() => undefined)));
  await frames();
}

window.__manifest = async () => {
  if (!loader) throw new Error(`No screens for "${slug}"`);
  const set = (await loader()).default;
  return {
    stills: Object.fromEntries(
      Object.entries(set.stills).map(([key, still]) => [key, { width: still.width, height: still.height }])
    ),
    motion: Object.fromEntries(
      Object.entries(set.motion ?? {}).map(([key, motion]) => [
        key,
        {
          width: motion.width,
          height: motion.height,
          duration: motion.duration,
          fps: motion.fps ?? 30,
          outputWidth: motion.outputWidth ?? 1600
        }
      ])
    )
  };
};

let setTimeState: (time: number) => void = () => {};

function Frame({
  Screen,
  start,
  width,
  height
}: {
  Screen: ComponentType<ScreenProps> | ComponentType<{ time: number }>;
  start: number;
  width: number;
  height: number;
}) {
  const [time, setTime] = useState(start);
  setTimeState = setTime;
  return (
    <div style={{ width, height, position: 'relative', overflow: 'hidden' }}>
      <Screen time={time} />
    </div>
  );
}
window.__setTime = async (time) => {
  flushSync(() => setTimeState(time));
  await frames();
};

window.__ready = (async () => {
  if (!loader || !kind) return;
  const set = (await loader()).default;
  const entry = kind === 'still' ? set.stills[name] : set.motion?.[name];
  if (!entry) throw new Error(`No ${kind} "${name}" for "${slug}"`);
  const start = 'time' in entry && typeof entry.time === 'number' ? entry.time : 0;

  const root = document.getElementById('root');
  if (!root) return;
  flushSync(() =>
    createRoot(root).render(
      <Frame Screen={entry.component} start={start} width={entry.width} height={entry.height} />
    )
  );
  await settle();
})();
