import type * as React from 'react';
import { K, NAMED, head, label } from './model';
import { Avatar, Button, FlatTag, Icon, NavBar, Screen } from './ui';

const BOARD: Record<string, string> = { H0101: 'Chair', H0214: 'Secretary', H0303: 'Treasurer' };

function Row({ flat, you }: { flat: string; you?: boolean }) {
  const name = NAMED[flat];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr auto', gap: 12, alignItems: 'center', padding: '9px 0', borderTop: `1px solid ${K.line}` }}>
      <Avatar flat={flat} name={name} size={36} />
      <span style={{ minWidth: 0 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 15, fontWeight: 600 }}>
          {name ?? flat}
          {BOARD[flat] ? <span style={{ ...label(9.5, K.paper), background: K.brick, padding: '3px 5px 2px', borderRadius: 4 }}>Styret</span> : null}
        </span>
        <span style={{ display: 'block', fontSize: 13, color: K.muted, marginTop: 1 }}>
          {you ? 'You, shown by flat number' : name ? `${flat}${BOARD[flat] ? ` · ${BOARD[flat]}` : ''}` : 'Shows flat number only'}
        </span>
      </span>
      {name || you ? null : <span />}
      {name ? <Icon name='chevron' size={18} color={K.faint} /> : null}
    </div>
  );
}

/** Neighbours: flat numbers by default, names for those who chose to show them. 390 × 844. */
export function DirectoryScreen() {
  const floors: [string, string[]][] = [
    ['Third floor', ['H0301', 'H0302', 'H0303', 'H0304']],
    ['Second floor', ['H0201', 'H0202', 'H0203', 'H0204']]
  ];
  return (
    <Screen tab='Neighbours'>
      <div style={{ padding: '10px 22px 0' }}>
        <div style={{ ...head(44, 800) }}>Neighbours</div>
        <div
          style={{
            marginTop: 14,
            height: 44,
            borderRadius: 14,
            background: K.card,
            boxShadow: `inset 0 0 0 1px ${K.line}`,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 14px',
            color: K.faint,
            fontSize: 15
          }}
        >
          <Icon name='search' size={19} /> Flat number or name
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
          {['Number 12', 'Whole co-op', 'Styret'].map((tab, index) => (
            <span
              key={tab}
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                padding: '7px 12px',
                borderRadius: 999,
                background: index === 0 ? K.ink : 'transparent',
                color: index === 0 ? K.paper : K.ink,
                boxShadow: index === 0 ? 'none' : `inset 0 0 0 1px ${K.lineStrong}`
              }}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>
      <div style={{ padding: '8px 22px 0' }}>
        {floors.map(([floor, flats]) => (
          <div key={floor} style={{ marginTop: 12 }}>
            <div style={{ ...label(11), marginBottom: 4 }}>{floor}</div>
            {flats.map((flat) => (
              <Row key={flat} flat={flat} you={flat === 'H0204'} />
            ))}
          </div>
        ))}
      </div>
    </Screen>
  );
}

function Choice({ title, preview, selected }: { title: string; preview: React.ReactNode; selected?: boolean }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '24px 1fr',
        gap: 12,
        alignItems: 'center',
        padding: '13px 14px',
        borderRadius: 16,
        background: K.card,
        boxShadow: selected ? `inset 0 0 0 2px ${K.ink}` : `inset 0 0 0 1px ${K.line}`
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          boxShadow: selected ? `inset 0 0 0 7px ${K.ink}` : `inset 0 0 0 2px ${K.lineStrong}`
        }}
      />
      <span>
        <span style={{ display: 'block', fontSize: 15, fontWeight: 600 }}>{title}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 7 }}>{preview}</span>
      </span>
    </div>
  );
}

function Toggle({ on }: { on?: boolean }) {
  return (
    <span style={{ width: 46, height: 28, borderRadius: 14, background: on ? K.moss : K.paperDeep, position: 'relative', flex: 'none' }}>
      <span style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 22, height: 22, borderRadius: 11, background: K.card, boxShadow: '0 1px 2px rgba(30,41,68,0.25)' }} />
    </span>
  );
}

