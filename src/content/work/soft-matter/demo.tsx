import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type * as React from 'react';
import { useDemoStill, useInView, usePageVisible, useReducedMotion } from '~/components/case/demo-context';
import { SM } from './screens/palette';
import { Wordmark } from './screens/Brand';
import {
  createRenderer,
  type Drop,
  type Look,
  LOOKS,
  type MaterialName,
  MOODS,
  mixLook,
  pick,
  type SoftRenderer,
  type View
} from './screens/SoftScene';

/*
 * The Soft Matter playground, as it runs on their home page. Drag to push the
 * drops (or pull them together), move the indigo drop with the arrow keys and
 * make it hop with space. Each material changes how the drops look and how
 * they move.
 */

type Physics = {
  /** Pull back to each drop's resting place. */
  spring: number;
  damping: number;
  /** How strongly drops that touch hold on to each other. */
  stick: number;
  /** Bounce when the indigo drop lands. */
  bounce: number;
  label: string;
  note: string;
};

const PHYSICS: Record<MaterialName, Physics> = {
  clay: { spring: 7, damping: 5.2, stick: 9, bounce: 0.08, label: 'Clay', note: 'Matte and heavy. Slow to settle.' },
  wax: { spring: 5, damping: 3.4, stick: 16, bounce: 0.18, label: 'Wax', note: 'Warm light inside. Joins easily.' },
  glass: { spring: 14, damping: 2.6, stick: 3, bounce: 0.46, label: 'Glass', note: 'Bright and springy. Holds its shape.' }
};

const MATERIALS: MaterialName[] = ['clay', 'wax', 'glass'];

type Body = {
  x: number;
  z: number;
  y: number;
  vx: number;
  vz: number;
  vy: number;
  r: number;
  color: string;
  hx: number;
  hz: number;
  phase: number;
};

type Spot = { x: number; z: number; r: number; color: string };

/** Resting places for a wide frame. The last one is the indigo drop. */
const WIDE: Spot[] = [
  { x: -0.82, z: 0.05, r: 0.84, color: SM.peach },
  { x: 0.82, z: -0.22, r: 0.66, color: SM.lilac },
  { x: -2.45, z: -0.85, r: 0.48, color: SM.cream },
  { x: 2.55, z: -0.95, r: 0.4, color: SM.peachSoft },
  { x: 2.15, z: 0.95, r: 0.28, color: SM.lilacDeep },
  { x: -2.05, z: 1.12, r: 0.2, color: SM.peachDeep },
  { x: -0.15, z: 1.42, r: 0.17, color: SM.lilacSoft },
  { x: 0.95, z: 1.38, r: 0.32, color: SM.indigo }
];

/** The same drops for a tall frame, spread into depth instead of across. */
const TALL: Spot[] = [
  { x: -0.38, z: -0.62, r: 0.84, color: SM.peach },
  { x: 0.62, z: 0.42, r: 0.66, color: SM.lilac },
  { x: 0.95, z: -1.65, r: 0.48, color: SM.cream },
  { x: -1.05, z: 0.85, r: 0.4, color: SM.peachSoft },
  { x: 1.2, z: 1.55, r: 0.28, color: SM.lilacDeep },
  { x: -1.15, z: -1.75, r: 0.2, color: SM.peachDeep },
  { x: -0.5, z: 1.95, r: 0.17, color: SM.lilacSoft },
  { x: 0.25, z: 1.6, r: 0.32, color: SM.indigo }
];
const CURSOR = WIDE.length - 1;

type Stage = { spots: Spot[]; view: View; bounds: { x: number; zMin: number; zMax: number } };

/** Where the drops rest and where the camera stands, for a frame of this shape. */
function stageFor(aspect: number): Stage {
  if (aspect < 1.15) {
    return {
      spots: TALL,
      view: { eye: [0, 10.8, 10.4], target: [0, 0.2, 0.32], fov: 26, fit: 0.66 },
      bounds: { x: 1.75, zMin: -2.4, zMax: 2.5 }
    };
  }
  const sx = Math.min(1, Math.max(0.66, aspect / 1.75));
  return {
    spots: WIDE.map((spot) => ({ ...spot, x: spot.x * sx })),
    view: { eye: [0, 4.6, 11.2], target: [0, 0.5, 0.25], fov: 22, fit: 1.75 },
    bounds: { x: 3.4, zMin: -1.9, zMax: 2.1 }
  };
}

