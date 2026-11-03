import type * as React from 'react';
import { CANVAS_COLUMNS, CanvasPage, WAITING_ROWS } from './App';
import { DATABASE, G, QUERIES } from './model';
import { Avatar, Button, Check, Chip, Icon, Label, Mark, Switch } from './ui';

/** Gantry's top bar: app, mode tabs, preview role and deploy. */
export function TopBar({ active = 'Build', old }: { active?: string; old?: boolean }) {
  if (old) return <OldTopBar />;
  return (
    <div
      style={{
        height: 46,
        flex: 'none',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '0 12px 0 14px',
        borderBottom: `1px solid ${G.line}`,
        background: G.surface
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
        <Mark size={22} />
        <span style={{ color: G.muted }}>Tovholm</span>
        <span style={{ color: G.faint }}>/</span>
        <span style={{ fontWeight: 500 }}>Refund approvals</span>
        <span
          style={{
            fontFamily: G.mono,
            fontSize: 11,
            color: G.muted,
            background: G.sunk,
            borderRadius: 4,
            padding: '2px 6px'
          }}
        >
          v24 draft
        </span>
      </div>
      <div style={{ display: 'flex', gap: 2, padding: 2, borderRadius: 7, background: G.sunk }}>
        {['Build', 'Queries', 'Permissions', 'Deploys'].map((tab) => (
          <span
            key={tab}
            style={{
              height: 26,
              padding: '0 12px',
              display: 'grid',
              placeItems: 'center',
              borderRadius: 5,
              fontSize: 12.5,
              fontWeight: tab === active ? 500 : 400,
              color: tab === active ? G.ink : G.muted,
              background: tab === active ? G.surface : undefined,
              boxShadow: tab === active ? `0 0 0 1px ${G.line}, 0 1px 2px rgba(0,0,0,0.05)` : undefined
            }}
          >
            {tab}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifySelf: 'end' }}>
        <span style={{ display: 'flex' }}>
          <Avatar name='Nanna Krog' size={24} tone='#f2c9b4' />
          <span style={{ marginLeft: -4 }}>
            <Avatar name='Emil Brandt' size={24} tone='#c9d5e8' />
          </span>
        </span>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            height: 28,
            padding: '0 9px',
            borderRadius: 6,
            boxShadow: `inset 0 0 0 1px ${G.line}`,
            fontSize: 12.5,
            color: G.text2
          }}
        >
          <Icon name='eye' size={14} color={G.muted} />
          Preview as <span style={{ color: G.ink, fontWeight: 500 }}>Support agent</span>
          <Icon name='chevronDown' size={12} color={G.muted} />
        </span>
        <Button tone='primary' size={12.5} style={{ height: 28 }}>
          Deploy v24
        </Button>
      </div>
    </div>
  );
}

function OldTopBar() {
  return (
    <div
      style={{
        height: 46,
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '0 12px',
        background: '#2b2d31',
        color: '#e6e6e6',
        fontSize: 12.5
      }}
    >
      <Mark size={22} />
      <span>refund-tool-v2</span>
      <span style={{ color: '#8b8d93' }}>Saved 4 min ago</span>
      <div style={{ display: 'flex', gap: 14, marginLeft: 22, color: '#a8aab0' }}>
        {['File', 'Edit', 'View', 'Insert', 'Data', 'Help'].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        {['Undo', 'Redo', 'Code', 'Share'].map((item) => (
          <span key={item} style={{ padding: '4px 8px', borderRadius: 4, background: '#3a3c42', fontSize: 11.5 }}>
            {item}
          </span>
        ))}
        <span style={{ padding: '5px 10px', borderRadius: 4, background: G.orange, color: '#fff', fontSize: 11.5, fontWeight: 500 }}>
          Publish
        </span>
      </div>
    </div>
  );
}

type TreeItem = { name: string; kind: React.ComponentProps<typeof Icon>['name']; depth: number; bound?: string; writes?: boolean; selected?: boolean };

/** The left panel: pages and the component tree, each bound component naming its query. */
export function Tree({ selected = 'table' }: { selected?: 'table' | 'form' | 'none' }) {
  const items: TreeItem[] = [
    { name: 'Waiting', kind: 'page', depth: 0 },
    { name: 'title', kind: 'text', depth: 1 },
    { name: 'statsRow', kind: 'stat', depth: 1, bound: 'refund_totals' },
    { name: 'refundsTable', kind: 'table', depth: 1, bound: 'refunds_waiting', selected: selected === 'table' },
    { name: 'approveForm', kind: 'form', depth: 1, bound: 'approve_refund', writes: true, selected: selected === 'form' },
    { name: 'amountField', kind: 'input', depth: 2 },
    { name: 'noteField', kind: 'input', depth: 2 },
    { name: 'rejectButton', kind: 'button', depth: 2, bound: 'reject_refund', writes: true },
    { name: 'approveButton', kind: 'button', depth: 2 }
  ];
  return (
    <aside
      style={{
        width: 232,
        flex: 'none',
        borderRight: `1px solid ${G.line}`,
        background: G.surface,
        display: 'flex',
        flexDirection: 'column',
        fontSize: 12.5
      }}
    >
      <div style={{ padding: '14px 14px 8px' }}>
        <Label right={<Icon name='plus' size={14} color={G.muted} />}>Pages</Label>
        {['Waiting', 'Over €500', 'Done today'].map((page, index) => (
          <div
            key={page}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              height: 28,
              padding: '0 8px',
              margin: '2px -6px 0',
              borderRadius: 6,
              background: index === 0 ? G.sunk : undefined,
              color: index === 0 ? G.ink : G.text2
            }}
          >
            <Icon name='page' size={14} color={G.muted} />
            {page}
          </div>
        ))}
      </div>
      <div style={{ padding: '10px 14px', borderTop: `1px solid ${G.line}` }}>
        <Label right={<Icon name='plus' size={14} color={G.muted} />}>Components</Label>
        <div style={{ marginTop: 6 }}>
          {items.slice(1).map((item) => (
            <div
              key={item.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                height: 28,
                padding: `0 6px 0 ${6 + (item.depth - 1) * 16}px`,
                margin: '1px -6px 0',
                borderRadius: 6,
                background: item.selected ? G.blueTint : undefined,
                color: item.selected ? G.blue : G.ink,
                boxShadow: item.selected ? `inset 0 0 0 1px ${G.blueLine}` : undefined
              }}
            >
              <Icon name={item.kind} size={14} color={item.selected ? G.blue : G.muted} />
              <span style={{ fontFamily: G.mono, fontSize: 11.5 }}>{item.name}</span>
              {item.bound ? (
                <span
                  style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontFamily: G.mono,
                    fontSize: 10.5,
                    color: G.orangeInk,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    maxWidth: 108
                  }}
                >
                  {item.writes ? '→' : '←'}
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.bound}</span>
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '10px 14px', borderTop: `1px solid ${G.line}`, marginTop: 'auto' }}>
        <Label right={<span style={{ fontFamily: G.mono, fontSize: 11 }}>6</span>}>Queries on ops-eu</Label>
        {['refunds_waiting', 'refunds_over_500', 'refunds_by_agent', 'refund_totals', 'approve_refund', 'reject_refund'].map((query, index) => (
          <div key={query} style={{ display: 'flex', alignItems: 'center', gap: 7, height: 24, fontFamily: G.mono, fontSize: 11.5, color: G.text2 }}>
            <Icon name='query' size={13} color={index > 3 ? G.orangeInk : G.muted} />
            {query}
            {index > 3 ? <span style={{ marginLeft: 'auto', fontFamily: G.sans, fontSize: 10.5, color: G.muted }}>writes</span> : null}
          </div>
        ))}
      </div>
    </aside>
  );
}

