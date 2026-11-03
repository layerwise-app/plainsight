import type * as React from 'react';
import { RefundDetail, RefundTable, ToolHeader, WAITING_ROWS, PENDING_TOTAL } from './App';
import { APPROVE_SQL, G, QUERIES, REFUNDS, eur } from './model';
import { Icon, Sql } from './ui';

/** Every plane of the exploded view is laid out at this size. */
export const PW = 1040;
export const PH = 660;

/** Where bindings leave each plane: the bottom edge of the table and of the form. */
export const PORTS = {
  table: { x: 342, y: 642 },
  form: { x: 852, y: 642 }
};

const plane: React.CSSProperties = { width: PW, height: PH, position: 'relative', overflow: 'hidden', fontFamily: G.sans, color: G.ink };

/** A port where a binding enters or leaves a plane. */
function Port({ x, y, tone = 'ink' }: { x: number; y: number; tone?: 'ink' | 'light' }) {
  return (
    <span
      style={{
        position: 'absolute',
        left: x - 7,
        top: y - 7,
        width: 14,
        height: 14,
        borderRadius: 99,
        background: tone === 'ink' ? G.surface : G.orange,
        boxShadow: `0 0 0 2px ${tone === 'ink' ? G.ink : G.surface}`,
        zIndex: 5
      }}
    />
  );
}

/* --------------------------------------------------------- 4: the tool */

const TOOL_COLUMNS = QUERIES[0].columns.filter((column) => ['id', 'customer', 'amount', 'reason', 'waiting'].includes(column.key));

export function ToolPlane() {
  return (
    <div style={{ ...plane, background: G.paper, display: 'flex', flexDirection: 'column', fontSize: 13 }}>
      <ToolHeader />
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 336px', gap: 20, padding: '18px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.025em' }}>Waiting for approval</div>
          <div style={{ fontSize: 12.5, color: G.muted, marginTop: 3, marginBottom: 12 }}>
            14 refunds · {eur(PENDING_TOTAL)} · oldest first
          </div>
          <RefundTable
            columns={TOOL_COLUMNS}
            rows={WAITING_ROWS}
            selectedId='R-20931'
            size={12.5}
            rowHeight={34}
            maxRows={13}
            total={14}
            style={{ flex: 1 }}
          />
        </div>
        <RefundDetail compact />
      </div>
      <Port {...PORTS.table} />
      <Port {...PORTS.form} />
    </div>
  );
}

/* ----------------------------------------------------- 3: the bindings */

function Outline({
  x,
  y,
  w,
  h,
  name,
  kind,
  bound,
  strong
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  name: string;
  kind: string;
  bound?: string;
  strong?: boolean;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 8,
        border: `1.5px ${strong ? 'solid' : 'dashed'} ${G.blue}`,
        background: strong ? 'rgba(47,91,234,0.06)' : 'rgba(47,91,234,0.025)'
      }}
    >
      <div style={{ position: 'absolute', left: 10, bottom: 10, display: 'flex', gap: 8, alignItems: 'center', whiteSpace: 'nowrap' }}>
        <span
          style={{
            height: 24,
            padding: '0 9px',
            borderRadius: 5,
            background: strong ? G.blue : G.surface,
            color: strong ? '#fff' : G.blue,
            boxShadow: strong ? 'none' : `inset 0 0 0 1px ${G.blue}`,
            fontFamily: G.mono,
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '24px'
          }}
        >
          {name}
          <span style={{ fontFamily: G.sans, opacity: 0.72, marginLeft: 7 }}>{kind}</span>
        </span>
        {bound ? <span style={{ fontFamily: G.mono, fontSize: 14, color: G.orangeInk, fontWeight: 500 }}>{bound}</span> : null}
      </div>
    </div>
  );
}

export function BindingsPlane() {
  return (
    <div
      style={{
        ...plane,
        background: `linear-gradient(rgba(47,91,234,0.1) 1px, transparent 1px) 0 0 / 26px 26px, linear-gradient(90deg, rgba(47,91,234,0.1) 1px, transparent 1px) 0 0 / 26px 26px, #EEF1F8`
      }}
    >
      <Outline x={20} y={124} w={644} h={518} name='refundsTable' kind='Table' bound='← refunds_waiting' strong />
      <Outline x={684} y={94} w={336} h={436} name='detailPanel' kind='Panel' bound='← selectedRow' />
      <Outline x={684} y={556} w={336} h={86} name='approveForm' kind='Form' bound='→ approve_refund' strong />
      <svg width={PW} height={PH} style={{ position: 'absolute', inset: 0 }} aria-hidden='true'>
        <path d='M560 158 C 640 158, 610 470, 684 470' fill='none' stroke={G.blue} strokeWidth='1.5' strokeDasharray='4 4' />
        <circle cx='560' cy='158' r='4' fill={G.blue} />
      </svg>
      <Port {...PORTS.table} />
      <Port {...PORTS.form} />
    </div>
  );
}

/* ------------------------------------------------------- 2: the queries */

