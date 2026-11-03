import { BALANCE, V } from './model';
import { Amount, Avatar, Card, Icon, Label, Mark, Screen, TabBar, Token } from './ui';

/** The hold-to-show control, in its resting and held states. */
export function HoldPill({ reveal = 0, press = 0 }: { reveal?: number; press?: number }) {
  const held = reveal >= 0.5;
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 36,
        padding: '0 15px 0 11px',
        borderRadius: 18,
        fontSize: 14,
        fontWeight: 500,
        color: held ? V.white : V.ink,
        background: held ? V.ink : 'rgba(20,23,27,0.07)',
        whiteSpace: 'nowrap'
      }}
    >
      <Icon name='hold' size={18} stroke={1.8} />
      {held ? 'Release to hide' : 'Hold to show'}
      {press > 0 ? (
        <span
          aria-hidden='true'
          style={{
            position: 'absolute',
            left: 20,
            top: '50%',
            width: 58,
            height: 58,
            marginLeft: -29,
            marginTop: -29,
            borderRadius: 40,
            background: 'rgba(255,255,255,0.32)',
            boxShadow: '0 0 0 1.5px rgba(255,255,255,0.75), 0 6px 18px rgba(20,23,27,0.18)',
            opacity: press,
            transform: `scale(${0.85 + press * 0.15})`
          }}
        />
      ) : null}
    </span>
  );
}

const ROWS = [
  { kind: 'eur', name: 'Euro', note: 'Stable, 1 € each', value: BALANCE.eur, sub: BALANCE.eurInNok },
  { kind: 'nok', name: 'Krone', note: 'Stable, 1 kr each', value: BALANCE.nok, sub: 'Everyday kroner' },
  { kind: 'btc', name: 'Bitcoin', note: 'Moves with the market', value: BALANCE.btc, sub: BALANCE.btcInNok }
] as const;

/** Home with balances hidden until you hold. 390 × 844. */
export function HomeScreen({ reveal = 0, press = 0 }: { reveal?: number; press?: number }) {
  return (
    <Screen>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px 0 22px', height: 48 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontSize: 16, fontWeight: 600 }}>
          <Mark size={22} />
          Everyday
          <Icon name='down' size={16} color={V.slate} stroke={2} />
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              position: 'relative',
              width: 38,
              height: 38,
              borderRadius: 19,
              display: 'grid',
              placeItems: 'center',
              background: 'rgba(20,23,27,0.06)'
            }}
          >
            <Icon name='shield' size={19} />
            <span style={{ position: 'absolute', right: 7, top: 7, width: 8, height: 8, borderRadius: 4, background: V.blue, boxShadow: `0 0 0 2px ${V.fog}` }} />
          </span>
          <Avatar initials='EB' tint={V.mist} size={38} />
        </span>
      </div>

      <div style={{ padding: '34px 22px 0' }}>
        <Label>All your money</Label>
        <div style={{ marginTop: 12, height: 64, display: 'flex', alignItems: 'center' }}>
          <Amount value={BALANCE.total} reveal={reveal} size={60} serif blur={13} />
        </div>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <HoldPill reveal={reveal} press={press} />
          <span style={{ fontSize: 12.5, color: V.faint, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <Icon name='lock' size={13} stroke={1.8} />
            Hidden by default
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, padding: '28px 16px 0' }}>
        {(
          [
            ['send', 'Send'],
            ['receive', 'Receive'],
            ['scan', 'Scan']
          ] as const
        ).map(([icon, name], index) => (
          <div
            key={name}
            style={{
              height: 70,
              borderRadius: 18,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              fontSize: 14,
              fontWeight: 500,
              background: index === 0 ? V.blue : V.paper,
              color: index === 0 ? V.white : V.ink,
              boxShadow: index === 0 ? 'none' : `0 0 0 1px ${V.line}`
            }}
          >
            <Icon name={icon} size={22} stroke={1.9} />
            {name}
          </div>
        ))}
      </div>

      <Card style={{ margin: '14px 16px 0', padding: '4px 0' }}>
        {ROWS.map((row, index) => (
          <div
            key={row.kind}
            style={{
              display: 'grid',
              gridTemplateColumns: '40px 1fr auto',
              alignItems: 'center',
              gap: 12,
              padding: '13px 16px',
              borderTop: index ? `1px solid ${V.line}` : undefined
            }}
          >
            <Token kind={row.kind} size={38} />
            <div>
              <div style={{ fontSize: 15.5, fontWeight: 600 }}>{row.name}</div>
              <div style={{ fontSize: 12.5, color: V.slate, marginTop: 3 }}>{row.note}</div>
            </div>
            <div style={{ display: 'grid', justifyItems: 'end', gap: 6 }}>
              <Amount value={row.value} reveal={reveal} size={16} align='right' blur={6} />
              <Amount value={row.sub} reveal={reveal} size={12.5} align='right' color={V.slate} blur={4.5} />
            </div>
          </div>
        ))}
      </Card>

      <Card style={{ margin: '12px 16px 0', padding: '14px 16px', display: 'grid', gridTemplateColumns: '38px 1fr 18px', gap: 12, alignItems: 'center' }}>
        <span style={{ width: 38, height: 38, borderRadius: 12, background: V.blueTint, color: V.blue, display: 'grid', placeItems: 'center' }}>
          <Icon name='shield' size={19} stroke={1.9} />
        </span>
        <div>
          <div style={{ fontSize: 14.5, fontWeight: 600 }}>Your week 44 report</div>
          <div style={{ fontSize: 12.5, color: V.slate, marginTop: 3, lineHeight: 1.35 }}>61 requests left. None named you.</div>
        </div>
        <Icon name='right' size={18} color={V.faint} />
      </Card>

      <TabBar active='Home' />
    </Screen>
  );
}
