import type * as React from 'react';
import { BagArt } from './Bag';
import { G, ROAST_ORDER, ROASTS, displayStyle, kr } from './brand';
import { Builder, MethodIcon } from './Builder';
import { Stamp } from './Packaging';

export function Wordmark({ size = 30, color = G.espresso }: { size?: number; color?: string }) {
  return (
    <span style={{ ...displayStyle(900, 144), fontSize: size, letterSpacing: '-0.03em', color, lineHeight: 1 }}>grums</span>
  );
}

/** Announcement bar and navigation, shared by every shop page. */
export function ShopChrome({ active, children }: { active?: string; children: React.ReactNode }) {
  const nav = ['Coffee', 'Subscription', 'Brewing', 'The roastery'];
  return (
    <div style={{ width: '100%', height: '100%', background: G.cream, color: G.espresso, fontFamily: G.sans, overflow: 'hidden' }}>
      <div
        style={{
          height: 32,
          background: G.espresso,
          color: G.cream,
          fontSize: 12.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          letterSpacing: '0.01em'
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: 9, background: G.tomato }} />
        Next roast Monday 4 November. Order by Sunday at 20:00 and it goes in.
      </div>
      <div
        style={{
          height: 66,
          padding: '0 40px',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          borderBottom: `1px solid ${G.line}`
        }}
      >
        <Wordmark size={32} />
        <div style={{ display: 'flex', gap: 30, fontSize: 14.5, fontWeight: 500 }}>
          {nav.map((item) => (
            <span
              key={item}
              style={{
                paddingBottom: 3,
                borderBottom: item === active ? `2px solid ${G.tomato}` : '2px solid transparent'
              }}
            >
              {item}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 22, fontSize: 14 }}>
          <span>Log in</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            Basket
            <span
              style={{
                minWidth: 22,
                height: 22,
                borderRadius: 11,
                background: G.espresso,
                color: G.cream,
                fontSize: 12,
                display: 'grid',
                placeItems: 'center',
                fontWeight: 600
              }}
            >
              0
            </span>
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}

function Button({ children, tone = 'tomato' }: { children: React.ReactNode; tone?: 'tomato' | 'line' }) {
  return (
    <span
      style={{
        height: 48,
        padding: '0 24px',
        borderRadius: 24,
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: 15,
        fontWeight: 600,
        background: tone === 'tomato' ? G.tomato : 'transparent',
        color: tone === 'tomato' ? '#fff8ef' : G.espresso,
        boxShadow: tone === 'line' ? `inset 0 0 0 1.5px ${G.espresso}` : undefined
      }}
    >
      {children}
    </span>
  );
}

/** The shop's front page, designed at 1240 × 760. */
export function ShopHome() {
  return (
    <ShopChrome>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.02fr', gap: 36, padding: '30px 40px 0', height: 404 }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', color: G.muted }}>
            FRESH COFFEE BY SUBSCRIPTION · TRONDHEIM
          </div>
          <h1 style={{ ...displayStyle(900, 144), fontSize: 66, lineHeight: 0.98, letterSpacing: '-0.035em', margin: '16px 0 0' }}>
            Coffee in the amount you drink.
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.5, color: G.muted, margin: '18px 0 0', maxWidth: 470 }}>
            Tell us how many cups, how many of you and how you brew. We roast on Monday and send a bag that runs out
            about when the next one lands.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 26 }}>
            <Button>Build your subscription</Button>
            <Button tone='line'>Shop this week’s coffee</Button>
          </div>
          <div style={{ display: 'flex', gap: 18, marginTop: 20, fontSize: 13, color: G.muted }}>
            <span>From 139 kr a bag</span>
            <span>Letterbox delivery included</span>
            <span>Skip by text</span>
          </div>
        </div>
        <div
          style={{
            position: 'relative',
            borderRadius: 22,
            background: G.tomato,
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: -18,
              top: -38,
              ...displayStyle(900, 144),
              fontSize: 330,
              lineHeight: 1,
              letterSpacing: '-0.06em',
              color: '#cf3622'
            }}
          >
            04.11
          </div>
          <div style={{ position: 'absolute', left: 28, bottom: 24, color: G.cream, fontSize: 13, lineHeight: 1.4 }}>
            <div style={{ fontWeight: 600 }}>This week’s roast</div>
            <div style={{ opacity: 0.8 }}>Monday 4 November 2024</div>
          </div>
          <div style={{ position: 'absolute', right: 26, bottom: 18, display: 'flex', alignItems: 'flex-end', gap: 0 }}>
            <BagArt roast='light' size={500} height={330} yaw={-0.36} shadow='#5c1206' />
            <div style={{ marginLeft: -90 }}>
              <BagArt roast='dark' size={250} height={330} yaw={0.3} shadow='#5c1206' date={{ dd: '31', mon: 'OCT', weekday: 'THURSDAY' }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '26px 40px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ ...displayStyle(800, 72), fontSize: 24, letterSpacing: '-0.02em' }}>This week’s coffee</div>
          <div style={{ fontSize: 13, color: G.muted }}>Four roasts, each dated the day it left the drum</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 14 }}>
          {ROAST_ORDER.map((r, i) => {
            const roast = ROASTS[r];
            const date = i === 2 ? { dd: '31', mon: 'OCT', weekday: 'THURSDAY' } : i === 3 ? { dd: '28', mon: 'OCT', weekday: 'MONDAY' } : { dd: '04', mon: 'NOV', weekday: 'MONDAY' };
            return (
              <div
                key={r}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '104px 1fr',
                  gap: 6,
                  alignItems: 'center',
                  padding: '10px 14px 10px 0',
                  borderRadius: 16,
                  background: G.paper,
                  boxShadow: `0 0 0 1px ${G.line}`
                }}
              >
                <div style={{ marginLeft: -14 }}>
                  <BagArt roast={r} size={250} height={164} width={118} date={date} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: G.muted }}>
                    {roast.label.toUpperCase()} {r === 'decaf' ? '' : 'ROAST'}
                  </div>
                  <div style={{ ...displayStyle(800, 72), fontSize: 20, letterSpacing: '-0.015em', marginTop: 4 }}>{roast.coffee}</div>
                  <div style={{ fontSize: 12.5, marginTop: 2 }}>{roast.origin}</div>
                  <div style={{ fontSize: 12, color: G.muted, marginTop: 2, lineHeight: 1.35 }}>{roast.notes}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>from {kr(roast.price[250])}</span>
                    <span style={{ ...displayStyle(900, 144), fontSize: 15, color: G.tomato }}>
                      {date.dd}.{date.mon === 'NOV' ? '11' : '10'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ShopChrome>
  );
}

