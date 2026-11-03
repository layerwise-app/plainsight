import { K } from './model';
import { AppFrame, PageHead, Pill } from './ui';

const ROWS = [
  { time: '14:32:11', agent: 'Momentum · Nordics', text: 'Bought 1,200 EQNR at 286.40', rule: '2.1', verdict: 'Allowed', note: 'position 6.8% of 8.0%' },
  { time: '14:31:47', agent: 'Pairs · Energy', text: 'Asked to hold 9.2% in AKRBP', rule: '2.2', verdict: 'Asked you', note: 'soft limit 8.0%' },
  { time: '14:29:02', agent: 'Mean reversion · G10 FX', text: 'Sold 2.0M EURNOK at 11.684', rule: '1.3', verdict: 'Allowed', note: 'day loss −0.3% of −2.5%' },
  { time: '14:12:40', agent: 'Momentum · Nordics', text: 'Wanted 13.1% in KOG', rule: '2.1', verdict: 'Stopped', note: 'over 8.0% position limit' },
  { time: '13:58:19', agent: 'Earnings drift · US', text: 'Order for NVDA at 13:58 Oslo', rule: '3.1', verdict: 'Stopped', note: 'opens 15:30' },
  { time: '13:40:05', agent: 'Overnight carry', text: 'Paused by Live Haugen', rule: '—', verdict: 'Paused', note: 'reason: rate decision at 14:00' },
  { time: '13:22:51', agent: 'Momentum · Nordics', text: 'Sold 3,000 MOWI at 198.20', rule: '2.1', verdict: 'Allowed', note: 'position 3.1% of 8.0%' }
] as const;

const tone = { Allowed: 'lime', 'Asked you': 'amber', Stopped: 'red', Paused: 'muted' } as const;

/** Every action with the rule that allowed or stopped it. 1240 × 760. */
export function ActivityScreen() {
  return (
    <AppFrame active='Activity'>
      <PageHead
        title='Activity'
        right={
          <>
            <span>Today · all agents</span>
            <span style={{ border: `1px solid ${K.lineStrong}`, borderRadius: 6, padding: '5px 10px', color: K.text }}>
              Export for compliance
            </span>
          </>
        }
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 12, flex: 1, minHeight: 0 }}>
        <div style={{ border: `1px solid ${K.line}`, borderRadius: 8, background: K.panel, overflow: 'hidden' }}>
          {ROWS.map((row, index) => (
            <div
              key={row.time}
              style={{
                display: 'grid',
                gridTemplateColumns: '74px 1fr 104px',
                gap: 12,
                padding: '13px 16px',
                borderBottom: `1px solid ${K.line}`,
                background: index === 3 ? K.raised : undefined,
                boxShadow: index === 3 ? `inset 2px 0 0 ${K.red}` : undefined
              }}
            >
              <span style={{ fontFamily: K.mono, fontSize: 12, color: K.muted, paddingTop: 1 }}>{row.time}</span>
              <div>
                <div>{row.text}</div>
                <div style={{ fontSize: 12, color: K.muted, marginTop: 4 }}>
                  {row.agent}
                  {row.rule !== '—' ? (
                    <>
                      {' · '}
                      <span style={{ fontFamily: K.mono, color: K.text }}>rule {row.rule}</span> {row.note}
                    </>
                  ) : (
                    <> · {row.note}</>
                  )}
                </div>
              </div>
              <div style={{ justifySelf: 'end' }}>
                <Pill tone={tone[row.verdict]}>{row.verdict}</Pill>
              </div>
            </div>
          ))}
        </div>

        <div style={{ border: `1px solid ${K.line}`, borderRadius: 8, background: K.panel, padding: 18 }}>
          <div style={{ fontSize: 12, color: K.red }}>Stopped at 14:12:40</div>
          <div style={{ fontSize: 17, letterSpacing: '-0.02em', marginTop: 8, lineHeight: 1.3 }}>
            Momentum · Nordics wanted 13.1% of the fund in Kongsberg Gruppen.
          </div>
          <div style={{ fontSize: 12, color: K.muted, marginTop: 22 }}>Rules checked, in order</div>
          {[
            ['3.1', 'Inside 09:00–17:00', true],
            ['1.2', 'Day loss −0.4%, limit −2.5%', true],
            ['2.1', 'Position 13.1%, limit 8.0%', false]
          ].map(([id, text, ok]) => (
            <div
              key={String(id)}
              style={{
                display: 'grid',
                gridTemplateColumns: '22px 34px 1fr',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: `1px solid ${K.line}`
              }}
            >
              <span style={{ color: ok ? K.lime : K.red, fontFamily: K.mono }}>{ok ? '✓' : '×'}</span>
              <span style={{ fontFamily: K.mono, fontSize: 12, color: K.muted }}>{id}</span>
              <span>{text}</span>
            </div>
          ))}
          <div style={{ fontSize: 12, color: K.muted, marginTop: 22 }}>What the agent did instead</div>
          <div style={{ marginTop: 8, lineHeight: 1.5 }}>
            Bought up to the limit, 4,100 KOG for 8.0%, and logged the rest of the signal as unfilled.
          </div>
          <div style={{ marginTop: 22, display: 'flex', gap: 8 }}>
            <span style={{ fontFamily: K.mono, fontSize: 11.5, color: K.muted, background: K.raised, borderRadius: 5, padding: '4px 8px' }}>
              trace 7f3a·e21c
            </span>
            <span style={{ fontFamily: K.mono, fontSize: 11.5, color: K.muted, background: K.raised, borderRadius: 5, padding: '4px 8px' }}>
              model v4.12
            </span>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

