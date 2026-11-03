import { K, head, label } from './model';
import { Button, Icon, NavBar, Screen } from './ui';

function Fact({ name, value, note }: { name: string; value: string; note?: string }) {
  return (
    <div style={{ padding: '12px 0', borderTop: `1px solid ${K.line}`, display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'baseline' }}>
      <span style={{ fontSize: 14, color: K.muted }}>{name}</span>
      <span style={{ textAlign: 'right' }}>
        <span style={{ fontSize: 15, fontWeight: 650 }}>{value}</span>
        {note ? <span style={{ display: 'block', fontSize: 12.5, color: K.muted, marginTop: 1 }}>{note}</span> : null}
      </span>
    </div>
  );
}

function Doc({ name, meta }: { name: string; meta: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '30px 1fr 18px', gap: 10, alignItems: 'center', padding: '10px 0' }}>
      <span style={{ width: 30, height: 36, borderRadius: 4, background: K.card, boxShadow: `inset 0 0 0 1.5px ${K.lineStrong}`, position: 'relative' }}>
        <span style={{ position: 'absolute', left: 6, right: 6, top: 9, height: 2, background: K.lineStrong }} />
        <span style={{ position: 'absolute', left: 6, right: 10, top: 15, height: 2, background: K.lineStrong }} />
        <span style={{ position: 'absolute', left: 6, right: 8, top: 21, height: 2, background: K.lineStrong }} />
      </span>
      <span>
        <span style={{ display: 'block', fontSize: 14.5, fontWeight: 600 }}>{name}</span>
        <span style={{ display: 'block', fontSize: 12.5, color: K.muted }}>{meta}</span>
      </span>
      <Icon name='chevron' size={18} color={K.faint} />
    </div>
  );
}

/** A proposal for the annual meeting, as residents read it. 390 × 844. */
export function ProposalScreen() {
  return (
    <Screen>
      <NavBar title='Annual meeting' />
      <div style={{ padding: '8px 22px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={label(11.5)}>Proposal 4 of 7</span>
          <span style={{ ...label(10.5, K.paper), background: K.brick, padding: '4px 7px 3px', borderRadius: 5 }}>Styret recommends for</span>
        </div>
        <div style={{ ...head(44, 800), marginTop: 12, textWrap: 'balance' }}>Charging points in the garage</div>
        <div style={{ fontSize: 15.5, lineHeight: 1.42, marginTop: 12, textWrap: 'pretty' }}>
          Styret proposes 24 charging points in the garage, paid for with a 15-year loan of 1.9 million kr. Anyone with a
          parking space can rent one.
        </div>
      </div>
      <div style={{ padding: '14px 22px 0' }}>
        <Fact name='Your common costs' value='+112 kr a month' note='from 1 September' />
        <Fact name='Power' value='Paid by each user' note='measured per charger' />
        <Fact name='To pass' value='Two thirds' note='of votes cast' />
      </div>
      <div style={{ padding: '10px 22px 0', borderTop: `1px solid ${K.line}`, margin: '0 22px', paddingLeft: 0, paddingRight: 0 }}>
        <Doc name='Quote from Elektro Nord' meta='PDF · 4 pages' />
        <Doc name='Questions and answers' meta='14 questions, all answered by styret' />
      </div>
      <div style={{ marginTop: 'auto', padding: '0 18px 38px' }}>
        <div style={{ fontSize: 13, color: K.muted, textAlign: 'center', marginBottom: 10 }}>Voting open until 12 May, 20:00</div>
        <Button tone='ink'>Vote on proposal 4</Button>
      </div>
    </Screen>
  );
}

function Option({ title, note, selected, tone }: { title: string; note: string; selected?: boolean; tone: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '28px 1fr',
        gap: 14,
        alignItems: 'center',
        padding: '16px 18px',
        borderRadius: 18,
        background: selected ? tone : K.card,
        color: selected ? K.paper : K.ink,
        boxShadow: selected ? 'none' : `inset 0 0 0 1px ${K.line}`
      }}
    >
      <span
        style={{
          width: 26,
          height: 26,
          borderRadius: 13,
          boxShadow: selected ? 'none' : `inset 0 0 0 2px ${K.lineStrong}`,
          background: selected ? K.paper : 'transparent',
          color: tone,
          display: 'grid',
          placeItems: 'center'
        }}
      >
        {selected ? <Icon name='check' size={17} stroke={3} /> : null}
      </span>
      <span>
        <span style={{ display: 'block', ...head(27, 760) }}>{title}</span>
        <span style={{ display: 'block', fontSize: 13.5, marginTop: 3, color: selected ? 'rgba(243,236,225,0.82)' : K.muted }}>{note}</span>
      </span>
    </div>
  );
}

