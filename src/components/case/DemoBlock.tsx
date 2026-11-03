import { Component, type ComponentType, type ReactNode, Suspense, lazy } from 'react';
import { Picture } from '~/components/site/Picture';
import { gridSizes } from '~/lib/sizes';
import type { DemoBlock as DemoBlockData } from '~/content/types';
import { DemoStillContext } from './demo-context';
import { Figure } from './Figure';

const cache = new Map<DemoBlockData['load'], ComponentType>();
function lazyDemo(load: DemoBlockData['load']) {
  let demo = cache.get(load);
  if (!demo) {
    demo = lazy(load);
    cache.set(load, demo);
  }
  return demo;
}

class StillOnError extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn('Live demo could not run; showing its still instead.', error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Mounts a case study's live React demo, with its still underneath until it loads. */
export function DemoBlock({ block }: { block: DemoBlockData }) {
  const Demo = lazyDemo(block.load);
  const aspect = block.aspect ?? block.still.width / block.still.height;
  const still = (
    <Picture image={block.still} alt={block.alt} sizes={gridSizes()} className='absolute inset-0 h-full object-cover' />
  );

  return (
    <Figure
      caption={block.caption}
      aside={block.hint ? <span className='text-ink'>{block.hint}</span> : undefined}
    >
      <div
        className='relative isolate [aspect-ratio:var(--a-m)] md:[aspect-ratio:var(--a)]'
        style={
          {
            '--a': aspect,
            '--a-m': block.aspectMobile ?? aspect,
            background: block.background ?? 'var(--site-tint)'
          } as React.CSSProperties
        }
      >
        <DemoStillContext.Provider value={still}>
          <StillOnError fallback={still}>
            <Suspense fallback={still}>
              <Demo />
            </Suspense>
          </StillOnError>
        </DemoStillContext.Provider>
      </div>
    </Figure>
  );
}