const DOTS = `radial-gradient(circle at 1px 1px, rgba(22,22,22,0.13) 1px, transparent 1.2px) 0 0 / 16px 16px`;

export function Canvas({ selected, old, children }: { selected?: 'table' | 'form'; old?: boolean; children?: React.ReactNode }) {
  return (
    <div style={{ flex: 1, minWidth: 0, position: 'relative', background: `${DOTS}, ${G.canvas}`, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 14px',
          fontSize: 11.5,
          color: G.muted
        }}
      >
        <span>{old ? 'page1 · 100%' : 'Waiting · 1280 wide · 100%'}</span>
        {old ? (
          <span>Preview data: query3 (cached 2 h ago)</span>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 9, background: G.green }} />
            Live data from {DATABASE.name}, read only
          </span>
        )}
      </div>
      <div style={{ position: 'absolute', left: 28, top: 44 }}>{children ?? <CanvasPage selected={selected} />}</div>
    </div>
  );
}

/** One step in a binding chain. */
export function ChainNode({
  kind,
  name,
  detail,
  size = 12.5,
  last
}: {
  kind: 'table' | 'query' | 'database' | 'form';
  name: string;
  detail: string;
  size?: number;
  last?: boolean;
}) {
  const label = { table: 'Table', query: 'Query', database: 'Database', form: 'Form' }[kind];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `${size * 2.2}px 1fr`, columnGap: size * 0.8, position: 'relative' }}>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <span
          style={{
            width: size * 2.2,
            height: size * 2.2,
            borderRadius: size * 0.55,
            display: 'grid',
            placeItems: 'center',
            background: kind === 'database' ? G.ink : kind === 'query' ? G.orangeTint : G.blueTint,
            color: kind === 'database' ? '#fff' : kind === 'query' ? G.orangeInk : G.blue,
            boxShadow: kind === 'query' ? `inset 0 0 0 1px ${G.orangeLine}` : kind === 'database' ? 'none' : `inset 0 0 0 1px ${G.blueLine}`,
            position: 'relative',
            zIndex: 1
          }}
        >
          <Icon name={kind} size={size * 1.15} stroke={1.4} />
        </span>
        {last ? null : (
          <span
            style={{
              position: 'absolute',
              top: size * 2.2,
              bottom: -size * 0.9,
              width: 1.5,
              background: `repeating-linear-gradient(${G.orange} 0 3px, transparent 3px 6px)`
            }}
          />
        )}
      </div>
      <div style={{ paddingBottom: last ? 0 : size * 1.1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: size * 0.5, flexWrap: 'wrap' }}>
          <span style={{ fontSize: size * 0.86, color: G.muted }}>{label}</span>
          <span style={{ fontFamily: G.mono, fontSize: size * 0.98, fontWeight: 500, color: G.ink }}>{name}</span>
        </div>
        <div style={{ fontSize: size * 0.88, color: G.muted, marginTop: size * 0.2 }}>{detail}</div>
      </div>
    </div>
  );
}

