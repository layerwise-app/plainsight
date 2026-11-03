import type * as React from 'react';
import { type Column, type ColumnKey, type Row, G, PENDING, QUERIES, cell, eur, wait } from './model';
import { Avatar, Button, Icon, StatusPill } from './ui';

export const COLUMN_WIDTH: Record<string, string> = {
  id: '74px',
  order: '78px',
  customer: 'minmax(0,1.35fr)',
  amount: '84px',
  reason: 'minmax(0,1.1fr)',
  agent: 'minmax(0,1fr)',
  requested: '72px',
  waiting: '82px',
  status: '96px',
  requests: '72px',
  waitingCount: '64px',
  waitingEur: '96px',
  oldest: '88px'
};

/** A Gantry table component, drawn at a fixed size for stills. */
export function RefundTable({
  columns,
  rows,
  selectedId,
  size = 12.5,
  rowHeight = 34,
  maxRows,
  total,
  footer = true,
  style
}: {
  columns: Column[];
  rows: Row[];
  selectedId?: string;
  size?: number;
  rowHeight?: number;
  maxRows?: number;
  total?: number;
  footer?: boolean;
  style?: React.CSSProperties;
}) {
  const shown = maxRows ? rows.slice(0, maxRows) : rows;
  const template = columns.map((column) => COLUMN_WIDTH[column.key] ?? '1fr').join(' ');
  const pad = size * 0.95;
  return (
    <div
      style={{
        background: G.surface,
        borderRadius: 8,
        boxShadow: `inset 0 0 0 1px ${G.line}`,
        overflow: 'hidden',
        fontSize: size,
        ...style
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: template,
          gap: size,
          padding: `0 ${pad}px`,
          height: rowHeight - 4,
          alignItems: 'center',
          color: G.muted,
          fontSize: size - 1.5,
          fontWeight: 500,
          borderBottom: `1px solid ${G.line}`,
          background: G.paper
        }}
      >
        {columns.map((column) => (
          <span key={column.key} style={{ textAlign: column.align ?? 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {column.label}
          </span>
        ))}
      </div>
      {shown.map((row) => {
        const selected = row.id !== undefined && row.id === selectedId;
        return (
          <div
            key={String(row.id ?? row.agent)}
            style={{
              display: 'grid',
              gridTemplateColumns: template,
              gap: size,
              padding: `0 ${pad}px`,
              height: rowHeight,
              alignItems: 'center',
              borderBottom: `1px solid ${G.line}`,
              background: selected ? G.orangeTint : undefined,
              boxShadow: selected ? `inset 2px 0 0 ${G.orange}` : undefined,
              color: G.ink
            }}
          >
            {columns.map((column) => (
              <CellView key={column.key} column={column} row={row} size={size} />
            ))}
          </div>
        );
      })}
      {footer ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: `0 ${pad}px`,
            height: rowHeight,
            color: G.muted,
            fontSize: size - 1
          }}
        >
          <span>
            {shown.length} of {total ?? rows.length}
          </span>
          <span style={{ display: 'flex', gap: 14, color: (total ?? rows.length) > shown.length ? G.ink : G.faint }}>
            <span style={{ color: G.faint }}>Previous</span>
            <span>Next</span>
          </span>
        </div>
      ) : null}
    </div>
  );
}

