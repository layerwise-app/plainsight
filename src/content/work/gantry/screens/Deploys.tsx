import type * as React from 'react';
import { WAITING_ROWS } from './App';
import { TopBar } from './Builder';
import { G, eur, wait } from './model';
import { Avatar, Button, Icon, Label, Sql } from './ui';

const VERSIONS = [
  { v: 'v24', state: 'Draft', who: 'Nanna Krog', when: 'Today 14:22', note: 'Waiting column, two leads over €500', tone: '#f2c9b4' },
  { v: 'v23', state: 'Live', who: 'Emil Brandt', when: 'Mon 16:12', note: 'Rejecting asks for a reason', tone: '#c9d5e8' },
  { v: 'v22', state: 'Rolled back', who: 'Emil Brandt', when: 'Mon 15:40', note: 'Back to v21 after 6 min: approve_refund timed out', tone: '#c9d5e8' },
  { v: 'v21', state: '', who: 'Sofie Lund', when: 'Fri 30 Oct', note: 'Over €500 page', tone: '#d6e3c9' },
  { v: 'v20', state: '', who: 'Nanna Krog', when: 'Thu 29 Oct', note: 'Customer history in the detail panel', tone: '#f2c9b4' },
  { v: 'v19', state: '', who: 'Aksel Holm', when: 'Tue 27 Oct', note: 'Reason column, filter by agent', tone: '#e6d9c2' },
  { v: 'v18', state: '', who: 'Sofie Lund', when: 'Mon 26 Oct', note: 'First version on ops-eu', tone: '#d6e3c9' }
];