function Section({ title, right, children, first }: { title: string; right?: React.ReactNode; children: React.ReactNode; first?: boolean }) {
  return (
    <div style={{ padding: '12px 16px', borderTop: first ? undefined : `1px solid ${G.line}` }}>
      <Label right={right}>{title}</Label>
      <div style={{ marginTop: 10 }}>{children}</div>
    </div>
  );
}

function InspectorHead({ icon, name, kind }: { icon: 'table' | 'form'; name: string; kind: string }) {
  return (
    <div style={{ height: 46, flex: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', borderBottom: `1px solid ${G.line}` }}>
      <span style={{ width: 24, height: 24, borderRadius: 6, background: G.blueTint, color: G.blue, display: 'grid', placeItems: 'center' }}>
        <Icon name={icon} size={14} />
      </span>
      <span style={{ fontFamily: G.mono, fontSize: 12.5, fontWeight: 500 }}>{name}</span>
      <span style={{ fontSize: 12, color: G.muted }}>{kind}</span>
      <span style={{ marginLeft: 'auto', color: G.muted }}>
        <Icon name='dots' size={16} />
      </span>
    </div>
  );
}

function Collapsed({ label, count }: { label: string; count: number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 40,
        padding: '0 16px',
        borderTop: `1px solid ${G.line}`,
        fontSize: 12.5,
        color: G.text2
      }}
    >
      {label}
      <span style={{ marginLeft: 8, fontSize: 11.5, color: G.faint }}>{count} settings</span>
      <span style={{ marginLeft: 'auto', color: G.muted }}>
        <Icon name='chevron' size={14} />
      </span>
    </div>
  );
}

