import type * as React from 'react';
import { Scaled } from '~/components/frames/Scaled';
import { CanvasPage } from './App';
import { ChainNode } from './Builder';
import { DATABASE, G, QUERIES } from './model';
import { FIELD, Field, longShadow, type FieldTone } from './Shot';
import { Avatar, Button, Chip, Icon, Label, Mark } from './ui';

/** The query choice inside the inspector: one radio row per query. */
export function QueryOption({ id, note, rows, selected, warning }: { id: string; note: string; rows: number; selected?: boolean; warning?: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '16px 1fr auto',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 8,
        background: selected ? G.orangeTint : G.surface,
        boxShadow: `inset 0 0 0 1px ${selected ? G.orangeLine : G.line}`
      }}
    >
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: 99,
          marginTop: 1,
          boxShadow: `inset 0 0 0 ${selected ? 5 : 1.3}px ${selected ? G.orange : G.lineStrong}`,
          background: G.surface
        }}
      />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: G.mono, fontSize: 12.5, fontWeight: 500 }}>{id}</div>
        <div style={{ fontSize: 11.5, color: G.muted, marginTop: 2 }}>{note}</div>
        {warning ? <div style={{ fontSize: 11.5, color: G.orangeInk, marginTop: 6, lineHeight: 1.4 }}>{warning}</div> : null}
      </div>
      <span style={{ fontFamily: G.mono, fontSize: 11.5, color: G.muted }}>{rows} rows</span>
    </div>
  );
}

/** The inspector's data section, close up. 340 wide. */
function DataCloseUp() {
  const [waiting, over, byAgent] = QUERIES;
  return (
    <div style={{ width: 340, background: G.surface, borderRadius: 12, fontFamily: G.sans, color: G.ink, fontSize: 12.5, overflow: 'hidden', boxShadow: `inset 0 0 0 1px ${G.line}` }}>
      <div style={{ height: 46, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', borderBottom: `1px solid ${G.line}` }}>
        <span style={{ width: 24, height: 24, borderRadius: 6, background: G.blueTint, color: G.blue, display: 'grid', placeItems: 'center' }}>
          <Icon name='table' size={14} />
        </span>
        <span style={{ fontFamily: G.mono, fontSize: 12.5, fontWeight: 500 }}>refundsTable</span>
        <span style={{ fontSize: 12, color: G.muted }}>Table</span>
      </div>
      <div style={{ padding: '14px 16px 16px' }}>
        <Label>Data</Label>
        <div style={{ fontSize: 14, lineHeight: 1.6, letterSpacing: '-0.01em', marginTop: 10 }}>
          Shows <b style={{ fontWeight: 600 }}>14 rows</b> from <Chip>refunds_waiting</Chip> on{' '}
          <Chip kind='database' quiet>
            {DATABASE.name}
          </Chip>
        </div>
        <div style={{ marginTop: 14, padding: 12, borderRadius: 8, background: G.paper, boxShadow: `inset 0 0 0 1px ${G.line}` }}>
          <ChainNode kind='table' name='refundsTable' detail='6 of 9 columns shown' size={12} />
          <ChainNode kind='query' name='refunds_waiting' detail={`Ran 12 s ago · ${waiting.ms} ms`} size={12} />
          <ChainNode kind='database' name={DATABASE.name} detail={`${DATABASE.engine} · read replica`} size={12} last />
        </div>
        <div style={{ marginTop: 18 }}>
          <Label>Query</Label>
        </div>
        <div style={{ display: 'grid', gap: 6, marginTop: 9 }}>
          <QueryOption id={waiting.id} note={waiting.note} rows={14} selected />
          <QueryOption id={over.id} note={over.note} rows={over.rows().length} />
          <QueryOption id={byAgent.id} note={byAgent.note} rows={byAgent.rows().length} warning='Different columns. Picking it swaps your 6 columns for its 5.' />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 14, color: G.blue, fontSize: 12.5 }}>
          <Icon name='plus' size={14} /> Add a filter
        </div>
      </div>
    </div>
  );
}

