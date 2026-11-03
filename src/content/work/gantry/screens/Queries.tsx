import { WAITING_ROWS } from './App';
import { TopBar } from './Builder';
import { DATABASE, G, QUERIES, cell } from './model';
import { Button, Chip, Icon, Label, Sql } from './ui';

const LIST: [string, string, boolean?][] = [
  ['refunds_waiting', 'refundsTable, waiting badge'],
  ['refunds_over_500', 'overTable'],
  ['refunds_by_agent', 'agentChart'],
  ['refund_totals', 'statsRow'],
  ['customer_history', 'detailPanel'],
  ['approve_refund', 'approveForm', true],
  ['reject_refund', 'rejectButton', true]
];

const RESULT_COLUMNS: [string, number, string][] = [
  ['id', 78, 'id'],
  ['customer', 142, 'customer'],
  ['amount_eur', 92, 'amount'],
  ['reason', 132, 'reason'],
  ['requested_by', 112, 'agent'],
  ['waiting', 76, 'waiting'],
  ['status', 60, 'status']
];

/** The query editor: SQL, its live result, and everything that reads it. Designed at 1240 × 760. */
export function QueryScreen() {
  const query = QUERIES[0];
  return (
    <div style={{ width: 1240, height: 760, display: 'flex', flexDirection: 'column', background: G.paper, color: G.ink, fontFamily: G.sans, fontSize: 12.5 }}>
      <TopBar active='Queries' />
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <aside style={{ width: 232, flex: 'none', borderRight: `1px solid ${G.line}`, background: G.surface, padding: '14px 10px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '0 4px' }}>
            <Label right={<Icon name='plus' size={14} color={G.muted} />}>Queries</Label>
          </div>
          <div
            style={{
              margin: '10px 4px 8px',
              height: 28,
              borderRadius: 6,
              background: G.paper,
              boxShadow: `inset 0 0 0 1px ${G.line}`,
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '0 8px',
              color: G.faint
            }}
          >
            <Icon name='search' size={13} /> Find a query
          </div>
          {LIST.map(([name, usedBy, writes], index) => (
            <div
              key={name}
              style={{
                padding: '7px 8px',
                borderRadius: 6,
                background: index === 0 ? G.orangeTint : undefined,
                boxShadow: index === 0 ? `inset 0 0 0 1px ${G.orangeLine}` : undefined,
                marginBottom: 2
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: G.mono, fontSize: 11.8, fontWeight: index === 0 ? 500 : 400 }}>
                <Icon name='query' size={13} color={writes || index === 0 ? G.orangeInk : G.muted} />
                {name}
                {writes ? <span style={{ marginLeft: 'auto', fontFamily: G.sans, fontSize: 10.5, color: G.orangeInk }}>writes</span> : null}
              </div>
              <div style={{ fontSize: 11, color: G.muted, marginTop: 3, paddingLeft: 20 }}>Used by {usedBy}</div>
            </div>
          ))}
          <div style={{ marginTop: 'auto', padding: '12px 4px 0', borderTop: `1px solid ${G.line}` }}>
            <Label>Databases</Label>
            {[
              [DATABASE.name, `${DATABASE.engine} · read replica`, true],
              ['billing-eu', 'Postgres 15 · read only', false]
            ].map(([name, note, active]) => (
              <div key={String(name)} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 9 }}>
                <span style={{ width: 22, height: 22, borderRadius: 5, background: active ? G.ink : G.sunk, color: active ? '#fff' : G.muted, display: 'grid', placeItems: 'center' }}>
                  <Icon name='database' size={13} />
                </span>
                <div>
                  <div style={{ fontFamily: G.mono, fontSize: 11.8 }}>{name}</div>
                  <div style={{ fontSize: 10.5, color: G.muted }}>{note}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 50, flex: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', borderBottom: `1px solid ${G.line}`, background: G.surface }}>
            <span style={{ fontFamily: G.mono, fontSize: 14, fontWeight: 500 }}>{query.id}</span>
            <span style={{ color: G.muted }}>Reads</span>
            <Chip kind='database' quiet>
              {DATABASE.name}
            </Chip>
            <span style={{ color: G.muted }}>read replica</span>
            <span style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              <Button size={12}>Format</Button>
              <Button tone='ink' size={12}>
                <Icon name='play' size={12} color='#fff' /> Run
                <span style={{ fontFamily: G.mono, fontSize: 11, opacity: 0.6 }}>⌘↵</span>
              </Button>
            </span>
          </div>
          <div style={{ padding: '16px 18px', background: G.surface, borderBottom: `1px solid ${G.line}` }}>
            <Sql code={query.sql} size={13} lineHeight={1.75} numbers highlight={[7]} />
          </div>
          <div style={{ height: 40, flex: 'none', display: 'flex', alignItems: 'center', gap: 18, padding: '0 18px', borderBottom: `1px solid ${G.line}` }}>
            {['Result', 'Columns', 'Plan', 'History'].map((tab, index) => (
              <span
                key={tab}
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  color: index === 0 ? G.ink : G.muted,
                  fontWeight: index === 0 ? 500 : 400,
                  boxShadow: index === 0 ? `inset 0 -2px 0 ${G.ink}` : undefined
                }}
              >
                {tab}
              </span>
            ))}
            <span style={{ marginLeft: 'auto', color: G.muted, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: 9, background: G.green }} />
              14 rows · {query.ms} ms · ran at 14:40:12
            </span>
          </div>
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', fontFamily: G.mono, fontSize: 11.8 }}>
            <div style={{ display: 'flex', height: 30, alignItems: 'center', padding: '0 18px', color: G.muted, background: G.paper, borderBottom: `1px solid ${G.line}` }}>
              {RESULT_COLUMNS.map(([name, width]) => (
                <span key={name} style={{ width, flex: 'none' }}>
                  {name}
                </span>
              ))}
            </div>
            {WAITING_ROWS.slice(0, 12).map((row) => (
              <div key={String(row.id)} style={{ display: 'flex', height: 28, alignItems: 'center', padding: '0 18px', borderBottom: `1px solid ${G.line}`, background: G.surface }}>
                {RESULT_COLUMNS.map(([name, width, key]) => {
                  const value =
                    key === 'amount'
                      ? Number(row.amount).toFixed(2)
                      : key === 'waiting'
                        ? `${String(Math.floor(Number(row.waiting) / 60)).padStart(2, '0')}:${String(Number(row.waiting) % 60).padStart(2, '0')}:00`
                        : key === 'requested'
                          ? `03 Nov ${row.requested}`
                          : key === 'status'
                            ? String(row.status)
                            : cell(key as 'id', row);
                  return (
                    <span key={name} style={{ width, flex: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: 10, color: key === 'status' ? G.muted : G.ink }}>
                      {value}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </main>

        <aside style={{ width: 280, flex: 'none', borderLeft: `1px solid ${G.line}`, background: G.surface, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${G.line}` }}>
            <Label>Used by</Label>
            {[
              ['table', 'refundsTable', 'Waiting page · 6 of 9 columns'],
              ['text', 'waitingBadge', 'Nav · counts rows']
            ].map(([icon, name, note]) => (
              <div key={name} style={{ display: 'flex', gap: 10, marginTop: 11 }}>
                <span style={{ width: 26, height: 26, borderRadius: 6, background: G.blueTint, color: G.blue, display: 'grid', placeItems: 'center', flex: 'none' }}>
                  <Icon name={icon as 'table'} size={14} />
                </span>
                <div>
                  <div style={{ fontFamily: G.mono, fontSize: 12 }}>{name}</div>
                  <div style={{ fontSize: 11.5, color: G.muted, marginTop: 2 }}>{note}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${G.line}` }}>
            <Label>Columns other things read</Label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
              {['id', 'customer', 'amount_eur', 'reason', 'requested_by', 'waiting'].map((column) => (
                <span key={column} style={{ fontFamily: G.mono, fontSize: 11, padding: '3px 6px', borderRadius: 4, background: G.sunk, color: G.text2 }}>
                  {column}
                </span>
              ))}
            </div>
            <div style={{ fontSize: 11.5, color: G.muted, marginTop: 10, lineHeight: 1.5 }}>
              Renaming or removing one of these breaks refundsTable. Gantry checks before every deploy.
            </div>
          </div>
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${G.line}` }}>
            <Label>Runs</Label>
            <div style={{ marginTop: 9, lineHeight: 1.6, color: G.text2 }}>
              When the Waiting page opens, every 60 s while it is open, and after <span style={{ fontFamily: G.mono, fontSize: 11.5 }}>approve_refund</span> or{' '}
              <span style={{ fontFamily: G.mono, fontSize: 11.5 }}>reject_refund</span>.
            </div>
          </div>
          <div style={{ padding: '14px 16px' }}>
            <Label>Who can run it</Label>
            <div style={{ marginTop: 9, lineHeight: 1.6, color: G.text2 }}>Support agents, support leads and finance. Read only for all three.</div>
          </div>
          <div style={{ marginTop: 'auto', padding: '12px 16px', borderTop: `1px solid ${G.line}`, fontSize: 11.5, color: G.muted, lineHeight: 1.5 }}>
            Index scan on <span style={{ fontFamily: G.mono }}>refunds_status_requested_at_idx</span>. 18,402 rows in the table, 14 returned.
          </div>
        </aside>
      </div>
    </div>
  );
}