const YAML = `# agents/momentum-nordics/risk.yaml
# Owner: platform team. Ask in #risk-changes before editing.

limits:
  position:
    max_pct_nav: 0.08        # TODO: NAV or gross? check w/ Live
    hard_cap_pct_nav: 0.10
    soft_breach: escalate     # -> pagerduty: risk-oncall
  drawdown:
    daily_halt: -0.025
    lookback: "1d"
    reset: "00:00Z"           # NB: UTC, not Oslo
  session:
    tz: "Europe/Oslo"
    start: "09:00"
    end: "17:00"
    exchanges: [XOSL]

overrides:
  - when: "earnings_window"
    limits.position.max_pct_nav: 0.05
  - when: "manual"            # set by ops, expires?
    halt: true
`;

function highlight(line: string) {
  const comment = line.indexOf('#');
  const code = comment === -1 ? line : line.slice(0, comment);
  const rest = comment === -1 ? '' : line.slice(comment);
  const [, indent, key, colon, value] = /^(\s*-?\s*)([\w."]+)?(:)?(.*)$/.exec(code) ?? [];
  return (
    <>
      <span>{indent}</span>
      {key ? <span style={{ color: '#9cc3e6' }}>{key}</span> : null}
      {colon ? <span style={{ color: '#7d8590' }}>:</span> : null}
      <span style={{ color: /\d/.test(value ?? '') ? '#e6c07b' : '#c9d1d9' }}>{value}</span>
      <span style={{ color: '#6a737d' }}>{rest}</span>
    </>
  );
}

/** Before: limits lived in YAML that only engineers could change. 1240 × 760. */
export function YamlScreen() {
  const lines = YAML.trimEnd().split('\n');
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#0d1117', color: '#c9d1d9', fontFamily: K.mono, fontSize: 13 }}>
      <div style={{ width: 212, borderRight: '1px solid #21262d', padding: '16px 0', fontSize: 12.5, color: '#8b949e' }}>
        {['agents/', '  momentum-nordics/', '    config.yaml', '    risk.yaml', '    signals.py', '  pairs-energy/', '  fx-g10/', 'runbooks/', 'README.md'].map(
          (item) => (
            <div
              key={item}
              style={{
                padding: '4px 16px',
                whiteSpace: 'pre',
                color: item.includes('risk.yaml') ? '#e6edf3' : undefined,
                background: item.includes('risk.yaml') ? '#161b22' : undefined
              }}
            >
              {item}
            </div>
          )
        )}
      </div>
      <div style={{ flex: 1, padding: '16px 0', position: 'relative' }}>
        {lines.map((line, index) => (
          <div key={index} style={{ display: 'grid', gridTemplateColumns: '52px 1fr', lineHeight: '23px', whiteSpace: 'pre' }}>
            <span style={{ color: '#484f58', textAlign: 'right', paddingRight: 18 }}>{index + 1}</span>
            <span>{highlight(line)}</span>
          </div>
        ))}
        <div
          style={{
            position: 'absolute',
            right: 22,
            top: 92,
            width: 300,
            padding: 14,
            borderRadius: 8,
            background: '#161b22',
            border: '1px solid #30363d',
            fontFamily: K.sans,
            fontSize: 13,
            lineHeight: 1.45
          }}
        >
          <div style={{ color: '#8b949e', fontSize: 12 }}>Live Haugen commented on line 6</div>
          <div style={{ marginTop: 6, color: '#e6edf3' }}>
            Is this 8% of NAV or of gross exposure? Compliance needs to know before Friday, and I can’t tell from here.
          </div>
        </div>
      </div>
    </div>
  );
}