/** How neighbours see you. Flat number is the default. 390 × 844. */
export function PrivacyScreen() {
  return (
    <Screen>
      <NavBar title='Privacy' />
      <div style={{ padding: '6px 22px 0' }}>
        <div style={{ ...head(40, 800) }}>How neighbours see you</div>
        <div style={{ fontSize: 15, lineHeight: 1.42, marginTop: 10, color: K.muted, textWrap: 'pretty' }}>
          In bookings, posts and the directory. You can change it any time.
        </div>
      </div>
      <div style={{ padding: '18px 16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Choice
          selected
          title='Flat number only'
          preview={
            <>
              <Avatar flat='H0204' size={24} />
              <span style={{ fontSize: 14, fontWeight: 600 }}>H0204</span>
            </>
          }
        />
        <Choice
          title='First name and flat'
          preview={
            <>
              <Avatar flat='H0204' name='Ida Berg' size={24} />
              <span style={{ fontSize: 14, fontWeight: 600 }}>Ida · H0204</span>
            </>
          }
        />
        <Choice
          title='Full name and flat'
          preview={
            <>
              <Avatar flat='H0204' name='Ida Berg' size={24} />
              <span style={{ fontSize: 14, fontWeight: 600 }}>Ida Berg · H0204</span>
            </>
          }
        />
      </div>
      <div style={{ padding: '14px 22px 0' }}>
        {[
          ['Neighbours can message me', true],
          ['Show me in the directory', true]
        ].map(([text, on]) => (
          <div key={String(text)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: `1px solid ${K.line}`, fontSize: 15 }}>
            {text}
            <Toggle on={Boolean(on)} />
          </div>
        ))}
      </div>
      <div style={{ margin: '6px 16px 0', padding: '14px 16px', borderRadius: 16, background: K.paperDeep }}>
        <div style={{ fontSize: 13, color: K.muted }}>Your laundry booking, as neighbours see it</div>
        <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: 8, marginTop: 10, fontSize: 12.5, color: K.muted }}>
          <span style={{ paddingTop: 6 }}>10</span>
          <span style={{ height: 30, borderRadius: '8px 8px 0 0', background: K.card, color: K.ink, display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: 13.5, fontWeight: 600 }}>H0204</span>
          <span style={{ paddingTop: 6 }}>11</span>
          <span style={{ height: 30, borderRadius: '0 0 8px 8px', background: K.card }} />
        </div>
      </div>
      <div style={{ margin: '14px 22px 0', display: 'grid', gridTemplateColumns: '22px 1fr', gap: 10, fontSize: 13.5, lineHeight: 1.4, color: K.muted }}>
        <Icon name='eye' size={20} color={K.muted} />
        <span>Styret always knows who lives in each flat. That comes from the share register, not from this app.</span>
      </div>
    </Screen>
  );
}

/** A flat door with its number plate, for onboarding. */
function Door() {
  return (
    <svg width='150' height='170' viewBox='0 0 150 170' aria-hidden='true' style={{ display: 'block' }}>
      <rect x='0' y='160' width='150' height='10' rx='2' fill={K.paperDeep} />
      <rect x='22' y='6' width='106' height='156' rx='3' fill={K.card} stroke={K.ink} strokeWidth='2.5' />
      <rect x='32' y='16' width='86' height='146' rx='2' fill={K.brick} stroke={K.ink} strokeWidth='2.5' />
      <rect x='48' y='36' width='54' height='22' rx='3' fill={K.card} stroke={K.ink} strokeWidth='2' />
      <text x='75' y='52' textAnchor='middle' fontFamily="'Bricolage Grotesque', sans-serif" fontWeight={750} fontStretch='80%' fontSize='14' fill={K.ink}>
        H0204
      </text>
      <circle cx='75' cy='76' r='4' fill={K.ink} />
      <rect x='98' y='92' width='12' height='4' rx='2' fill={K.yellow} stroke={K.ink} strokeWidth='1.6' />
      <circle cx='104' cy='106' r='2.5' fill={K.ink} />
      <rect x='46' y='120' width='58' height='8' rx='2' fill={K.brickDeep} />
    </svg>
  );
}

