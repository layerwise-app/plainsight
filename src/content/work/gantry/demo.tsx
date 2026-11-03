import { useId, useState } from 'react';
import type * as React from 'react';
import { type ColumnKey, type Query, type Row, DATABASE, G, QUERIES, cell, eur, queryById } from './screens/model';
import { Chip, Icon, Mark, StatusPill } from './screens/ui';

type Selected = 'title' | 'table' | 'form';
type Filter = { column: ColumnKey; value: string };

const PAGE_SIZE = 7;
const RING = 'focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#2F5BEA]';

const COMPONENTS: { key: Selected; name: string; kind: string; icon: 'text' | 'table' | 'form' }[] = [
  { key: 'title', name: 'title', kind: 'Text', icon: 'text' },
  { key: 'table', name: 'refundsTable', kind: 'Table', icon: 'table' },
  { key: 'form', name: 'approveForm', kind: 'Form', icon: 'form' }
];

const raw = (key: ColumnKey, row: Row) => String(row[key] ?? '');
const label = (key: ColumnKey, value: string) => (key === 'status' ? value.replace(/^./, (c) => c.toUpperCase()) : value);

function distinct(query: Query, key: ColumnKey) {
  const values = [...new Set(query.rows().map((row) => raw(key, row)))];
  // Pending first: it is the filter people reach for.
  return values.sort((a, b) => (a === 'pending' ? -1 : b === 'pending' ? 1 : a.localeCompare(b)));
}

function columnLabel(query: Query, key: ColumnKey) {
  return query.columns.find((column) => column.key === key)?.label ?? key;
}