/** Close-up of the bindings: the inspector at large scale over the canvas. 1440 × 960. */
export function BindingsDetail({ tone = 'orange' }: { tone?: FieldTone }) {
  const shadow = FIELD[tone].shadow;
  return (
    <Field width={1440} height={960} tone={tone}>
      <div style={{ position: 'absolute', left: -120, top: 210 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 12, boxShadow: longShadow(shadow, 1.1, 1.2) }} />
        <Scaled width={680} height={700} scale={1.34}>
          <div style={{ background: `radial-gradient(circle at 1px 1px, rgba(22,22,22,0.13) 1px, transparent 1.2px) 0 0 / 16px 16px, ${G.canvas}`, width: 680, height: 700, padding: '30px 20px', borderRadius: 12 }}>
            <CanvasPage selected='table' />
          </div>
        </Scaled>
      </div>
      <div style={{ position: 'absolute', left: 790, top: 64 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 12 * 1.55, boxShadow: longShadow(shadow, 1.4, 1.4) }} />
        <Scaled width={340} height={640} scale={1.55}>
          <DataCloseUp />
        </Scaled>
      </div>
    </Field>
  );
}

/* ---------------------------------------------------------- permissions */

const ROLES = [
  ['Support agent', '12 people'],
  ['Support lead', '3 people'],
  ['Finance', '4 people'],
  ['Tool admin', '2 people']
];

type Grant = 'yes' | 'no' | 'two';

const ACTIONS: [string, string, Grant[]][] = [
  ['See refunds and orders', 'refunds_waiting, customer_history', ['yes', 'yes', 'yes', 'yes']],
  ['Ask for a refund', 'from the order page', ['yes', 'yes', 'no', 'no']],
  ['Approve up to €500', 'approve_refund', ['no', 'yes', 'yes', 'no']],
  ['Approve over €500', 'approve_refund, amount_eur > 500', ['no', 'two', 'two', 'no']],
  ['Reject a refund', 'reject_refund, needs a reason', ['no', 'yes', 'yes', 'no']],
  ['Export to CSV', 'up to 5,000 rows', ['no', 'yes', 'yes', 'yes']],
  ['Edit queries and components', 'in the builder', ['no', 'no', 'no', 'yes']],
  ['Deploy a new version', 'after checks pass', ['no', 'no', 'no', 'yes']]
];

function GrantCell({ grant }: { grant: Grant }) {
  if (grant === 'yes') return <Icon name='check' size={18} stroke={1.9} color={G.ink} />;
  if (grant === 'two')
    return (
      <span style={{ height: 22, padding: '0 7px', borderRadius: 6, background: G.orangeTint, color: G.orangeInk, boxShadow: `inset 0 0 0 1px ${G.orangeLine}`, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 500 }}>
        <Icon name='user' size={12} />+1
      </span>
    );
  return <span style={{ width: 14, height: 1.5, background: G.lineStrong, display: 'block' }} />;
}

/** Who can do what, one row per action. 720 wide. */
export function PermissionsPanel() {
  return (
    <div style={{ width: 720, background: G.surface, borderRadius: 12, fontFamily: G.sans, color: G.ink, fontSize: 13, overflow: 'hidden', boxShadow: `inset 0 0 0 1px ${G.line}` }}>
      <div style={{ padding: '18px 20px 16px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: `1px solid ${G.line}` }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em' }}>Who can do what</div>
          <div style={{ fontSize: 12.5, color: G.muted, marginTop: 3 }}>Refund approvals · enforced on the server, not just hidden</div>
        </div>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: G.blue }}>
          <Icon name='eye' size={14} /> Preview as a role
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr repeat(4, 104px)', alignItems: 'end', padding: '12px 20px 10px', borderBottom: `1px solid ${G.line}`, background: G.paper }}>
        <span style={{ fontSize: 11.5, color: G.muted }}>Action</span>
        {ROLES.map(([role, count]) => (
          <span key={role} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 500 }}>{role}</div>
            <div style={{ fontSize: 11, color: G.muted, marginTop: 2 }}>{count}</div>
          </span>
        ))}
      </div>
      {ACTIONS.map(([action, detail, grants], index) => (
        <div
          key={action}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr repeat(4, 104px)',
            alignItems: 'center',
            padding: '0 20px',
            height: 54,
            borderBottom: index < ACTIONS.length - 1 ? `1px solid ${G.line}` : undefined,
            background: index === 3 ? 'rgba(255,91,31,0.04)' : undefined
          }}
        >
          <div>
            <div>{action}</div>
            <div style={{ fontFamily: G.mono, fontSize: 11, color: G.faint, marginTop: 3 }}>{detail}</div>
          </div>
          {grants.map((grant, column) => (
            <span key={column} style={{ display: 'flex', justifyContent: 'center' }}>
              <GrantCell grant={grant} />
            </span>
          ))}
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', borderTop: `1px solid ${G.line}`, background: G.paper, fontSize: 12, color: G.muted }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: G.orangeInk, fontWeight: 500 }}>
          <Icon name='user' size={12} />+1
        </span>
        needs a second support lead, never the person who asked. Changes ship with the next deploy.
      </div>
    </div>
  );
}

