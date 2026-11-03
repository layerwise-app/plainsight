import { K, head, label } from './model';
import { Avatar, Button, Icon, NavBar, Screen } from './ui';

export type FaultKind = 'water' | 'heating' | 'lights' | 'doors' | 'laundry' | 'bins' | 'outdoors' | 'windows' | 'other';

export const FAULTS: { kind: FaultKind; name: string }[] = [
  { kind: 'water', name: 'Water and drains' },
  { kind: 'heating', name: 'Heating' },
  { kind: 'lights', name: 'Lights' },
  { kind: 'doors', name: 'Doors and locks' },
  { kind: 'laundry', name: 'Laundry machines' },
  { kind: 'bins', name: 'Bins and recycling' },
  { kind: 'windows', name: 'Windows and balconies' },
  { kind: 'outdoors', name: 'Courtyard and garden' },
  { kind: 'other', name: 'Something else' }
];

const S = { stroke: K.ink, strokeWidth: 1.6, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

/** One drawing per kind of fault, so nobody needs a photo to say what’s wrong. 40 × 40. */
export function FaultArt({ kind, size = 56, tile = true }: { kind: FaultKind; size?: number; tile?: boolean }) {
  const bg: Record<FaultKind, string> = {
    water: K.paperDeep,
    heating: K.brickSoft,
    lights: K.dusk,
    doors: K.mossSoft,
    laundry: K.paperDeep,
    bins: K.yellowSoft,
    windows: K.brickSoft,
    outdoors: K.mossSoft,
    other: K.card
  };
  return (
    <svg width={size} height={size} viewBox='0 0 40 40' aria-hidden='true' style={{ display: 'block', flex: 'none' }}>
      {tile ? <rect width='40' height='40' rx='10' fill={bg[kind]} stroke={kind === 'other' ? K.lineStrong : 'none'} /> : null}
      {kind === 'water' ? (
        <g {...S}>
          <path d='M6 12h12a4 4 0 0 1 4 4v3h-4v-2.5a1 1 0 0 0-1-1H6z' fill={K.card} />
          <path d='M13 12V9M9.5 8.5h7' fill='none' />
          <path d='M20 24.5s-3.2 3.6-3.2 5.8a3.2 3.2 0 0 0 6.4 0c0-2.2-3.2-5.8-3.2-5.8z' fill={K.dusk} />
          <path d='M28 30h6M30 26h4' fill='none' stroke={K.dusk} />
        </g>
      ) : null}
      {kind === 'heating' ? (
        <g {...S}>
          <rect x='7' y='19' width='26' height='13' rx='2.5' fill={K.card} />
          <path d='M12.5 19v13M17.5 19v13M22.5 19v13M27.5 19v13M9 32v2M31 32v2' fill='none' />
          <path d='M13 15c-1.4-1.6 1.4-2.4 0-4.5M20 15c-1.4-1.6 1.4-2.4 0-4.5M27 15c-1.4-1.6 1.4-2.4 0-4.5' fill='none' stroke={K.brick} strokeWidth='1.8' />
        </g>
      ) : null}
      {kind === 'lights' ? (
        <g {...S} stroke={K.paper}>
          <path d='M20 7v3' fill='none' />
          <path d='M14 17a6 6 0 0 1 12 0c0 3-2.4 4.4-2.8 7h-6.4c-.4-2.6-2.8-4-2.8-7z' fill={K.yellow} stroke={K.yellow} />
          <path d='M17 27.5h6M17.6 30.5h4.8' fill='none' />
          <path d='M9 13l2 1M31 13l-2 1M8 21h2.5M32 21h-2.5' fill='none' stroke={K.yellow} />
        </g>
      ) : null}
      {kind === 'doors' ? (
        <g {...S}>
          <rect x='9' y='6' width='16' height='28' rx='1.5' fill={K.brick} />
          <circle cx='21.5' cy='21' r='1.3' fill={K.yellow} stroke='none' />
          <rect x='13' y='10' width='8' height='3.5' rx='0.8' fill={K.card} />
          <circle cx='29.5' cy='26' r='3.6' fill={K.yellow} />
          <path d='M29.5 29.6V35M29.5 33h2' fill='none' />
        </g>
      ) : null}
      {kind === 'laundry' ? (
        <g {...S}>
          <rect x='10' y='7' width='20' height='26' rx='3' fill={K.card} />
          <path d='M10 13h20' fill='none' />
          <circle cx='14' cy='10' r='0.5' fill={K.ink} />
          <circle cx='20' cy='23' r='6.5' fill={K.dusk} />
          <path d='M15.5 24.5c1.6 1.4 3.2-1.2 4.6.2 1.4 1.4 2.9-.9 4.4.2' fill='none' stroke={K.yellow} strokeWidth='1.4' />
        </g>
      ) : null}
      {kind === 'bins' ? (
        <g {...S}>
          <path d='M7.5 14h11l-1.3 19h-8.4z' fill={K.moss} />
          <path d='M6.5 11.5h13v2.5h-13z' fill={K.moss} />
          <path d='M21.5 14h11l-1.3 19h-8.4z' fill={K.dusk} />
          <path d='M20.5 11.5h13v2.5h-13z' fill={K.dusk} />
          <path d='M11 19v9M15 19v9' fill='none' stroke={K.mossSoft} strokeWidth='1.3' />
          <path d='M25 19v9M29 19v9' fill='none' stroke='rgba(243,236,225,0.5)' strokeWidth='1.3' />
        </g>
      ) : null}
      {kind === 'windows' ? (
        <g {...S}>
          <rect x='8' y='7' width='24' height='19' rx='1' fill={K.card} />
          <rect x='10.5' y='9.5' width='8.5' height='14' fill={K.yellow} stroke='none' />
          <rect x='21' y='9.5' width='8.5' height='14' fill={K.dusk} stroke='none' />
          <path d='M20 7v19' fill='none' />
          <path d='M5 27h30v6H5z' fill={K.moss} />
          <path d='M12 27v6M20 27v6M28 27v6' fill='none' stroke={K.mossSoft} strokeWidth='1.2' />
        </g>
      ) : null}
      {kind === 'outdoors' ? (
        <g {...S}>
          <path d='M25 33V22' fill='none' />
          <circle cx='25' cy='15' r='8' fill={K.moss} />
          <circle cx='22' cy='12.5' r='2.4' fill={K.mossSoft} stroke='none' opacity='0.7' />
          <path d='M5 25h14M6 28.5h12M8 25v8M16 25v8' fill='none' stroke={K.brick} strokeWidth='1.8' />
          <path d='M4 33h32' fill='none' />
        </g>
      ) : null}
      {kind === 'other' ? (
        <g fill={K.ink}>
          <circle cx='13' cy='20' r='2' />
          <circle cx='20' cy='20' r='2' />
          <circle cx='27' cy='20' r='2' />
        </g>
      ) : null}
    </svg>
  );
}

/** Report: pick what’s wrong from drawings. 390 × 844. */
export function FaultCategoriesScreen() {
  return (
    <Screen tab='Report'>
      <div style={{ padding: '12px 22px 0' }}>
        <span style={label(11.5)}>Report a fault</span>
        <div style={{ ...head(44, 800), marginTop: 8 }}>What needs fixing?</div>
        <div style={{ fontSize: 15, lineHeight: 1.4, marginTop: 8, color: K.muted }}>Pick the closest one. No photo needed.</div>
      </div>
      <div style={{ padding: '18px 14px 0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {FAULTS.map((fault) => (
          <div
            key={fault.kind}
            style={{
              borderRadius: 18,
              background: fault.kind === 'lights' ? K.card : K.card,
              boxShadow: fault.kind === 'lights' ? `inset 0 0 0 2px ${K.ink}` : `inset 0 0 0 1px ${K.line}`,
              padding: '12px 10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              minHeight: 118
            }}
          >
            <FaultArt kind={fault.kind} size={52} />
            <span style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.2, fontStretch: '92%' }}>{fault.name}</span>
          </div>
        ))}
      </div>
      <div
        style={{
          margin: '12px 14px 0',
          padding: '13px 14px',
          borderRadius: 18,
          background: K.brickSoft,
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 12,
          alignItems: 'center'
        }}
      >
        <span style={{ fontSize: 13.5, lineHeight: 1.35 }}>
          <b style={{ fontWeight: 650 }}>Burst pipe or no heat?</b> Call the caretaker on duty, day or night.
        </span>
        <span style={{ fontSize: 14, fontWeight: 650, color: K.paper, background: K.brick, padding: '8px 14px', borderRadius: 12 }}>Call</span>
      </div>
      <div style={{ padding: '16px 22px 0' }}>
        <div style={{ ...label(11), marginBottom: 2 }}>Your reports</div>
        {[
          ['lights', 'Light out on the third-floor landing', 'Fixed', K.moss],
          ['laundry', 'Machine 2 stops at the spin', 'Booked Fri', K.ink]
        ].map(([kind, title, state, color]) => (
          <div key={title} style={{ display: 'grid', gridTemplateColumns: '28px 1fr auto', gap: 10, alignItems: 'center', padding: '8px 0', borderTop: `1px solid ${K.line}` }}>
            <FaultArt kind={kind as FaultKind} size={28} />
            <span style={{ fontSize: 14, fontWeight: 550 }}>{title}</span>
            <span style={{ fontSize: 12.5, fontWeight: 650, color }}>{state}</span>
          </div>
        ))}
      </div>
    </Screen>
  );
}