/** Live demo: a small Gantry builder. Pick a component, bind it to a query, and watch the preview follow. */
export default function GantryDemo() {
  const [selected, setSelected] = useState<Selected>('table');
  const [queryId, setQueryId] = useState(QUERIES[0].id);
  const [columns, setColumns] = useState<Record<string, ColumnKey[]>>(() =>
    Object.fromEntries(QUERIES.map((query) => [query.id, query.defaultColumns]))
  );
  const [filter, setFilter] = useState<Filter | null>(null);
  const [page, setPage] = useState(0);
  const [rowId, setRowId] = useState<string | undefined>('R-20931');
  const [note, setNote] = useState('Sorry about the armrest. We have refunded half the sofa and the delivery.');
  const [twoLeads, setTwoLeads] = useState(true);
  const [message, setMessage] = useState('');

  const query = queryById(queryId);
  const all = query.rows();
  const rows = filter ? all.filter((row) => raw(filter.column, row) === filter.value) : all;
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pages - 1);
  const shown = rows.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);
  const visible = query.columns.filter((column) => columns[query.id].includes(column.key));
  const hasIds = query.columns.some((column) => column.key === 'id');
  const picked = hasIds ? (rows.find((row) => row.id === rowId) ?? rows[0]) : undefined;

  const chain = `Table shows ${rows.length} ${rows.length === 1 ? 'row' : 'rows'} from query ${query.id}${
    filter ? `, where ${filter.column === 'agent' ? 'requested_by' : filter.column} is ${filter.value},` : ''
  } on database ${DATABASE.name}.`;

  const pickQuery = (id: string) => {
    const next = queryById(id);
    setQueryId(id);
    setPage(0);
    setMessage('');
    if (filter && !next.filterable.includes(filter.column)) setFilter(null);
    const nextRows = next.rows();
    if (!nextRows.some((row) => row.id === rowId)) setRowId(nextRows[0]?.id as string | undefined);
  };

  const toggleColumn = (key: ColumnKey) =>
    setColumns((all) => {
      const list = all[query.id];
      if (list.includes(key) && list.length === 1) return all;
      const next = list.includes(key) ? list.filter((item) => item !== key) : query.columns.map((c) => c.key).filter((k) => list.includes(k) || k === key);
      return { ...all, [query.id]: next };
    });

  const addFilter = () => {
    const column = query.filterable[0];
    setFilter({ column, value: distinct(query, column)[0] });
    setPage(0);
  };

  return (
    <div
      className='@container flex min-h-full w-full flex-col'
      style={{ background: G.paper, color: G.ink, fontFamily: G.sans, fontSize: 13, letterSpacing: '-0.003em' }}
    >
      <header className='flex h-12 flex-none items-center gap-3 px-4' style={{ background: G.surface, borderBottom: `1px solid ${G.line}` }}>
        <Mark size={22} />
        <span className='hidden @min-[480px]:inline' style={{ color: G.muted }}>
          Tovholm /
        </span>
        <span style={{ fontWeight: 500 }}>Refund approvals</span>
        <span className='ml-auto hidden items-center gap-2 @min-[620px]:flex' style={{ fontSize: 12, color: G.muted }}>
          <span style={{ width: 6, height: 6, borderRadius: 9, background: G.green }} />
          Live data from {DATABASE.name}, read only
        </span>
      </header>

      <div className='grid flex-1 grid-cols-1 @min-[700px]:grid-cols-[minmax(0,1fr)_300px] @min-[1000px]:grid-cols-[200px_minmax(0,1fr)_320px]'>
        {/* Component tree. A row of chips until there is room for a column. */}
        <nav
          aria-label='Components'
          className='flex flex-wrap items-center gap-1.5 px-3 py-2.5 @min-[700px]:col-span-2 @min-[1000px]:col-span-1 @min-[1000px]:flex-col @min-[1000px]:flex-nowrap @min-[1000px]:items-stretch @min-[1000px]:gap-0.5 @min-[1000px]:px-3 @min-[1000px]:py-4'
          style={{ background: G.surface, borderBottom: `1px solid ${G.line}`, borderRight: `1px solid ${G.line}` }}
        >
          <span className='mr-1 hidden px-2 pb-2 @min-[1000px]:block' style={{ fontSize: 11.5, color: G.muted, fontWeight: 500 }}>
            Components on Waiting
          </span>
          {COMPONENTS.map((component) => {
            const on = selected === component.key;
            const bound = component.key === 'table' ? `← ${query.id}` : component.key === 'form' ? '→ approve_refund' : '';
            return (
              <button
                key={component.key}
                type='button'
                aria-pressed={on}
                onClick={() => setSelected(component.key)}
                className={`flex min-h-8 items-center gap-2 rounded-md px-2 text-left @min-[1000px]:items-start @min-[1000px]:[&>svg]:mt-2 ${RING}`}
                style={{
                  background: on ? G.blueTint : 'transparent',
                  color: on ? G.blue : G.ink,
                  boxShadow: on ? `inset 0 0 0 1px ${G.blueLine}` : `inset 0 0 0 1px transparent`
                }}
              >
                <Icon name={component.icon} size={14} color={on ? G.blue : G.muted} />
                <span className='min-w-0 @min-[1000px]:py-1.5'>
                  <span className='block' style={{ fontFamily: G.mono, fontSize: 12 }}>
                    {component.name}
                  </span>
                  {bound ? (
                    <span className='hidden truncate @min-[1000px]:block' style={{ fontFamily: G.mono, fontSize: 10.5, color: G.orangeInk, marginTop: 1 }}>
                      {bound}
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Canvas: the page itself, running on live data. */}
        <div
          className='min-w-0 p-3 @min-[480px]:p-5 @min-[1000px]:p-6'
          style={{ background: `radial-gradient(circle at 1px 1px, rgba(22,22,22,0.13) 1px, transparent 1.2px) 0 0 / 16px 16px, ${G.canvas}` }}
        >
          <div className='@container mx-auto max-w-[760px] rounded-[10px] px-4 pt-8 pb-4 @min-[480px]:px-5 @min-[480px]:pb-5' style={{ background: G.paper, boxShadow: `0 0 0 1px ${G.line}, 0 12px 32px -18px rgba(22,22,22,0.22)` }}>
            <Frame name='title' kind='Text' on={selected === 'title'} onSelect={() => setSelected('title')}>
              <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>Refund approvals</div>
              <div style={{ fontSize: 12, color: G.muted, marginTop: 3 }} aria-live='polite'>
                {rows.length} {rows.length === 1 ? 'row' : 'rows'} · {query.label}
                {filter ? ` · ${columnLabel(query, filter.column).toLowerCase()} ${label(filter.column, filter.value)}` : ''}
              </div>
            </Frame>

            <Frame name='refundsTable' kind='Table' on={selected === 'table'} onSelect={() => setSelected('table')} className='mt-8'>
              <div className='overflow-hidden rounded-lg' style={{ background: G.surface, boxShadow: `inset 0 0 0 1px ${G.line}` }}>
                {/* biome-ignore lint/a11y/noNoninteractiveTabindex: a scrolling region has to take focus so keyboards can scroll it */}
                <section className='overflow-x-auto' aria-label='Table preview' tabIndex={0}>
                  <table className='w-full border-collapse' style={{ fontSize: 12.5, minWidth: Math.max(420, visible.length * 96) }}>
                    <caption className='sr-only'>{chain}</caption>
                    <thead>
                      <tr style={{ background: G.paper, color: G.muted, fontSize: 11.5 }}>
                        {visible.map((column) => (
                          <th
                            key={column.key}
                            scope='col'
                            className='h-8 px-3 font-medium whitespace-nowrap'
                            style={{ textAlign: column.align ?? 'left', borderBottom: `1px solid ${G.line}` }}
                          >
                            {column.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {shown.map((row) => {
                        const on = hasIds && picked?.id === row.id;
                        return (
                          <tr
                            key={String(row.id ?? row.agent)}
                            onClick={hasIds ? () => setRowId(row.id as string) : undefined}
                            style={{
                              background: on ? G.orangeTint : undefined,
                              boxShadow: on ? `inset 2px 0 0 ${G.orange}` : undefined,
                              cursor: hasIds ? 'pointer' : undefined
                            }}
                          >
                            {visible.map((column, index) => (
                              <td
                                key={column.key}
                                className='h-[37px] px-3 whitespace-nowrap'
                                style={{
                                  textAlign: column.align ?? 'left',
                                  borderBottom: `1px solid ${G.line}`,
                                  fontFamily: column.mono ? G.mono : undefined,
                                  fontSize: column.mono ? 12 : undefined,
                                  fontVariantNumeric: 'tabular-nums',
                                  color: column.key === 'id' || column.key === 'order' || column.key === 'requested' ? G.muted : G.ink
                                }}
                              >
                                {column.key === 'status' ? (
                                  <StatusPill status={row.status as 'pending'} size={11.5} />
                                ) : index === 0 && hasIds ? (
                                  <button
                                    type='button'
                                    aria-pressed={on}
                                    aria-label={`Pick ${row.id}, ${row.customer}`}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setRowId(row.id as string);
                                    }}
                                    className={`-mx-1 rounded px-1 ${RING}`}
                                    style={{ font: 'inherit', color: 'inherit' }}
                                  >
                                    {cell(column.key, row)}
                                  </button>
                                ) : (
                                  cell(column.key, row)
                                )}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                      {shown.length === 0 ? (
                        <tr>
                          <td colSpan={visible.length} className='h-24 px-3 text-center' style={{ color: G.muted }}>
                            No rows match this filter.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </section>
                <div className='flex h-10 items-center justify-between px-3' style={{ fontSize: 12, color: G.muted }}>
                  <span>
                    {rows.length ? `${current * PAGE_SIZE + 1}–${current * PAGE_SIZE + shown.length} of ${rows.length}` : '0 rows'}
                  </span>
                  <span className='flex gap-1'>
                    <PageButton disabled={current === 0} onClick={() => setPage(current - 1)}>
                      Previous
                    </PageButton>
                    <PageButton disabled={current >= pages - 1} onClick={() => setPage(current + 1)}>
                      Next
                    </PageButton>
                  </span>
                </div>
              </div>
            </Frame>

            <Frame name='approveForm' kind='Form' on={selected === 'form'} onSelect={() => setSelected('form')} className='mt-8'>
              <ApproveForm
                row={picked}
                query={query}
                note={note}
                onNote={setNote}
                twoLeads={twoLeads}
                onAction={(verb) =>
                  picked &&
                  setMessage(
                    `Preview only. ${verb === 'approve' ? 'approve_refund' : 'reject_refund'} would set ${picked.id} to ${verb === 'approve' ? (twoLeads && Number(picked.amount) > 500 ? 'waiting for a second lead' : 'approved') : 'rejected'}. Nothing was written.`
                  )
                }
              />
              <p aria-live='polite' className='min-h-0 empty:hidden' style={{ fontSize: 12, color: G.text2, marginTop: 8 }}>
                {message}
              </p>
            </Frame>
          </div>
        </div>

        {/* Inspector. */}
        <aside
          aria-label='Inspector'
          className='min-w-0 @max-[699px]:border-t'
          style={{ background: G.surface, borderLeft: `1px solid ${G.line}`, borderColor: G.line }}
        >
          {selected === 'table' ? (
            <TableInspector
              query={query}
              chain={chain}
              count={rows.length}
              visible={columns[query.id]}
              onQuery={pickQuery}
              onColumn={toggleColumn}
              filter={filter}
              onAddFilter={addFilter}
              onFilter={(next) => {
                setFilter(next);
                setPage(0);
              }}
            />
          ) : selected === 'form' ? (
            <FormInspector row={picked} query={query} twoLeads={twoLeads} onTwoLeads={setTwoLeads} />
          ) : (
            <TitleInspector query={query} count={rows.length} />
          )}
        </aside>
      </div>
    </div>
  );
}

/** A component on the canvas: click it, or Tab to its name tag and press Enter. */
function Frame({
  name,
  kind,
  on,
  onSelect,
  className = '',
  children
}: {
  name: string;
  kind: string;
  on: boolean;
  onSelect: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents lint/a11y/noStaticElementInteractions: a mouse shortcut; the name tag below is the keyboard path
    <div className={`relative ${className}`} onClick={onSelect}>
      <button
        type='button'
        aria-pressed={on}
        aria-label={`Select ${name}, ${kind}`}
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
        className={`absolute -top-[22px] -left-[5px] z-10 h-[18px] rounded px-1.5 ${RING}`}
        style={{
          background: on ? G.blue : G.surface,
          color: on ? '#fff' : G.blue,
          boxShadow: on ? 'none' : `inset 0 0 0 1px ${G.blueLine}`,
          fontFamily: G.mono,
          fontSize: 10.5,
          lineHeight: '18px',
          fontWeight: 500,
          opacity: on ? 1 : 0.9
        }}
      >
        {name}
        <span style={{ fontFamily: G.sans, opacity: 0.72, marginLeft: 5 }}>{kind}</span>
      </button>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute -inset-1 rounded-[10px]'
        style={{ boxShadow: on ? `0 0 0 1.5px ${G.blue}` : `0 0 0 1px ${G.blueLine}`, opacity: on ? 1 : 0.6 }}
      />
      {children}
    </div>
  );
}

function PageButton({ disabled, onClick, children }: { disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type='button'
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={`h-7 rounded-md px-2 disabled:cursor-default ${RING}`}
      style={{ color: disabled ? G.faint : G.ink }}
    >
      {children}
    </button>
  );
}

function ApproveForm({
  row,
  query,
  note,
  onNote,
  twoLeads,
  onAction
}: {
  row?: Row;
  query: Query;
  note: string;
  onNote: (note: string) => void;
  twoLeads: boolean;
  onAction: (verb: 'approve' | 'reject') => void;
}) {
  const id = useId();
  if (!row)
    return (
      <div className='rounded-lg p-4' style={{ background: G.surface, boxShadow: `inset 0 0 0 1px ${G.line}`, fontSize: 12.5, color: G.muted, lineHeight: 1.5 }}>
        Nothing to approve. <span style={{ fontFamily: G.mono, color: G.ink }}>{query.id}</span> returns one row per agent, not refunds, so approveForm has
        no row to edit.
      </div>
    );
  const over = Number(row.amount) > 500;
  const pending = row.status === 'pending';
  return (
    <div className='rounded-lg p-3.5' style={{ background: G.surface, boxShadow: `inset 0 0 0 1px ${G.line}` }}>
      <div className='flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1'>
        <div style={{ fontSize: 13, fontWeight: 600 }}>
          {pending ? 'Approve' : 'Already decided:'} <span style={{ fontFamily: G.mono, fontWeight: 500 }}>{row.id}</span>
          <span style={{ fontWeight: 400, color: G.muted }}> · {row.customer}</span>
        </div>
        {over && twoLeads && pending ? <div style={{ fontSize: 11.5, color: G.orangeInk }}>Over €500: needs a second lead</div> : null}
      </div>
      <div className='mt-2.5 grid grid-cols-1 items-end gap-2 @min-[500px]:grid-cols-[110px_minmax(0,1fr)_auto]'>
        <div>
          <label htmlFor={`${id}a`} style={{ fontSize: 11, color: G.muted }}>
            Amount
          </label>
          <input
            id={`${id}a`}
            readOnly
            value={eur(Number(row.amount))}
            className={`mt-1 block h-[30px] w-full rounded-md px-2.5 ${RING}`}
            style={{ boxShadow: `inset 0 0 0 1px ${G.lineStrong}`, background: G.paper, fontFamily: G.mono, fontSize: 12 }}
          />
        </div>
        <div className='min-w-0'>
          <label htmlFor={`${id}n`} style={{ fontSize: 11, color: G.muted }}>
            Note to customer
          </label>
          <input
            id={`${id}n`}
            value={note}
            onChange={(event) => onNote(event.target.value)}
            disabled={!pending}
            className={`mt-1 block h-[30px] w-full rounded-md px-2.5 disabled:opacity-50 ${RING}`}
            style={{ boxShadow: `inset 0 0 0 1px ${G.lineStrong}`, background: G.surface, fontSize: 12.5 }}
          />
        </div>
        <div className='flex gap-1.5'>
          <button
            type='button'
            disabled={!pending}
            onClick={() => onAction('reject')}
            className={`h-[30px] rounded-md px-3 disabled:opacity-40 ${RING}`}
            style={{ boxShadow: `inset 0 0 0 1px ${G.lineStrong}`, background: G.surface, fontSize: 12.5, fontWeight: 500 }}
          >
            Reject
          </button>
          <button
            type='button'
            disabled={!pending}
            onClick={() => onAction('approve')}
            className={`h-[30px] rounded-md px-3 disabled:opacity-40 ${RING}`}
            style={{ background: G.ink, color: '#fff', fontSize: 12.5, fontWeight: 500 }}
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, aside, children, first }: { title: string; aside?: React.ReactNode; children: React.ReactNode; first?: boolean }) {
  return (
    <section className='px-4 py-3' style={{ borderTop: first ? undefined : `1px solid ${G.line}` }}>
      <div className='flex items-center justify-between' style={{ fontSize: 11.5, color: G.muted, fontWeight: 500 }}>
        <h3>{title}</h3>
        {aside}
      </div>
      <div className='mt-2'>{children}</div>
    </section>
  );
}

function Head({ icon, name, kind }: { icon: 'table' | 'form' | 'text'; name: string; kind: string }) {
  return (
    <div className='flex h-11 items-center gap-2 px-4' style={{ borderBottom: `1px solid ${G.line}` }}>
      <span className='grid size-6 place-items-center rounded-md' style={{ background: G.blueTint, color: G.blue }}>
        <Icon name={icon} size={14} />
      </span>
      <h2 style={{ fontFamily: G.mono, fontSize: 12.5, fontWeight: 500 }}>{name}</h2>
      <span style={{ fontSize: 12, color: G.muted }}>{kind}</span>
    </div>
  );
}

function Step({ kind, name, detail, last }: { kind: 'table' | 'query' | 'database' | 'form'; name: string; detail: string; last?: boolean }) {
  const tone =
    kind === 'database'
      ? { background: G.ink, color: '#fff', boxShadow: 'none' }
      : kind === 'query'
        ? { background: G.orangeTint, color: G.orangeInk, boxShadow: `inset 0 0 0 1px ${G.orangeLine}` }
        : { background: G.blueTint, color: G.blue, boxShadow: `inset 0 0 0 1px ${G.blueLine}` };
  return (
    <li className='relative grid grid-cols-[26px_1fr] gap-x-2.5'>
      <span className='relative z-[1] grid size-[26px] place-items-center rounded-[7px]' style={tone}>
        <Icon name={kind} size={14} stroke={1.4} />
      </span>
      {last ? null : (
        <span
          aria-hidden='true'
          className='absolute top-[26px] bottom-0 left-[12.25px] w-[1.5px]'
          style={{ background: `repeating-linear-gradient(${G.orange} 0 3px, transparent 3px 6px)` }}
        />
      )}
      <div className={`min-w-0 ${last ? '' : 'pb-2.5'}`}>
        <div className='flex flex-wrap items-baseline gap-x-1.5'>
          <span style={{ fontSize: 11, color: G.muted }}>{{ table: 'Table', query: 'Query', database: 'Database', form: 'Form' }[kind]}</span>
          <span className='truncate' style={{ fontFamily: G.mono, fontSize: 12, fontWeight: 500 }}>
            {name}
          </span>
        </div>
        <div style={{ fontSize: 11.5, color: G.muted, marginTop: 1 }}>{detail}</div>
      </div>
    </li>
  );
}

function TableInspector({
  query,
  chain,
  count,
  visible,
  onQuery,
  onColumn,
  filter,
  onAddFilter,
  onFilter
}: {
  query: Query;
  chain: string;
  count: number;
  visible: ColumnKey[];
  onQuery: (id: string) => void;
  onColumn: (key: ColumnKey) => void;
  filter: Filter | null;
  onAddFilter: () => void;
  onFilter: (filter: Filter | null) => void;
}) {
  const id = useId();
  return (
    <div>
      <Head icon='table' name='refundsTable' kind='Table' />
      <Section title='Data' first>
        <p aria-live='polite' style={{ fontSize: 13.5, lineHeight: 1.6, letterSpacing: '-0.01em', textWrap: 'pretty' }}>
          <span className='sr-only'>{chain}</span>
          <span aria-hidden='true'>
            Shows <b style={{ fontWeight: 600 }}>{count} {count === 1 ? 'row' : 'rows'}</b> from <Chip>{query.id}</Chip>
            {filter ? (
              <>
                {' '}
                where <Chip kind='plain' quiet>{`${filter.column === 'agent' ? 'requested_by' : filter.column} = ${filter.value}`}</Chip>
              </>
            ) : null}{' '}
            on{' '}
            <Chip kind='database' quiet>
              {DATABASE.name}
            </Chip>
          </span>
        </p>
        <ol className='mt-2.5 rounded-lg px-3 py-2.5' style={{ background: G.paper, boxShadow: `inset 0 0 0 1px ${G.line}` }} aria-label='Where the data comes from'>
          <Step kind='table' name='refundsTable' detail={`${visible.length} of ${query.columns.length} columns shown`} />
          <Step kind='query' name={query.id} detail={`${query.note} · ${query.ms} ms`} />
          <Step kind='database' name={DATABASE.name} detail={`${DATABASE.engine} · ${DATABASE.replica}`} last />
        </ol>
      </Section>

      <Section title='Query'>
        <fieldset>
          <legend className='sr-only'>Query for refundsTable</legend>
          <div className='grid gap-1.5'>
            {QUERIES.map((option) => {
              const on = option.id === query.id;
              return (
                <label
                  key={option.id}
                  className='grid cursor-pointer grid-cols-[16px_1fr_auto] gap-2.5 rounded-lg px-3 py-2 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-solid has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-[#2F5BEA]'
                  style={{ background: on ? G.orangeTint : G.surface, boxShadow: `inset 0 0 0 1px ${on ? G.orangeLine : G.line}` }}
                >
                  <input type='radio' name={`${id}q`} value={option.id} checked={on} onChange={() => onQuery(option.id)} className='sr-only' />
                  <span
                    aria-hidden='true'
                    className='mt-px size-4 rounded-full'
                    style={{ background: G.surface, boxShadow: `inset 0 0 0 ${on ? 5 : 1.3}px ${on ? G.orange : G.lineStrong}` }}
                  />
                  <span className='min-w-0'>
                    <span className='block truncate' style={{ fontFamily: G.mono, fontSize: 12, fontWeight: 500 }}>
                      {option.id}
                    </span>
                    <span className='block' style={{ fontSize: 11.5, color: G.muted, marginTop: 1 }}>
                      {option.note}
                    </span>
                  </span>
                  <span style={{ fontFamily: G.mono, fontSize: 11, color: G.muted }}>{option.rows().length} rows</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </Section>

      <Section title='Columns' aside={<span style={{ fontWeight: 400 }}>{visible.length} of {query.columns.length}</span>}>
        <fieldset>
          <legend className='sr-only'>Columns to show</legend>
          <div className='grid grid-cols-2 gap-x-3 @min-[1000px]:grid-cols-3'>
            {query.columns.map((column) => {
              const on = visible.includes(column.key);
              return (
                <label key={column.key} className='flex min-h-[26px] cursor-pointer items-center gap-2 rounded has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-solid has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#2F5BEA]'>
                  <input type='checkbox' checked={on} onChange={() => onColumn(column.key)} className='sr-only' />
                  <span
                    aria-hidden='true'
                    className='grid size-3.5 flex-none place-items-center rounded-[3.5px]'
                    style={{ background: on ? G.ink : G.surface, boxShadow: on ? 'none' : `inset 0 0 0 1.2px ${G.lineStrong}` }}
                  >
                    {on ? <Icon name='check' size={12} color='#fff' stroke={1.9} /> : null}
                  </span>
                  <span style={{ fontSize: 12.5, color: on ? G.ink : G.muted }}>{column.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </Section>

      <Section title='Filter'>
        {filter ? (
          <div className='flex flex-wrap items-center gap-1.5'>
            <Select
              label='Filter column'
              value={filter.column}
              onChange={(value) => {
                const column = value as ColumnKey;
                onFilter({ column, value: distinct(query, column)[0] });
              }}
              options={query.filterable.map((key) => [key, columnLabel(query, key)])}
            />
            <span style={{ color: G.muted, fontFamily: G.mono, fontSize: 12 }}>=</span>
            <Select
              label='Filter value'
              value={filter.value}
              onChange={(value) => onFilter({ ...filter, value })}
              options={distinct(query, filter.column).map((value) => [value, label(filter.column, value)])}
            />
            <button
              type='button'
              onClick={() => onFilter(null)}
              aria-label='Remove filter'
              className={`grid size-7 place-items-center rounded-md ${RING}`}
              style={{ color: G.muted }}
            >
              <Icon name='x' size={13} />
            </button>
          </div>
        ) : (
          <button type='button' onClick={onAddFilter} className={`-mx-1 flex h-7 items-center gap-1.5 rounded-md px-1 ${RING}`} style={{ color: G.blue, fontSize: 12.5 }}>
            <Icon name='plus' size={14} /> Add a filter
          </button>
        )}
      </Section>
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: [string, string][] }) {
  return (
    <span className='relative inline-flex'>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`h-7 cursor-pointer appearance-none rounded-md py-0 pr-7 pl-2 ${RING}`}
        style={{ boxShadow: `inset 0 0 0 1px ${G.lineStrong}`, background: G.surface, fontSize: 12.5, color: G.ink }}
      >
        {options.map(([key, text]) => (
          <option key={key} value={key}>
            {text}
          </option>
        ))}
      </select>
      <span className='pointer-events-none absolute top-1/2 right-2 -translate-y-1/2' style={{ color: G.muted }}>
        <Icon name='chevronDown' size={12} />
      </span>
    </span>
  );
}

function FormInspector({ row, query, twoLeads, onTwoLeads }: { row?: Row; query: Query; twoLeads: boolean; onTwoLeads: (on: boolean) => void }) {
  const id = useId();
  return (
    <div>
      <Head icon='form' name='approveForm' kind='Form' />
      <Section title='Data' first>
        <p aria-live='polite' style={{ fontSize: 13.5, lineHeight: 1.6, letterSpacing: '-0.01em', textWrap: 'pretty' }}>
          {row ? (
            <>
              Edits <b style={{ fontWeight: 600, fontFamily: G.mono, fontSize: 12.5 }}>{String(row.id)}</b>, picked in <Chip kind='table' quiet>refundsTable</Chip>, and saves it with{' '}
              <Chip>approve_refund</Chip>
            </>
          ) : (
            <>
              Has nothing to edit. <Chip>{query.id}</Chip> returns agents, not refunds.
            </>
          )}
        </p>
        <ol className='mt-3 rounded-lg p-3' style={{ background: G.paper, boxShadow: `inset 0 0 0 1px ${G.line}` }} aria-label='Where the data goes'>
          <Step kind='table' name='refundsTable.selectedRow' detail={row ? `${row.id} · ${row.customer}` : 'No refund picked'} />
          <Step kind='query' name='approve_refund' detail='Updates 1 row, only if still pending' />
          <Step kind='database' name={DATABASE.name} detail={`${DATABASE.engine} · primary`} last />
        </ol>
      </Section>
      <Section title='Fields'>
        {[
          ['Amount', '← selectedRow.amount_eur'],
          ['Note to customer', 'typed by the agent']
        ].map(([name, source]) => (
          <div key={name} className='flex min-h-8 items-center justify-between gap-3'>
            <span>{name}</span>
            <span style={{ fontFamily: G.mono, fontSize: 11, color: source.startsWith('←') ? G.orangeInk : G.muted }}>{source}</span>
          </div>
        ))}
      </Section>
      <Section title='Who can approve'>
        <div className='flex items-center justify-between gap-3'>
          <div>
            <div id={id}>A second lead over €500</div>
            <div style={{ fontSize: 11.5, color: G.muted, marginTop: 2 }}>Never the person who asked</div>
          </div>
          <button
            type='button'
            role='switch'
            aria-checked={twoLeads}
            aria-labelledby={id}
            onClick={() => onTwoLeads(!twoLeads)}
            className={`relative h-[18px] w-[30px] flex-none rounded-full ${RING}`}
            style={{ background: twoLeads ? G.ink : G.lineStrong }}
          >
            <span className='absolute top-[2px] size-[14px] rounded-full bg-white transition-[left]' style={{ left: twoLeads ? 14 : 2 }} />
          </button>
        </div>
      </Section>
    </div>
  );
}

function TitleInspector({ query, count }: { query: Query; count: number }) {
  return (
    <div>
      <Head icon='text' name='title' kind='Text' />
      <Section title='Data' first>
        <p aria-live='polite' style={{ fontSize: 13.5, lineHeight: 1.6, letterSpacing: '-0.01em' }}>
          The subtitle counts the rows in <Chip kind='table' quiet>refundsTable</Chip>, so it reads {count} now. Bind the table to another query and
          it follows.
        </p>
        <ol className='mt-3 rounded-lg p-3' style={{ background: G.paper, boxShadow: `inset 0 0 0 1px ${G.line}` }} aria-label='Where the text comes from'>
          <Step kind='table' name='refundsTable.rowCount' detail={`${count} rows`} />
          <Step kind='query' name={query.id} detail={query.note} />
          <Step kind='database' name={DATABASE.name} detail={`${DATABASE.engine} · ${DATABASE.replica}`} last />
        </ol>
      </Section>
      <Section title='Text'>
        <div className='rounded-md px-2.5 py-2' style={{ boxShadow: `inset 0 0 0 1px ${G.line}`, background: G.paper, fontSize: 12.5 }}>
          Refund approvals
        </div>
      </Section>
    </div>
  );
}