function CellView({ column, row, size }: { column: Column; row: Row; size: number }) {
  if (column.key === 'status') return <span><StatusPill status={row.status as 'pending'} size={size - 1.5} /></span>;
  const text = cell(column.key as ColumnKey, row);
  const over = column.key === 'amount' && Number(row.amount) > 500;
  return (
    <span
      style={{
        textAlign: column.align ?? 'left',
        fontFamily: column.mono ? G.mono : undefined,
        fontSize: column.mono ? size - 0.5 : size,
        color: column.key === 'id' || column.key === 'order' || column.key === 'requested' ? G.muted : G.ink,
        fontWeight: over ? 500 : undefined,
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}
    >
      {text}
    </span>
  );
}

const WAITING = QUERIES[0];
export const CANVAS_COLUMNS = WAITING.columns.filter((column) => WAITING.defaultColumns.includes(column.key));
export const WAITING_ROWS = WAITING.rows();
export const PENDING_TOTAL = PENDING.reduce((sum, refund) => sum + refund.amount, 0);

/** Wraps a canvas component with Gantry's selection outline and name tag. */
export function Selectable({
  name,
  kind,
  selected,
  hover,
  children,
  style
}: {
  name: string;
  kind: string;
  selected?: boolean;
  hover?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ position: 'relative', ...style }}>
      {children}
      {selected || hover ? (
        <>
          <div
            style={{
              position: 'absolute',
              inset: -4,
              borderRadius: 10,
              boxShadow: `0 0 0 ${selected ? 1.5 : 1}px ${G.blue}`,
              pointerEvents: 'none'
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: -5.5,
              top: -24,
              height: 18,
              padding: '0 6px',
              borderRadius: 4,
              background: selected ? G.blue : G.surface,
              color: selected ? '#fff' : G.blue,
              boxShadow: selected ? 'none' : `inset 0 0 0 1px ${G.blue}`,
              fontFamily: G.mono,
              fontSize: 10.5,
              lineHeight: '18px',
              fontWeight: 500,
              whiteSpace: 'nowrap'
            }}
          >
            {name}
            <span style={{ opacity: 0.7, fontFamily: G.sans, marginLeft: 6 }}>{kind}</span>
          </div>
          {selected
            ? [
                [-4, -4],
                ['100%', -4],
                [-4, '100%'],
                ['100%', '100%']
              ].map(([x, y]) => (
                <span
                  key={`${x}${y}`}
                  style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    width: 7,
                    height: 7,
                    marginLeft: x === -4 ? -3.5 : 0.5,
                    marginTop: y === -4 ? -3.5 : 0.5,
                    background: '#fff',
                    boxShadow: `0 0 0 1.3px ${G.blue}`,
                    borderRadius: 1
                  }}
                />
              ))
            : null}
        </>
      ) : null}
    </div>
  );
}