/** The redesigned inspector with the table selected: where the data comes from, then what to show. */
export function TableInspector({ width = 312 }: { width?: number }) {
  const query = QUERIES[0];
  const visible = new Set(query.defaultColumns);
  return (
    <aside style={{ width, flex: 'none', borderLeft: `1px solid ${G.line}`, background: G.surface, display: 'flex', flexDirection: 'column', fontSize: 12.5 }}>
      <InspectorHead icon='table' name='refundsTable' kind='Table' />
      <Section title='Data' first right={<span style={{ color: G.blue, fontSize: 12 }}>Change</span>}>
        <div style={{ fontSize: 13.5, lineHeight: 1.55, letterSpacing: '-0.01em', color: G.ink, textWrap: 'pretty' }}>
          Shows <b style={{ fontWeight: 600 }}>{WAITING_ROWS.length} rows</b> from <Chip>{query.id}</Chip> on{' '}
          <Chip kind='database' quiet>
            {DATABASE.name}
          </Chip>
        </div>
        <div style={{ marginTop: 14, padding: '12px 12px 12px', borderRadius: 8, background: G.paper, boxShadow: `inset 0 0 0 1px ${G.line}` }}>
          <ChainNode kind='table' name='refundsTable' detail={`6 of 9 columns · row click fills approveForm`} size={12} />
          <ChainNode kind='query' name={query.id} detail={`Ran 12 s ago · ${query.ms} ms · ${WAITING_ROWS.length} rows`} size={12} />
          <ChainNode kind='database' name={DATABASE.name} detail={`${DATABASE.engine} · ${DATABASE.replica}, ${DATABASE.where}`} size={12} last />
        </div>
      </Section>
      <Section title='Columns' right={<span style={{ fontSize: 11.5, color: G.muted }}>6 of 9 shown</span>}>
        {query.columns.map((column) => (
          <div key={column.key} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 22.5 }}>
            <Icon name='grip' size={13} color={G.faint} />
            <Check on={visible.has(column.key)} size={13} />
            <span style={{ color: visible.has(column.key) ? G.ink : G.muted }}>{column.label}</span>
            <span style={{ marginLeft: 'auto', fontFamily: G.mono, fontSize: 11, color: G.faint }}>{column.sql}</span>
          </div>
        ))}
      </Section>
      <Section title='When a row is clicked'>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: G.text2 }}>
          Fill <Chip kind='form' quiet>approveForm</Chip> with the row
        </div>
      </Section>
      <Collapsed label='Style and layout' count={12} />
      <Collapsed label='Advanced' count={9} />
    </aside>
  );
}

/** The redesigned inspector with the form selected: what it reads, what it writes, who may use it. */
export function FormInspector({ width = 312 }: { width?: number }) {
  return (
    <aside style={{ width, flex: 'none', borderLeft: `1px solid ${G.line}`, background: G.surface, display: 'flex', flexDirection: 'column', fontSize: 12.5 }}>
      <InspectorHead icon='form' name='approveForm' kind='Form' />
      <Section title='Data' first>
        <div style={{ fontSize: 13.5, lineHeight: 1.6, letterSpacing: '-0.01em', textWrap: 'pretty' }}>
          Edits the row picked in <Chip kind='table' quiet>refundsTable</Chip> and saves it with <Chip>approve_refund</Chip>
        </div>
        <div style={{ marginTop: 14, padding: 12, borderRadius: 8, background: G.paper, boxShadow: `inset 0 0 0 1px ${G.line}` }}>
          <ChainNode kind='table' name='refundsTable.selectedRow' detail='R-20931 · Lea Christensen' size={12} />
          <ChainNode kind='query' name='approve_refund' detail='Updates 1 row · only if still pending' size={12} />
          <ChainNode kind='database' name={DATABASE.name} detail={`${DATABASE.engine} · primary, ${DATABASE.where}`} size={12} last />
        </div>
      </Section>
      <Section title='Fields'>
        {[
          ['amountField', 'Amount', '← selectedRow.amount_eur'],
          ['noteField', 'Note to customer', 'typed by the agent']
        ].map(([name, label, source]) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, height: 36 }}>
            <div>
              <div>{label}</div>
              <div style={{ fontFamily: G.mono, fontSize: 10.5, color: G.faint, marginTop: 1 }}>{name}</div>
            </div>
            <span style={{ fontFamily: G.mono, fontSize: 11, color: source.startsWith('←') ? G.orangeInk : G.muted }}>{source}</span>
          </div>
        ))}
      </Section>
      <Section title='Who can approve'>
        {[
          ['Support leads only', 'Nanna Krog, Sofie Lund, Aksel Holm', true],
          ['A second lead over €500', 'Set in Permissions, rule 3', true]
        ].map(([title, note, on]) => (
          <div key={String(title)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
            <div style={{ flex: 1 }}>
              <div>{title}</div>
              <div style={{ fontSize: 11.5, color: G.muted, marginTop: 2 }}>{note}</div>
            </div>
            <Switch on={Boolean(on)} />
          </div>
        ))}
      </Section>
      <Section title='After saving'>
        <div style={{ color: G.text2, lineHeight: 1.6 }}>
          Run <Chip quiet>refunds_waiting</Chip> again, then say “Refund approved”
        </div>
      </Section>
    </aside>
  );
}

