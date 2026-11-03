import { AGENTS, DEFAULT_LIMITS, K, fmtPct, replay } from './model';
import { AppFrame, EquityChart, PageHead, Pill, Stat } from './ui';

const statusTone = { Trading: 'lime', Waiting: 'muted', 'Needs approval': 'amber', Paused: 'muted' } as const;

/** The agents overview, designed at 1240 × 760. */
export function Overview({ progress = 1, pulse = 0 }: { progress?: number; pulse?: number }) {
  const run = replay(DEFAULT_LIMITS);
  return (
    <AppFrame active='Agents'>
      <PageHead
        title='Agents'
        right={
          <>
            <span style={{ fontFamily: K.mono }}>Tue 3 Nov · 14:32 CET</span>
            <Pill tone='lime'>Oslo Børs open</Pill>
          </>
        }
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <Stat label='Fund value' value='412.8M NOK' note='5 agents, 3 trading' />
        <Stat label='Today' value='+0.62%' tone={K.lime} note='+2.55M NOK since 09:00' />
        <Stat label='Exposure' value='71%' note='of the 85% fund limit' />
        <Stat label='Waiting for you' value='2' tone={K.amber} note='Oldest asked 3 min ago' />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: 12, marginTop: 12, flex: 1, minHeight: 0 }}>
        <div style={{ border: `1px solid ${K.line}`, borderRadius: 8, background: K.panel, overflow: 'hidden' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.45fr 1.15fr 0.6fr 1.45fr',
              padding: '11px 16px',
              fontSize: 11.5,
              color: K.muted,
              borderBottom: `1px solid ${K.line}`
            }}
          >
            <span>Agent</span>
            <span>Status</span>
            <span style={{ textAlign: 'right' }}>Today</span>
            <span style={{ paddingLeft: 24 }}>Last action</span>
          </div>
          {AGENTS.map((agent) => (
            <div
              key={agent.name}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.45fr 1.15fr 0.6fr 1.45fr',
                alignItems: 'center',
                padding: '13px 16px',
                borderBottom: `1px solid ${K.line}`,
                background: agent.status === 'Needs approval' ? 'rgba(239,181,74,0.05)' : undefined
              }}
            >
              <div>
                <div style={{ fontWeight: 500 }}>{agent.name}</div>
                <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 84, height: 3, borderRadius: 2, background: K.raised, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${agent.exposure * 100}%`,
                        height: '100%',
                        background: agent.exposure > 0.6 ? K.amber : K.muted
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 11, color: K.faint, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agent.headroom}</span>
                </div>
              </div>
              <div>
                <Pill tone={statusTone[agent.status]}>{agent.status}</Pill>
              </div>
              <div
                style={{
                  textAlign: 'right',
                  fontFamily: K.mono,
                  color: agent.pnl > 0 ? K.lime : agent.pnl < 0 ? K.red : K.muted
                }}
              >
                {agent.pnl === 0 ? '0.00%' : fmtPct(agent.pnl, 2)}
              </div>
              <div style={{ paddingLeft: 24, minWidth: 0 }}>
                <div style={{ color: K.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {agent.last}
                </div>
                <div style={{ fontFamily: K.mono, fontSize: 11, color: K.faint, marginTop: 4 }}>
                  {agent.rule === '—' ? 'no rule' : `rule ${agent.rule}`}
                </div>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', fontSize: 12, color: K.muted }}>
            <span>Every action above links to the rule that allowed it.</span>
            <span style={{ color: K.red }}>Pause all agents</span>
          </div>
        </div>

        <div
          style={{
            border: `1px solid ${K.line}`,
            borderRadius: 8,
            background: K.panel,
            padding: 16,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <div style={{ fontWeight: 500 }}>Momentum · Nordics</div>
              <div style={{ color: K.muted, fontSize: 12, marginTop: 3 }}>Last 90 days, inside its guardrails</div>
            </div>
            <div style={{ fontFamily: K.mono, color: K.lime, fontSize: 18 }}>{fmtPct(run.returnPct)}</div>
          </div>
          <div style={{ marginTop: 22, flex: 1 }}>
            <EquityChart
              curve={run.curve}
              baseline={run.baseline}
              blockedDays={run.blocked.map((t) => t.day)}
              width={432}
              height={262}
              progress={progress}
              pulse={pulse}
            />
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 11.5, color: K.muted, marginTop: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 2, background: K.lime }} /> With guardrails
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 0, borderTop: `1.5px dashed ${K.muted}` }} /> Without
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 2, height: 10, background: K.red }} /> {run.blocked.length} trades stopped
            </span>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