/** A panel floating on a field, at large scale. Square by default. */
export function PanelShot({
  children,
  width = 1200,
  height = 1200,
  design,
  scale,
  tone = 'stone'
}: {
  children: React.ReactNode;
  width?: number;
  height?: number;
  design: [number, number];
  scale: number;
  tone?: FieldTone;
}) {
  const [w, h] = design;
  const left = Math.round((width - w * scale) / 2);
  const top = Math.round((height - h * scale) / 2);
  return (
    <Field width={width} height={height} tone={tone}>
      <div style={{ position: 'absolute', left, top, width: w * scale, height: h * scale, borderRadius: 12 * scale, boxShadow: longShadow(FIELD[tone].shadow, 1.2, 1.3) }} />
      <Scaled width={w} height={h} scale={scale} style={{ position: 'absolute', left, top }}>
        {children}
      </Scaled>
    </Field>
  );
}

/* ----------------------------------------------------------- onboarding */

const TABLES: [string, string, string[]][] = [
  ['refunds', '18,402 rows', ['id', 'order_id', 'amount_eur', 'status', 'requested_by']],
  ['orders', '1.2M rows', ['id', 'customer_id', 'total_eur', 'shipped_at']],
  ['customers', '310,553 rows', ['id', 'full_name', 'email', 'city']],
  ['returns', '9,871 rows', ['id', 'order_id', 'received_at', 'condition']],
  ['delivery_slots', '4,230 rows', ['id', 'region', 'starts_at', 'capacity']]
];

