import { StatusBar } from '~/components/frames/Phone';
import { K } from './model';
import { Mark } from './ui';

const screen: React.CSSProperties = {
  width: 390,
  height: 844,
  background: K.bg,
  color: K.text,
  fontFamily: K.sans,
  letterSpacing: '-0.01em',
  display: 'flex',
  flexDirection: 'column'
};

function Bar({ value, soft, hard }: { value: number; soft: number; hard: number }) {
  const max = 12;
  const at = (v: number) => `${(v / max) * 100}%`;
  return (
    <div style={{ position: 'relative', height: 54, marginTop: 8 }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 18, height: 10, borderRadius: 3, background: K.raised }} />
      <div style={{ position: 'absolute', left: 0, width: at(value), top: 18, height: 10, borderRadius: 3, background: K.amber }} />
      <div style={{ position: 'absolute', left: at(soft), top: 10, bottom: 18, width: 1.5, background: K.text }} />
      <div style={{ position: 'absolute', left: at(hard), top: 10, bottom: 18, width: 1.5, background: K.red }} />
      <div style={{ position: 'absolute', left: at(soft), top: 40, fontFamily: K.mono, fontSize: 11, color: K.muted, transform: 'translateX(-50%)' }}>
        8.0 soft
      </div>
      <div style={{ position: 'absolute', left: at(hard), top: 40, fontFamily: K.mono, fontSize: 11, color: K.red, transform: 'translateX(-50%)' }}>
        10 hard
      </div>
    </div>
  );
}

/** A trade that passed a soft limit, waiting for a person. 390 × 844. */
export function ApprovalScreen({ seconds = 52 }: { seconds?: number }) {
  const ring = 2 * Math.PI * 15;
  return (
    <div style={screen}>
      <StatusBar color={K.text} time='14:33' />
      <div style={{ padding: '12px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 15, color: K.muted }}>Approvals</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: K.mono, fontSize: 13, color: K.amber }}>
          <svg width='34' height='34' viewBox='0 0 34 34' aria-hidden='true'>
            <circle cx='17' cy='17' r='15' fill='none' stroke={K.raised} strokeWidth='3' />
            <circle
              cx='17'
              cy='17'
              r='15'
              fill='none'
              stroke={K.amber}
              strokeWidth='3'
              strokeDasharray={ring}
              strokeDashoffset={ring * (1 - seconds / 90)}
              transform='rotate(-90 17 17)'
              strokeLinecap='round'
            />
          </svg>
          0:{String(seconds).padStart(2, '0')}
        </span>
      </div>
      <div style={{ padding: '18px 22px 0' }}>
        <div style={{ fontSize: 13, color: K.amber }}>Pairs · Energy is asking</div>
        <div style={{ fontSize: 29, lineHeight: 1.12, letterSpacing: '-0.035em', marginTop: 10 }}>
          Hold 9.2% of the fund in Aker BP, above your 8% soft limit.
        </div>
        <Bar value={9.2} soft={8} hard={10} />
      </div>
      <div style={{ margin: '26px 22px 0', padding: 16, borderRadius: 12, background: K.panel, border: `1px solid ${K.line}` }}>
        <div style={{ fontSize: 12, color: K.muted }}>The agent’s reason</div>
        <div style={{ fontSize: 15, lineHeight: 1.45, marginTop: 8 }}>
          The AKRBP–EQNR spread is 2.4 standard deviations from its 60-day mean. Closing it needs 1.2% more size than the
          limit allows.
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 14,
            paddingTop: 12,
            borderTop: `1px solid ${K.line}`,
            fontFamily: K.mono,
            fontSize: 12,
            color: K.muted
          }}
        >
          <span>Order 31,400 AKRBP</span>
          <span>≈ 8.3M NOK</span>
        </div>
      </div>
      <div style={{ padding: '16px 22px', fontSize: 13, color: K.muted, lineHeight: 1.45 }}>
        If nobody answers in 90 seconds, Kestrel declines the trade and keeps the position at 8%.
      </div>
      <div style={{ marginTop: 'auto', padding: '0 22px 40px', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 10 }}>
        <div
          style={{
            height: 54,
            borderRadius: 14,
            border: `1px solid ${K.lineStrong}`,
            display: 'grid',
            placeItems: 'center',
            fontSize: 16
          }}
        >
          Decline
        </div>
        <div
          style={{
            height: 54,
            borderRadius: 14,
            background: K.lime,
            color: K.limeInk,
            display: 'grid',
            placeItems: 'center',
            fontSize: 16,
            fontWeight: 500
          }}
        >
          Approve once
        </div>
      </div>
    </div>
  );
}

