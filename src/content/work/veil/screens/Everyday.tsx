import { seeded } from '~/components/art/random';
import { CONTACTS, POISON, RECEIVE, V, fingerprint, short } from './model';
import { Address, Avatar, Bars, Button, Card, Chip, Icon, Mark, NavBar, Screen, TabBar, Token, Words } from './ui';

type Row = {
  label: string;
  meta: string;
  amount: string;
  incoming?: boolean;
  who: 'eur' | 'nok' | 'btc' | number | 'warn';
};

const GROUPS: { day: string; rows: Row[] }[] = [
  {
    day: 'Today',
    rows: [
      { label: 'Cabin, Hemsedal', meta: 'To Mari Lunde · 08:04', amount: '− € 120,00', who: 0 },
      { label: 'Bike service', meta: 'To 0x3c90…1f02 · 07:41', amount: '− kr 890,00', who: 'nok' }
    ]
  },
  {
    day: 'Yesterday',
    rows: [
      { label: 'Hidden: lookalike of Mari', meta: `${short(POISON)} sent €0,00 · 23:14`, amount: '€ 0,00', who: 'warn' },
      { label: 'Concert tickets, half', meta: 'From Sunniva Dahl · 19:20', amount: '+ € 18,50', incoming: true, who: 2 },
      { label: 'Fish soup at the market', meta: 'To 0xb71e…a4c8 · 13:05', amount: '− kr 245,00', who: 'nok' }
    ]
  },
  {
    day: 'Saturday 1 November',
    rows: [
      { label: 'Savings, November', meta: 'Kroner to bitcoin · 10:00', amount: '+ 0,000 94 BTC', incoming: true, who: 'btc' },
      { label: 'Top-up from bank', meta: 'Everyday kroner · 09:12', amount: '+ kr 5 000,00', incoming: true, who: 'nok' }
    ]
  }
];

/** Activity, with labels that are kept and searched on the phone. 390 × 844. */
export function ActivityScreen() {
  return (
    <Screen>
      <div style={{ padding: '6px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <span style={{ fontFamily: V.serif, fontSize: 38, letterSpacing: '-0.015em' }}>Activity</span>
        <span style={{ display: 'flex', gap: 6 }}>
          <Chip tone='solid'>All</Chip>
          <Chip>€</Chip>
          <Chip>kr</Chip>
          <Chip>₿</Chip>
        </span>
      </div>
      <div
        style={{
          margin: '6px 16px 0',
          height: 42,
          borderRadius: 21,
          background: 'rgba(20,23,27,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          padding: '0 15px',
          fontSize: 14.5,
          color: V.faint
        }}
      >
        <Icon name='search' size={17} color={V.slate} />
        <span style={{ flex: 1 }}>Search your labels</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
          <Icon name='lock' size={12} stroke={1.9} />
          on this phone
        </span>
      </div>

      {GROUPS.map((group) => (
        <div key={group.day}>
          <div style={{ padding: '16px 22px 7px', fontSize: 12.5, fontWeight: 500, color: V.slate }}>{group.day}</div>
          <Card style={{ margin: '0 16px', overflow: 'hidden' }}>
            {group.rows.map((row, index) => {
              const warn = row.who === 'warn';
              return (
                <div
                  key={row.label}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '36px 1fr auto',
                    gap: 12,
                    alignItems: 'center',
                    padding: '10px 14px',
                    borderTop: index ? `1px solid ${V.line}` : undefined,
                    background: warn ? 'rgba(255,79,31,0.06)' : undefined
                  }}
                >
                  {typeof row.who === 'number' ? (
                    <Avatar initials={CONTACTS[row.who].initials} tint={CONTACTS[row.who].tint} size={36} />
                  ) : warn ? (
                    <span style={{ width: 36, height: 36, borderRadius: 18, background: V.redTint, color: V.redInk, display: 'grid', placeItems: 'center' }}>
                      <Icon name='warn' size={17} stroke={1.9} />
                    </span>
                  ) : (
                    <Token kind={row.who as 'eur' | 'nok' | 'btc'} size={36} />
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: warn ? V.redInk : V.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {row.label}
                    </div>
                    <div style={{ fontSize: 12, color: V.slate, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.meta}</div>
                  </div>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      color: warn ? V.faint : row.incoming ? V.blueInk : V.ink,
                      textDecoration: warn ? 'line-through' : undefined
                    }}
                  >
                    {row.amount}
                  </span>
                </div>
              );
            })}
          </Card>
        </div>
      ))}

      <TabBar active='Activity' />
    </Screen>
  );
}

/** A QR-style code drawn from the address. Not scannable; only for the picture. */
function Code({ address, size = 212 }: { address: string; size?: number }) {
  const n = 29;
  const cell = size / n;
  const random = seeded(address.length * 977 + address.charCodeAt(5) * 31 + address.charCodeAt(9));
  const finder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8);
  const centre = (x: number, y: number) => Math.abs(x - 14) <= 3 && Math.abs(y - 14) <= 3;
  const cells: [number, number][] = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (finder(x, y) || centre(x, y)) continue;
      // Timing lines, as a real code has.
      if ((x === 6 || y === 6) && (x + y) % 2 === 0) cells.push([x, y]);
      else if (x !== 6 && y !== 6 && random() < 0.48) cells.push([x, y]);
    }
  }
  const eye = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x * cell + cell * 0.5} y={y * cell + cell * 0.5} width={cell * 6} height={cell * 6} rx={cell * 1.6} fill='none' stroke={V.ink} strokeWidth={cell} />
      <rect x={(x + 2) * cell} y={(y + 2) * cell} width={cell * 3} height={cell * 3} rx={cell * 0.8} fill={V.blue} />
    </g>
  );
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} aria-hidden='true'>
        {cells.map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x * cell + 0.6} y={y * cell + 0.6} width={cell - 1.2} height={cell - 1.2} rx={cell * 0.28} fill={V.ink} />
        ))}
        {eye(0, 0)}
        {eye(n - 7, 0)}
        {eye(0, n - 7)}
      </svg>
      <span style={{ position: 'absolute', left: size / 2 - 20, top: size / 2 - 20, width: 40, height: 40, borderRadius: 12, background: V.paper, display: 'grid', placeItems: 'center' }}>
        <Mark size={26} />
      </span>
    </div>
  );
}

