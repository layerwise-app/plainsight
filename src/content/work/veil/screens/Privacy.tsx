import { CONTACTS, V } from './model';
import { Avatar, Button, Card, Chip, Icon, Label, NavBar, Screen, TabBar } from './ui';

/** What left the phone each day of week 44, by kind. */
const DAYS = [
  { day: 'M', price: 6, balance: 3, pay: 1, backup: 0 },
  { day: 'T', price: 5, balance: 2, pay: 0, backup: 0 },
  { day: 'W', price: 6, balance: 3, pay: 1, backup: 1 },
  { day: 'T', price: 5, balance: 2, pay: 0, backup: 0 },
  { day: 'F', price: 6, balance: 3, pay: 1, backup: 0 },
  { day: 'S', price: 5, balance: 2, pay: 1, backup: 0 },
  { day: 'S', price: 5, balance: 2, pay: 0, backup: 1 }
];

const KINDS = [
  { key: 'price', name: 'Price updates', count: 38, where: 'Veil relay · carried no address', color: V.lilac },
  { key: 'balance', name: 'Balance checks', count: 17, where: 'Relay, one fresh address at a time', color: V.blue },
  { key: 'pay', name: 'Payments you sent', count: 4, where: 'Public network, as every payment is', color: V.ink },
  { key: 'backup', name: 'Backups', count: 2, where: 'Encrypted on this phone first', color: '#9AA5B1' }
] as const;

/** The weekly privacy report. 390 × 844. */
export function ReportScreen() {
  const max = 11;
  return (
    <Screen>
      <div style={{ padding: '6px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 44 }}>
        <span style={{ fontSize: 13, color: V.slate }}>27 Oct – 2 Nov</span>
        <Chip>Week 44</Chip>
      </div>
      <div style={{ padding: '6px 22px 0' }}>
        <div style={{ fontFamily: V.serif, fontSize: 40, lineHeight: 1.02, letterSpacing: '-0.015em', textWrap: 'balance' }}>What left your phone this week</div>
      </div>

      <div style={{ padding: '18px 22px 0', display: 'flex', alignItems: 'flex-end', gap: 22 }}>
        <div>
          <div style={{ fontFamily: V.serif, fontSize: 64, lineHeight: 0.9, letterSpacing: '-0.02em' }}>61</div>
          <div style={{ fontSize: 13, color: V.slate, marginTop: 6 }}>requests</div>
        </div>
        <div>
          <div style={{ fontFamily: V.serif, fontSize: 64, lineHeight: 0.9, letterSpacing: '-0.02em', color: V.blue }}>0</div>
          <div style={{ fontSize: 13, color: V.slate, marginTop: 6 }}>named you</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'grid', gridTemplateColumns: 'repeat(7, 14px)', gap: 6, alignItems: 'end', height: 86 }}>
          {DAYS.map((day, index) => {
            const parts = [
              [day.backup, '#9AA5B1'],
              [day.pay, V.ink],
              [day.balance, V.blue],
              [day.price, V.lilac]
            ] as const;
            return (
              <div key={index} style={{ display: 'grid', justifyItems: 'center', gap: 5 }}>
                <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 1.5, height: 66, justifyContent: 'flex-start' }}>
                  {parts.map(([count, color], i) =>
                    count ? (
                      <span key={i} style={{ width: 14, height: (count / max) * 64, borderRadius: 2.5, background: color }} />
                    ) : null
                  )}
                </div>
                <span style={{ fontSize: 10.5, color: V.faint, fontWeight: 500 }}>{day.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      <Card style={{ margin: '20px 16px 0' }}>
        {KINDS.map((kind, index) => (
          <div
            key={kind.key}
            style={{
              display: 'grid',
              gridTemplateColumns: '10px 1fr auto',
              gap: 12,
              alignItems: 'center',
              padding: '11px 16px',
              borderTop: index ? `1px solid ${V.line}` : undefined
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: 3, background: kind.color }} />
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 600 }}>{kind.name}</div>
              <div style={{ fontSize: 12.5, color: V.slate, marginTop: 2 }}>{kind.where}</div>
            </div>
            <span style={{ fontFamily: V.serif, fontSize: 24, lineHeight: 1 }}>{kind.count}</span>
          </div>
        ))}
      </Card>

      <div
        style={{
          margin: '10px 16px 0',
          padding: '12px 14px',
          borderRadius: 16,
          background: V.redTint,
          display: 'grid',
          gridTemplateColumns: '20px 1fr auto',
          gap: 10,
          alignItems: 'start'
        }}
      >
        <span style={{ color: V.redInk, marginTop: 1 }}>
          <Icon name='phone' size={18} stroke={1.9} />
        </span>
        <div style={{ fontSize: 13.5, lineHeight: 1.38, color: V.ink }}>
          A new phone asked to pair on Thursday at 21:40. You said no.
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: V.redInk }}>Review</span>
      </div>

      <div style={{ margin: '10px 16px 0', padding: '12px 14px', display: 'grid', gridTemplateColumns: '20px 1fr', gap: 10, fontSize: 13, color: V.slate, lineHeight: 1.4 }}>
        <span style={{ marginTop: 1 }}>
          <Icon name='lock' size={16} stroke={1.8} />
        </span>
        <span>
          <span style={{ color: V.ink, fontWeight: 600 }}>Never left: </span>
          23 contacts, 118 labels and who holds your recovery shares.
        </span>
      </div>

      <TabBar active='Privacy' />
    </Screen>
  );
}

