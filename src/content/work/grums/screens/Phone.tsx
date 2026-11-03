import type * as React from 'react';
import { StatusBar } from '~/components/frames/Phone';
import { BagArt } from './Bag';
import { G, displayStyle } from './brand';
import { Wordmark } from './Shop';

const screen: React.CSSProperties = {
  width: 390,
  height: 844,
  background: G.cream,
  color: G.espresso,
  fontFamily: G.sans,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative'
};

/** The “next bag” page on a phone, with Nudge open. 390 × 844. */
export function NextBagScreen() {
  return (
    <div style={screen}>
      <StatusBar color={G.espresso} time='08:12' />
      <div style={{ padding: '6px 22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Wordmark size={26} />
        <span
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            background: G.espresso,
            color: G.cream,
            display: 'grid',
            placeItems: 'center',
            fontSize: 14,
            fontWeight: 600
          }}
        >
          MK
        </span>
      </div>
      <div style={{ padding: '22px 22px 0' }}>
        <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '0.14em', color: G.muted }}>YOUR NEXT BAG</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 6 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, color: G.tomato }}>
              <span style={{ ...displayStyle(900, 144), fontSize: 92, lineHeight: 0.84, letterSpacing: '-0.05em' }}>18</span>
              <span style={{ ...displayStyle(900, 144), fontSize: 28 }}>NOV</span>
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 600, marginTop: 12 }}>Roasted Monday 18 Nov</div>
            <div style={{ fontSize: 14, color: G.muted, marginTop: 2 }}>In your letterbox Wed 20 Nov</div>
          </div>
          <div style={{ marginRight: -14, marginBottom: -6 }}>
            <BagArt roast='medium' size={500} height={176} date={{ dd: '18', mon: 'NOV', weekday: 'MONDAY' }} method='cafetiere' />
          </div>
        </div>
      </div>
      <div style={{ margin: '18px 22px 0', padding: '12px 14px', borderRadius: 14, background: G.paper, boxShadow: `0 0 0 1px ${G.line}`, fontSize: 13.5, lineHeight: 1.4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 600 }}>500 g La Pradera</span>
          <span>269 kr</span>
        </div>
        <div style={{ color: G.muted }}>Every 2 weeks · cafetière, 2 cups a day</div>
      </div>
      <div style={{ margin: '12px 22px 0', padding: '12px 14px 14px', borderRadius: 14, background: G.paper, boxShadow: `0 0 0 1px ${G.line}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
          <span style={{ fontWeight: 600 }}>Left in the open bag</span>
          <span style={{ color: G.muted }}>about 140 g</span>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: '#eadfcd', marginTop: 10, overflow: 'hidden' }}>
          <div style={{ width: '28%', height: '100%', background: G.kraft }} />
        </div>
        <div style={{ fontSize: 12.5, color: G.muted, marginTop: 8 }}>Enough until Saturday, if you keep to 2 cups a day.</div>
      </div>

      <div style={{ margin: '18px 22px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div
          style={{ height: 50, borderRadius: 25, boxShadow: `inset 0 0 0 1.5px ${G.espresso}`, display: 'grid', placeItems: 'center', fontSize: 15, fontWeight: 600 }}
        >
          Skip this one
        </div>
        <div style={{ height: 50, borderRadius: 25, background: G.espresso, color: G.cream, display: 'grid', placeItems: 'center', fontSize: 15, fontWeight: 600 }}>
          Nudge
        </div>
      </div>
      <div style={{ margin: '10px 22px 0', borderRadius: 16, background: G.paper, boxShadow: `0 0 0 1px ${G.line}`, overflow: 'hidden' }}>
        {[
          ['3 days sooner', 'Roasted Thursday 14 Nov', false],
          ['A week later', 'Roasted Monday 25 Nov', true]
        ].map(([title, note, on], i) => (
          <div
            key={String(title)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              borderTop: i ? `1px solid ${G.line}` : undefined,
              background: on ? '#f6ece0' : undefined
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                boxShadow: `inset 0 0 0 ${on ? 6 : 1.5}px ${on ? G.tomato : G.lineStrong}`,
                flex: 'none'
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600 }}>{title}</div>
              <div style={{ fontSize: 12.5, color: G.muted }}>{note}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 'auto', padding: '0 22px 34px' }}>
        <div style={{ height: 52, borderRadius: 26, background: G.tomato, color: '#fff8ef', display: 'grid', placeItems: 'center', fontSize: 15.5, fontWeight: 600 }}>
          Move to Monday 25 November
        </div>
        <div style={{ fontSize: 12, color: G.muted, textAlign: 'center', marginTop: 10 }}>The bag after that moves with it, to 9 December.</div>
      </div>
    </div>
  );
}

function Bubble({ children, out, tail }: { children: React.ReactNode; out?: boolean; tail?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: out ? 'flex-end' : 'flex-start', padding: '0 14px', marginTop: tail ? 2 : 8 }}>
      <div
        style={{
          maxWidth: 270,
          padding: '9px 13px',
          borderRadius: 19,
          borderBottomLeftRadius: !out ? 6 : 19,
          borderBottomRightRadius: out ? 6 : 19,
          background: out ? '#34c759' : '#e9e9eb',
          color: out ? '#fff' : '#111',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 16,
          lineHeight: 1.3,
          letterSpacing: '-0.01em'
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** The text Grums sends two days before a roast, and the reply. 390 × 844. */
export function SmsScreen() {
  return (
    <div style={{ ...screen, background: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <StatusBar color='#000' time='09:04' />
      <div style={{ padding: '4px 14px 10px', borderBottom: '1px solid #e5e5ea', background: '#f7f7f8', position: 'relative' }}>
        <svg width='12' height='20' viewBox='0 0 12 20' style={{ position: 'absolute', left: 16, top: 22 }} aria-hidden='true'>
          <path d='M10 2 2 10l8 8' fill='none' stroke='#0a7aff' strokeWidth='2.6' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              background: G.tomato,
              color: G.cream,
              display: 'grid',
              placeItems: 'center',
              ...displayStyle(900, 144),
              fontSize: 26,
              lineHeight: 1,
              paddingBottom: 6
            }}
          >
            g
          </span>
          <span style={{ fontSize: 12.5, color: '#111' }}>Grums · 2290</span>
        </div>
      </div>
      <div style={{ fontSize: 12, color: '#8a8a8e', textAlign: 'center', margin: '14px 0 4px' }}>
        <strong style={{ fontWeight: 600 }}>Text Message</strong>
        <br />
        Sat 16 Nov at 09:00
      </div>
      <Bubble>Hei Marte. Your next bag, 500 g of La Pradera, roasts on Monday 18 Nov and lands on Wednesday.</Bubble>
      <Bubble tail>Reply SKIP to move this delivery to 2 Dec, or LATER to push it a week.</Bubble>
      <div style={{ fontSize: 12, color: '#8a8a8e', textAlign: 'center', margin: '16px 0 2px' }}>Sat 16 Nov at 09:03</div>
      <Bubble out>LATER</Bubble>
      <Bubble>Done. La Pradera now roasts on Monday 25 Nov and lands on Wednesday 27 Nov. The one after moves too, to 9 Dec.</Bubble>
      <Bubble out>Takk!</Bubble>
      <div style={{ fontSize: 11.5, color: '#8a8a8e', textAlign: 'right', padding: '3px 18px 0' }}>Delivered</div>
      <div style={{ marginTop: 'auto', padding: '8px 12px 34px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 34, height: 34, borderRadius: 17, background: '#e9e9eb', display: 'grid', placeItems: 'center' }}>
          <svg width='14' height='14' viewBox='0 0 14 14' aria-hidden='true'>
            <path d='M7 1v12M1 7h12' stroke='#8a8a8e' strokeWidth='1.8' strokeLinecap='round' />
          </svg>
        </span>
        <span style={{ flex: 1, height: 36, borderRadius: 18, boxShadow: 'inset 0 0 0 1px #d1d1d6', padding: '0 14px', display: 'flex', alignItems: 'center', fontSize: 16, color: '#b0b0b5' }}>
          Text Message
        </span>
      </div>
    </div>
  );
}
