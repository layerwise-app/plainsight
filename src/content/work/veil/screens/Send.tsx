import { BALANCE, CONTACTS, MARI, POISON, V, fingerprint, short } from './model';
import { Address, Amount, Avatar, Bars, Button, Card, Chip, Icon, Label, NavBar, Screen, Token, Words } from './ui';

function FromRow() {
  return (
    <Card style={{ margin: '2px 16px 0', padding: '12px 14px', display: 'grid', gridTemplateColumns: '34px 1fr auto', gap: 12, alignItems: 'center' }}>
      <Token kind='eur' size={34} />
      <div>
        <div style={{ fontSize: 12.5, color: V.slate }}>From</div>
        <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>Everyday euros</div>
      </div>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
        <Amount value={BALANCE.eur} size={15} align='right' blur={5} />
        <span style={{ fontSize: 12.5, fontWeight: 500, color: V.slate, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Icon name='hold' size={15} stroke={1.8} />
          Hold
        </span>
      </span>
    </Card>
  );
}

/** Choosing who to pay. Every saved contact shows its words and colours. 390 × 844. */
export function RecipientScreen() {
  return (
    <Screen>
      <NavBar title='Send euros' icon='close' />
      <FromRow />
      <div
        style={{
          margin: '12px 16px 0',
          height: 46,
          borderRadius: 23,
          background: 'rgba(20,23,27,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          padding: '0 8px 0 15px',
          color: V.faint,
          fontSize: 15
        }}
      >
        <Icon name='search' size={18} color={V.slate} />
        <span style={{ flex: 1 }}>Name, label or address</span>
        <span
          style={{
            height: 32,
            padding: '0 12px',
            borderRadius: 16,
            background: V.paper,
            color: V.ink,
            fontSize: 13,
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: `0 0 0 1px ${V.line}`
          }}
        >
          <Icon name='paste' size={15} />
          Paste
        </span>
      </div>

      <Label style={{ padding: '22px 22px 9px' }}>People you’ve paid</Label>
      <Card style={{ margin: '0 16px' }}>
        {CONTACTS.map((contact, index) => {
          const print = fingerprint(contact.address);
          return (
            <div
              key={contact.name}
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr auto',
                gap: 12,
                alignItems: 'center',
                padding: '12px 14px',
                borderTop: index ? `1px solid ${V.line}` : undefined
              }}
            >
              <Avatar initials={contact.initials} tint={contact.tint} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15.5, fontWeight: 600 }}>{contact.name}</div>
                <div style={{ fontSize: 13, color: V.slate, marginTop: 3 }}>{print.words.join(' · ')}</div>
              </div>
              <Bars bars={print.bars} height={20} width={5} gap={2.5} radius={1.5} />
            </div>
          );
        })}
      </Card>

      <Label style={{ padding: '20px 22px 9px' }}>From your history</Label>
      <Card style={{ margin: '0 16px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr auto', gap: 12, alignItems: 'center', padding: '12px 14px' }}>
          <span style={{ width: 40, height: 40, borderRadius: 20, background: V.redTint, color: V.redInk, display: 'grid', placeItems: 'center' }}>
            <Icon name='warn' size={19} stroke={1.9} />
          </span>
          <div>
            <div style={{ fontFamily: V.mono, fontSize: 14 }}>{short(POISON)}</div>
            <div style={{ fontSize: 12.5, color: V.slate, marginTop: 3 }}>Sent you €0,00 · yesterday 23:14</div>
          </div>
          <Chip tone='red'>Lookalike</Chip>
        </div>
        <div style={{ padding: '10px 14px 12px', fontSize: 13, lineHeight: 1.4, color: V.redInk, background: 'rgba(255,79,31,0.06)', borderTop: '1px solid rgba(255,79,31,0.14)' }}>
          Starts and ends like Mari Lunde’s address. Veil has taken it out of your suggestions.
        </div>
      </Card>

      <div style={{ marginTop: 'auto', padding: '0 26px 40px', display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12.5, color: V.slate, lineHeight: 1.45 }}>
        <span style={{ marginTop: 1 }}>
          <Icon name='lock' size={14} stroke={1.8} />
        </span>
        Words and colours are worked out on this phone from the address itself. Nothing is looked up.
      </div>
    </Screen>
  );
}

