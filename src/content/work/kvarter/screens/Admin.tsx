import type * as React from 'react';
import { K, head, label } from './model';
import { Avatar, Icon, Mark } from './ui';

const NAV: [string, string?][] = [
  ['Overview'],
  ['Notices'],
  ['Bookings'],
  ['Faults', '3'],
  ['Annual meeting'],
  ['Residents'],
  ['Documents']
];

function Field({ name, children, tall }: { name: string; children: React.ReactNode; tall?: boolean }) {
  return (
    <div>
      <div style={{ ...label(10.5), marginBottom: 6 }}>{name}</div>
      <div
        style={{
          borderRadius: 10,
          background: K.card,
          boxShadow: `inset 0 0 0 1px ${K.line}`,
          padding: tall ? '12px 14px' : '0 14px',
          minHeight: tall ? 0 : 42,
          display: tall ? 'block' : 'flex',
          alignItems: 'center',
          fontSize: 14,
          lineHeight: 1.5
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Check({ on, children, note }: { on?: boolean; children: React.ReactNode; note?: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '22px 1fr', gap: 10, alignItems: 'start', fontSize: 14 }}>
      <span
        style={{
          width: 18,
          height: 18,
          marginTop: 1,
          borderRadius: 5,
          background: on ? K.ink : K.card,
          boxShadow: on ? 'none' : `inset 0 0 0 1.5px ${K.lineStrong}`,
          color: K.paper,
          display: 'grid',
          placeItems: 'center'
        }}
      >
        {on ? <Icon name='check' size={13} stroke={3} /> : null}
      </span>
      <span>
        {children}
        {note ? <span style={{ display: 'block', fontSize: 12.5, color: K.muted, marginTop: 2 }}>{note}</span> : null}
      </span>
    </div>
  );
}

const RECENT = [
  ['Spring dugnad, Sunday 26 April', '14 Apr', 61],
  ['Annual meeting: invitation and proposals', '7 Apr', 58],
  ['New lint filters in both laundry rooms', '2 Apr', 49],
  ['Bike shed clear-out before 15 May', '24 Mar', 55]
] as const;

/** Styret’s side: writing a notice and seeing who it reaches. Designed at 1240 × 760. */
export function AdminScreen() {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: K.paper, color: K.ink, fontFamily: K.sans, fontSize: 14 }}>
      <aside style={{ width: 216, flex: 'none', background: K.dusk, color: K.paper, padding: '20px 12px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 24px' }}>
          <Mark size={28} />
          <span>
            <span style={{ display: 'block', ...head(20, 800) }}>Kvarter</span>
            <span style={{ display: 'block', fontSize: 12, color: 'rgba(243,236,225,0.6)', marginTop: 1 }}>Styret · Fjellhagen</span>
          </span>
        </div>
        {NAV.map(([item, badge]) => (
          <div
            key={item}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: 36,
              padding: '0 10px',
              borderRadius: 8,
              fontSize: 14,
              color: item === 'Notices' ? K.ink : 'rgba(243,236,225,0.78)',
              background: item === 'Notices' ? K.paper : 'transparent',
              fontWeight: item === 'Notices' ? 650 : 450
            }}
          >
            {item}
            {badge ? (
              <span style={{ fontSize: 11.5, fontWeight: 700, color: K.ink, background: K.yellow, borderRadius: 5, padding: '1px 6px' }}>{badge}</span>
            ) : null}
          </div>
        ))}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 8px 0', borderTop: '1px solid rgba(243,236,225,0.14)' }}>
          <Avatar flat='H0101' name='Tone Bakke' size={30} color={K.brick} />
          <span>
            <span style={{ display: 'block', fontSize: 13.5 }}>Tone Bakke</span>
            <span style={{ display: 'block', fontSize: 12, color: 'rgba(243,236,225,0.6)' }}>Chair · H0101</span>
          </span>
        </div>
      </aside>

      <main style={{ flex: 1, minWidth: 0, padding: '22px 28px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 12.5, color: K.muted }}>Notices</div>
            <div style={{ ...head(32, 800), marginTop: 2 }}>New notice</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ fontSize: 13.5, padding: '9px 14px', borderRadius: 10, boxShadow: `inset 0 0 0 1px ${K.lineStrong}` }}>Save draft</span>
            <span style={{ fontSize: 13.5, fontWeight: 650, padding: '9px 16px', borderRadius: 10, background: K.brick, color: K.paper }}>Send to 64 flats</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 18 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field name='Title'>
              <span style={{ fontWeight: 600 }}>Water off Tuesday 28 April, 09–12</span>
            </Field>
            <Field name='Message' tall>
              <p style={{ margin: 0 }}>
                Nordby Rør is replacing the main water valve in the basement. All 64 flats will be without water from 09:00 to
                12:00.
              </p>
              <p style={{ margin: '8px 0 0' }}>On Monday night, fill a jug for drinking and a bucket for the toilet.</p>
              <p style={{ margin: '8px 0 0', color: K.muted }}>Tone Bakke, for styret</p>
            </Field>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '4px 2px 0' }}>
              <Check on note='Three bookings in that window. We’ll move them and tell those flats.'>
                Close both laundry rooms from 09 to 12
              </Check>
              <Check on note='Comes down by itself at 12:00 on Tuesday.'>
                Pin to the top of everyone’s home screen
              </Check>
              <Check>Allow replies from residents</Check>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ borderRadius: 14, background: K.card, boxShadow: `inset 0 0 0 1px ${K.line}`, padding: 16 }}>
              <div style={{ ...label(10.5) }}>Who it reaches</div>
              <div style={{ ...head(28, 780), marginTop: 8 }}>All 64 flats, three ways</div>
              <div style={{ marginTop: 12, display: 'flex', gap: 1.5, height: 10 }}>
                {Array.from({ length: 64 }, (_, i) => (
                  <span
                    key={i}
                    style={{ flex: 1, borderRadius: 1.5, background: i < 52 ? K.brick : i < 55 ? K.yellow : K.paperDeep, boxShadow: i >= 55 ? `inset 0 0 0 1px ${K.line}` : 'none' }}
                  />
                ))}
              </div>
              {[
                [K.brick, '52 flats', 'in the app, as a notification'],
                [K.yellow, '3 flats', 'by text message, as they asked'],
                [K.paperDeep, '9 flats', 'on paper, in their stairwell']
              ].map(([color, count, how]) => (
                <div key={count} style={{ display: 'grid', gridTemplateColumns: '12px 64px 1fr', gap: 8, alignItems: 'center', marginTop: 10, fontSize: 13.5 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: color, boxShadow: `inset 0 0 0 1px ${K.line}` }} />
                  <span style={{ fontWeight: 650 }}>{count}</span>
                  <span style={{ color: K.muted }}>{how}</span>
                </div>
              ))}
              <div
                style={{
                  marginTop: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: K.paper
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5 }}>
                  <Icon name='print' size={18} /> Stairwell sheet, A4, 4 copies
                </span>
                <span style={{ fontSize: 13, fontWeight: 650, textDecoration: 'underline', textUnderlineOffset: 3 }}>Print</span>
              </div>
            </div>
            <div style={{ borderRadius: 14, background: K.brick, color: K.paper, padding: '14px 16px' }}>
              <div style={{ ...label(10, 'rgba(243,236,225,0.75)') }}>Preview · From styret</div>
              <div style={{ ...head(24, 780), marginTop: 8 }}>Water off Tuesday, 09–12</div>
              <div style={{ fontSize: 13, lineHeight: 1.4, marginTop: 6, color: 'rgba(243,236,225,0.88)' }}>
                The main valve in the basement is being replaced. Fill a jug on Monday night.
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 22, borderTop: `1px solid ${K.line}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 220px', gap: 16, padding: '12px 0 8px', ...label(10.5) }}>
            <span>Recent notices</span>
            <span>Sent</span>
            <span>Read</span>
          </div>
          {RECENT.map(([title, sent, read]) => (
            <div
              key={title}
              style={{ display: 'grid', gridTemplateColumns: '1fr 90px 220px', gap: 16, padding: '9px 0', borderTop: `1px solid ${K.line}`, alignItems: 'center', fontSize: 14 }}
            >
              <span style={{ fontWeight: 550 }}>{title}</span>
              <span style={{ color: K.muted }}>{sent}</span>
              <span style={{ display: 'grid', gridTemplateColumns: '1fr 54px', gap: 10, alignItems: 'center' }}>
                <span style={{ height: 6, borderRadius: 3, background: K.paperDeep, overflow: 'hidden' }}>
                  <span style={{ display: 'block', height: '100%', width: `${(read / 64) * 100}%`, background: K.ink }} />
                </span>
                <span style={{ fontSize: 13, color: K.muted, fontVariantNumeric: 'tabular-nums' }}>{read} of 64</span>
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