function Card({ title, kind, children }: { title: React.ReactNode; kind: string; children: React.ReactNode }) {
  return (
    <div style={{ background: G.surface, borderRadius: 9, boxShadow: `inset 0 0 0 1px ${G.line}`, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 40, padding: '0 14px', borderBottom: `1px solid ${G.line}` }}>
        <span style={{ fontSize: 11, color: G.muted, background: G.sunk, borderRadius: 4, padding: '2px 6px' }}>{kind}</span>
        <span style={{ fontSize: 13 }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function MiniTable({ withWaiting, label }: { withWaiting?: boolean; label: string }) {
  const cols: [string, string][] = [
    ['Refund', '58px'],
    ['Customer', '1fr'],
    ['Amount', '62px'],
    ...(withWaiting ? ([['Waiting', '68px']] as [string, string][]) : [])
  ];
  const template = cols.map(([, w]) => w).join(' ');
  return (
    <div>
      <div style={{ fontSize: 11, color: G.muted, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: 9, background: withWaiting ? G.orange : G.green }} />
        {label}
      </div>
      <div style={{ borderRadius: 6, boxShadow: `inset 0 0 0 1px ${G.line}`, overflow: 'hidden', fontSize: 10.5, position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: template, gap: 8, padding: '0 9px', height: 24, alignItems: 'center', color: G.muted, background: G.paper }}>
          {cols.map(([name]) => (
            <span key={name} style={{ textAlign: name === 'Amount' || name === 'Waiting' ? 'right' : 'left' }}>
              {name}
            </span>
          ))}
        </div>
        {WAITING_ROWS.slice(0, 4).map((row) => (
          <div
            key={String(row.id)}
            style={{ display: 'grid', gridTemplateColumns: template, gap: 8, padding: '0 9px', height: 25, alignItems: 'center', borderTop: `1px solid ${G.line}` }}
          >
            <span style={{ fontFamily: G.mono, color: G.muted, fontSize: 10 }}>{row.id}</span>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.customer}</span>
            <span style={{ fontFamily: G.mono, textAlign: 'right', fontSize: 10 }}>{eur(Number(row.amount), false)}</span>
            {withWaiting ? <span style={{ textAlign: 'right' }}>{wait(row.waiting as number)}</span> : null}
          </div>
        ))}
        {withWaiting ? (
          <div
            style={{
              position: 'absolute',
              right: 2,
              top: 2,
              bottom: 2,
              width: 76,
              borderRadius: 4,
              background: 'rgba(29,122,76,0.08)',
              boxShadow: `inset 0 0 0 1.5px ${G.green}`
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

const DIFF = `select r.id, r.order_id, c.full_name as customer,
       r.amount_eur, r.reason, r.requested_by,
       r.requested_at, r.status
       r.requested_at, now() - r.requested_at as waiting,
       r.status
from refunds r`;

/** Deploys: what changed since the live version, checked before it ships. Designed at 1240 × 760. */
export function DeployScreen() {
  return (
    <div style={{ width: 1240, height: 760, display: 'flex', flexDirection: 'column', background: G.paper, color: G.ink, fontFamily: G.sans, fontSize: 12.5 }}>
      <TopBar active='Deploys' />
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <aside style={{ width: 288, flex: 'none', borderRight: `1px solid ${G.line}`, background: G.surface, padding: '14px 0' }}>
          <div style={{ padding: '0 16px 8px' }}>
            <Label right={<span style={{ fontSize: 11 }}>Last 30 days</span>}>Versions</Label>
          </div>
          {VERSIONS.map((version, index) => (
            <div
              key={version.v}
              style={{
                display: 'grid',
                gridTemplateColumns: '18px 1fr',
                gap: 10,
                padding: '10px 16px',
                background: index === 0 ? G.orangeTint : undefined,
                boxShadow: index === 0 ? `inset 2px 0 0 ${G.orange}` : undefined,
                position: 'relative'
              }}
            >
              <span style={{ position: 'relative', display: 'flex', justifyContent: 'center', paddingTop: 3 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 99,
                    background: version.state === 'Live' ? G.green : version.state === 'Draft' ? G.orange : G.surface,
                    boxShadow: version.state ? 'none' : `inset 0 0 0 1.5px ${G.lineStrong}`,
                    position: 'relative',
                    zIndex: 1
                  }}
                />
                {index < VERSIONS.length - 1 ? (
                  <span style={{ position: 'absolute', top: 14, bottom: -24, width: 1.5, background: G.line }} />
                ) : null}
              </span>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontFamily: G.mono, fontWeight: 500 }}>{version.v}</span>
                  {version.state ? (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: version.state === 'Live' ? G.green : version.state === 'Draft' ? G.orangeInk : G.red
                      }}
                    >
                      {version.state}
                    </span>
                  ) : null}
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: G.muted }}>{version.when}</span>
                </div>
                <div style={{ marginTop: 3, color: G.text2, lineHeight: 1.4 }}>{version.note}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5, fontSize: 11, color: G.muted }}>
                  <Avatar name={version.who} size={16} tone={version.tone} />
                  {version.who}
                </div>
              </div>
            </div>
          ))}
        </aside>

        <main style={{ flex: 1, minWidth: 0, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em' }}>
                <span style={{ fontFamily: G.mono, fontWeight: 500 }}>v24</span> compared with{' '}
                <span style={{ fontFamily: G.mono, fontWeight: 500 }}>v23</span>, live
              </div>
              <div style={{ color: G.muted, marginTop: 3 }}>3 changes by Nanna Krog, edited today at 14:22</div>
            </div>
            <span style={{ display: 'flex', gap: 6 }}>
              <Button size={12}>
                <Icon name='eye' size={13} /> Preview v24
              </Button>
              <Button size={12}>
                Compare with v23 <Icon name='chevronDown' size={12} />
              </Button>
            </span>
          </div>

          <Card kind='Component' title={<><span style={{ fontFamily: G.mono }}>refundsTable</span> shows a new column, Waiting</>}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 14, alignItems: 'end' }}>
              <MiniTable label='v23, live' />
              <MiniTable label='v24, draft' withWaiting />
            </div>
          </Card>

          <Card kind='Query' title={<><span style={{ fontFamily: G.mono }}>refunds_waiting</span> returns how long each refund has waited</>}>
            <div style={{ padding: '10px 14px' }}>
              <Sql code={DIFF} size={11.8} lineHeight={1.75} numbers removed={[3]} added={[4, 5]} />
            </div>
          </Card>

          <Card kind='Permission' title='Approving over €500 needs a second support lead'>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
              <span style={{ padding: '5px 9px', borderRadius: 6, background: G.redTint, color: G.red, textDecoration: 'line-through', textDecorationThickness: 1 }}>
                One support lead
              </span>
              <Icon name='chevron' size={14} color={G.muted} />
              <span style={{ padding: '5px 9px', borderRadius: 6, background: G.greenTint, color: G.green }}>Two support leads, not the one who asked</span>
              <span style={{ marginLeft: 'auto', fontSize: 11.5, color: G.muted }}>Affects 6 refunds waiting now</span>
            </div>
          </Card>
          <div style={{ display: 'flex', gap: 18, padding: '2px 2px 0', fontSize: 12, color: G.muted }}>
            <span>Unchanged since v23:</span>
            <span>3 pages</span>
            <span>6 queries</span>
            <span>11 components</span>
            <span>7 permissions</span>
          </div>
        </main>

        <aside style={{ width: 300, flex: 'none', borderLeft: `1px solid ${G.line}`, background: G.surface, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 16px 6px' }}>
            <Label>Checked before deploy</Label>
          </div>
          {[
            ['All 7 queries run on ops-eu', 'Read replica, slowest 41 ms'],
            ['Every column a component reads exists', '23 bindings checked'],
            ['Permission change reviewed', 'Sofie Lund, today 14:31'],
            ['Previewed as two roles', 'Support agent and support lead']
          ].map(([title, note]) => (
            <div key={title} style={{ display: 'grid', gridTemplateColumns: '22px 1fr', gap: 8, padding: '9px 16px' }}>
              <span style={{ width: 18, height: 18, borderRadius: 99, background: G.greenTint, color: G.green, display: 'grid', placeItems: 'center', marginTop: 1 }}>
                <Icon name='check' size={12} stroke={1.8} />
              </span>
              <div>
                <div>{title}</div>
                <div style={{ fontSize: 11.5, color: G.muted, marginTop: 2 }}>{note}</div>
              </div>
            </div>
          ))}
          <div style={{ margin: '10px 16px 0', paddingTop: 16, borderTop: `1px solid ${G.line}` }}>
            <Label>After deploy</Label>
            <div style={{ marginTop: 9, lineHeight: 1.6, color: G.text2 }}>
              15 people on the support team get v24 the next time a page loads. Refunds they have open keep their place.
            </div>
          </div>
          <div style={{ margin: '16px 16px 0', paddingTop: 16, borderTop: `1px solid ${G.line}` }}>
            <Label>If it goes wrong</Label>
            <div style={{ marginTop: 9, lineHeight: 1.6, color: G.text2 }}>
              Roll back from this page or from the tool’s own menu. v22 was rolled back in 6 minutes by the person who shipped it.
            </div>
          </div>
          <div style={{ marginTop: 'auto', padding: 16, borderTop: `1px solid ${G.line}` }}>
            <Button tone='primary' size={13} style={{ width: '100%', height: 38 }}>
              Deploy v24 to the support team
            </Button>
            <div style={{ fontSize: 11.5, color: G.muted, marginTop: 10, lineHeight: 1.5, textAlign: 'center' }}>
              Takes about 20 seconds. v23 stays one click away.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