function Step({ n, title, body, children }: { n: string; title: string; body: string; children: React.ReactNode }) {
  return (
    <div style={{ background: G.paper, borderRadius: 18, boxShadow: `0 0 0 1px ${G.line}`, padding: 18, display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 112, borderRadius: 12, background: G.cream, display: 'grid', placeItems: 'center', position: 'relative', overflow: 'hidden' }}>
        {children}
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginTop: 14 }}>
        <span style={{ ...displayStyle(900, 144), fontSize: 18, color: G.tomato }}>{n}</span>
        <span style={{ fontSize: 15, fontWeight: 600 }}>{title}</span>
      </div>
      <div style={{ fontSize: 13, color: G.muted, lineHeight: 1.45, marginTop: 4 }}>{body}</div>
    </div>
  );
}

/** The subscription page: how it works, then the builder. 1240 × 760. */
export function SubscribePage() {
  return (
    <ShopChrome active='Subscription'>
      <div style={{ display: 'grid', gridTemplateColumns: '0.86fr 1.6fr', gap: 36, padding: '34px 40px 30px', alignItems: 'end' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', color: G.muted }}>SUBSCRIPTION</div>
          <h1 style={{ ...displayStyle(900, 144), fontSize: 54, lineHeight: 1, letterSpacing: '-0.035em', margin: '14px 0 0' }}>
            A subscription that sizes itself.
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.5, color: G.muted, margin: '14px 0 0' }}>
            No bags piling up, no Friday without coffee. If life changes, reply to a text.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          <Step n='1' title='Tell us how you drink' body='Cups a day, how many of you, how you brew. We do the grams.'>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...displayStyle(800, 72), fontSize: 22 }}>
              <span>2</span>
              <span style={{ fontSize: 14, opacity: 0.5 }}>×</span>
              <span>2</span>
              <span style={{ fontSize: 14, opacity: 0.5 }}>×</span>
              <MethodIcon method='cafetiere' />
              <span style={{ fontSize: 14, opacity: 0.5 }}>=</span>
              <span style={{ color: G.tomato }}>476 g</span>
            </div>
            <div style={{ position: 'absolute', bottom: 12, fontSize: 11.5, color: G.muted }}>a week, so 1 kg every 2 weeks</div>
          </Step>
          <Step n='2' title='We roast on Monday' body='The date on the bag is the day it left the drum. It lands on Wednesday.'>
            <svg width='150' height='100' viewBox='-75 -50 150 100' aria-hidden='true' style={{ overflow: 'visible' }}>
              <Stamp x={0} y={0} r={44} dd='04' mon='NOV' rotate={-8} />
            </svg>
          </Step>
          <Step n='3' title='Skip or nudge by text' body='Two days before each roast we text you. Reply SKIP or LATER.'>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 210 }}>
              <div style={{ alignSelf: 'flex-start', background: '#fff', borderRadius: 14, padding: '7px 11px', fontSize: 11.5, lineHeight: 1.35, boxShadow: `0 0 0 1px ${G.line}` }}>
                La Pradera roasts Monday. Reply SKIP to move it.
              </div>
              <div style={{ alignSelf: 'flex-end', background: G.espresso, color: G.cream, borderRadius: 14, padding: '6px 12px', fontSize: 12, fontWeight: 600 }}>
                LATER
              </div>
            </div>
          </Step>
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${G.line}` }}>
        <Builder initial={{ cups: 2, people: 1, method: 'filter', roast: 'light' }} />
      </div>
    </ShopChrome>
  );
}