const HOLDERS = [
  { contact: CONTACTS[0], share: 1, state: 'Ready', note: 'Confirmed 14 March' },
  { contact: CONTACTS[1], share: 2, state: 'Ready', note: 'Confirmed 14 March' },
  { contact: CONTACTS[2], share: 3, state: 'Waiting', note: 'Invited on Sunday' }
] as const;

/** Three people around the phone; any two of them can restore it. */
function Circle() {
  const size = 236;
  const c = size / 2;
  const r = 84;
  const at = (deg: number) => [c + r * Math.cos((deg * Math.PI) / 180), c + r * Math.sin((deg * Math.PI) / 180)];
  const spots = [-90, 30, 150].map(at);
  const arc = (a: number, b: number) => {
    const [x1, y1] = at(a);
    const [x2, y2] = at(b);
    return `M${x1} ${y1}A${r} ${r} 0 0 1 ${x2} ${y2}`;
  };
  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} aria-hidden='true' style={{ position: 'absolute', inset: 0 }}>
        <path d={arc(-62, 2)} fill='none' stroke={V.blue} strokeWidth={3} strokeLinecap='round' />
        <path d={arc(58, 122)} fill='none' stroke={V.lineStrong} strokeWidth={3} strokeLinecap='round' strokeDasharray='2 7' />
        <path d={arc(178, 242)} fill='none' stroke={V.lineStrong} strokeWidth={3} strokeLinecap='round' strokeDasharray='2 7' />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: c - 34,
          top: c - 34,
          width: 68,
          height: 68,
          borderRadius: 22,
          background: V.blue,
          color: V.white,
          display: 'grid',
          placeItems: 'center'
        }}
      >
        <Icon name='key' size={30} stroke={2.1} />
      </div>
      {HOLDERS.map((holder, index) => {
        const [x, y] = spots[index];
        const ready = holder.state === 'Ready';
        return (
          <div key={holder.contact.name} style={{ position: 'absolute', left: x - 28, top: y - 28 }}>
            <div style={{ borderRadius: 30, padding: 3, background: ready ? V.blue : V.fog, boxShadow: ready ? undefined : `inset 0 0 0 2px ${V.lineStrong}` }}>
              <div style={{ borderRadius: 30, padding: 2, background: V.fog }}>
                <Avatar initials={holder.contact.initials} tint={holder.contact.tint} size={46} />
              </div>
            </div>
            <span
              style={{
                position: 'absolute',
                right: -4,
                top: -4,
                width: 20,
                height: 20,
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 700,
                display: 'grid',
                placeItems: 'center',
                background: ready ? V.ink : V.paper,
                color: ready ? V.white : V.slate,
                boxShadow: `0 0 0 2px ${V.fog}`
              }}
            >
              {holder.share}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** Recovery split between three people. 390 × 844. */
export function RecoveryScreen() {
  return (
    <Screen>
      <NavBar title='Recovery' />
      <div style={{ padding: '4px 22px 0' }}>
        <div style={{ fontFamily: V.serif, fontSize: 36, lineHeight: 1.03, letterSpacing: '-0.015em' }}>
          Any two of these three can bring your wallet back.
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <Circle />
      </div>

      <Card style={{ margin: '8px 16px 0' }}>
        {HOLDERS.map((holder, index) => (
          <div
            key={holder.contact.name}
            style={{
              display: 'grid',
              gridTemplateColumns: '40px 1fr auto',
              gap: 12,
              alignItems: 'center',
              padding: '11px 14px',
              borderTop: index ? `1px solid ${V.line}` : undefined
            }}
          >
            <Avatar initials={holder.contact.initials} tint={holder.contact.tint} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{holder.contact.name}</div>
              <div style={{ fontSize: 12.5, color: V.slate, marginTop: 2 }}>
                Share {holder.share} · {holder.note}
              </div>
            </div>
            {holder.state === 'Ready' ? (
              <Chip tone='blue' icon='check'>
                Ready
              </Chip>
            ) : (
              <Chip>Waiting</Chip>
            )}
          </div>
        ))}
      </Card>

      <div style={{ padding: '14px 24px 0', fontSize: 13, lineHeight: 1.45, color: V.slate }}>
        No one of them can open your wallet alone, and neither can Veil. Each share is encrypted to its holder’s phone.
      </div>

      <div style={{ marginTop: 'auto', padding: '0 16px 34px' }}>
        <Label style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: 12 }}>
          <Icon name='check' size={14} stroke={2.2} color={V.blue} />
          Tested 2 Nov: restored on a spare phone in 4 min
        </Label>
        <Button tone='ghost'>Remind Sunniva</Button>
      </div>
    </Screen>
  );
}
