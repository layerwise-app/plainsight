import type * as React from 'react';
import { type Limits, K } from './model';

export type RuleKey = 'maxPosition' | 'maxDailyLoss' | 'hours';

const pad = (hour: number) => `${String(hour).padStart(2, '0')}:00`;

export const RULES: {
  key: RuleKey;
  id: string;
  render: (value: (key: keyof Limits, text: string) => React.ReactNode, limits: Limits) => React.ReactNode;
}[] = [
  {
    key: 'maxPosition',
    id: '2.1',
    render: (v, l) => (
      <>
        Never let one position grow past {v('maxPosition', `${l.maxPosition.toFixed(1)}%`)} of the fund.
      </>
    )
  },
  {
    key: 'maxDailyLoss',
    id: '1.2',
    render: (v, l) => (
      <>
        Stop trading for the day after losing {v('maxDailyLoss', `${l.maxDailyLoss.toFixed(1)}%`)}.
      </>
    )
  },
  {
    key: 'hours',
    id: '3.1',
    render: (v, l) => (
      <>
        Only place orders between {v('startHour', pad(l.startHour))} and {v('endHour', pad(l.endHour))} Oslo time.
      </>
    )
  }
];

/** A value inside a guardrail sentence. Static in stills; a stepper in the demo. */
export function Token({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span
      style={{
        fontFamily: K.mono,
        fontSize: '0.92em',
        padding: '1px 7px 2px',
        borderRadius: 5,
        color: active ? K.limeInk : K.lime,
        background: active ? K.lime : 'rgba(205,244,100,0.1)',
        boxShadow: `inset 0 0 0 1px ${active ? K.lime : 'rgba(205,244,100,0.28)'}`,
        whiteSpace: 'nowrap'
      }}
    >
      {children}
    </span>
  );
}

export function RuleRow({
  id,
  children,
  aside
}: {
  id: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '38px 1fr auto',
        alignItems: 'baseline',
        gap: 10,
        padding: '15px 16px',
        borderTop: `1px solid ${K.line}`
      }}
    >
      <span style={{ fontFamily: K.mono, fontSize: 11.5, color: K.faint }}>{id}</span>
      <span style={{ fontSize: 15.5, lineHeight: 1.6, letterSpacing: '-0.015em', textWrap: 'pretty' }}>{children}</span>
      {aside}
    </div>
  );
}