/** The check, when the address is the one saved for Mari. 390 × 844. */
export function MatchScreen() {
  const print = fingerprint(MARI.address);
  return (
    <Screen>
      <NavBar title='Send euros' />
      <div style={{ padding: '6px 22px 0', display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ position: 'relative' }}>
          <Avatar initials={MARI.initials} tint={MARI.tint} size={52} />
          <span
            style={{
              position: 'absolute',
              right: -3,
              bottom: -3,
              width: 22,
              height: 22,
              borderRadius: 11,
              background: V.blue,
              color: V.white,
              display: 'grid',
              placeItems: 'center',
              boxShadow: `0 0 0 2.5px ${V.fog}`
            }}
          >
            <Icon name='check' size={13} stroke={2.6} />
          </span>
        </span>
        <div>
          <div style={{ fontSize: 13, color: V.slate }}>To</div>
          <div style={{ fontFamily: V.serif, fontSize: 32, lineHeight: 1.05, letterSpacing: '-0.01em' }}>Mari Lunde</div>
        </div>
      </div>

      <Card style={{ margin: '18px 16px 0', padding: '16px 16px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip tone='blue' icon='check'>
            Matches Mari Lunde
          </Chip>
          <span style={{ fontSize: 12.5, color: V.slate }}>saved 12 March</span>
        </div>
        <div style={{ marginTop: 16 }}>
          <Words print={print} size={33} />
        </div>
        <div style={{ marginTop: 14 }}>
          <Bars bars={print.bars} height={34} width={14} gap={5} radius={3} />
        </div>
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${V.line}` }}>
          <Address address={MARI.address} size={12.5} color={V.slate} />
        </div>
        <div style={{ marginTop: 8, fontSize: 12.5, color: V.slate, lineHeight: 1.4 }}>
          Same words and colours as your last six payments to Mari.
        </div>
      </Card>

      <div style={{ padding: '22px 22px 0' }}>
        <Label>Amount</Label>
        <div style={{ fontFamily: V.serif, fontSize: 58, lineHeight: 1, letterSpacing: '-0.02em', marginTop: 8 }}>€ 120,00</div>
        <div style={{ fontSize: 13, color: V.slate, marginTop: 6 }}>≈ kr 1 404,00 · from Everyday euros</div>
      </div>

      <Card style={{ margin: '16px 16px 0', padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Icon name='lock' size={16} color={V.slate} stroke={1.8} />
        <span style={{ flex: 1, fontSize: 15 }}>Cabin, Hemsedal</span>
        <span style={{ fontSize: 12, color: V.faint }}>Label stays on this phone</span>
      </Card>

      <div style={{ margin: '14px 22px 0', display: 'grid', gap: 9, fontSize: 13.5 }}>
        {[
          ['Network fee', '€ 0,04'],
          ['Arrives', 'in about 10 seconds'],
          ['Mari sees', 'the amount, not your label']
        ].map(([key, value]) => (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: V.slate }}>{key}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto', padding: '0 16px 34px' }}>
        <Button>Send € 120,00 to Mari</Button>
      </div>
    </Screen>
  );
}

/** The check, when a lookalike of Mari's address was pasted. 390 × 844. */
export function LookalikeScreen() {
  const saved = fingerprint(MARI.address);
  const pasted = fingerprint(POISON);
  return (
    <Screen>
      <NavBar title='Send euros' />
      <div style={{ padding: '8px 22px 0' }}>
        <span style={{ width: 46, height: 46, borderRadius: 23, background: V.red, color: V.white, display: 'grid', placeItems: 'center' }}>
          <Icon name='warn' size={22} stroke={2} />
        </span>
        <div style={{ fontFamily: V.serif, fontSize: 38, lineHeight: 1.02, letterSpacing: '-0.015em', marginTop: 16 }}>
          This isn’t Mari’s address.
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.45, color: V.slate, marginTop: 10, textWrap: 'pretty' }}>
          It starts <span style={{ fontFamily: V.mono, fontSize: 13.5, color: V.ink }}>0x7a3F9c</span> and ends{' '}
          <span style={{ fontFamily: V.mono, fontSize: 13.5, color: V.ink }}>4b2d</span>, like hers. All 30 characters in between are
          different. It sent you €0,00 last night so it would sit in your history.
        </div>
      </div>

      <Card style={{ margin: '18px 16px 0', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 12.5, color: V.slate }}>Saved for Mari Lunde, 12 March</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10, marginTop: 8 }}>
            <Words print={saved} size={23} />
            <Bars bars={saved.bars} height={24} width={7} gap={3} />
          </div>
        </div>
        <div style={{ padding: '14px 16px', background: 'rgba(255,79,31,0.07)', borderTop: '1px solid rgba(255,79,31,0.16)' }}>
          <div style={{ fontSize: 12.5, color: V.redInk }}>The address you pasted</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10, marginTop: 8 }}>
            <Words print={pasted} size={23} />
            <Bars bars={pasted.bars} height={24} width={7} gap={3} />
          </div>
          <div style={{ marginTop: 10 }}>
            <Address address={POISON} against={MARI.address} size={12.5} color={V.slate} />
          </div>
        </div>
      </Card>

      <div style={{ margin: '16px 22px 0', display: 'grid', gridTemplateColumns: '18px 1fr', gap: 10, fontSize: 13, lineHeight: 1.42, color: V.slate }}>
        <span style={{ marginTop: 1 }}>
          <Icon name='shield' size={16} stroke={1.9} />
        </span>
        <span>
          This is the third lookalike of someone you know that Veil has caught since August. None of them were paid.
        </span>
      </div>

      <div style={{ marginTop: 'auto', padding: '0 16px 34px', display: 'grid', gap: 10 }}>
        <Button>Pay Mari’s saved address</Button>
        <Button tone='red'>Block this address</Button>
      </div>
    </Screen>
  );
}