/** Casting the flat's one vote. 390 × 844. */
export function VoteScreen() {
  return (
    <Screen background={K.paper}>
      <NavBar title='Your vote' />
      <div style={{ padding: '8px 22px 0' }}>
        <span style={label(11.5)}>Proposal 4 · Charging points</span>
        <div style={{ ...head(38, 800), marginTop: 10 }}>How does H0204 vote?</div>
        <div style={{ fontSize: 15, lineHeight: 1.42, marginTop: 10, color: K.muted, textWrap: 'pretty' }}>
          One vote per flat. You can change it until the meeting closes on 12 May at 20:00.
        </div>
      </div>
      <div style={{ padding: '20px 16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Option title='For' note='Install 24 charging points' selected tone={K.moss} />
        <Option title='Against' note='Keep the garage as it is' tone={K.brick} />
        <Option title='Abstain' note='Counts towards turnout, not the result' tone={K.dusk} />
      </div>
      <div style={{ margin: '18px 22px 0', display: 'grid', gridTemplateColumns: '22px 1fr', gap: 10, fontSize: 13.5, lineHeight: 1.4, color: K.muted }}>
        <Icon name='lock' size={20} color={K.muted} />
        <span>Votes are secret. Styret sees the totals, never how a flat voted.</span>
      </div>
      <div style={{ margin: '22px 22px 0', paddingTop: 14, borderTop: `1px solid ${K.line}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
          <span style={{ fontWeight: 600 }}>You’ve voted on 3 of 7</span>
          <span style={{ color: K.muted }}>Next: proposal 5</span>
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 9 }}>
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <span key={n} style={{ flex: 1, height: 6, borderRadius: 3, background: n <= 3 ? K.moss : n === 4 ? K.ink : K.paperDeep }} />
          ))}
        </div>
      </div>
      <div style={{ marginTop: 'auto', padding: '0 18px 38px' }}>
        <Button tone='moss'>Cast vote for H0204</Button>
      </div>
    </Screen>
  );
}

const OTHERS: [string, string, string][] = [
  ['1', 'Annual accounts 2025', 'Approved'],
  ['2', 'Fees for styret, 2026', 'Approved'],
  ['3', 'Dogs allowed in the courtyard', 'Not adopted'],
  ['5', 'Elections: Kristian Moe, treasurer', 'Elected']
];

/** Results, as the meeting closed. 390 × 844. */
export function ResultsScreen() {
  const votes = { for: 41, against: 14, abstain: 3 };
  const cast = votes.for + votes.against;
  const share = votes.for / cast;
  return (
    <Screen background={K.dusk} dark time='20:04'>
      <NavBar title='Results' dark />
      <div style={{ padding: '6px 22px 0' }}>
        <span style={label(11.5, 'rgba(243,236,225,0.62)')}>Proposal 4 · closed 12 May, 20:00</span>
        <div style={{ ...head(66, 820), marginTop: 12, color: K.yellow }}>Adopted</div>
        <div style={{ ...head(26, 720), marginTop: 6 }}>Charging points in the garage</div>
      </div>
      <div style={{ padding: '26px 22px 0' }}>
        <div style={{ position: 'relative', display: 'flex', height: 46, borderRadius: 10, overflow: 'hidden', gap: 2 }}>
          <span style={{ flex: votes.for, background: K.moss }} />
          <span style={{ flex: votes.against, background: K.brick }} />
        </div>
        <div style={{ position: 'relative', height: 30 }}>
          <span style={{ position: 'absolute', left: `${(2 / 3) * 100}%`, top: -54, width: 2, height: 62, background: K.paper, marginLeft: -1 }} />
          <span style={{ position: 'absolute', left: `${(2 / 3) * 100}%`, top: 12, transform: 'translateX(-50%)', fontSize: 12, color: 'rgba(243,236,225,0.7)', whiteSpace: 'nowrap' }}>
            two thirds
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 6 }}>
          {[
            ['For', votes.for, K.moss],
            ['Against', votes.against, K.brick],
            ['Abstained', votes.abstain, 'rgba(243,236,225,0.3)']
          ].map(([name, value, color]) => (
            <div key={String(name)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(243,236,225,0.72)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: String(color) }} />
                {name}
              </div>
              <div style={{ ...head(34, 760), marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.45, marginTop: 16, color: 'rgba(243,236,225,0.82)', textWrap: 'pretty' }}>
          {(share * 100).toFixed(1)}% of votes cast were for. 58 of 64 flats voted: 31 from home, 27 in the meeting room.
        </div>
      </div>
      <div style={{ margin: '22px 22px 0' }}>
        {OTHERS.map(([n, name, result]) => (
          <div
            key={n}
            style={{
              display: 'grid',
              gridTemplateColumns: '24px 1fr auto',
              gap: 8,
              padding: '11px 0',
              borderTop: '1px solid rgba(243,236,225,0.14)',
              fontSize: 14
            }}
          >
            <span style={{ color: 'rgba(243,236,225,0.5)', fontVariantNumeric: 'tabular-nums' }}>{n}</span>
            <span>{name}</span>
            <span style={{ color: result === 'Not adopted' ? '#F2A58C' : K.yellow, fontWeight: 600 }}>{result}</span>
          </div>
        ))}
        <div style={{ fontSize: 13, color: 'rgba(243,236,225,0.6)', paddingTop: 12, borderTop: '1px solid rgba(243,236,225,0.14)', lineHeight: 1.4 }}>
          Minutes signed by the chair and two residents. Sent to every flat on 14 May.
        </div>
      </div>
    </Screen>
  );
}