const OLD_NAMES = { stats: 'container1', table: 'table1', form: 'form1' };

const OLD_FIELDS: [string, string, 'text' | 'code' | 'toggle' | 'select'][] = [
  ['Name', 'table1', 'text'],
  ['Data', '{{ query3.data }}', 'code'],
  ['Transform', '{{ data.filter(r => r.st…', 'code'],
  ['Row key', 'id', 'text'],
  ['Columns', 'Auto (9)  Edit JSON', 'select'],
  ['Default sort', 'None', 'select'],
  ['Sort order', 'Ascending', 'select'],
  ['Page size', '10', 'text'],
  ['Server paging', 'off', 'toggle'],
  ['Total rows', '{{ query3.count }}', 'code'],
  ['Selection', 'Single row', 'select'],
  ['Default row', '{{ 0 }}', 'code'],
  ['Searchable', 'on', 'toggle'],
  ['Placeholder', 'Search…', 'text'],
  ['Show header', 'on', 'toggle'],
  ['Sticky header', 'off', 'toggle'],
  ['Striped', 'off', 'toggle'],
  ['Compact', 'on', 'toggle'],
  ['Row height', '32', 'text'],
  ['Empty text', 'No data', 'text'],
  ['Loading', '{{ query3.isFetching }}', 'code'],
  ['Hidden', '{{ false }}', 'code'],
  ['Disabled', '{{ false }}', 'code'],
  ['Refetch', '{{ query3.trigger }}', 'code'],
  ['Error text', '{{ query3.error }}', 'code'],
  ['Cache key', 'table1_q3', 'text'],
  ['Min width', '320', 'text'],
  ['Margin', '0 0 16 0', 'text']
];

