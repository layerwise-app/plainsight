import type * as React from 'react';
import { useId, useRef, useState } from 'react';
import {
  type Cell,
  type Outcome,
  type Resource,
  type ResourceId,
  INITIAL_MINE,
  RESOURCES,
  cellAt,
  cellLabel,
  freeCount,
  key,
  press,
  resourceById,
  span,
  summary
} from './slots';
import { K, ME, WEEK, head, label, pad, who } from './model';
import { Icon, Mark } from './ui';

const INK = 1.6;

/** Small flat drawings, one per shared space. 40 × 40. */
export function ResourceArt({ id, size = 40, tile = true }: { id: ResourceId; size?: number; tile?: boolean }) {
  const bg = { laundry: K.paperDeep, guest: K.yellowSoft, bike: K.mossSoft }[id];
  return (
    <svg width={size} height={size} viewBox='0 0 40 40' aria-hidden='true' style={{ display: 'block', flex: 'none' }}>
      {tile ? <rect width='40' height='40' rx='11' fill={bg} /> : null}
      {id === 'laundry' ? (
        <g stroke={K.ink} strokeWidth={INK} strokeLinejoin='round'>
          <rect x='10' y='7' width='20' height='26' rx='3' fill={K.card} />
          <path d='M10 13h20' fill='none' />
          <circle cx='14' cy='10' r='0.6' fill={K.ink} />
          <circle cx='17' cy='10' r='0.6' fill={K.ink} />
          <circle cx='20' cy='23' r='6.5' fill={K.dusk} />
          <path d='M15.5 24.5c1.6 1.4 3.2-1.2 4.6.2 1.4 1.4 2.9-.9 4.4.2' fill='none' stroke={K.yellow} strokeWidth='1.4' strokeLinecap='round' />
        </g>
      ) : null}
      {id === 'guest' ? (
        <g stroke={K.ink} strokeWidth={INK} strokeLinejoin='round'>
          <path d='M8 12v19M32 22v9' fill='none' strokeLinecap='round' />
          <rect x='8' y='13' width='9' height='9' rx='2' fill={K.brick} />
          <rect x='8' y='22' width='24' height='5' rx='1.5' fill={K.card} />
          <path d='M17 22c0-3 2-5 6-5h5c2.5 0 4 1.6 4 4v1z' fill={K.moss} />
          <path d='M8 27h24' fill='none' />
        </g>
      ) : null}
      {id === 'bike' ? (
        <g stroke={K.ink} strokeWidth={INK} strokeLinejoin='round' strokeLinecap='round'>
          <rect x='6' y='15' width='13' height='9' rx='1.5' fill={K.brick} />
          <circle cx='10.5' cy='29' r='4' fill={K.card} />
          <circle cx='30' cy='29' r='4' fill={K.card} />
          <path d='M10.5 29 19 24h7l4 5M26 24l-2-8h-3M24 16h4' fill='none' />
          <path d='M19 24l3-6' fill='none' />
        </g>
      ) : null}
    </svg>
  );
}

const hatch = (color: string) =>
  `repeating-linear-gradient(135deg, ${color} 0 1.5px, transparent 1.5px 7px)`;

/** Who a cell belongs to, so runs of the same booking draw as one block. */
const owner = (cell: Cell) =>
  cell.kind === 'mine' ? 'mine' : cell.kind === 'closed' ? 'closed' : cell.flat ? `${cell.kind}:${cell.flat}` : null;

function chipStyle(cell: Cell): React.CSSProperties {
  switch (cell.kind) {
    case 'mine':
      return { background: K.moss, color: K.paper };
    case 'taken':
      return { background: K.paperDeep, color: K.ink };
    case 'past':
      return { background: hatch('rgba(30,41,68,0.07)'), color: K.faint };
    case 'closed':
      return { background: `${hatch('rgba(194,78,44,0.22)')}, ${K.brickSoft}`, color: K.brickDeep };
    case 'limit':
      return { background: `${hatch('rgba(30,41,68,0.06)')}, ${K.card}`, color: K.faint, boxShadow: `inset 0 0 0 1px ${K.line}` };
    default:
      return { background: K.card, color: K.ink, boxShadow: `inset 0 0 0 1px ${K.line}` };
  }
}