/** The first thing a new builder sees: connect a database, pick a table, get a working tool. 720 wide. */
export function OnboardingPanel() {
  return (
    <div style={{ width: 720, background: G.surface, borderRadius: 12, fontFamily: G.sans, color: G.ink, fontSize: 13, overflow: 'hidden', boxShadow: `inset 0 0 0 1px ${G.line}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderBottom: `1px solid ${G.line}` }}>
        <Mark size={22} />
        <span style={{ fontWeight: 500 }}>New tool</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
          {['Connect', 'Pick a table', 'Build'].map((step, index) => (
            <span key={step} style={{ display: 'flex', alignItems: 'center', gap: 6, color: index === 1 ? G.ink : G.muted, fontWeight: index === 1 ? 500 : 400 }}>
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 99,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 10.5,
                  fontFamily: G.mono,
                  background: index === 0 ? G.green : index === 1 ? G.ink : G.surface,
                  color: index < 2 ? '#fff' : G.muted,
                  boxShadow: index === 2 ? `inset 0 0 0 1.2px ${G.lineStrong}` : undefined
                }}
              >
                {index === 0 ? <Icon name='check' size={11} stroke={2} /> : index + 1}
              </span>
              {step}
              {index < 2 ? <span style={{ width: 18, height: 1, background: G.lineStrong, marginLeft: 2 }} /> : null}
            </span>
          ))}
        </div>
      </div>
      <div style={{ margin: '16px 20px 0', padding: '12px 14px', borderRadius: 8, background: G.greenTint, display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ width: 30, height: 30, borderRadius: 7, background: G.ink, color: '#fff', display: 'grid', placeItems: 'center', flex: 'none' }}>
          <Icon name='database' size={16} />
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500 }}>
            Connected to <span style={{ fontFamily: G.mono }}>ops-eu</span> in 84 ms
          </div>
          <div style={{ fontSize: 12, color: G.text2, marginTop: 2 }}>
            Postgres 16 · <span style={{ fontFamily: G.mono, fontSize: 11.5 }}>gantry_reader</span> can read 46 tables and write to none
          </div>
        </div>
        <span style={{ fontSize: 12, color: G.green, fontWeight: 500 }}>Change</span>
      </div>
      <div style={{ padding: '20px 20px 6px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em' }}>Pick a table to start from</div>
          <div style={{ fontSize: 12.5, color: G.muted, marginTop: 3 }}>Sorted by how often your team’s queries use them</div>
        </div>
      </div>
      <div style={{ padding: '8px 20px 0', display: 'grid', gap: 6 }}>
        {TABLES.map(([name, rows, columns], index) => (
          <div
            key={name}
            style={{
              display: 'grid',
              gridTemplateColumns: '18px 130px 1fr auto',
              alignItems: 'center',
              gap: 12,
              padding: '11px 14px',
              borderRadius: 8,
              background: index === 0 ? G.orangeTint : undefined,
              boxShadow: `inset 0 0 0 1px ${index === 0 ? G.orangeLine : G.line}`
            }}
          >
            <span style={{ width: 16, height: 16, borderRadius: 99, boxShadow: `inset 0 0 0 ${index === 0 ? 5 : 1.3}px ${index === 0 ? G.orange : G.lineStrong}` }} />
            <span style={{ fontFamily: G.mono, fontSize: 13, fontWeight: 500 }}>{name}</span>
            <span style={{ display: 'flex', gap: 4, overflow: 'hidden' }}>
              {columns.map((column) => (
                <span key={column} style={{ fontFamily: G.mono, fontSize: 10.5, color: G.muted, background: index === 0 ? 'rgba(255,255,255,0.7)' : G.paper, borderRadius: 4, padding: '2px 5px', whiteSpace: 'nowrap' }}>
                  {column}
                </span>
              ))}
            </span>
            <span style={{ fontFamily: G.mono, fontSize: 11.5, color: G.muted }}>{rows}</span>
          </div>
        ))}
      </div>
      <div style={{ margin: '18px 20px 0', padding: 14, borderRadius: 8, background: G.paper, boxShadow: `inset 0 0 0 1px ${G.line}` }}>
        <div style={{ fontSize: 12, color: G.muted }}>Gantry will make, already bound to refunds</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 10 }}>
          {[
            ['table', 'A table', 'of refunds, newest first'],
            ['page', 'A detail panel', 'for the row you pick'],
            ['form', 'An edit form', 'for status, tested on a copy']
          ].map(([icon, title, note]) => (
            <div key={title} style={{ display: 'flex', gap: 9 }}>
              <span style={{ width: 26, height: 26, borderRadius: 6, background: G.blueTint, color: G.blue, display: 'grid', placeItems: 'center', flex: 'none' }}>
                <Icon name={icon as 'table'} size={14} />
              </span>
              <div>
                <div style={{ fontWeight: 500, fontSize: 12.5 }}>{title}</div>
                <div style={{ fontSize: 11.5, color: G.muted, marginTop: 1 }}>{note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px 18px', marginTop: 6 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: G.muted }}>
          <Avatar name='Sofie Lund' size={20} tone='#d6e3c9' /> Sofie Lund is setting this up
        </span>
        <span style={{ display: 'flex', gap: 8 }}>
          <Button size={13}>Start empty</Button>
          <Button tone='primary' size={13}>
            Build from refunds
          </Button>
        </span>
      </div>
    </div>
  );
}

/** The onboarding card on Gantry's own empty canvas. */
export function OnboardingShot({ width = 1200, height = 1200 }: { width?: number; height?: number }) {
  const scale = 1.3;
  const w = 720;
  const h = 630;
  const left = Math.round((width - w * scale) / 2);
  const top = Math.round((height - h * scale) / 2);
  return (
    <div style={{ width, height, position: 'relative', overflow: 'hidden', background: `radial-gradient(circle at 1.5px 1.5px, rgba(22,22,22,0.16) 1.4px, transparent 1.7px) 0 0 / 26px 26px, ${G.canvas}` }}>
      <div style={{ position: 'absolute', left, top, width: w * scale, height: h * scale, borderRadius: 12 * scale, boxShadow: longShadow('58,44,28', 1, 1.1) }} />
      <Scaled width={w} height={h} scale={scale} style={{ position: 'absolute', left, top }}>
        <OnboardingPanel />
      </Scaled>
    </div>
  );
}

