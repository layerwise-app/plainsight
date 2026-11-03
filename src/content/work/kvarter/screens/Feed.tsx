import type * as React from 'react';
import { K, head, label } from './model';
import { Avatar, Button, Icon, Mark, NavBar, Screen, Segments } from './ui';

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ borderRadius: 20, background: K.card, boxShadow: `inset 0 0 0 1px ${K.line}`, padding: 16, ...style }}>{children}</div>
  );
}

function Post({ flat, name, when, children, replies }: { flat: string; name?: string; when: string; children: React.ReactNode; replies?: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr', gap: 12, padding: '14px 0', borderTop: `1px solid ${K.line}` }}>
      <Avatar flat={flat} name={name} size={36} />
      <div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', fontSize: 13.5 }}>
          <span style={{ fontWeight: 650 }}>{name ? `${name.split(' ')[0]}, ${flat}` : flat}</span>
          <span style={{ color: K.faint }}>{when}</span>
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.38, marginTop: 3, textWrap: 'pretty' }}>{children}</div>
        {replies ? <div style={{ fontSize: 13, color: K.muted, marginTop: 7 }}>{replies}</div> : null}
      </div>
    </div>
  );
}

/** Home: what styret needs you to know, what you've booked, and the neighbours. 390 × 844. */
export function FeedScreen({ time = '21:12', fresh = 1 }: { time?: string; fresh?: number }) {
  return (
    <Screen tab='Home' time={time}>
      <div style={{ padding: '2px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 44 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <Mark size={26} />
          <span style={{ fontSize: 16, fontWeight: 650, fontStretch: '90%' }}>Fjellhagen</span>
          <svg width='12' height='12' viewBox='0 0 12 12' aria-hidden='true'>
            <path d='m3 4.5 3 3 3-3' fill='none' stroke={K.muted} strokeWidth='1.6' strokeLinecap='round' />
          </svg>
        </span>
        <span style={{ position: 'relative', color: K.ink }}>
          <Icon name='bell' size={24} />
          <span
            style={{
              position: 'absolute',
              right: -1,
              top: -1,
              width: 10,
              height: 10,
              borderRadius: 5,
              background: K.brick,
              boxShadow: `0 0 0 2px ${K.paper}`,
              opacity: fresh
            }}
          />
        </span>
      </div>
      <div style={{ padding: '14px 20px 16px' }}>
        <div style={label(11.5)}>Thursday 23 April</div>
        <div style={{ ...head(44, 780), marginTop: 6 }}>Evening, Ida.</div>
      </div>
      <div style={{ padding: '0 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ borderRadius: 22, background: K.brick, color: K.paper, padding: '16px 18px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ ...label(11, 'rgba(243,236,225,0.78)'), display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name='megaphone' size={15} stroke={2} /> From styret
            </span>
            <span style={{ fontSize: 12.5, color: 'rgba(243,236,225,0.72)' }}>2 days ago</span>
          </div>
          <div style={{ ...head(33, 780), marginTop: 12 }}>Water off Tuesday, 09–12</div>
          <div style={{ fontSize: 14.5, lineHeight: 1.4, marginTop: 8, color: 'rgba(243,236,225,0.9)', textWrap: 'pretty' }}>
            The main valve in the basement is being replaced. Fill a jug on Monday night.
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 14,
              paddingTop: 12,
              borderTop: '1px solid rgba(243,236,225,0.2)',
              fontSize: 12.5,
              color: 'rgba(243,236,225,0.78)'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar flat='H0101' name='Tone Bakke' size={22} /> Tone, chair
            </span>
            <span>Read by 47 flats</span>
          </div>
        </div>

        <Card style={{ background: K.yellow, boxShadow: 'none', padding: '15px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={label(11, 'rgba(30,41,68,0.72)')}>Spring dugnad</span>
            <span style={{ fontSize: 12.5, color: 'rgba(30,41,68,0.72)' }}>Sun 26 April, 10–14</span>
          </div>
          <div style={{ ...head(25, 760), marginTop: 9 }}>41 flats are coming. You’re planting the front beds.</div>
          <div style={{ marginTop: 12 }}>
            <Segments total={64} filled={41} color={K.ink} height={7} gap={1.5} />
          </div>
        </Card>

        <Card style={{ padding: '12px 14px', display: 'grid', gridTemplateColumns: '40px 1fr 20px', gap: 12, alignItems: 'center' }}>
          <span style={{ width: 40, height: 40, borderRadius: 12, background: K.moss, color: K.paper, display: 'grid', placeItems: 'center' }}>
            <Icon name='book' size={21} />
          </span>
          <span>
            <span style={{ display: 'block', fontSize: 15, fontWeight: 650 }}>Laundry room 1</span>
            <span style={{ display: 'block', fontSize: 13.5, color: K.muted, marginTop: 1 }}>Saturday 2 May, 10–12</span>
          </span>
          <span style={{ color: K.faint }}>
            <Icon name='chevron' size={18} />
          </span>
        </Card>
      </div>
      <div style={{ padding: '18px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
          <span style={head(21, 760)}>Neighbours</span>
          <span style={{ fontSize: 13, color: K.muted }}>See all</span>
        </div>
        <Post flat='H0302' when='3 h'>
          Found a set of keys with a blue tag by the bike shed. They’re in my postbox.
        </Post>
        <Post flat='H0106' name='Silje Aas' when='yesterday'>
          Giving away a 16-inch children’s bike. Ring the bell.
        </Post>
      </div>
    </Screen>
  );
}

/** One notice from styret, with who has read it. 390 × 844. */
export function NoticeScreen() {
  return (
    <Screen background={K.paper} status={K.paper}>
      <div style={{ background: K.brick, color: K.paper, marginTop: -54, paddingTop: 54 }}>
        <NavBar dark title='Notice' action={<Icon name='bell' size={22} />} />
        <div style={{ padding: '10px 22px 24px' }}>
          <span style={{ ...label(11, 'rgba(243,236,225,0.78)'), display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name='megaphone' size={15} stroke={2} /> From styret · Pinned
          </span>
          <div style={{ ...head(46, 790), marginTop: 12, textWrap: 'balance' }}>Water off on Tuesday 28 April, 09–12</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 16, fontSize: 13.5, color: 'rgba(243,236,225,0.82)' }}>
            <Avatar flat='H0101' name='Tone Bakke' size={26} />
            Tone Bakke, chair · 21 April
          </div>
        </div>
      </div>
      <div style={{ padding: '20px 22px 0', fontSize: 16, lineHeight: 1.45, textWrap: 'pretty' }}>
        <p style={{ margin: 0 }}>
          Nordby Rør is replacing the main water valve in the basement. All 64 flats will be without water from 09:00 to 12:00.
        </p>
        <p style={{ margin: '12px 0 0' }}>On Monday night, fill a jug for drinking and a bucket for the toilet.</p>
      </div>
      <div style={{ margin: '18px 16px 0', borderRadius: 18, background: K.mossSoft, padding: '14px 16px', display: 'grid', gridTemplateColumns: '26px 1fr', gap: 10 }}>
        <span style={{ color: K.moss, paddingTop: 1 }}>
          <Icon name='check' size={22} stroke={2.3} />
        </span>
        <div style={{ fontSize: 14.5, lineHeight: 1.4 }}>
          <div style={{ fontWeight: 650 }}>Your laundry booking is not affected</div>
          <div style={{ color: K.muted, marginTop: 2 }}>
            Both laundry rooms close until 12:00. Three bookings in that window were moved, and their flats told.
          </div>
        </div>
      </div>
      <div style={{ margin: '22px 22px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
          <span style={{ fontWeight: 600 }}>Read by 47 of 52 flats in the app</span>
        </div>
        <div style={{ marginTop: 9 }}>
          <Segments total={52} filled={47} color={K.brick} height={8} gap={1.5} />
        </div>
        <div style={{ fontSize: 13, color: K.muted, marginTop: 10, lineHeight: 1.4 }}>
          The other 12 flats get it by text message, or on paper in their stairwell.
        </div>
      </div>
      <div style={{ marginTop: 'auto', padding: '0 18px 38px' }}>
        <Button tone='ghost'>Ask styret a question</Button>
      </div>
    </Screen>
  );
}

const TASKS = [
  { name: 'Rake and sweep the courtyard', taken: 8, spots: 10 },
  { name: 'Clear out the bike shed', taken: 3, spots: 6, note: 'Unmarked bikes go to charity on 15 May' },
  { name: 'Paint the benches', taken: 4, spots: 4 },
  { name: 'Plant the front beds', taken: 5, spots: 6, mine: true },
  { name: 'Waffles and coffee', taken: 2, spots: 3 }
];

/** Signing up for the spring dugnad, one task per flat. 390 × 844. */
export function DugnadScreen() {
  return (
    <Screen background={K.yellow}>
      <NavBar title='Dugnad' />
      <div style={{ padding: '6px 22px 18px' }}>
        <div style={label(11.5, 'rgba(30,41,68,0.7)')}>Sunday 26 April · 10–14</div>
        <div style={{ ...head(50, 800), marginTop: 8 }}>Spring dugnad</div>
        <div style={{ fontSize: 15, lineHeight: 1.4, marginTop: 10, color: 'rgba(30,41,68,0.82)', textWrap: 'pretty' }}>
          Meet in the courtyard. Waffles from 12. Bring gloves if you have them; styret has rakes.
        </div>
      </div>
      <div style={{ background: K.paper, borderRadius: '26px 26px 0 0', flex: 1, padding: '18px 16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 6px 10px' }}>
          <span style={head(21, 760)}>Pick a task</span>
          <span style={{ fontSize: 13, color: K.muted }}>41 of 64 flats</span>
        </div>
        {TASKS.map((task) => {
          const full = task.taken >= task.spots;
          return (
            <div
              key={task.name}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 10,
                alignItems: 'center',
                padding: '13px 14px',
                marginBottom: 8,
                borderRadius: 16,
                background: task.mine ? K.card : 'transparent',
                boxShadow: task.mine ? `inset 0 0 0 2px ${K.moss}` : `inset 0 0 0 1px ${K.line}`,
                opacity: full ? 0.55 : 1
              }}
            >
              <div>
                <div style={{ fontSize: 15.5, fontWeight: 600 }}>{task.name}</div>
                <div style={{ marginTop: 7, width: 150 }}>
                  <Segments total={task.spots} filled={task.taken} color={task.mine ? K.moss : K.ink} height={5} gap={3} />
                </div>
                {task.note ? <div style={{ fontSize: 12.5, color: K.muted, marginTop: 6 }}>{task.note}</div> : null}
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: task.mine ? K.paper : full ? K.muted : K.ink,
                  background: task.mine ? K.moss : 'transparent',
                  borderRadius: 999,
                  padding: task.mine ? '5px 10px 5px 7px' : '5px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                {task.mine ? <Icon name='check' size={15} stroke={2.6} /> : null}
                {task.mine ? 'You' : full ? 'Full' : `${task.spots - task.taken} left`}
              </span>
            </div>
          );
        })}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 6px 0', fontSize: 13.5, color: K.muted }}>
          <span>We’ll remind you on Saturday at 18:00.</span>
          <span style={{ color: K.ink, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}>Change task</span>
        </div>
      </div>
    </Screen>
  );
}
