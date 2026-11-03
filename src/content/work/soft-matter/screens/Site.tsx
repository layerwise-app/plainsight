import type * as React from 'react';
import { StatusBar } from '~/components/frames/Phone';
import { Mark, Wordmark } from './Brand';
import {
  archiveScene,
  gardenScene,
  heroScene,
  heroTallScene,
  meltScene,
  tideScene,
  tideTallScene
} from './choreo';
import { SM } from './palette';
import { type MaterialName, type MoodName, type SceneFn, SoftScene } from './SoftScene';

type Project = {
  title: string;
  client: string;
  kind: string;
  year: number;
  scene: SceneFn;
  mood: MoodName;
  material: MaterialName;
};

export const PROJECTS: Project[] = [
  { title: 'Slow Tide', client: 'Halvø Science Centre', kind: 'Installation', year: 2024, scene: tideScene, mood: 'dusk', material: 'wax' },
  { title: 'Melt', client: 'Kalk Ceramics', kind: 'Shop window', year: 2024, scene: meltScene, mood: 'peach', material: 'clay' },
  { title: 'Pressure Garden', client: 'Odense Glasshouse', kind: 'Interactive floor', year: 2023, scene: gardenScene, mood: 'studio', material: 'glass' },
  { title: 'Thread Count', client: 'Museum of Thread', kind: 'Collection browser', year: 2023, scene: archiveScene, mood: 'studio', material: 'clay' }
];

const page: React.CSSProperties = {
  width: '100%',
  height: '100%',
  background: SM.paper,
  color: SM.plum,
  fontFamily: SM.text,
  fontWeight: 500,
  letterSpacing: '-0.005em',
  overflow: 'hidden',
  position: 'relative'
};

const NAV = ['Work', 'Studio', 'Lab', 'Journal'];

function Nav({ active, overlay }: { active?: string; overlay?: boolean }) {
  return (
    <div
      style={{
        position: overlay ? 'absolute' : 'relative',
        zIndex: 2,
        left: 0,
        right: 0,
        top: 0,
        height: 68,
        padding: '0 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: overlay ? undefined : `1px solid ${SM.line}`
      }}
    >
      <Wordmark size={19} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 30, fontSize: 14.5, fontWeight: 600 }}>
        {NAV.map((item) => (
          <span key={item} style={{ color: item === active ? SM.plum : SM.plumSoft, position: 'relative' }}>
            {item}
            {item === active ? (
              <span style={{ position: 'absolute', left: 0, right: 0, bottom: -7, height: 2, borderRadius: 2, background: SM.indigo }} />
            ) : null}
          </span>
        ))}
        <span
          style={{
            marginLeft: 6,
            height: 38,
            padding: '0 18px',
            borderRadius: 99,
            background: SM.plum,
            color: SM.cream,
            display: 'inline-flex',
            alignItems: 'center'
          }}
        >
          Start a project
        </span>
      </div>
    </div>
  );
}

/** The material switch as it appears on the site, drawn still. */
export function MaterialChips({ active = 'wax', small }: { active?: MaterialName; small?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        padding: 2,
        borderRadius: 99,
        background: 'rgba(255,255,255,0.42)',
        boxShadow: 'inset 0 0 0 1px rgba(29,21,48,0.06)',
        fontSize: small ? 12 : 13,
        fontWeight: 600
      }}
    >
      {(['clay', 'wax', 'glass'] as const).map((name) => (
        <span
          key={name}
          style={{
            height: small ? 28 : 32,
            padding: small ? '0 11px' : '0 14px',
            borderRadius: 99,
            display: 'inline-flex',
            alignItems: 'center',
            background: name === active ? SM.plum : 'transparent',
            color: name === active ? SM.cream : SM.plum,
            textTransform: 'capitalize'
          }}
        >
          {name}
        </span>
      ))}
    </span>
  );
}

function Thumb({ project, width, height, time = 0 }: { project: Project; width: number; height: number; time?: number }) {
  return (
    <div style={{ width, height, borderRadius: 14, overflow: 'hidden', position: 'relative' }}>
      <SoftScene scene={project.scene} width={width} height={height} time={time} material={project.material} mood={project.mood} />
    </div>
  );
}