/** Joining: which flat is yours. 390 × 844. */
export function OnboardingFlatScreen() {
  return (
    <Screen>
      <div style={{ padding: '14px 22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13.5, color: K.muted }}>Step 2 of 3</span>
        <span style={{ display: 'flex', gap: 4 }}>
          {[1, 2, 3].map((step) => (
            <span key={step} style={{ width: 22, height: 4, borderRadius: 2, background: step <= 2 ? K.ink : K.paperDeep }} />
          ))}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '22px 0 4px' }}>
        <Door />
      </div>
      <div style={{ padding: '14px 22px 0' }}>
        <div style={{ ...head(40, 800) }}>Which flat is yours?</div>
        <div style={{ fontSize: 15, lineHeight: 1.42, marginTop: 8, color: K.muted, textWrap: 'pretty' }}>
          It’s on your door and on the letter from the co-op: H, then the floor, then the flat.
        </div>
      </div>
      <div style={{ padding: '18px 22px 0' }}>
        <div style={{ ...label(11), marginBottom: 6 }}>Address</div>
        <div style={{ height: 50, borderRadius: 14, background: K.card, boxShadow: `inset 0 0 0 1px ${K.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', fontSize: 16 }}>
          Fjellhagen 12 <Icon name='chevron' size={18} color={K.faint} />
        </div>
        <div style={{ ...label(11), margin: '14px 0 6px' }}>Flat number</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
          {['H', '0', '2', '0', '4'].map((char, index) => (
            <span
              key={index}
              style={{
                height: 58,
                borderRadius: 14,
                background: index === 0 ? K.paperDeep : K.card,
                boxShadow: index === 4 ? `inset 0 0 0 2px ${K.ink}` : `inset 0 0 0 1px ${K.line}`,
                display: 'grid',
                placeItems: 'center',
                ...head(30, 760),
                color: index === 0 ? K.muted : K.ink
              }}
            >
              {char}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 13.5, color: K.moss, marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
          <Icon name='check' size={16} stroke={2.6} /> Second floor, number 12
        </div>
      </div>
      <div style={{ marginTop: 'auto', padding: '0 18px 38px' }}>
        <Button tone='ink'>Continue</Button>
      </div>
    </Screen>
  );
}

/** Joining: styret confirms you live there. 390 × 844. */
export function OnboardingVerifyScreen() {
  const steps = [
    { title: 'Ida Berg, H0204', note: 'Fjellhagen 12, second floor', state: 'done' },
    { title: 'Styret checks the share register', note: 'Usually the same day. Tone or Hanne will do it.', state: 'now' },
    { title: 'You’re in', note: 'Notices, bookings and the annual meeting', state: 'next' }
  ];
  return (
    <Screen>
      <div style={{ padding: '14px 22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13.5, color: K.muted }}>Step 3 of 3</span>
        <span style={{ display: 'flex', gap: 4 }}>
          {[1, 2, 3].map((step) => (
            <span key={step} style={{ width: 22, height: 4, borderRadius: 2, background: K.ink }} />
          ))}
        </span>
      </div>
      <div style={{ padding: '30px 22px 0' }}>
        <div style={{ ...head(42, 800), textWrap: 'balance' }}>Styret checks that it’s you</div>
        <div style={{ fontSize: 15, lineHeight: 1.42, marginTop: 10, color: K.muted, textWrap: 'pretty' }}>
          Only people who live here can read notices and vote. Nobody else in the co-op sees this request.
        </div>
      </div>
      <div style={{ padding: '22px 22px 0' }}>
        {steps.map((step, index) => (
          <div key={step.title} style={{ display: 'grid', gridTemplateColumns: '30px 1fr', gap: 12, paddingBottom: 18, position: 'relative' }}>
            {index < steps.length - 1 ? <span style={{ position: 'absolute', left: 14, top: 30, bottom: 0, width: 2, background: index === 0 ? K.moss : K.paperDeep }} /> : null}
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                display: 'grid',
                placeItems: 'center',
                background: step.state === 'done' ? K.moss : step.state === 'now' ? K.yellow : K.paperDeep,
                color: step.state === 'done' ? K.paper : K.ink,
                fontWeight: 700,
                fontSize: 14,
                position: 'relative'
              }}
            >
              {step.state === 'done' ? <Icon name='check' size={17} stroke={2.6} /> : index + 1}
            </span>
            <span>
              <span style={{ display: 'block', fontSize: 16, fontWeight: 650 }}>{step.title}</span>
              <span style={{ display: 'block', fontSize: 13.5, color: K.muted, marginTop: 2, lineHeight: 1.35 }}>{step.note}</span>
            </span>
          </div>
        ))}
      </div>
      <div style={{ margin: '4px 16px 0', padding: '16px 16px 18px', borderRadius: 18, background: K.card, boxShadow: `inset 0 0 0 1px ${K.line}` }}>
        <div style={{ fontSize: 15, fontWeight: 650 }}>Faster: the code from your letter</div>
        <div style={{ fontSize: 13.5, color: K.muted, marginTop: 3 }}>Styret put one in every postbox in March.</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6, marginTop: 12 }}>
          {['4', '8', '1', '', '', ''].map((char, index) => (
            <span
              key={index}
              style={{
                height: 50,
                borderRadius: 12,
                background: K.paper,
                boxShadow: index === 3 ? `inset 0 0 0 2px ${K.ink}` : `inset 0 0 0 1px ${K.line}`,
                display: 'grid',
                placeItems: 'center',
                ...head(26, 740)
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 'auto', padding: '0 18px 38px', display: 'flex', justifyContent: 'center' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <FlatTag flat='H0204' tone='mine' />
          <span style={{ fontSize: 13.5, color: K.muted }}>We’ll let you know when you’re in</span>
        </span>
      </div>
    </Screen>
  );
}
