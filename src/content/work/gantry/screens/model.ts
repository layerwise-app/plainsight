/** Gantry's own palette and type. Light theme, one brand colour, one selection colour. */
export const G = {
  paper: '#F6F5F1',
  surface: '#FFFFFF',
  sunk: '#EFEEE9',
  canvas: '#ECEBE6',
  ink: '#161616',
  text2: '#3F3E3A',
  muted: '#6C6B65',
  faint: '#9E9C95',
  line: '#E4E2DB',
  lineStrong: '#D2CFC7',
  orange: '#FF5B1F',
  orangeInk: '#B63A0C',
  orangeTint: '#FFEDE5',
  orangeLine: '#FFC7B0',
  blue: '#2F5BEA',
  blueTint: '#EAF0FE',
  blueLine: '#B9C9F8',
  green: '#1D7A4C',
  greenTint: '#E4F2EA',
  red: '#C2362B',
  redTint: '#FBE8E5',
  sans: "'IBM Plex Sans', system-ui, sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, monospace"
};

export type Status = 'pending' | 'approved' | 'rejected';

export type Refund = {
  id: string;
  order: string;
  customer: string;
  amount: number;
  reason: string;
  agent: string;
  /** When it was asked for, as shown in the table. */
  requested: string;
  /** Minutes it has waited; only for pending refunds. */
  waiting?: number;
  status: Status;
};

export const AGENTS = ['Nanna Krog', 'Emil Brandt', 'Sofie Lund', 'Aksel Holm'] as const;

/** Tovholm's refund requests, Tuesday 3 November 2026 at 14:40. */
export const REFUNDS: Refund[] = [
  { id: 'R-20931', order: 'TV-48213', customer: 'Lea Christensen', amount: 742, reason: 'Arrived damaged', agent: 'Emil Brandt', requested: '11:59', waiting: 161, status: 'pending' },
  { id: 'R-20934', order: 'TV-48177', customer: 'Jonas Weber', amount: 89.5, reason: 'Wrong colour', agent: 'Emil Brandt', requested: '12:12', waiting: 148, status: 'pending' },
  { id: 'R-20936', order: 'TV-48302', customer: 'Marit Dahl', amount: 1280, reason: 'Not delivered', agent: 'Sofie Lund', requested: '12:21', waiting: 139, status: 'pending' },
  { id: 'R-20938', order: 'TV-48266', customer: 'Pieter de Vries', amount: 214.9, reason: 'Missing parts', agent: 'Nanna Krog', requested: '12:38', waiting: 122, status: 'pending' },
  { id: 'R-20940', order: 'TV-48319', customer: 'Ida Sørensen', amount: 56, reason: 'Charged twice', agent: 'Aksel Holm', requested: '12:43', waiting: 117, status: 'pending' },
  { id: 'R-20941', order: 'TV-48145', customer: 'Felix Hartmann', amount: 615, reason: 'Arrived damaged', agent: 'Emil Brandt', requested: '13:04', waiting: 96, status: 'pending' },
  { id: 'R-20943', order: 'TV-48351', customer: 'Saga Lindqvist', amount: 39.9, reason: 'Changed mind', agent: 'Sofie Lund', requested: '13:12', waiting: 88, status: 'pending' },
  { id: 'R-20944', order: 'TV-48288', customer: 'Oskar Nyberg', amount: 508.4, reason: 'Late delivery', agent: 'Nanna Krog', requested: '13:26', waiting: 74, status: 'pending' },
  { id: 'R-20946', order: 'TV-48362', customer: 'Clara Mertens', amount: 129, reason: 'Wrong colour', agent: 'Aksel Holm', requested: '13:39', waiting: 61, status: 'pending' },
  { id: 'R-20947', order: 'TV-48204', customer: 'Mikkel Bang', amount: 1045, reason: 'Arrived damaged', agent: 'Sofie Lund', requested: '13:48', waiting: 52, status: 'pending' },
  { id: 'R-20949', order: 'TV-48377', customer: 'Hanna Virtanen', amount: 72.4, reason: 'Missing parts', agent: 'Emil Brandt', requested: '14:03', waiting: 37, status: 'pending' },
  { id: 'R-20950', order: 'TV-48311', customer: 'Lukas Becker', amount: 349, reason: 'Not delivered', agent: 'Nanna Krog', requested: '14:16', waiting: 24, status: 'pending' },
  { id: 'R-20952', order: 'TV-48390', customer: 'Freja Mortensen', amount: 880, reason: 'Arrived damaged', agent: 'Aksel Holm', requested: '14:25', waiting: 15, status: 'pending' },
  { id: 'R-20953', order: 'TV-48395', customer: 'Tobias Engel', amount: 45, reason: 'Charged twice', agent: 'Sofie Lund', requested: '14:34', waiting: 6, status: 'pending' },
  { id: 'R-20902', order: 'TV-47988', customer: 'Elin Ström', amount: 520, reason: 'Arrived damaged', agent: 'Sofie Lund', requested: 'Mon 15:02', status: 'approved' },
  { id: 'R-20907', order: 'TV-48012', customer: 'Rasmus Kjær', amount: 64.9, reason: 'Wrong colour', agent: 'Emil Brandt', requested: 'Mon 15:47', status: 'approved' },
  { id: 'R-20911', order: 'TV-48056', customer: 'Amélie Laurent', amount: 1480, reason: 'Not delivered', agent: 'Nanna Krog', requested: 'Mon 16:20', status: 'approved' },
  { id: 'R-20913', order: 'TV-48031', customer: 'Noah Jansen', amount: 230, reason: 'Changed mind', agent: 'Aksel Holm', requested: 'Mon 16:41', status: 'rejected' },
  { id: 'R-20918', order: 'TV-48090', customer: 'Astrid Olsen', amount: 98, reason: 'Missing parts', agent: 'Sofie Lund', requested: '08:14', status: 'approved' },
  { id: 'R-20920', order: 'TV-48101', customer: 'Viktor Novak', amount: 760, reason: 'Late delivery', agent: 'Emil Brandt', requested: '08:52', status: 'rejected' },
  { id: 'R-20922', order: 'TV-48134', customer: 'Karla Schmidt', amount: 42.5, reason: 'Charged twice', agent: 'Nanna Krog', requested: '09:30', status: 'approved' },
  { id: 'R-20925', order: 'TV-48118', customer: 'Mia Andersen', amount: 189, reason: 'Arrived damaged', agent: 'Aksel Holm', requested: '10:05', status: 'approved' },
  { id: 'R-20927', order: 'TV-48160', customer: 'Jakob Friis', amount: 1120, reason: 'Arrived damaged', agent: 'Sofie Lund', requested: '10:41', status: 'approved' },
  { id: 'R-20929', order: 'TV-48172', customer: 'Nora Haugen', amount: 310, reason: 'Wrong colour', agent: 'Emil Brandt', requested: '11:18', status: 'approved' }
];