function QueryCard({
  x,
  y,
  w,
  h,
  name,
  meta,
  code,
  size = 12,
  writes,
  faded
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  name: string;
  meta: string;
  code: string;
  size?: number;
  writes?: boolean;
  faded?: boolean;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 9,
        background: G.surface,
        boxShadow: `inset 0 0 0 1px ${faded ? G.line : G.orangeLine}, 0 1px 2px rgba(0,0,0,0.04)`,
        overflow: 'hidden',
        opacity: faded ? 0.85 : 1
      }}
    >
      <div
        style={{
          height: 36,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 14px',
          borderBottom: `1px solid ${G.line}`,
          background: faded ? G.surface : G.orangeTint
        }}
      >
        <Icon name='query' size={15} color={G.orangeInk} />
        <span style={{ fontFamily: G.mono, fontSize: 12.5, fontWeight: 500, color: G.ink }}>{name}</span>
        {writes ? (
          <span style={{ fontSize: 11, color: G.orangeInk, fontWeight: 500, border: `1px solid ${G.orangeLine}`, borderRadius: 4, padding: '0 5px' }}>
            writes
          </span>
        ) : null}
        <span style={{ marginLeft: 'auto', fontSize: 11.5, color: G.muted }}>{meta}</span>
      </div>
      <div style={{ padding: '10px 14px' }}>
        <Sql code={code} size={size} lineHeight={1.62} />
      </div>
    </div>
  );
}

export function QueriesPlane() {
  return (
    <div
      style={{
        ...plane,
        background: `radial-gradient(circle at 1px 1px, rgba(22,22,22,0.12) 1px, transparent 1.3px) 0 0 / 18px 18px, #FBFAF7`
      }}
    >
      <QueryCard
        x={22}
        y={26}
        w={300}
        h={160}
        name='refund_totals'
        meta='9 ms'
        size={11}
        faded
        code={`select count(*) as waiting,
       sum(amount_eur) as value
from refunds
where status = 'pending';`}
      />
      <QueryCard
        x={342}
        y={26}
        w={330}
        h={160}
        name='customer_history'
        meta='22 ms'
        size={11}
        faded
        code={`select count(*) as orders,
       min(created_at) as since
from orders
where customer_id = {{ row.customer_id }};`}
      />
      <QueryCard
        x={692}
        y={26}
        w={326}
        h={160}
        name='reject_refund'
        meta='writes'
        size={11}
        faded
        code={`update refunds
set status = 'rejected'
where id = {{ row.id }};`}
      />
      <QueryCard x={22} y={386} w={650} h={256} name='refunds_waiting' meta='14 rows · 38 ms' code={QUERIES[0].sql} size={11.6} />
      <QueryCard x={692} y={386} w={326} h={256} name='approve_refund' meta='1 row' writes code={APPROVE_SQL} size={10.6} />
      <Port {...PORTS.table} />
      <Port {...PORTS.form} />
    </div>
  );
}

/* ------------------------------------------------------ 1: the database */

const DB_COLUMNS: [string, number, (refund: (typeof REFUNDS)[number]) => string][] = [
  ['id', 92, (r) => r.id],
  ['order_id', 98, (r) => r.order],
  ['customer', 170, (r) => r.customer],
  ['amount_eur', 104, (r) => r.amount.toFixed(2)],
  ['reason', 150, (r) => r.reason.toLowerCase().replaceAll(' ', '_')],
  ['requested_by', 140, (r) => r.agent.split(' ')[0].toLowerCase()],
  ['requested_at', 120, (r) => (r.requested.includes(' ') ? `02 Nov ${r.requested.slice(4)}` : `03 Nov ${r.requested}`)],
  ['status', 90, (r) => r.status]
];

export function DatabasePlane() {
  const rows = [...REFUNDS].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 14);
  const dbInk = '#E9E7E1';
  const line = 'rgba(233,231,225,0.1)';
  return (
    <div style={{ ...plane, background: G.ink, color: dbInk, fontFamily: G.mono, fontSize: 12.5 }}>
      <div style={{ height: 48, display: 'flex', alignItems: 'center', gap: 12, padding: '0 22px', borderBottom: `1px solid ${line}` }}>
        <Icon name='database' size={17} color={G.orange} />
        <span style={{ fontWeight: 500, color: '#fff' }}>ops-eu</span>
        <span style={{ color: 'rgba(233,231,225,0.5)' }}>/ public / refunds</span>
        <span style={{ marginLeft: 'auto', color: 'rgba(233,231,225,0.5)' }}>Postgres 16 · 18,402 rows</span>
      </div>
      <div style={{ display: 'flex', height: 36, alignItems: 'center', padding: '0 22px', color: 'rgba(233,231,225,0.5)', borderBottom: `1px solid ${line}` }}>
        {DB_COLUMNS.map(([name, width]) => (
          <span key={name} style={{ width, flex: 'none' }}>
            {name}
          </span>
        ))}
      </div>
      {rows.map((row, index) => {
        const target = row.id === 'R-20931';
        return (
          <div
            key={row.id}
            style={{
              display: 'flex',
              height: 40.5,
              alignItems: 'center',
              padding: '0 22px',
              borderBottom: `1px solid ${line}`,
              background: target ? G.orange : row.status === 'pending' ? 'rgba(255,91,31,0.13)' : undefined,
              color: target ? G.ink : index % 2 ? 'rgba(233,231,225,0.86)' : dbInk
            }}
          >
            {DB_COLUMNS.map(([name, width, read]) => (
              <span
                key={name}
                style={{
                  width,
                  flex: 'none',
                  color: !target && name === 'status' && row.status === 'pending' ? '#FF8A5C' : undefined,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden'
                }}
              >
                {read(row)}
              </span>
            ))}
          </div>
        );
      })}
      <Port {...PORTS.table} tone='light' />
      <Port {...PORTS.form} tone='light' />
    </div>
  );
}
