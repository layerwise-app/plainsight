import type * as React from 'react';
import { useId } from 'react';
import { Grain } from '~/components/art/Grain';
import { Phone } from '~/components/frames/Phone';
import { K, head, label } from './model';
import { Avatar, Icon, Screen } from './ui';

const W = 1440;
const H = 960;
const BOARD = { x: 196, y: 92, w: 1048, h: 700 };

const PRINT = "'IBM Plex Sans', Arial, sans-serif";
const POSTER = "'Archivo', Arial, sans-serif";
const PEN = "'Instrument Serif', Georgia, serif";
const PEN_INK = '#24346E';

/** A stairwell wall: plaster above, gloss paint below, the timer switch for the stair light. */
function Stairwell({ children, board }: { children?: React.ReactNode; board?: 'cork' | 'gone' }) {
  return (
    <div style={{ width: W, height: H, position: 'relative', overflow: 'hidden', background: '#E6E0D3' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 640, background: 'linear-gradient(#EEE9DE, #E3DCCD)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 640, bottom: 0, background: 'linear-gradient(#7F9886, #6F8977)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 634, height: 8, background: '#4F6656' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 642, height: 3, background: 'rgba(255,255,255,0.18)' }} />
      {/* Stair light timer switch */}
      <div style={{ position: 'absolute', left: 1318, top: 468, width: 62, height: 62, borderRadius: 8, background: '#F4F1EA', boxShadow: '0 2px 0 rgba(0,0,0,0.08), 0 6px 14px rgba(60,50,30,0.16)' }}>
        <div style={{ position: 'absolute', inset: 12, borderRadius: 30, background: '#EDE8DE', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)' }} />
        <div style={{ position: 'absolute', left: 27, top: 27, width: 8, height: 8, borderRadius: 4, background: '#F28A2E', boxShadow: '0 0 6px #F28A2E' }} />
      </div>
      {board === 'gone' ? (
        <>
          <div style={{ position: 'absolute', left: BOARD.x + 6, top: BOARD.y + 6, width: BOARD.w - 12, height: 634 - BOARD.y - 6, background: '#F0EBE1', opacity: 0.8 }} />
          <div style={{ position: 'absolute', left: BOARD.x + 6, top: 645, width: BOARD.w - 12, height: BOARD.y + BOARD.h - 6 - 645, background: '#86A08E', opacity: 0.7 }} />
          {[
            [BOARD.x + 30, BOARD.y + 30],
            [BOARD.x + BOARD.w - 30, BOARD.y + 30],
            [BOARD.x + 30, BOARD.y + BOARD.h - 30],
            [BOARD.x + BOARD.w - 30, BOARD.y + BOARD.h - 30]
          ].map(([x, y]) => (
            <span key={`${x}-${y}`} style={{ position: 'absolute', left: x - 3, top: y - 3, width: 6, height: 6, borderRadius: 3, background: 'rgba(70,60,45,0.35)' }} />
          ))}
        </>
      ) : null}
      {children}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(120% 80% at 50% -10%, rgba(255,250,235,0.3) 0%, rgba(255,250,235,0) 55%), linear-gradient(rgba(30,41,68,0) 60%, rgba(30,41,68,0.12))',
          pointerEvents: 'none'
        }}
      />
      <Grain opacity={0.16} frequency={0.8} />
    </div>
  );
}

function Cork() {
  const id = useId().replaceAll(':', '');
  return (
    <div
      style={{
        position: 'absolute',
        left: BOARD.x,
        top: BOARD.y,
        width: BOARD.w,
        height: BOARD.h,
        background: '#B48855',
        padding: 18,
        boxShadow: '0 18px 30px rgba(60,40,20,0.25), inset 0 0 0 1px rgba(255,255,255,0.15)'
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%', background: '#C79A64', boxShadow: 'inset 0 2px 6px rgba(60,30,10,0.35)', overflow: 'hidden' }}>
        <svg width='100%' height='100%' style={{ position: 'absolute', inset: 0 }} aria-hidden='true'>
          <filter id={`cork${id}`}>
            <feTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves={3} seed={4} />
            <feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.2  0 0 0 0 0.08  0 0 0 -2.2 1.25' />
          </filter>
          <rect width='100%' height='100%' filter={`url(#cork${id})`} opacity={0.55} />
        </svg>
      </div>
    </div>
  );
}

function Note({
  x,
  y,
  w,
  h,
  rotate = 0,
  paper = '#FBFAF6',
  pin = '#C8352B',
  pinAt = 0.5,
  z,
  children,
  style
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  rotate?: number;
  paper?: string;
  pin?: string | null;
  pinAt?: number;
  z?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `rotate(${rotate}deg)`,
        background: paper,
        boxShadow: '0 1px 1px rgba(40,25,10,0.18), 0 6px 12px rgba(40,25,10,0.18)',
        zIndex: z,
        ...style
      }}
    >
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>{children}</div>
      {pin ? (
        <span
          style={{
            position: 'absolute',
            left: `${pinAt * 100}%`,
            top: 8,
            width: 16,
            height: 16,
            marginLeft: -8,
            borderRadius: 8,
            background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.7) 0 2px, ${pin} 3px)`,
            boxShadow: '2px 4px 3px rgba(40,25,10,0.35)'
          }}
        />
      ) : null}
    </div>
  );
}

const lines = (count: number, width: number[], color = '#8A8780', gap = 9) =>
  Array.from({ length: count }, (_, i) => (
    <div key={i} style={{ height: 3, width: `${width[i % width.length]}%`, background: color, opacity: 0.55, marginTop: i ? gap - 3 : 0, borderRadius: 1 }} />
  ));

/** Before: the noticeboard by the entrance of number 12, as it was in March 2025. */
export function NoticeboardScene() {
  return (
    <Stairwell>
      <Cork />
      {/* An old one, half covered */}
      <Note x={720} y={420} w={240} h={250} rotate={2.5} paper='#EFE3C2' pin='#3F6FB5' pinAt={0.2} z={1}>
        <div style={{ padding: '30px 20px', fontFamily: PRINT, color: '#6E6450' }}>
          <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.05 }}>Christmas tree collection</div>
          <div style={{ fontSize: 14, marginTop: 8 }}>Tuesday 7 January, by the bins</div>
          <div style={{ marginTop: 14 }}>{lines(6, [92, 80, 88, 60], '#9C907A')}</div>
        </div>
      </Note>
      <Note x={244} y={128} w={250} h={340} rotate={-2.2} z={3}>
        <div style={{ padding: '34px 22px 0', fontFamily: PRINT, color: '#1D1D1F' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#555' }}>Fjellhagen borettslag</div>
          <div style={{ fontFamily: POSTER, fontSize: 50, fontWeight: 850, fontStretch: '70%', lineHeight: 0.92, marginTop: 10, letterSpacing: '-0.01em' }}>
            WATER
            <br />
            OFF
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, marginTop: 10 }}>Tuesday 28 April</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>09.00 – 12.00</div>
          <div style={{ fontSize: 11.5, lineHeight: 1.45, marginTop: 10, color: '#333' }}>
            The main valve in the basement will be replaced. Please fill containers the night before. Do NOT use the laundry
            room.
          </div>
          <div style={{ fontSize: 11.5, marginTop: 10, color: '#333' }}>Regards, Styret</div>
        </div>
      </Note>
      <Note x={522} y={104} w={244} h={330} rotate={1.6} paper='#F3DE6B' pin='#2E7D4F' z={2}>
        <div style={{ padding: '32px 20px 0', color: '#1D1D1F' }}>
          <div style={{ fontFamily: POSTER, fontSize: 56, fontWeight: 900, fontStretch: '72%', lineHeight: 0.9, letterSpacing: '-0.01em' }}>DUGNAD</div>
          <div style={{ fontFamily: PRINT, fontSize: 14, fontWeight: 600, marginTop: 6 }}>Sunday 26 April, 10–14</div>
          <div style={{ fontFamily: PRINT, fontSize: 11.5, marginTop: 4 }}>Write your flat and what you’ll do.</div>
          <div style={{ marginTop: 10, borderTop: '1px solid #1D1D1F' }}>
            {[
              ['104', 'rake'],
              ['302', 'benches'],
              ['211', '?? whatever'],
              ['Silje 106', 'waffles!'],
              ['', ''],
              ['', '']
            ].map(([flat, task], index) => (
              <div
                key={index}
                style={{ display: 'grid', gridTemplateColumns: '84px 1fr', height: 26, borderBottom: '1px solid rgba(29,29,31,0.5)', alignItems: 'end' }}
              >
                <span style={{ fontFamily: PEN, fontStyle: 'italic', fontSize: 19, color: PEN_INK, borderRight: '1px solid rgba(29,29,31,0.5)', height: '100%', lineHeight: '30px' }}>{flat}</span>
                <span style={{ fontFamily: PEN, fontStyle: 'italic', fontSize: 19, color: PEN_INK, paddingLeft: 8, lineHeight: '30px' }}>{task}</span>
              </div>
            ))}
          </div>
        </div>
      </Note>
      <Note x={796} y={134} w={226} h={300} rotate={-1} pin='#3F6FB5' z={2}>
        <div style={{ padding: '32px 20px 0', fontFamily: PRINT, color: '#1D1D1F' }}>
          <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.15 }}>Notice of the annual general meeting 2026</div>
          <div style={{ fontSize: 11, marginTop: 8, color: '#333', lineHeight: 1.45 }}>Tuesday 12 May at 18:00 in the meeting room, number 16. Proposals to styret by 15 April.</div>
          <div style={{ fontSize: 10.5, fontWeight: 700, marginTop: 12 }}>Agenda</div>
          {['Accounts 2025', 'Fees for styret', 'Dogs in the courtyard', 'Charging points', 'Elections'].map((item, index) => (
            <div key={item} style={{ fontSize: 10.5, color: '#333', marginTop: 3 }}>
              {index + 1}. {item}
            </div>
          ))}
          <div style={{ marginTop: 10 }}>{lines(4, [94, 86, 90, 50], '#8A8780', 8)}</div>
        </div>
      </Note>
      <Note x={1054} y={118} w={152} h={150} rotate={4.5} paper='#FFE66B' pin={null} z={4}>
        <div style={{ padding: '18px 14px', fontFamily: PEN, fontStyle: 'italic', fontSize: 21, lineHeight: 1.05, color: PEN_INK }}>
          CLEAN THE FILTER after you!! It’s not hard.
        </div>
      </Note>
      <Note x={1034} y={296} w={176} h={196} rotate={-3} pin='#E3A21A' z={3}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(transparent 0 23px, rgba(60,110,190,0.35) 23px 24px)',
            backgroundPosition: '0 30px'
          }}
        />
        <div style={{ position: 'absolute', left: 22, top: 0, bottom: 0, width: 1, background: 'rgba(210,60,60,0.45)' }} />
        <div style={{ position: 'relative', padding: '34px 14px 0 30px', fontFamily: PEN, fontStyle: 'italic', fontSize: 19, lineHeight: '24px', color: PEN_INK }}>
          Found: keys with a blue tag by the bike shed. In my postbox, 302
        </div>
      </Note>
      <Note x={262} y={494} w={204} h={240} rotate={1.2} pin='#2E7D4F' z={2}>
        <div style={{ padding: '32px 18px 0', fontFamily: PRINT, color: '#1D1D1F' }}>
          <div style={{ fontFamily: POSTER, fontSize: 30, fontWeight: 850, fontStretch: '75%', lineHeight: 0.95 }}>FREE</div>
          <div style={{ fontSize: 13, lineHeight: 1.35, marginTop: 6 }}>Children’s bike, 16 inch, blue. Ring the bell at H0106.</div>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 86, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderTop: '1px dashed #888' }}>
          {Array.from({ length: 7 }, (_, i) => (
            <span
              key={i}
              style={{
                borderLeft: i ? '1px dashed #888' : undefined,
                writingMode: 'vertical-rl',
                fontSize: 11,
                fontFamily: PRINT,
                display: 'grid',
                placeItems: 'center',
                background: i === 2 || i === 5 ? '#C79A64' : undefined,
                color: i === 2 || i === 5 ? 'transparent' : '#333'
              }}
            >
              H0106 bike
            </span>
          ))}
        </div>
      </Note>
      <Note x={494} y={470} w={214} h={270} rotate={-2.6} pin='#C8352B' z={3}>
        <div style={{ padding: '30px 18px 0', fontFamily: PRINT, color: '#1D1D1F' }}>
          <div style={{ fontFamily: POSTER, fontSize: 30, fontWeight: 850, fontStretch: '75%', lineHeight: 0.95 }}>MISSING: PUS</div>
          <svg width='120' height='84' viewBox='0 0 120 84' style={{ display: 'block', margin: '10px auto 4px' }} aria-hidden='true'>
            <path d='M28 72c-8-22 4-44 26-46l6-14 8 13c18 3 28 20 24 40-2 9-10 13-20 13H40c-6 0-10-2-12-6z' fill='#8E8E93' />
            <path d='M92 62c14 2 20-8 16-18' fill='none' stroke='#8E8E93' strokeWidth='7' strokeLinecap='round' />
            <path d='M38 78h12M64 78h12' stroke='#fff' strokeWidth='6' strokeLinecap='round' />
            <circle cx='58' cy='40' r='2.6' fill='#222' />
            <circle cx='72' cy='40' r='2.6' fill='#222' />
          </svg>
          <div style={{ fontSize: 12.5, lineHeight: 1.35 }}>Grey, white paws, very shy. Please ring the bell at H0311.</div>
        </div>
      </Note>
      <Note x={974} y={528} w={160} h={92} rotate={-6} paper='#F7F7F7' pin='#3F6FB5' pinAt={0.85} z={4}>
        <div style={{ padding: '14px 12px', fontFamily: PRINT, color: '#1D1D1F' }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Vinduspuss Ole</div>
          <div style={{ fontSize: 10.5, marginTop: 3, color: '#444', lineHeight: 1.35 }}>Windows inside and out. Ask for Ole in number 14.</div>
        </div>
      </Note>
      <Note x={1000} y={640} w={206} h={112} rotate={0.6} paper='#EDEDED' pin={null} z={2} style={{ borderRadius: 4 }}>
        <div style={{ padding: '14px 14px', fontFamily: PRINT, color: '#1D1D1F', boxShadow: 'inset 0 0 0 4px rgba(255,255,255,0.6)', height: '100%' }}>
          <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>House rules § 4</div>
          <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4 }}>Quiet from 23 to 07</div>
          <div style={{ fontSize: 10.5, marginTop: 4, color: '#444' }}>Also Sundays and public holidays before 10.</div>
        </div>
      </Note>
    </Stairwell>
  );
}

function NoticeRow({ title, meta, tone = K.ink, pinned }: { title: string; meta: string; tone?: string; pinned?: boolean }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '6px 1fr', gap: 12, padding: '13px 0', borderTop: `1px solid ${K.line}` }}>
      <span style={{ width: 6, borderRadius: 3, background: tone }} />
      <span>
        <span style={{ display: 'block', ...head(22, 760) }}>{title}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: K.muted, marginTop: 4 }}>
          {pinned ? <span style={{ ...label(9.5, K.paper), background: K.brick, padding: '2px 5px', borderRadius: 4 }}>Pinned</span> : null}
          {meta}
        </span>
      </span>
    </div>
  );
}

/** The notices from styret, sorted by what’s soonest. 390 × 844. */
export function NoticesListScreen() {
  return (
    <Screen tab='Home'>
      <div style={{ padding: '10px 22px 0' }}>
        <div style={{ ...label(11.5, K.brick), display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name='megaphone' size={15} stroke={2} color={K.brick} /> From styret
        </div>
        <div style={{ ...head(44, 800), marginTop: 8 }}>Notices</div>
      </div>
      <div style={{ padding: '14px 22px 0' }}>
        <NoticeRow title='Water off Tuesday 28 April, 09–12' meta='Laundry rooms closed until 12' tone={K.brick} pinned />
        <NoticeRow title='Spring dugnad, Sunday 26 April' meta='41 of 64 flats signed up' tone={K.yellow} />
        <NoticeRow title='Annual meeting, Tuesday 12 May' meta='7 proposals · voting opens 5 May' tone={K.dusk} />
        <NoticeRow title='Please clean the lint filter' meta='Laundry rooms · new filters fitted' tone={K.paperDeep} />
        <NoticeRow title='Quiet from 23 to 07' meta='House rules, section 4' tone={K.paperDeep} />
        <NoticeRow title='Bike shed clear-out by 15 May' meta='Unmarked bikes go to charity' tone={K.paperDeep} />
      </div>
      <div style={{ margin: '10px 22px 0', fontSize: 13, color: K.muted, lineHeight: 1.4 }}>
        Notices take themselves down when they’re over. The Christmas tree collection went on 8 January.
      </div>
    </Screen>
  );
}

function Post({ flat, name, when, children, tag }: { flat: string; name?: string; when: string; children: React.ReactNode; tag?: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr', gap: 12, padding: '13px 0', borderTop: `1px solid ${K.line}` }}>
      <Avatar flat={flat} name={name} size={36} />
      <div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', fontSize: 13.5 }}>
          <span style={{ fontWeight: 650 }}>{name ? `${name.split(' ')[0]}, ${flat}` : flat}</span>
          <span style={{ color: K.faint }}>{when}</span>
          {tag ? <span style={{ marginLeft: 'auto', ...label(9.5, K.ink), background: K.yellowSoft, padding: '2px 5px', borderRadius: 4 }}>{tag}</span> : null}
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.38, marginTop: 3, textWrap: 'pretty' }}>{children}</div>
      </div>
    </div>
  );
}

/** Posts from neighbours, kept apart from styret’s notices. 390 × 844. */
export function NeighboursBoardScreen() {
  return (
    <Screen tab='Neighbours'>
      <div style={{ padding: '10px 22px 0' }}>
        <div style={label(11.5)}>Between neighbours</div>
        <div style={{ ...head(44, 800), marginTop: 8 }}>Noticeboard</div>
      </div>
      <div style={{ padding: '14px 22px 0' }}>
        <Post flat='H0311' when='1 h' tag='Lost'>
          Pus is missing. Grey, white paws, very shy. Please check your storage rooms.
        </Post>
        <Post flat='H0302' when='3 h' tag='Found'>
          Keys with a blue tag by the bike shed. They’re in my postbox.
        </Post>
        <Post flat='H0106' name='Silje Aas' when='yesterday' tag='Free'>
          Children’s bike, 16 inch, blue. Ring the bell.
        </Post>
        <Post flat='H0410' name='Per Ivar Lunde' when='Mon'>
          Ole in number 14 cleaned our windows. Recommended.
        </Post>
        <Post flat='H0215' when='Sun' tag='Borrow'>
          Could anyone lend me a ladder on Saturday? Two hours, I’ll bring it back.
        </Post>
      </div>
      <span
        style={{
          position: 'absolute',
          right: 18,
          bottom: 104,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          height: 48,
          padding: '0 18px 0 14px',
          borderRadius: 24,
          background: K.yellow,
          color: K.ink,
          fontSize: 15,
          fontWeight: 650,
          boxShadow: '0 6px 16px rgba(30,41,68,0.18)'
        }}
      >
        <Icon name='plus' size={18} stroke={2.4} /> Post
      </span>
    </Screen>
  );
}

/** After: the board came down; the same notices, in two lists on the phone. */
export function AppBoardScene() {
  const width = 312;
  const pw = width * (412 / 390);
  const ph = width * (866 / 390);
  const gap = 70;
  const left = BOARD.x + (BOARD.w - (pw * 2 + gap)) / 2;
  const top = (H - ph) / 2 - 22;
  return (
    <Stairwell board='gone'>
      {[<NoticesListScreen key='a' />, <NeighboursBoardScreen key='b' />].map((screen, index) => {
        const x = left + index * (pw + gap);
        return (
          <div key={screen.key}>
            <div style={{ position: 'absolute', left: x + 24, top: top + 40, width: pw, height: ph, borderRadius: 60, background: 'rgba(60,45,25,0.32)', filter: 'blur(22px)' }} />
            <Phone width={width} style={{ position: 'absolute', left: x, top }}>
              {screen}
            </Phone>
          </div>
        );
      })}
    </Stairwell>
  );
}