/** The refund page as laid out on the builder canvas, 640 wide. */
export function CanvasPage({
  selected,
  hover,
  rows = WAITING_ROWS,
  columns = CANVAS_COLUMNS,
  maxRows = 8,
  names = { stats: 'statsRow', table: 'refundsTable', form: 'approveForm' }
}: {
  selected?: 'table' | 'form';
  hover?: 'table' | 'form' | 'stats';
  rows?: Row[];
  columns?: Column[];
  maxRows?: number;
  /** Component names shown on the selection tags. */
  names?: { stats: string; table: string; form: string };
}) {
  const first = WAITING_ROWS[0];
  return (
    <div
      style={{
        width: 640,
        background: G.paper,
        borderRadius: 10,
        boxShadow: `0 0 0 1px ${G.line}, 0 12px 32px -18px rgba(22,22,22,0.22)`,
        padding: '22px 22px 24px',
        fontFamily: G.sans,
        color: G.ink
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>Refund approvals</div>
          <div style={{ fontSize: 12, color: G.muted, marginTop: 3 }}>
            {PENDING.length} waiting · oldest {wait(first.waiting as number)}
          </div>
        </div>
        <Segmented items={['Waiting', 'Over €500', 'Done today']} active={0} />
      </div>
      <Selectable name={names.stats} kind='Stats' hover={hover === 'stats'} style={{ marginTop: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          <MiniStat label='Waiting' value={String(PENDING.length)} />
          <MiniStat label='Value waiting' value={eur(PENDING_TOTAL)} />
          <MiniStat label='Over €500' value='6' note='need two people' />
        </div>
      </Selectable>
      <Selectable name={names.table} kind='Table' selected={selected === 'table'} hover={hover === 'table'} style={{ marginTop: 16 }}>
        <RefundTable columns={columns} rows={rows} selectedId={first.id as string} maxRows={maxRows} size={12} rowHeight={32} />
      </Selectable>
      <Selectable name={names.form} kind='Form' selected={selected === 'form'} hover={hover === 'form'} style={{ marginTop: 16 }}>
        <ApproveStrip />
      </Selectable>
    </div>
  );
}

function ApproveStrip() {
  return (
    <div style={{ background: G.surface, borderRadius: 8, boxShadow: `inset 0 0 0 1px ${G.line}`, padding: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>
          Approve <span style={{ fontFamily: G.mono, fontWeight: 500 }}>R-20931</span>
        </div>
        <div style={{ fontSize: 11.5, color: G.orangeInk }}>Over €500: needs a second approver</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr auto', gap: 8, marginTop: 10, alignItems: 'end' }}>
        <Field label='Amount' value='€742.00' mono />
        <Field label='Note to customer' value='Sorry about the armrest. Half the sofa and the delivery…' />
        <div style={{ display: 'flex', gap: 6 }}>
          <Button tone='plain' size={12}>
            Reject
          </Button>
          <Button tone='ink' size={12}>
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, value, mono, size = 12 }: { label: string; value: string; mono?: boolean; size?: number }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: size - 1, color: G.muted, marginBottom: 4 }}>{label}</div>
      <div
        style={{
          height: size * 2.3,
          display: 'flex',
          alignItems: 'center',
          padding: '0 9px',
          borderRadius: 6,
          boxShadow: `inset 0 0 0 1px ${G.lineStrong}`,
          background: G.surface,
          fontFamily: mono ? G.mono : undefined,
          fontSize: mono ? size - 0.5 : size,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function Segmented({ items, active, size = 12 }: { items: string[]; active: number; size?: number }) {
  return (
    <div style={{ display: 'flex', padding: 2, borderRadius: 7, background: G.sunk, boxShadow: `inset 0 0 0 1px ${G.line}` }}>
      {items.map((item, index) => (
        <span
          key={item}
          style={{
            padding: `0 ${size * 0.8}px`,
            height: size * 2.1,
            display: 'grid',
            placeItems: 'center',
            borderRadius: 5,
            fontSize: size,
            fontWeight: index === active ? 500 : 400,
            color: index === active ? G.ink : G.muted,
            background: index === active ? G.surface : undefined,
            boxShadow: index === active ? `0 0 0 1px ${G.line}, 0 1px 2px rgba(0,0,0,0.05)` : undefined
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function MiniStat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div style={{ background: G.surface, borderRadius: 8, boxShadow: `inset 0 0 0 1px ${G.line}`, padding: '10px 12px' }}>
      <div style={{ fontSize: 11, color: G.muted }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
        <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.02em', fontFamily: G.mono }}>{value}</span>
        {note ? <span style={{ fontSize: 11, color: G.muted }}>{note}</span> : null}
      </div>
    </div>
  );
}

/* ----------------------------------------------------- the finished tool */

/** Tovholm's refund tool, as the support team sees it. Designed at 1240 × 760. */
export function ToolScreen({ width = 1240, height = 760 }: { width?: number; height?: number }) {
  const columns = QUERIES[0].columns.filter((column) => ['id', 'customer', 'amount', 'reason', 'agent', 'waiting'].includes(column.key));
  return (
    <div style={{ width, height, background: G.paper, color: G.ink, fontFamily: G.sans, fontSize: 13, display: 'flex', flexDirection: 'column' }}>
      <ToolHeader />
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 392px', gap: 16, padding: '18px 22px 22px' }}>
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.025em' }}>Waiting for approval</div>
              <div style={{ fontSize: 12.5, color: G.muted, marginTop: 3 }}>
                {PENDING.length} refunds · {eur(PENDING_TOTAL)} · oldest first
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <Button size={12}>Asked by: anyone</Button>
              <Button size={12}>Reason: any</Button>
            </div>
          </div>
          <RefundTable columns={columns} rows={WAITING_ROWS} selectedId='R-20931' size={12.5} rowHeight={36.5} total={14} />
        </div>
        <RefundDetail />
      </div>
    </div>
  );
}

export function ToolHeader({ size = 1 }: { size?: number }) {
  return (
    <div
      style={{
        height: 52 * size,
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 26 * size,
        padding: `0 ${22 * size}px`,
        borderBottom: `1px solid ${G.line}`,
        background: G.surface
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 * size }}>
        <TovholmMark size={20 * size} />
        <span style={{ fontWeight: 600, fontSize: 14 * size, letterSpacing: '-0.01em' }}>Tovholm</span>
        <span style={{ color: G.faint, fontSize: 14 * size }}>/</span>
        <span style={{ fontSize: 14 * size }}>Refunds</span>
      </div>
      <div style={{ display: 'flex', gap: 4 * size, height: '100%', alignItems: 'stretch' }}>
        {[
          ['Waiting', '14'],
          ['Over €500', '6'],
          ['Done today', '9']
        ].map(([label, count], index) => (
          <span
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6 * size,
              padding: `0 ${10 * size}px`,
              fontSize: 13 * size,
              color: index === 0 ? G.ink : G.muted,
              fontWeight: index === 0 ? 500 : 400,
              boxShadow: index === 0 ? `inset 0 -2px 0 ${G.ink}` : undefined
            }}
          >
            {label}
            <span style={{ fontFamily: G.mono, fontSize: 11.5 * size, color: G.muted }}>{count}</span>
          </span>
        ))}
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 * size }}>
        <span
          style={{
            width: 240 * size,
            height: 30 * size,
            borderRadius: 7 * size,
            background: G.paper,
            boxShadow: `inset 0 0 0 1px ${G.line}`,
            display: 'flex',
            alignItems: 'center',
            gap: 8 * size,
            padding: `0 ${10 * size}px`,
            color: G.faint,
            fontSize: 12.5 * size
          }}
        >
          <Icon name='search' size={14 * size} />
          Order, refund or customer
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 * size, fontSize: 12.5 * size }}>
          <Avatar name='Nanna Krog' size={26 * size} tone='#f2c9b4' />
          <span>
            Nanna Krog
            <span style={{ color: G.muted }}> · Support lead</span>
          </span>
        </span>
      </div>
    </div>
  );
}

export function TovholmMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox='0 0 20 20' aria-hidden='true' style={{ display: 'block' }}>
      <circle cx='10' cy='10' r='10' fill={G.ink} />
      <path d='M5.5 7h9M10 7v7.5' stroke='#fff' strokeWidth='2' strokeLinecap='round' />
    </svg>
  );
}

/** The right-hand panel: the selected refund and the approve form. */
export function RefundDetail({ compact }: { compact?: boolean }) {
  return (
    <div
      style={{
        background: G.surface,
        borderRadius: 10,
        boxShadow: `inset 0 0 0 1px ${G.line}`,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0
      }}
    >
      <div style={{ padding: '16px 18px 14px', borderBottom: `1px solid ${G.line}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: G.mono, fontSize: 12, color: G.muted }}>R-20931 · TV-48213</span>
          <StatusPill status='pending' size={11.5} />
        </div>
        <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 10 }}>Lea Christensen</div>
        <div style={{ fontSize: 12.5, color: G.muted, marginTop: 3 }}>Aarhus · 3 orders since 2023 · no earlier refunds</div>
      </div>
      <div style={{ padding: '14px 18px', borderBottom: `1px solid ${G.line}`, fontSize: 12.5 }}>
        {[
          ['Hald 3-seat sofa, oat bouclé', '€1,306.00'],
          ['Delivery and assembly', '€89.00'],
          ['Refund: half the sofa and delivery', '€742.00']
        ].map(([item, price], index) => (
          <div
            key={item}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '5px 0',
              fontWeight: index === 2 ? 600 : 400,
              borderTop: index === 2 ? `1px solid ${G.line}` : undefined,
              marginTop: index === 2 ? 6 : 0,
              paddingTop: index === 2 ? 10 : 5
            }}
          >
            <span>{item}</span>
            <span style={{ fontFamily: G.mono, fontSize: 12.5 }}>{price}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: '14px 18px', fontSize: 12.5, lineHeight: 1.5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: G.muted, fontSize: 12 }}>
          <Avatar name='Emil Brandt' size={18} tone='#c9d5e8' /> Emil Brandt asked at 11:59
        </div>
        <div style={{ marginTop: 6, color: G.text2 }}>
          Left armrest split on delivery. Photos in ticket 55120. Customer keeps the sofa if we refund half plus delivery.
        </div>
        {compact ? null : (
          <>
            <div style={{ fontSize: 12, color: G.muted, marginTop: 14, marginBottom: 5 }}>Note to customer</div>
            <div
              style={{
                borderRadius: 7,
                boxShadow: `inset 0 0 0 1px ${G.lineStrong}`,
                padding: '8px 10px',
                minHeight: 66,
                color: G.ink
              }}
            >
              Sorry about the armrest, Lea. We have refunded half the sofa and the delivery, €742.00, to your card ending 4417.
            </div>
          </>
        )}
      </div>
      <div
        style={{
          marginTop: 'auto',
          padding: '12px 18px 16px',
          borderTop: `1px solid ${G.line}`
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: G.orangeInk, marginBottom: 12 }}>
          <Icon name='user' size={14} />
          Over €500. Sofie Lund or Aksel Holm approves second.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 8 }}>
          <Button tone='danger' size={13} style={{ height: 36 }}>
            Reject
          </Button>
          <Button tone='ink' size={13} style={{ height: 36 }}>
            Approve €742.00
          </Button>
        </div>
      </div>
    </div>
  );
}