/** softmatter.dk, the home page, designed at 1240 × 762. */
export function HomePage({ time = 0 }: { time?: number }) {
  const heroH = 540;
  return (
    <div style={page}>
      <div style={{ position: 'relative', height: heroH }}>
        <SoftScene scene={heroScene} width={1240} height={heroH} time={time} material='wax' />
        <Nav active='Work' overlay />
        <div style={{ position: 'absolute', left: 36, bottom: 40, width: 600 }}>
          <h1
            style={{
              fontFamily: SM.display,
              fontWeight: 500,
              fontSize: 62,
              lineHeight: 1.02,
              letterSpacing: '-0.055em',
              margin: 0
            }}
          >
            Software with
            <br />a bit of give.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.5, marginTop: 20, maxWidth: 470, color: SM.plumSoft }}>
            Soft Matter is a creative technology studio in Copenhagen. We make installations and interactive pieces for
            museums and brands, and the tools that run them.
          </p>
        </div>
        <div style={{ position: 'absolute', right: 36, bottom: 40, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: SM.plumMuted }}>Drag to push the drops</span>
          <MaterialChips />
        </div>
      </div>
      <div style={{ padding: '34px 36px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontFamily: SM.display, fontSize: 22, fontWeight: 500, letterSpacing: '-0.04em' }}>Selected work</div>
          <div style={{ fontSize: 14.5, fontWeight: 600 }}>
            All 31 projects <span style={{ color: SM.indigo }}>→</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 22 }}>
          {PROJECTS.map((project) => (
            <div key={project.title}>
              <Thumb project={project} width={279} height={196} time={time} />
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 14.5, fontWeight: 600 }}>
                {project.title}
                <span style={{ color: SM.plumMuted, fontWeight: 500 }}>{project.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const FACTS = [
  ['Client', 'Halvø Science Centre, Aarhus'],
  ['Opened', 'May 2024, Hall 2'],
  ['Wall', '14 × 3.2 m, six projectors'],
  ['Sensing', 'Two depth cameras, 40 ms from hand to water'],
  ['Visitors', '212,000 in the first year'],
  ['Team', 'Freja Holm, Emil Brandt, Noor Lindqvist']
];

/** A case page on softmatter.dk, designed at 1240 × 762. */
export function ProjectPage({ time = 0 }: { time?: number }) {
  return (
    <div style={page}>
      <Nav active='Work' />
      <div style={{ padding: '40px 36px 0', display: 'grid', gridTemplateColumns: '1fr 1.08fr', gap: 48 }}>
        <div>
          <div style={{ fontSize: 13.5, color: SM.plumMuted, fontWeight: 600 }}>Installation · 2024</div>
          <h1 style={{ fontFamily: SM.display, fontWeight: 500, fontSize: 56, lineHeight: 1, letterSpacing: '-0.055em', margin: '14px 0 0' }}>
            Slow Tide
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.4, marginTop: 16, maxWidth: 430, letterSpacing: '-0.015em' }}>
            A wall of water that remembers every hand that pushed it.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 28, alignContent: 'start', paddingTop: 4 }}>
          {FACTS.map(([label, value]) => (
            <div key={label} style={{ padding: '10px 0', borderTop: `1px solid ${SM.line}` }}>
              <div style={{ fontSize: 12.5, color: SM.plumMuted, fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: 14, marginTop: 3, lineHeight: 1.35 }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ margin: '36px 36px 0', borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
        <SoftScene scene={tideScene} width={1168} height={400} time={time} material='wax' mood='dusk' />
        <div
          style={{
            position: 'absolute',
            left: 20,
            bottom: 20,
            height: 38,
            padding: '0 16px 0 12px',
            borderRadius: 99,
            background: 'rgba(245,238,228,0.92)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 13.5,
            fontWeight: 600
          }}
        >
          <svg width='16' height='16' viewBox='0 0 16 16' aria-hidden='true'>
            <circle cx='8' cy='8' r='8' fill={SM.plum} />
            <path d='M6.4 5.1v5.8L11 8z' fill={SM.cream} />
          </svg>
          Film, 2:14. Plays when you tap.
        </div>
      </div>
      <div style={{ padding: '30px 36px 0', display: 'grid', gridTemplateColumns: '1fr 1.08fr', gap: 48 }}>
        <div style={{ fontFamily: SM.display, fontSize: 20, fontWeight: 500, letterSpacing: '-0.04em' }}>The brief</div>
        <p style={{ fontSize: 16, lineHeight: 1.55, margin: 0 }}>
          Halvø wanted its tidal exhibit touched, not read. Push the water and it moves away from your hands. Walk off and
          the wall keeps the shape you made for an hour before the tide smooths it out.
        </p>
      </div>
    </div>
  );
}

const phone: React.CSSProperties = {
  width: 390,
  height: 844,
  background: SM.paper,
  color: SM.plum,
  fontFamily: SM.text,
  fontWeight: 500,
  letterSpacing: '-0.005em',
  position: 'relative',
  overflow: 'hidden'
};

function PhoneNav({ overlay }: { overlay?: boolean }) {
  return (
    <div
      style={{
        position: overlay ? 'absolute' : 'relative',
        zIndex: 6,
        top: overlay ? 54 : undefined,
        left: 0,
        right: 0,
        height: 52,
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Wordmark size={17} />
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14.5, fontWeight: 600 }}>
        Menu
        <svg width='18' height='10' viewBox='0 0 18 10' aria-hidden='true'>
          <rect y='0' width='18' height='2' rx='1' fill={SM.plum} />
          <rect y='8' width='12' height='2' rx='1' x='6' fill={SM.plum} />
        </svg>
      </span>
    </div>
  );
}

/** The home page on a phone. 390 × 844. */
export function MobileHome({ time = 0 }: { time?: number }) {
  return (
    <div style={phone}>
      <div style={{ position: 'relative', height: 470 }}>
        <SoftScene scene={heroTallScene} width={390} height={470} time={time} material='wax' />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
          <StatusBar color={SM.plum} time='14:32' />
        </div>
        <PhoneNav overlay />
        <div style={{ position: 'absolute', left: 20, bottom: 18 }}>
          <MaterialChips small />
        </div>
      </div>
      <div style={{ padding: '24px 20px 0' }}>
        <h1 style={{ fontFamily: SM.display, fontWeight: 500, fontSize: 35, lineHeight: 1.04, letterSpacing: '-0.055em', margin: 0 }}>
          Software with a bit of give.
        </h1>
        <p style={{ fontSize: 15.5, lineHeight: 1.5, marginTop: 14, color: SM.plumSoft }}>
          Soft Matter is a creative technology studio in Copenhagen. We make installations and interactive pieces for
          museums and brands, and the tools that run them.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <span style={{ height: 46, padding: '0 20px', borderRadius: 99, background: SM.plum, color: SM.cream, display: 'inline-flex', alignItems: 'center', fontSize: 15, fontWeight: 600 }}>
            See the work
          </span>
          <span style={{ height: 46, padding: '0 20px', borderRadius: 99, boxShadow: `inset 0 0 0 1.5px ${SM.lineStrong}`, display: 'inline-flex', alignItems: 'center', fontSize: 15, fontWeight: 600 }}>
            Start a project
          </span>
        </div>
      </div>
    </div>
  );
}

/** The work index on a phone. 390 × 844. */
export function MobileWork({ time = 0 }: { time?: number }) {
  const filters: [string, number][] = [
    ['All', 31],
    ['Museums', 14],
    ['Brands', 11],
    ['Tools', 6]
  ];
  return (
    <div style={phone}>
      <StatusBar color={SM.plum} time='14:33' />
      <PhoneNav />
      <div style={{ padding: '18px 20px 0' }}>
        <h1 style={{ fontFamily: SM.display, fontWeight: 500, fontSize: 35, letterSpacing: '-0.055em', margin: 0 }}>Work</h1>
        <div style={{ display: 'flex', gap: 6, marginTop: 16 }}>
          {filters.map(([name, count], index) => (
            <span
              key={name}
              style={{
                height: 32,
                padding: '0 12px',
                borderRadius: 99,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 13,
                fontWeight: 600,
                background: index === 0 ? SM.plum : 'transparent',
                color: index === 0 ? SM.cream : SM.plum,
                boxShadow: index === 0 ? undefined : `inset 0 0 0 1px ${SM.lineStrong}`
              }}
            >
              {name}
              <span style={{ opacity: 0.55, fontWeight: 500 }}>{count}</span>
            </span>
          ))}
        </div>
      </div>
      <div style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 22 }}>
        {PROJECTS.slice(0, 3).map((project) => (
          <div key={project.title}>
            <Thumb project={project} width={350} height={196} time={time} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 15.5, fontWeight: 600 }}>
              {project.title}
              <span style={{ color: SM.plumMuted, fontWeight: 500 }}>{project.year}</span>
            </div>
            <div style={{ fontSize: 13.5, color: SM.plumMuted, marginTop: 2 }}>
              {project.kind} for {project.client}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** A case page on a phone. 390 × 844. */
export function MobileProject({ time = 0 }: { time?: number }) {
  return (
    <div style={{ ...phone, background: SM.plum, color: SM.cream }}>
      <div style={{ position: 'relative', height: 420 }}>
        <SoftScene scene={tideTallScene} width={390} height={420} time={time} material='wax' mood='dusk' />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
          <StatusBar color={SM.cream} time='14:34' />
        </div>
        <div
          style={{
            position: 'absolute',
            top: 54,
            left: 0,
            right: 0,
            height: 52,
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 14.5,
            fontWeight: 600
          }}
        >
          <span>← Work</span>
          <Mark size={20} color={SM.cream} />
        </div>
      </div>
      <div style={{ padding: '24px 20px 0' }}>
        <div style={{ fontSize: 13, opacity: 0.6, fontWeight: 600 }}>Installation · 2024</div>
        <h1 style={{ fontFamily: SM.display, fontWeight: 500, fontSize: 38, letterSpacing: '-0.055em', margin: '8px 0 0' }}>Slow Tide</h1>
        <p style={{ fontSize: 16.5, lineHeight: 1.42, marginTop: 10, letterSpacing: '-0.015em' }}>
          A wall of water that remembers every hand that pushed it.
        </p>
        <div style={{ marginTop: 20 }}>
          {FACTS.slice(0, 4).map(([label, value]) => (
            <div
              key={label}
              style={{
                display: 'grid',
                gridTemplateColumns: '86px 1fr',
                padding: '10px 0',
                borderTop: '1px solid rgba(245,238,228,0.14)',
                fontSize: 13.5,
                lineHeight: 1.35
              }}
            >
              <span style={{ opacity: 0.55, fontWeight: 600 }}>{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