export const PENDING = REFUNDS.filter((refund) => refund.status === 'pending');

export const eur = (value: number, cents = true) =>
  `€${value.toLocaleString('en-GB', { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 })}`;

export const wait = (minutes?: number) => {
  if (minutes === undefined) return '—';
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, '0')} min`;
};

/* ------------------------------------------------------------------ queries */

export type ColumnKey = keyof Refund | 'requests' | 'waitingCount' | 'waitingEur' | 'oldest';

export type Column = {
  key: ColumnKey;
  label: string;
  /** The column's name in SQL. */
  sql: string;
  align?: 'right';
  mono?: boolean;
};

export type Row = Record<string, string | number | undefined>;

export type Query = {
  id: string;
  label: string;
  note: string;
  sql: string;
  columns: Column[];
  defaultColumns: ColumnKey[];
  /** Columns a filter can use, first is the default. */
  filterable: ColumnKey[];
  rows: () => Row[];
  ms: number;
};

const REFUND_COLUMNS: Column[] = [
  { key: 'id', label: 'Refund', sql: 'id', mono: true },
  { key: 'order', label: 'Order', sql: 'order_id', mono: true },
  { key: 'customer', label: 'Customer', sql: 'customer' },
  { key: 'amount', label: 'Amount', sql: 'amount_eur', align: 'right', mono: true },
  { key: 'reason', label: 'Reason', sql: 'reason' },
  { key: 'agent', label: 'Asked by', sql: 'requested_by' },
  { key: 'requested', label: 'Asked at', sql: 'requested_at', mono: true },
  { key: 'waiting', label: 'Waiting', sql: 'waiting', align: 'right' },
  { key: 'status', label: 'Status', sql: 'status' }
];

export const QUERIES: Query[] = [
  {
    id: 'refunds_waiting',
    label: 'Refunds waiting',
    note: 'Pending, oldest first',
    ms: 38,
    columns: REFUND_COLUMNS,
    defaultColumns: ['id', 'customer', 'amount', 'reason', 'agent', 'waiting'],
    filterable: ['status', 'reason', 'agent'],
    rows: () => [...PENDING].sort((a, b) => (b.waiting ?? 0) - (a.waiting ?? 0)),
    sql: `select r.id, r.order_id, c.full_name as customer,
       r.amount_eur, r.reason, r.requested_by,
       r.requested_at, now() - r.requested_at as waiting,
       r.status