/** After approval: what happened and which rule it touched. 390 × 844. */
export function ApprovedScreen() {
  return (
    <div style={screen}>
      <StatusBar color={K.text} time='14:33' />
      <div style={{ padding: '12px 22px', fontSize: 15, color: K.muted }}>Approvals</div>
      <div style={{ padding: '40px 22px 0' }}>
        <div style={{ width: 52, height: 52, borderRadius: 26, background: K.lime, display: 'grid', placeItems: 'center' }}>
          <svg width='22' height='22' viewBox='0 0 22 22' aria-hidden='true'>
            <path d='M4 11.5l4.5 4.5L18 6.5' fill='none' stroke={K.limeInk} strokeWidth='2.4' strokeLinecap='round' />
          </svg>
        </div>
        <div style={{ fontSize: 29, lineHeight: 1.12, letterSpacing: '-0.035em', marginTop: 24 }}>
          Approved once. Aker BP may reach 9.2% until the close.
        </div>
        <div style={{ fontSize: 15, color: K.muted, marginTop: 14, lineHeight: 1.45 }}>
          Rule 2.2 goes back to 8% at 16:20. Nothing else about the agent changed.
        </div>
      </div>
      <div style={{ margin: '34px 22px 0', borderTop: `1px solid ${K.line}` }}>
        {[
          ['14:33:08', 'You approved, 38 s after the ask'],
          ['14:33:09', 'Bought 31,400 AKRBP at 264.10'],
          ['14:33:09', 'Position now 9.2% of fund'],
          ['16:20:00', 'Soft limit returns to 8.0%']
        ].map(([time, text], index) => (
          <div
            key={time + text}
            style={{
              display: 'grid',
              gridTemplateColumns: '84px 1fr',
              padding: '13px 0',
              borderBottom: `1px solid ${K.line}`,
              fontSize: 14,
              color: index === 3 ? K.muted : K.text
            }}
          >
            <span style={{ fontFamily: K.mono, fontSize: 12.5, color: K.muted }}>{time}</span>
            {text}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 'auto', padding: '0 22px 40px' }}>
        <div
          style={{
            height: 54,
            borderRadius: 14,
            border: `1px solid ${K.lineStrong}`,
            display: 'grid',
            placeItems: 'center',
            fontSize: 16
          }}
        >
          Back to agents
        </div>
      </div>
    </div>
  );
}

/** The lock screen notification that starts it. 390 × 844. */
export function LockScreen() {
  return (
    <div
      style={{
        ...screen,
        background: 'radial-gradient(120% 70% at 30% 10%, #2b3a30 0%, #101512 55%, #070908 100%)'
      }}
    >
      <StatusBar color='#fff' time='' />
      <div style={{ textAlign: 'center', marginTop: 46, color: 'rgba(255,255,255,0.75)', fontSize: 18, fontWeight: 500 }}>
        Tuesday 3 November
      </div>
      <div
        style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.92)',
          fontSize: 96,
          fontWeight: 600,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          marginTop: 4
        }}
      >
        14:33
      </div>
      <div
        style={{
          margin: 'auto 12px 120px',
          padding: 14,
          borderRadius: 24,
          background: 'rgba(40,48,44,0.62)',
          backdropFilter: 'blur(18px)',
          display: 'grid',
          gridTemplateColumns: '38px 1fr',
          gap: 12,
          color: '#fff'
        }}
      >
        <div style={{ width: 38, height: 38, borderRadius: 9, background: K.bg, display: 'grid', placeItems: 'center' }}>
          <Mark size={20} />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5, fontWeight: 600 }}>
            Kestrel <span style={{ fontWeight: 400, opacity: 0.6, fontSize: 13 }}>now</span>
          </div>
          <div style={{ fontSize: 14.5, lineHeight: 1.35, marginTop: 2 }}>
            Pairs · Energy wants 9.2% in Aker BP. Soft limit is 8%. Declines by itself in 90 s.
          </div>
        </div>
      </div>
    </div>
  );
}