function makeBodies(stage: Stage): Body[] {
  return stage.spots.map((spot, index) => ({
    x: spot.x,
    z: spot.z,
    y: 0,
    vx: 0,
    vz: 0,
    vy: 0,
    r: spot.r,
    color: spot.color,
    hx: spot.x,
    hz: spot.z,
    phase: index * 1.7
  }));
}

function toDrops(bodies: Body[]): Drop[] {
  return bodies.map((b) => ({ p: [b.x, b.r * 0.92 + b.y, b.z], r: b.r, color: b.color }));
}

/** Groups of drops close enough to read as one shape. */
function countShapes(bodies: Body[], blend: number) {
  const parent = bodies.map((_, i) => i);
  const find = (start: number) => {
    let i = start;
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]];
      i = parent[i];
    }
    return i;
  };
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i];
      const b = bodies[j];
      const d = Math.hypot(a.x - b.x, a.z - b.z, a.y - b.y);
      if (d < (a.r + b.r) * 1.04 + blend * 0.3) parent[find(i)] = find(j);
    }
  }
  return new Set(bodies.map((_, i) => find(i))).size;
}

type Hand = { x: number; z: number; down: boolean; over: boolean };
type Bounds = Stage['bounds'];

function step(bodies: Body[], physics: Physics, hand: Hand, pull: boolean, bounds: Bounds, time: number, dt: number) {
  for (let i = 0; i < bodies.length; i++) {
    const b = bodies[i];
    const cursor = i === CURSOR;
    // Resting places drift a little, so the scene breathes.
    const hx = b.hx + (cursor ? 0 : 0.05 * Math.sin(time * 0.6 + b.phase));
    const hz = b.hz + (cursor ? 0 : 0.04 * Math.cos(time * 0.5 + b.phase));
    const k = physics.spring * (cursor ? 2.2 : 1) * (0.7 + 0.5 / (b.r + 0.4));
    let fx = -k * (b.x - hx) - physics.damping * b.vx;
    let fz = -k * (b.z - hz) - physics.damping * b.vz;
    for (let j = 0; j < bodies.length; j++) {
      if (j === i) continue;
      const o = bodies[j];
      const dx = b.x - o.x;
      const dz = b.z - o.z;
      const d = Math.hypot(dx, dz) || 1e-4;
      const touch = b.r + o.r;
      const nx = dx / d;
      const nz = dz / d;
      if (d < touch * 0.78) {
        const push = (touch * 0.78 - d) * 40;
        fx += nx * push;
        fz += nz * push;
      } else if (d < touch * 1.22) {
        // Drops that touch hold on, towards a slight overlap.
        const pullIn = (d - touch * 0.86) * physics.stick * (o.r / (b.r + o.r));
        fx -= nx * pullIn;
        fz -= nz * pullIn;
      }
    }
    if (hand.down) {
      const dx = b.x - hand.x;
      const dz = b.z - hand.z;
      const d = Math.hypot(dx, dz) || 1e-4;
      const reach = pull ? 2.6 : 1.5 + b.r * 0.5;
      if (d < reach) {
        const fall = 1 - d / reach;
        const strength = (pull ? 34 : 70) * fall * fall * (0.5 + 0.35 / (b.r + 0.2));
        fx += (pull ? -1 : 1) * (dx / d) * strength;
        fz += (pull ? -1 : 1) * (dz / d) * strength;
      }
    }
    const mass = 0.4 + b.r * 1.2;
    b.vx += (fx / mass) * dt;
    b.vz += (fz / mass) * dt;
    b.x += b.vx * dt;
    b.z += b.vz * dt;
    const xMax = bounds.x - b.r * 0.5;
    if (Math.abs(b.x) > xMax) {
      b.x = Math.sign(b.x) * xMax;
      b.vx *= -0.3;
    }
    const zMin = bounds.zMin + b.r * 0.5;
    const zMax = bounds.zMax - b.r * 0.5;
    if (b.z < zMin || b.z > zMax) {
      b.z = Math.min(zMax, Math.max(zMin, b.z));
      b.vz *= -0.3;
    }
    if (b.y > 0 || b.vy > 0) {
      b.vy -= 22 * dt;
      b.y += b.vy * dt;
      if (b.y < 0) {
        b.y = 0;
        b.vy = Math.abs(b.vy) > 1.2 ? -b.vy * physics.bounce : 0;
      }
    }
  }
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** The frame the still is rendered at; the live demo starts from the same layout. */
const STILL = { w: 1376, h: 760 };

/** Live demo: the Soft Matter playground. With `time` it renders one still frame. */
export default function SoftMatterDemo({ time }: { time?: number }) {
  const still = time !== undefined;
  const fallback = useDemoStill();
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<SoftRenderer | null>(null);
  const [supported, setSupported] = useState(true);
  const [drawn, setDrawn] = useState(false);
  const [material, setMaterial] = useState<MaterialName>('wax');
  const [pull, setPull] = useState(false);
  const [shapes, setShapes] = useState(() => countShapes(makeBodies(stageFor(STILL.w / STILL.h)), LOOKS.wax.blend));
  const [focused, setFocused] = useState(false);
  const inView = useInView(rootRef);
  const visible = usePageVisible();
  const reduced = useReducedMotion();
  const hintId = useId();

  const sim = useRef(
    (() => {
      const stage = stageFor(STILL.w / STILL.h);
      return {
        stage,
        bodies: makeBodies(stage),
        size: { ...STILL },
        hand: { x: 0, z: 0, down: false, over: false } as Hand,
        pull: false,
        time: 0,
        look: LOOKS.wax as Look,
        from: LOOKS.wax as Look,
        to: LOOKS.wax as Look,
        blendT: 1,
        physics: PHYSICS.wax,
        focused: false,
        ratio: 1.5
      };
    })()
  );

  const draw = () => {
    const s = sim.current;
    const gl = renderer.current;
    if (!gl) return;
    const cursor = s.bodies[CURSOR];
    const touch: [number, number, number, number] =
      s.hand.over || s.hand.down
        ? [s.hand.x, s.hand.z, s.hand.down ? 0.9 : 0.6, s.hand.down ? 1 : 0.45]
        : s.focused
          ? [cursor.x, cursor.z, 0.75, 0.8]
          : [0, 0, 1, 0];
    gl.draw(
      { drops: toDrops(s.bodies), look: s.look, mood: MOODS.studio, view: s.stage.view, touch, grain: 0.014 },
      s.size.w,
      s.size.h,
      still ? Math.min(window.devicePixelRatio || 1, 2) : s.ratio
    );
  };

  /** Reads the frame size; a new shape of frame gets new resting places. Returns true if they moved. */
  const measure = () => {
    const root = rootRef.current;
    if (!root) return false;
    const rect = root.getBoundingClientRect();
    const s = sim.current;
    s.size = { w: Math.max(1, rect.width), h: Math.max(1, rect.height) };
    const stage = stageFor(s.size.w / s.size.h);
    const moved = stage.spots.some((spot, i) => spot.x !== s.stage.spots[i].x || spot.z !== s.stage.spots[i].z);
    if (!moved && stage.view === s.stage.view) return false;
    s.stage = stage;
    s.bodies.forEach((b, i) => {
      if (i === CURSOR) {
        b.hx = clamp(b.hx, -stage.bounds.x + 0.3, stage.bounds.x - 0.3);
        b.hz = clamp(b.hz, stage.bounds.zMin + 0.3, stage.bounds.zMax - 0.3);
        if (!moved) return;
      }
      b.hx = stage.spots[i].x;
      b.hz = stage.spots[i].z;
    });
    return moved;
  };

  const settle = (steps = 420) => {
    const s = sim.current;
    for (let i = 0; i < steps; i++) step(s.bodies, s.physics, s.hand, s.pull, s.stage.bounds, s.time, 1 / 120);
    for (const b of s.bodies) {
      b.vx = 0;
      b.vz = 0;
      b.y = 0;
      b.vy = 0;
    }
  };

  const recount = () => {
    const s = sim.current;
    setShapes(countShapes(s.bodies, s.look.blend));
  };

  // Set up WebGL once, before the first paint, and draw the opening frame.
  // biome-ignore lint/correctness/useExhaustiveDependencies: the simulation lives in a ref; only these inputs restart it
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = createRenderer(canvas, still);
    if (!gl) {
      setSupported(false);
      return;
    }
    renderer.current = gl;
    const s = sim.current;
    s.ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    if (measure()) {
      // A frame of another shape starts at rest in its own layout.
      for (const b of s.bodies) {
        b.x = b.hx;
        b.z = b.hz;
      }
      recount();
    }
    draw();
    setDrawn(true);
    const lost = (event: Event) => {
      event.preventDefault();
      setSupported(false);
    };
    canvas.addEventListener('webglcontextlost', lost);
    return () => {
      canvas.removeEventListener('webglcontextlost', lost);
      gl.dispose();
      renderer.current = null;
    };
  }, [still]);

  // Keep the canvas sized to the frame.
  // biome-ignore lint/correctness/useExhaustiveDependencies: the simulation lives in a ref; only these inputs restart it
  useEffect(() => {
    if (still || !supported) return;
    const root = rootRef.current;
    if (!root || !('ResizeObserver' in window)) return;
    const observer = new ResizeObserver(() => {
      measure();
      if (reduced) {
        settle();
        recount();
      }
      draw();
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, [still, supported, reduced]);

  // The loop runs only while the demo is on screen, the tab is visible and motion is allowed.
  // biome-ignore lint/correctness/useExhaustiveDependencies: the simulation lives in a ref; only these inputs restart it
  useEffect(() => {
    if (still || !supported) return;
    if (reduced) {
      const s = sim.current;
      s.look = s.to;
      s.blendT = 1;
      settle();
      draw();
      recount();
      return;
    }
    if (!inView || !visible) return;
    let raf = 0;
    let last = performance.now();
    let frames = 0;
    let spent = 0;
    let lastShapes = -1;
    const tick = (now: number) => {
      const s = sim.current;
      const elapsed = Math.min(0.05, (now - last) / 1000);
      last = now;
      // Drop the resolution on slow machines; never raise it mid-session.
      frames++;
      spent += elapsed;
      if (frames === 45) {
        if (spent / frames > 0.026 && s.ratio > 0.75) s.ratio = Math.max(0.75, s.ratio - 0.25);
        frames = 0;
        spent = 0;
      }
      if (s.blendT < 1) {
        s.blendT = Math.min(1, s.blendT + elapsed / 0.45);
        s.look = mixLook(s.from, s.to, 1 - (1 - s.blendT) ** 3);
      }
      const sub = Math.max(1, Math.round(elapsed * 120));
      for (let i = 0; i < sub; i++) {
        s.time += elapsed / sub;
        step(s.bodies, s.physics, s.hand, s.pull, s.stage.bounds, s.time, elapsed / sub);
      }
      draw();
      const count = countShapes(s.bodies, s.look.blend);
      if (count !== lastShapes) {
        lastShapes = count;
        setShapes(count);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [still, supported, reduced, inView, visible]);

  const chooseMaterial = (next: MaterialName) => {
    const s = sim.current;
    setMaterial(next);
    s.physics = PHYSICS[next];
    s.from = s.look;
    s.to = LOOKS[next];
    s.blendT = 0;
    if (reduced) {
      s.look = LOOKS[next];
      s.blendT = 1;
      settle();
      draw();
      recount();
    }
  };

  const choosePull = (next: boolean) => {
    setPull(next);
    sim.current.pull = next;
  };

  const reset = () => {
    const s = sim.current;
    s.bodies = makeBodies(s.stage);
    s.hand.down = false;
    draw();
    recount();
  };

  const handAt = (event: React.PointerEvent) => {
    const s = sim.current;
    const rect = event.currentTarget.getBoundingClientRect();
    return pick(s.stage.view, rect.width, rect.height, event.clientX - rect.left, event.clientY - rect.top, 0.35);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const point = handAt(event);
    if (!point) return;
    const s = sim.current;
    [s.hand.x, s.hand.z] = point;
    if (reduced) {
      // No animation: the indigo drop goes where you tap, and everything settles at once.
      const cursor = s.bodies[CURSOR];
      const { bounds } = s.stage;
      cursor.hx = clamp(point[0], -bounds.x + 0.3, bounds.x - 0.3);
      cursor.hz = clamp(point[1], bounds.zMin + 0.3, bounds.zMax - 0.3);
      cursor.x = cursor.hx;
      cursor.z = cursor.hz;
      settle();
      draw();
      recount();
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    s.hand.down = true;
    s.hand.over = true;
    // A tap is a poke: drops near it get a nudge straight away.
    for (const b of s.bodies) {
      const dx = b.x - point[0];
      const dz = b.z - point[1];
      const d = Math.hypot(dx, dz) || 1e-4;
      const fall = Math.max(0, 1 - d / 1.8);
      const kick = (s.pull ? -1.6 : 2.6) * fall * fall;
      b.vx += (dx / d) * kick;
      b.vz += (dz / d) * kick;
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const point = handAt(event);
    const s = sim.current;
    if (!point) {
      s.hand.over = false;
      return;
    }
    [s.hand.x, s.hand.z] = point;
    s.hand.over = event.pointerType === 'mouse' || s.hand.down;
  };

  const release = (event: React.PointerEvent<HTMLDivElement>) => {
    const s = sim.current;
    s.hand.down = false;
    if (event.pointerType !== 'mouse' || event.type === 'pointerleave') s.hand.over = false;
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const s = sim.current;
    const cursor = s.bodies[CURSOR];
    const { bounds } = s.stage;
    const size = event.shiftKey ? 0.7 : 0.35;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-size, 0],
      ArrowRight: [size, 0],
      ArrowUp: [0, -size],
      ArrowDown: [0, size]
    };
    const move = moves[event.key];
    if (move) {
      event.preventDefault();
      cursor.hx = clamp(cursor.hx + move[0], -bounds.x + 0.3, bounds.x - 0.3);
      cursor.hz = clamp(cursor.hz + move[1], bounds.zMin + 0.3, bounds.zMax - 0.3);
    } else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (!reduced && cursor.y <= 0.001) cursor.vy = 6.4;
    } else {
      return;
    }
    if (reduced) {
      cursor.x = cursor.hx;
      cursor.z = cursor.hz;
      settle();
      draw();
      recount();
    }
  };

  if (!supported && fallback) {
    return <div className='relative min-h-full w-full [&>*]:absolute [&>*]:inset-0'>{fallback}</div>;
  }

  const physics = PHYSICS[material];
  const mood = MOODS.studio;
  const hint = focused
    ? 'Arrow keys move the indigo drop. Space makes it hop. Hold shift for bigger steps.'
    : reduced
      ? 'Tap the floor to move the indigo drop, or focus the scene and use the arrow keys.'
      : 'Drag across the floor to push the drops, or focus the scene and use the arrow keys.';

  return (
    <div
      ref={rootRef}
      className='@container relative isolate flex min-h-full w-full flex-col overflow-hidden'
      style={{ background: mood.hazeTop, color: SM.plum, fontFamily: SM.text }}
    >
      {fallback && !drawn && !still ? (
        <div aria-hidden='true' className='absolute inset-0 [&>*]:absolute [&>*]:inset-0'>
          {fallback}
        </div>
      ) : null}
      <canvas ref={canvasRef} aria-hidden='true' className='absolute inset-0 block h-full w-full' />
      {/* The playing surface. Focus it to steer the indigo drop. */}
      <div
        role='application'
        aria-label='Soft Matter playground'
        aria-describedby={hintId}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: an application region that handles its own keys
        tabIndex={0}
        onKeyDown={onKeyDown}
        onFocus={(event) => {
          // Only keyboard focus lights the indigo drop and swaps the hint.
          if (!event.currentTarget.matches(':focus-visible')) return;
          sim.current.focused = true;
          setFocused(true);
          if (reduced) draw();
        }}
        onBlur={() => {
          sim.current.focused = false;
          setFocused(false);
          if (reduced) draw();
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={release}
        onPointerCancel={release}
        onPointerLeave={release}
        className='absolute inset-0 cursor-grab outline-none active:cursor-grabbing focus-visible:shadow-[inset_0_0_0_3px_#3A2A8C]'
        style={{ touchAction: 'pan-y' }}
      />

      <div className='pointer-events-none relative flex flex-1 flex-col justify-between gap-6 p-4 @min-[700px]:p-7'>
        <div className='flex items-center justify-between gap-4'>
          <Wordmark size={17} />
          <div className='flex items-center gap-4'>
            <p
              className='hidden tabular-nums @min-[520px]:block'
              style={{ fontSize: 12.5, fontWeight: 500, color: SM.plumSoft }}
            >
              {WIDE.length} drops
              <span aria-hidden='true'> · </span>
              <span className='sr-only'>, </span>
              {shapes} {shapes === 1 ? 'shape' : 'shapes'}
            </p>
            <button
              type='button'
              onClick={reset}
              className='pointer-events-auto h-8 rounded-full px-3.5 outline-none transition-colors hover:bg-white/60 focus-visible:shadow-[0_0_0_2px_#3A2A8C]'
              style={{ fontSize: 12.5, fontWeight: 600, background: 'rgba(255,255,255,0.38)', color: SM.plum }}
            >
              Reset
            </button>
          </div>
        </div>

        <div className='flex flex-col gap-3 @min-[700px]:flex-row @min-[700px]:items-end @min-[700px]:justify-between'>
          <div style={{ maxWidth: 360 }}>
            <p aria-live='polite' style={{ fontFamily: SM.display, fontSize: 15, fontWeight: 500, letterSpacing: '-0.03em' }}>
              {physics.label}
              <span className='sr-only'>. {physics.note}</span>
            </p>
            <p aria-hidden='true' style={{ fontSize: 13, lineHeight: 1.45, marginTop: 4, color: SM.plumSoft }}>
              {physics.note}
            </p>
            <p
              id={hintId}
              className='hidden @min-[520px]:block'
              style={{ fontSize: 12.5, lineHeight: 1.45, marginTop: 10, color: SM.plumMuted }}
            >
              {hint}
            </p>
          </div>

          <div className='pointer-events-auto flex flex-wrap items-center gap-2'>
            <Segmented
              label='Material'
              options={MATERIALS.map((name) => ({ value: name, label: PHYSICS[name].label }))}
              value={material}
              onChange={chooseMaterial}
            />
            <Segmented
              label='Hand'
              options={[
                { value: 'push', label: 'Push' },
                { value: 'pull', label: 'Pull' }
              ]}
              value={pull ? 'pull' : 'push'}
              onChange={(next) => choosePull(next === 'pull')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div
      role='group'
      aria-label={label}
      className='flex h-9 items-center rounded-full p-0.5'
      style={{ background: 'rgba(255,255,255,0.38)', boxShadow: 'inset 0 0 0 1px rgba(29,21,48,0.06)' }}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type='button'
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className='h-8 rounded-full px-3 outline-none transition-colors focus-visible:shadow-[0_0_0_2px_#3A2A8C] @min-[520px]:px-3.5'
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '-0.005em',
              color: active ? SM.cream : SM.plum,
              background: active ? SM.plum : 'transparent'
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