/** Before: the old inspector. Twenty-eight fields on the first tab, and no way to see where query3 lives. */
export function OldInspector({ width = 312 }: { width?: number }) {
  return (
    <aside
      style={{
        width,
        flex: 'none',
        borderLeft: '1px solid #d6d6d6',
        background: '#f3f3f3',
        display: 'flex',
        flexDirection: 'column',
        fontSize: 11,
        position: 'relative',
        color: '#2a2a2a'
      }}
    >
      <div style={{ height: 34, display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', borderBottom: '1px solid #d6d6d6', background: '#eaeaea' }}>
        <b style={{ fontWeight: 600 }}>table1</b>
        <span style={{ color: '#888' }}>(Table)</span>
        <span style={{ marginLeft: 'auto', color: '#888' }}>id: cmp_8f21a</span>
      </div>
      <div style={{ display: 'flex', borderBottom: '1px solid #d6d6d6', background: '#eaeaea' }}>
        {[
          ['Properties', 28],
          ['Style', 11],
          ['Events', 6],
          ['Advanced', 9]
        ].map(([tab, count], index) => (
          <span
            key={String(tab)}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '7px 0',
              fontSize: 10.5,
              color: index === 0 ? '#111' : '#777',
              background: index === 0 ? '#f3f3f3' : undefined,
              borderRight: '1px solid #d6d6d6',
              marginBottom: index === 0 ? -1 : 0
            }}
          >
            {tab} <span style={{ color: '#999' }}>{count}</span>
          </span>
        ))}
      </div>
      <div style={{ padding: '6px 14px 6px 10px', overflow: 'hidden', flex: 1 }}>
        {OLD_FIELDS.map(([label, value, type]) => (
          <div key={label} style={{ display: 'grid', gridTemplateColumns: '86px 1fr', alignItems: 'center', gap: 6, height: 22.6 }}>
            <span style={{ color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
            {type === 'toggle' ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#666' }}>
                <span
                  style={{
                    width: 11,
                    height: 11,
                    border: '1px solid #aaa',
                    borderRadius: 2,
                    background: value === 'on' ? '#5b6b8c' : '#fff'
                  }}
                />
              </span>
            ) : (
              <span
                style={{
                  height: 19,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 5px',
                  border: `1px solid ${label === 'Data' ? '#e0a43a' : '#cfcfcf'}`,
                  borderRadius: 2,
                  background: '#fff',
                  fontFamily: type === 'code' ? G.mono : undefined,
                  fontSize: type === 'code' ? 10 : 11,
                  color: type === 'code' ? '#7a3fb0' : '#222',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden'
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
                {type === 'select' ? <span style={{ color: '#999' }}>▾</span> : null}
              </span>
            )}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', right: 3, top: 76, width: 5, height: 210, borderRadius: 3, background: '#c4c4c4' }} />
      <div
        style={{
          position: 'absolute',
          right: 16,
          top: 150,
          width: 222,
          padding: '10px 12px',
          borderRadius: 6,
          background: '#fff8c5',
          boxShadow: '0 6px 18px rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.06)',
          fontFamily: G.sans,
          fontSize: 12,
          lineHeight: 1.45,
          color: '#2a2a2a'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#777' }}>
          <Avatar name='Emil Brandt' size={16} tone='#c9d5e8' /> Emil Brandt · comment
        </div>
        <div style={{ marginTop: 5 }}>
          Which database is query3 on? I changed it and the table went blank on the live tool.
        </div>
      </div>
    </aside>
  );
}

function OldTree() {
  const items = ['container1', 'text1', 'stat1', 'stat2', 'stat3', 'table1', 'form1', 'textInput1', 'textInput2', 'button1', 'button2'];
  return (
    <aside style={{ width: 232, flex: 'none', borderRight: '1px solid #d6d6d6', background: '#f3f3f3', fontSize: 11.5, color: '#2a2a2a', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 10px', borderBottom: '1px solid #d6d6d6', background: '#eaeaea', fontWeight: 600, fontSize: 11 }}>Components (11)</div>
      <div style={{ padding: '6px 10px' }}>
        {items.map((item, index) => (
          <div
            key={item}
            style={{
              height: 22,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: index === 0 ? 0 : index > 6 ? 28 : 14,
              background: item === 'table1' ? '#d9e1f2' : undefined,
              margin: '0 -10px',
              padding: `0 10px 0 ${10 + (index === 0 ? 0 : index > 6 ? 28 : 14)}px`
            }}
          >
            {item}
          </div>
        ))}
      </div>
      <div style={{ padding: '8px 10px', borderTop: '1px solid #d6d6d6', borderBottom: '1px solid #d6d6d6', background: '#eaeaea', fontWeight: 600, fontSize: 11, marginTop: 'auto' }}>
        Queries (7)
      </div>
      <div style={{ padding: '6px 10px 10px', fontFamily: G.mono, fontSize: 10.5, color: '#444' }}>
        {['query1', 'query2', 'query3', 'query4', 'query5', 'query6', 'query7'].map((item) => (
          <div key={item} style={{ height: 20, display: 'flex', alignItems: 'center' }}>
            {item}
          </div>
        ))}
      </div>
    </aside>
  );
}

/** The whole builder. Designed at 1240 × 760. */
export function BuilderScreen({ selected = 'table', old }: { selected?: 'table' | 'form'; old?: boolean }) {
  return (
    <div style={{ width: 1240, height: 760, display: 'flex', flexDirection: 'column', background: G.paper, color: G.ink, fontFamily: G.sans }}>
      <TopBar old={old} />
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        {old ? <OldTree /> : <Tree selected={selected} />}
        <Canvas old={old}>
          <CanvasPage selected={selected} columns={CANVAS_COLUMNS} names={old ? OLD_NAMES : undefined} />
        </Canvas>
        {old ? <OldInspector /> : selected === 'form' ? <FormInspector /> : <TableInspector />}
      </div>
    </div>
  );
}