const STEPS = [
  { title: 'Reported', when: 'Mon 20 April, 22:14', who: 'You, H0204', note: 'Light on the third-floor landing, number 12. Stays off when you walk past.' },
  { title: 'Seen by styret', when: 'Tue 21 April, 08:02', who: 'Hanne Sæther', flat: 'H0214' },
  { title: 'With the caretaker', when: 'Tue 21 April, 10:30', who: 'Fjellhagen Drift', note: 'Booked for Thursday.' },
  { title: 'Fixed', when: 'Thu 23 April, 14:05', who: 'Fjellhagen Drift', note: 'Replaced the motion sensor.' }
];

/** A reported fault, from report to fixed. 390 × 844. */
export function FaultStatusScreen() {
  return (
    <Screen>
      <NavBar title='Fault #118' />
      <div style={{ padding: '8px 22px 0', display: 'grid', gridTemplateColumns: '1fr 56px', gap: 14, alignItems: 'start' }}>
        <div>
          <span style={{ ...label(10.5, K.paper), background: K.moss, padding: '4px 7px 3px', borderRadius: 5 }}>Fixed</span>
          <div style={{ ...head(34, 790), marginTop: 12, textWrap: 'balance' }}>Light out on the third-floor landing</div>
        </div>
        <FaultArt kind='lights' size={56} />
      </div>
      <div style={{ margin: '16px 16px 0', padding: '12px 14px', borderRadius: 16, background: K.yellowSoft, fontSize: 13.5, lineHeight: 1.4 }}>
        H0301 and H0402 reported it too. Kvarter put the three reports together, so styret fixed it once.
      </div>
      <div style={{ padding: '20px 22px 0' }}>
        {STEPS.map((step, index) => {
          const last = index === STEPS.length - 1;
          return (
            <div key={step.title} style={{ display: 'grid', gridTemplateColumns: '22px 1fr', gap: 12 }}>
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    marginTop: 3,
                    background: last ? K.moss : K.ink,
                    boxShadow: last ? `0 0 0 4px ${K.mossSoft}` : 'none',
                    position: 'relative',
                    zIndex: 1
                  }}
                />
                {last ? null : <span style={{ position: 'absolute', top: 14, bottom: -4, width: 2, background: K.ink }} />}
              </div>
              <div style={{ paddingBottom: last ? 0 : 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 15.5, fontWeight: 650 }}>{step.title}</span>
                  <span style={{ fontSize: 12.5, color: K.muted, whiteSpace: 'nowrap' }}>{step.when}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: K.muted, marginTop: 3 }}>
                  {step.flat ? <Avatar flat={step.flat} name={step.who} size={18} /> : null}
                  {step.who}
                </div>
                {step.note ? <div style={{ fontSize: 14, lineHeight: 1.4, marginTop: 5 }}>{step.note}</div> : null}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 'auto', padding: '0 18px 38px' }}>
        <div style={{ fontSize: 14, fontWeight: 600, textAlign: 'center', marginBottom: 12 }}>Is the light working again?</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Button tone='ghost'>Not quite</Button>
          <Button tone='moss'>
            <Icon name='check' size={18} stroke={2.6} /> Yes, thanks
          </Button>
        </div>
      </div>
    </Screen>
  );
}