/** Receiving, with a new address for this payment. 390 × 844. */
export function ReceiveScreen() {
  const print = fingerprint(RECEIVE);
  return (
    <Screen>
      <NavBar title='Receive euros' icon='close' />
      <div style={{ padding: '6px 22px 0', textAlign: 'center' }}>
        <div style={{ fontFamily: V.serif, fontSize: 30, lineHeight: 1.05, letterSpacing: '-0.01em' }}>A new address, just for this payment</div>
      </div>
      <Card style={{ margin: '18px 16px 0', padding: '22px 18px 18px', display: 'grid', justifyItems: 'center' }}>
        <Code address={RECEIVE} size={204} />
        <div style={{ marginTop: 18, textAlign: 'center' }}>
          <Words print={print} size={27} />
        </div>
        <div style={{ marginTop: 10 }}>
          <Bars bars={print.bars} height={26} width={10} gap={4} radius={2.5} />
        </div>
        <div style={{ marginTop: 14, maxWidth: 270, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
          <span style={{ display: 'inline-flex', justifyContent: 'center' }}>
            <Address address={RECEIVE} size={12.5} color={V.slate} />
          </span>
        </div>
      </Card>
      <div style={{ margin: '12px 16px 0', padding: '12px 14px', display: 'grid', gridTemplateColumns: '20px 1fr', gap: 10, fontSize: 13, lineHeight: 1.42, color: V.slate }}>
        <span style={{ marginTop: 1, color: V.blue }}>
          <Icon name='shield' size={17} stroke={1.9} />
        </span>
        <span>
          <span style={{ color: V.ink, fontWeight: 600 }}>Address 31 of this wallet.</span> Each is used once, so nobody can add up what you’ve
          received. Read the three words to whoever is paying you.
        </span>
      </div>
      <div style={{ marginTop: 'auto', padding: '0 16px 34px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Button tone='ghost'>
          <Icon name='copy' size={18} /> Copy
        </Button>
        <Button>
          <Icon name='share' size={18} /> Share
        </Button>
      </div>
    </Screen>
  );
}