function CellText({ resource, cell, start, compact }: { resource: Resource; cell: Cell; start: boolean; compact?: boolean }) {
  if (!start) return null;
  const size = compact ? 12 : 13;
  if (cell.kind === 'mine')
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: size, fontWeight: 650 }}>
        <Icon name='check' size={14} stroke={2.6} />
        {resource.unit === 'night' ? 'Your stay' : 'You'}
      </span>
    );
  if (cell.kind === 'closed') return <span style={{ fontSize: size, fontWeight: 650 }}>Water off</span>;
  if (cell.flat)
    return (
      <span
        style={{
          fontSize: size,
          fontWeight: cell.kind === 'past' ? 450 : 550,
          opacity: cell.kind === 'past' ? 0.9 : 0.82,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {cell.now ? 'Now · ' : ''}
        {who(cell.flat)}
      </span>
    );
  return null;
}

const HOVER: Record<string, string> = { free: 'Book', limit: '' };

type Focus = { day: number; slot: number };

/** The week as a grid. Arrow keys move, Enter or Space books and cancels. */
function WeekGrid({
  resource,
  mine,
  focus,
  onFocus,
  onPress,
  height
}: {
  resource: Resource;
  mine: string[];
  focus: Focus;
  onFocus: (focus: Focus) => void;
  onPress: (day: number, slot: number) => void;
  height: number;
}) {
  const refs = useRef(new Map<string, HTMLButtonElement>());
  const rows = resource.slots.length;
  const nightly = resource.unit === 'night';
  const timeCol = resource.unit === 'slot' ? 64 : 48;
  const move = (day: number, slot: number) => {
    const next = { day: Math.max(0, Math.min(6, day)), slot: Math.max(0, Math.min(rows - 1, slot)) };
    onFocus(next);
    refs.current.get(key(next.day, next.slot))?.focus();
  };
  const onKeyDown = (event: React.KeyboardEvent) => {
    const { day, slot } = focus;
    const next: Record<string, [number, number]> = {
      ArrowRight: [day + 1, slot],
      ArrowLeft: [day - 1, slot],
      ArrowDown: [day, slot + 1],
      ArrowUp: [day, slot - 1],
      Home: [0, slot],
      End: [6, slot],
      PageUp: [day, 0],
      PageDown: [day, rows - 1]
    };
    const target = next[event.key];
    if (target) {
      event.preventDefault();
      move(target[0], target[1]);
    }
  };
  const columns = `${timeCol}px repeat(7, minmax(0, 1fr))`;
  const cells = WEEK.map((_, day) => resource.slots.map((__, slot) => cellAt(resource, day, slot, mine)));

  return (
    <div
      role='grid'
      aria-label={`${resource.name}, week of 27 April 2026`}
      aria-rowcount={rows + 1}
      aria-colcount={8}
      onKeyDown={onKeyDown}
      style={{ display: 'flex', flexDirection: 'column', height }}
    >
      <div role='row' style={{ display: 'grid', gridTemplateColumns: columns, height: 52, flex: 'none' }}>
        <span role='columnheader' aria-label={nightly ? 'Night' : 'Time'} />
        {WEEK.map((day, index) => (
          <div
            key={day.short}
            role='columnheader'
            aria-label={`${day.name} ${day.date} ${day.month}`}
            style={{ padding: '0 4px 8px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
          >
            <span style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ ...label(11, index === 0 ? K.brick : K.muted) }}>{day.short}</span>
              <span style={{ ...head(22, 720), color: index === 0 ? K.brick : K.ink }}>{day.date}</span>
            </span>
            <span style={{ fontSize: 11.5, color: index === 0 ? K.brick : K.faint, marginTop: 2, height: 14 }}>
              {index === 0 ? 'Today' : index === 4 ? 'Public holiday' : ''}
            </span>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {resource.slots.map((range, slot) => (
          <div
            key={range.start}
            role='row'
            style={{ display: 'grid', gridTemplateColumns: columns, flex: 1, minHeight: 0, borderTop: slot === 0 ? `1px solid ${K.line}` : undefined }}
          >
            <span
              role='rowheader'
              aria-label={nightly ? 'Night, check in 15:00' : `${pad(range.start)}:00 to ${pad(range.end)}:00`}
              style={{
                fontSize: 12,
                color: K.muted,
                fontVariantNumeric: 'tabular-nums',
                paddingTop: 5,
                paddingRight: 8,
                lineHeight: 1.25
              }}
            >
              {nightly ? (
                <>
                  Night
                  <br />
                  <span style={{ color: K.faint }}>15 → 12</span>
                </>
              ) : resource.unit === 'slot' ? (
                `${pad(range.start)}–${pad(range.end)}`
              ) : (
                pad(range.start)
              )}
            </span>
            {WEEK.map((_, day) => {
              const cell = cells[day][slot];
              const id = owner(cell);
              const prev = nightly ? cells[day - 1]?.[slot] : cells[day][slot - 1];
              const next = nightly ? cells[day + 1]?.[slot] : cells[day][slot + 1];
              const start = !id || !prev || owner(prev) !== id;
              const end = !id || !next || owner(next) !== id;
              const focused = focus.day === day && focus.slot === slot;
              const inset = nightly
                ? { top: 3, bottom: 3, left: start ? 3 : 0, right: end ? 3 : 0 }
                : { left: 3, right: 3, top: start ? 2 : 0, bottom: end ? 2 : 0 };
              const r = 8;
              const radius = nightly
                ? `${start ? r : 0}px ${end ? r : 0}px ${end ? r : 0}px ${start ? r : 0}px`
                : `${start ? r : 0}px ${start ? r : 0}px ${end ? r : 0}px ${end ? r : 0}px`;
              const interactive = cell.kind === 'free' || cell.kind === 'mine';
              return (
                <div key={day} role='gridcell' style={{ position: 'relative', minWidth: 0 }}>
                  <button
                    ref={(element) => {
                      if (element) refs.current.set(key(day, slot), element);
                      else refs.current.delete(key(day, slot));
                    }}
                    type='button'
                    tabIndex={focused ? 0 : -1}
                    aria-label={cellLabel(resource, day, slot, cell)}
                    aria-disabled={interactive ? undefined : true}
                    onFocus={() => onFocus({ day, slot })}
                    onClick={() => {
                      onFocus({ day, slot });
                      onPress(day, slot);
                    }}
                    className='group absolute inset-0 cursor-pointer outline-none focus-visible:z-10 aria-disabled:cursor-default'
                    style={{ background: 'transparent', border: 0, padding: 0 }}
                  >
                    <span
                      className={
                        cell.kind === 'free'
                          ? 'absolute flex items-center transition-colors duration-100 group-hover:bg-[#FFEDC2]! group-focus-visible:bg-[#FFEDC2]!'
                          : 'absolute flex items-center'
                      }
                      style={{
                        ...inset,
                        ...chipStyle(cell),
                        borderRadius: radius,
                        padding: nightly ? '10px 10px' : '0 8px',
                        alignItems: nightly ? 'flex-start' : 'center',
                        overflow: 'hidden'
                      }}
                    >
                      <CellText resource={resource} cell={cell} start={start} />
                      {cell.kind === 'free' ? (
                        <span
                          className='opacity-0 transition-opacity duration-100 group-hover:opacity-100 group-focus-visible:opacity-100'
                          style={{ fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}
                        >
                          <Icon name='plus' size={13} stroke={2.4} /> {HOVER.free}
                        </span>
                      ) : null}
                      {cell.kind === 'limit' ? (
                        <span
                          className='opacity-0 transition-opacity duration-100 group-hover:opacity-100 group-focus-visible:opacity-100'
                          style={{ fontSize: 12, fontWeight: 550, color: K.muted }}
                        >
                          {cell.reason}
                        </span>
                      ) : null}
                    </span>
                    <span
                      aria-hidden='true'
                      className='pointer-events-none absolute opacity-0 group-focus-visible:opacity-100'
                      style={{ ...inset, top: inset.top - 1, bottom: inset.bottom - 1, borderRadius: r, boxShadow: `0 0 0 2.5px ${K.dusk}` }}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Phones: one day at a time, as a list. */
function DayList({ resource, mine, day, onPress }: { resource: Resource; mine: string[]; day: number; onPress: (day: number, slot: number) => void }) {
  const nightly = resource.unit === 'night';
  const items = nightly
    ? WEEK.map((_, index) => ({ day: index, slot: 0 }))
    : resource.slots.map((_, slot) => ({ day, slot }));
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
      {items.map(({ day: d, slot }) => {
        const cell = cellAt(resource, d, slot, mine);
        const range = resource.slots[slot];
        const action = cell.kind === 'free' ? 'Book' : cell.kind === 'mine' ? 'Cancel' : '';
        const status =
          cell.kind === 'mine'
            ? nightly
              ? 'Your stay'
              : 'Yours'
            : cell.kind === 'closed'
              ? 'Water off'
              : cell.flat
                ? `${cell.now ? 'Now · ' : ''}${who(cell.flat)}`
                : cell.kind === 'past'
                  ? 'Past'
                  : cell.kind === 'limit'
                    ? (cell.reason ?? '')
                    : 'Free';
        return (
          <li key={`${d}-${slot}`}>
            <button
              type='button'
              onClick={() => onPress(d, slot)}
              aria-label={cellLabel(resource, d, slot, cell)}
              aria-disabled={action ? undefined : true}
              className='flex w-full cursor-pointer items-center gap-3 text-left outline-none focus-visible:outline-[2.5px] focus-visible:outline-offset-1 focus-visible:outline-[#1E2944] aria-disabled:cursor-default'
              style={{ ...chipStyle(cell), border: 0, borderRadius: 10, minHeight: 46, padding: '0 12px', fontFamily: K.sans }}
            >
              <span style={{ width: nightly ? 92 : 52, fontSize: 13.5, fontVariantNumeric: 'tabular-nums', fontWeight: 600, flex: 'none' }}>
                {nightly ? `${WEEK[d].short} ${WEEK[d].date} ${WEEK[d].month.slice(0, 3)}` : `${pad(range.start)}–${pad(range.end)}`}
              </span>
              <span style={{ flex: 1, minWidth: 0, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{status}</span>
              {action ? (
                <span style={{ fontSize: 13.5, fontWeight: 650, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {action === 'Book' ? <Icon name='plus' size={14} stroke={2.4} /> : null}
                  {action}
                </span>
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function Picker({ value, onChange, mine, compact }: { value: ResourceId; onChange: (id: ResourceId) => void; mine: Record<ResourceId, string[]>; compact?: boolean }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const delta = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (index + delta + RESOURCES.length) % RESOURCES.length;
    onChange(RESOURCES[next].id);
    refs.current[next]?.focus();
  };
  return (
    <div
      role='radiogroup'
      aria-label='Shared space'
      style={{ display: 'grid', gridTemplateColumns: compact ? 'repeat(3, minmax(0, 1fr))' : '1fr', gap: compact ? 6 : 8 }}
    >
      {RESOURCES.map((resource, index) => {
        const on = resource.id === value;
        const free = freeCount(resource, mine[resource.id]);
        return (
          <button
            key={resource.id}
            ref={(element) => {
              refs.current[index] = element;
            }}
            type='button'
            role='radio'
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(resource.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className='cursor-pointer text-left outline-none transition-colors focus-visible:outline-[2.5px] focus-visible:outline-offset-2 focus-visible:outline-[#1E2944]'
            style={{
              display: 'flex',
              flexDirection: compact ? 'column' : 'row',
              alignItems: compact ? 'flex-start' : 'center',
              gap: compact ? 8 : 12,
              padding: compact ? '10px 10px 11px' : '10px 14px 10px 10px',
              borderRadius: 14,
              border: 0,
              fontFamily: K.sans,
              color: on ? K.paper : K.ink,
              background: on ? K.dusk : K.card,
              boxShadow: on ? 'none' : `inset 0 0 0 1px ${K.line}`
            }}
          >
            <ResourceArt id={resource.id} size={compact ? 32 : 40} />
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: compact ? 13.5 : 15.5, fontWeight: 650, fontStretch: '92%', whiteSpace: 'nowrap' }}>
                {compact ? resource.short : resource.name}
              </span>
              {compact ? null : (
                <span style={{ display: 'block', fontSize: 12.5, marginTop: 1, color: on ? 'rgba(243,236,225,0.7)' : K.muted }}>{resource.place}</span>
              )}
            </span>
            {compact ? null : (
              <span style={{ fontSize: 12.5, color: on ? K.yellow : K.muted, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                {free} free
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function Sentence({ outcome, id }: { outcome: Pick<Outcome, 'message' | 'tone'>; id?: string }) {
  const color = { booked: K.moss, cancelled: K.ink, blocked: K.brick, info: K.ink }[outcome.tone];
  return (
    <div id={id} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 10, alignItems: 'start' }} aria-hidden='true'>
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          display: 'grid',
          placeItems: 'center',
          background: outcome.tone === 'booked' ? K.moss : outcome.tone === 'blocked' ? K.brick : K.paperDeep,
          color: outcome.tone === 'booked' || outcome.tone === 'blocked' ? K.paper : K.ink,
          marginTop: 1
        }}
      >
        {outcome.tone === 'booked' ? (
          <Icon name='check' size={16} stroke={2.6} />
        ) : outcome.tone === 'blocked' ? (
          <span style={{ fontWeight: 800, fontSize: 15 }}>!</span>
        ) : (
          <Icon name='book' size={15} stroke={2} />
        )}
      </span>
      <span style={{ ...head(23, 700, 80), lineHeight: 1.08, color, textWrap: 'pretty' }}>{outcome.message}</span>
    </div>
  );
}

function YourBookings({ mine, onCancel }: { mine: Record<ResourceId, string[]>; onCancel: (id: ResourceId, keys: string[]) => void }) {
  const items: { id: ResourceId; text: string; when: string; keys: string[] }[] = [];
  for (const resource of RESOURCES) {
    const list = mine[resource.id];
    if (!list.length) continue;
    if (resource.unit === 'night') {
      const nights = list.map((k) => Number(k.split(':')[0])).sort((a, b) => a - b);
      const last = nights[nights.length - 1];
      items.push({
        id: resource.id,
        text: resource.name,
        when: `${WEEK[nights[0]].short} ${WEEK[nights[0]].date} → ${last + 1 < 7 ? `${WEEK[last + 1].short} ${WEEK[last + 1].date}` : 'Mon 4'} ${last + 1 < 4 ? 'Apr' : 'May'}`,
        keys: list
      });
      continue;
    }
    const byDay = new Map<number, number[]>();
    for (const k of list) {
      const [day, slot] = k.split(':').map(Number);
      byDay.set(day, [...(byDay.get(day) ?? []), slot].sort((a, b) => a - b));
    }
    for (const [day, slots] of [...byDay.entries()].sort((a, b) => a[0] - b[0])) {
      let from = slots[0];
      for (let i = 1; i <= slots.length; i++) {
        if (i === slots.length || slots[i] !== slots[i - 1] + 1) {
          const to = slots[i - 1];
          items.push({
            id: resource.id,
            text: resource.name,
            when: `${WEEK[day].short} ${WEEK[day].date} ${WEEK[day].month.slice(0, 3)} · ${span(resource, from, to)}`,
            keys: slots.filter((s) => s >= from && s <= to).map((s) => key(day, s))
          });
          from = slots[i];
        }
      }
    }
  }
  return (
    <div>
      <div style={{ ...label(11), marginBottom: 8 }}>Your bookings this week</div>
      {items.length ? (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {items.map((item) => (
            <li
              key={item.keys.join()}
              style={{
                display: 'grid',
                gridTemplateColumns: '10px 1fr auto',
                gap: 10,
                alignItems: 'center',
                padding: '9px 0',
                borderTop: `1px solid ${K.line}`
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: 4, background: K.moss }} />
              <span style={{ fontSize: 14, minWidth: 0 }}>
                <span style={{ fontWeight: 600 }}>{item.text}</span>
                <span style={{ color: K.muted }}> · {item.when}</span>
              </span>
              <button
                type='button'
                onClick={() => onCancel(item.id, item.keys)}
                className='cursor-pointer rounded-md underline decoration-1 underline-offset-[3px] outline-none focus-visible:outline-[2.5px] focus-visible:outline-offset-2 focus-visible:outline-[#1E2944]'
                style={{ fontSize: 13, color: K.muted, background: 'none', border: 0, padding: '2px 2px', fontFamily: K.sans }}
              >
                Cancel<span className='sr-only'> {`${item.text}, ${item.when}`}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ fontSize: 14, color: K.muted, padding: '9px 0', borderTop: `1px solid ${K.line}` }}>Nothing yet.</div>
      )}
    </div>
  );
}

function Rules({ resource }: { resource: Resource }) {
  return (
    <div>
      <div style={{ ...label(11), marginBottom: 8 }}>House rules</div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {resource.rules.map((rule, index) => (
          <li key={rule} style={{ display: 'grid', gridTemplateColumns: '22px 1fr', fontSize: 14, padding: '3px 0', lineHeight: 1.35 }}>
            <span style={{ color: K.faint, fontVariantNumeric: 'tabular-nums', fontSize: 12.5, paddingTop: 1 }}>{index + 1}</span>
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The whole booking screen, as residents and the demo use it. */
export function BookingApp() {
  const [resourceId, setResourceId] = useState<ResourceId>('laundry');
  const [mine, setMine] = useState(INITIAL_MINE);
  const [outcome, setOutcome] = useState<Pick<Outcome, 'message' | 'tone'> | null>(null);
  const [focus, setFocus] = useState<Record<ResourceId, Focus>>({
    laundry: { day: 0, slot: 3 },
    guest: { day: 2, slot: 0 },
    bike: { day: 0, slot: 1 }
  });
  const [day, setDay] = useState(0);
  const titleId = useId();
  const resource = resourceById(resourceId);
  const shown = outcome ?? { message: summary(resource, mine[resourceId]), tone: 'info' as const };

  const onPress = (d: number, slot: number) => {
    const result = press(resource, d, slot, mine[resourceId]);
    setMine({ ...mine, [resourceId]: result.mine });
    setOutcome(result);
  };
  const onResource = (id: ResourceId) => {
    setResourceId(id);
    setOutcome(null);
  };
  const onCancel = (id: ResourceId, keys: string[]) => {
    const next = { ...mine, [id]: mine[id].filter((k) => !keys.includes(k)) };
    setMine(next);
    setResourceId(id);
    const r = resourceById(id);
    setOutcome({
      tone: 'cancelled',
      message: id === 'guest' ? 'Your stay is cancelled. Nothing to pay.' : `Cancelled. ${summary(r, next[id])}`
    });
  };
  const gridHeight = resource.unit === 'hour' ? 548 : resource.unit === 'slot' ? 420 : 236;

  return (
    <div
      className='@container min-h-full w-full'
      style={{ background: K.paper, color: K.ink, fontFamily: K.sans, fontSize: 14, letterSpacing: '-0.004em' }}
    >
      <section aria-labelledby={titleId} className='flex flex-col gap-5 p-4 @min-[700px]:gap-6 @min-[700px]:p-7'>
        <header className='flex flex-wrap items-end justify-between gap-x-6 gap-y-2'>
          <div className='flex items-center gap-3'>
            <Mark size={34} />
            <div>
              <h2 id={titleId} style={{ ...head(36, 800), margin: 0 }}>
                Book
              </h2>
            </div>
            <div style={{ fontSize: 13.5, color: K.muted, marginLeft: 6, lineHeight: 1.3 }}>
              Fjellhagen borettslag
              <br />
              Week 18 · 27 April – 3 May 2026
            </div>
          </div>
          <div className='flex items-center gap-2' style={{ fontSize: 13.5, color: K.muted }}>
            Booking as
            <span style={{ fontWeight: 650, color: K.paper, background: K.moss, borderRadius: 6, padding: '3px 8px', letterSpacing: '0.03em' }}>
              {ME.flat}
            </span>
          </div>
        </header>

        <p className='sr-only' aria-live='polite' aria-atomic='true'>
          {outcome ? outcome.message : ''}
        </p>

        {/* Phones and narrow frames */}
        <div className='flex flex-col gap-4 @min-[700px]:hidden'>
          <Picker value={resourceId} onChange={onResource} mine={mine} compact />
          <div style={{ padding: '4px 2px' }}>
            <Sentence outcome={shown} />
          </div>
          {resource.unit !== 'night' ? (
            <div className='grid grid-cols-7 gap-1' role='group' aria-label='Day'>
              {WEEK.map((d, index) => {
                const on = index === day;
                const has = mine[resourceId].some((k) => Number(k.split(':')[0]) === index);
                return (
                  <button
                    key={d.short}
                    type='button'
                    aria-pressed={on}
                    aria-label={`${d.name} ${d.date} ${d.month}${has ? ', you have a booking' : ''}`}
                    onClick={() => setDay(index)}
                    className='flex cursor-pointer flex-col items-center gap-0.5 rounded-xl py-2 outline-none focus-visible:outline-[2.5px] focus-visible:outline-offset-2 focus-visible:outline-[#1E2944]'
                    style={{ border: 0, background: on ? K.dusk : K.card, color: on ? K.paper : K.ink, fontFamily: K.sans, boxShadow: on ? 'none' : `inset 0 0 0 1px ${K.line}` }}
                  >
                    <span style={{ ...label(10, on ? 'rgba(243,236,225,0.7)' : index === 0 ? K.brick : K.muted) }}>{d.short}</span>
                    <span style={head(19, 720)}>{d.date}</span>
                    <span style={{ width: 5, height: 5, borderRadius: 3, background: has ? (on ? K.yellow : K.moss) : 'transparent' }} />
                  </button>
                );
              })}
            </div>
          ) : null}
          <DayList resource={resource} mine={mine[resourceId]} day={day} onPress={onPress} />
          <Rules resource={resource} />
          <YourBookings mine={mine} onCancel={onCancel} />
        </div>

        {/* Wide frames */}
        <div className='hidden gap-7 @min-[700px]:grid @min-[700px]:grid-cols-[minmax(250px,320px)_1fr] @min-[1100px]:grid-cols-[340px_1fr]'>
          <div className='flex flex-col gap-6'>
            <Picker value={resourceId} onChange={onResource} mine={mine} />
            <div style={{ padding: '16px 16px 18px', borderRadius: 16, background: K.card, boxShadow: `inset 0 0 0 1px ${K.line}`, minHeight: 128 }}>
              <Sentence outcome={shown} />
            </div>
            <Rules resource={resource} />
            <YourBookings mine={mine} onCancel={onCancel} />
          </div>
          <div style={{ minWidth: 0 }}>
            <WeekGrid
              resource={resource}
              mine={mine[resourceId]}
              focus={focus[resourceId]}
              onFocus={(next) => setFocus({ ...focus, [resourceId]: next })}
              onPress={onPress}
              height={gridHeight}
            />
            {resource.unit === 'night' ? <GuestFlatInfo /> : null}
            <Legend resource={resource} />
          </div>
        </div>
      </section>
    </div>
  );
}

function Legend({ resource }: { resource: Resource }) {
  const items: [string, React.CSSProperties][] = [
    ['Free', chipStyle({ kind: 'free' })],
    ['Yours', chipStyle({ kind: 'mine' })],
    ['A neighbour', chipStyle({ kind: 'taken' })],
    ['Over your limit', chipStyle({ kind: 'limit' })],
    ...(resource.id === 'laundry' ? ([['Closed', chipStyle({ kind: 'closed' })]] as [string, React.CSSProperties][]) : [])
  ];
  return (
    <div className='mt-4 flex flex-wrap items-center gap-x-5 gap-y-2' style={{ fontSize: 12.5, color: K.muted, paddingLeft: resource.unit === 'slot' ? 64 : 48 }}>
      {items.map(([text, style]) => (
        <span key={text} className='flex items-center gap-2'>
          <span style={{ ...style, width: 14, height: 14, borderRadius: 4 }} />
          {text}
        </span>
      ))}
      <span style={{ marginLeft: 'auto' }}>Neighbours show by flat number unless they choose to show a name.</span>
    </div>
  );
}

function GuestFlatInfo() {
  return (
    <div
      className='mt-4 grid gap-5 @min-[900px]:grid-cols-[200px_1fr]'
      style={{ marginLeft: 48, padding: 18, borderRadius: 16, background: K.card, boxShadow: `inset 0 0 0 1px ${K.line}` }}
    >
      <svg viewBox='0 0 200 140' width='100%' aria-hidden='true' style={{ maxWidth: 200 }}>
        <rect x='4' y='4' width='192' height='132' rx='4' fill={K.paper} stroke={K.ink} strokeWidth='3' />
        <path d='M112 4v78M112 82h84M4 92h60' stroke={K.ink} strokeWidth='2' />
        <rect x='18' y='18' width='52' height='38' rx='4' fill={K.moss} />
        <rect x='18' y='18' width='52' height='10' rx='3' fill={K.mossSoft} />
        <rect x='124' y='18' width='58' height='22' rx='4' fill={K.brick} />
        <rect x='128' y='46' width='22' height='22' rx='3' fill={K.card} stroke={K.ink} strokeWidth='1.5' />
        <circle cx='139' cy='57' r='6' fill={K.dusk} />
        <rect x='18' y='104' width='70' height='18' rx='4' fill={K.yellow} />
        <path d='M150 136v-10a14 14 0 0 1 14-14' fill='none' stroke={K.ink} strokeWidth='1.5' />
      </svg>
      <div style={{ fontSize: 14, lineHeight: 1.45 }}>
        <div style={head(21, 740)}>The guest flat, ground floor of number 14</div>
        <div style={{ color: K.muted, marginTop: 6, maxWidth: '56ch' }}>
          Sleeps four: a double bed and a sofa bed. Linen and towels are in the cupboard. The key box code comes by text the day
          before you arrive, and the flat is cleaned between every stay.
        </div>
      </div>
    </div>
  );
}