from refunds r
join customers c on c.id = r.customer_id
where r.status = 'pending'
order by r.requested_at asc;`
  },
  {
    id: 'refunds_over_500',
    label: 'Refunds over €500',
    note: 'Last two days, any status',
    ms: 41,
    columns: REFUND_COLUMNS,
    defaultColumns: ['id', 'customer', 'amount', 'agent', 'requested', 'status'],
    filterable: ['status', 'reason', 'agent'],
    rows: () => REFUNDS.filter((refund) => refund.amount > 500).sort((a, b) => b.amount - a.amount),
    sql: `select r.id, r.order_id, c.full_name as customer,
       r.amount_eur, r.reason, r.requested_by,
       r.requested_at, r.status
from refunds r
join customers c on c.id = r.customer_id
where r.amount_eur > 500
  and r.requested_at > now() - interval '2 days'
order by r.amount_eur desc;`
  },
  {
    id: 'refunds_by_agent',
    label: 'Refunds by agent',
    note: 'One row per agent',
    ms: 29,
    columns: [
      { key: 'agent', label: 'Agent', sql: 'agent' },
      { key: 'requests', label: 'Asked for', sql: 'requests', align: 'right', mono: true },
      { key: 'waitingCount', label: 'Waiting', sql: 'waiting', align: 'right', mono: true },
      { key: 'waitingEur', label: 'Waiting, €', sql: 'waiting_eur', align: 'right', mono: true },
      { key: 'oldest', label: 'Oldest', sql: 'oldest', align: 'right', mono: true }
    ],
    defaultColumns: ['agent', 'requests', 'waitingCount', 'waitingEur', 'oldest'],
    filterable: ['agent'],
    rows: () =>
      AGENTS.map((agent) => {
        const mine = REFUNDS.filter((refund) => refund.agent === agent);
        const waiting = mine.filter((refund) => refund.status === 'pending');
        return {
          agent,
          requests: mine.length,
          waitingCount: waiting.length,
          waitingEur: waiting.reduce((sum, refund) => sum + refund.amount, 0),
          oldest: Math.max(...waiting.map((refund) => refund.waiting ?? 0))
        };
      }).sort((a, b) => b.waitingCount - a.waitingCount || b.waitingEur - a.waitingEur),
    sql: `select r.requested_by as agent,
       count(*) as requests,
       count(*) filter (where r.status = 'pending') as waiting,
       sum(r.amount_eur) filter (where r.status = 'pending') as waiting_eur,
       max(now() - r.requested_at) filter (where r.status = 'pending') as oldest
from refunds r
where r.requested_at > now() - interval '2 days'
group by r.requested_by
order by waiting desc;`
  }
];

export const queryById = (id: string) => QUERIES.find((query) => query.id === id) ?? QUERIES[0];

/** How a cell reads in a table. */
export function cell(key: ColumnKey, row: Row): string {
  const value = row[key];
  if (key === 'amount' || key === 'waitingEur') return eur(Number(value));
  if (key === 'waiting' || key === 'oldest') return wait(value as number | undefined);
  if (key === 'status') return String(value).replace(/^./, (c) => c.toUpperCase());
  return value === undefined ? '—' : String(value);
}

export const APPROVE_SQL = `update refunds
set status = 'approved',
    approved_by = {{ current_user.email }},
    note_to_customer = {{ approveForm.note }}
where id = {{ refundsTable.selectedRow.id }}
  and status = 'pending';`;

/** The live database the tool reads. */
export const DATABASE = { name: 'ops-eu', engine: 'Postgres 16', where: 'Frankfurt', replica: 'read replica' };
