import { Grain } from '~/components/art/Grain';
import { BagArt, Label } from './Bag';
import { G, ROAST_ORDER, ROASTS, displayStyle, wonk } from './brand';

const NOTES: { n: string; title: string; body: string; anchor: number }[] = [
  { n: '1', title: 'Roast date', body: 'Printed from the roast log at the end of each batch. The day is the largest thing on the bag.', anchor: 0.27 },
  { n: '2', title: 'Coffee and origin', body: 'Name, region and process, then the notes in the order you taste them.', anchor: 0.66 },
  { n: '3', title: 'Roast and weight', body: 'Spelled out, because colour alone fails one man in twelve.', anchor: 0.885 },
  { n: '4', title: 'Brew guide', body: 'Subscription bags print the method you told us. Shop bags carry filter and espresso.', anchor: 0.955 }
];

const ROAST_DAYS = [
  ['04', 'Mon'],
  ['07', 'Thu'],
  ['11', 'Mon'],
  ['14', 'Thu'],
  ['18', 'Mon'],
  ['21', 'Thu'],
  ['25', 'Mon'],
  ['28', 'Thu']
];

/** The label system: one label for every coffee, and four bag colours for four roasts. 1440 × 960. */
export function LabelSheet() {
  const labelW = 420;
  const labelH = labelW * 1.04;
  const lx = 88;
  const ly = 206;
  const nx = lx + labelW + 64;
  const noteY = [218, 340, 462, 578];
  return (
    <div style={{ width: 1440, height: 960, position: 'relative', overflow: 'hidden', background: G.cream, color: G.espresso, fontFamily: G.sans }}>
      <Grain opacity={0.16} frequency={0.8} />
      <div style={{ position: 'absolute', left: 88, top: 64, right: 88, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '0.16em', color: G.muted }}>GRUMS · LABEL SYSTEM · 2024</div>
          <div style={{ ...displayStyle(900, 144), fontSize: 60, lineHeight: 1, letterSpacing: '-0.035em', marginTop: 12 }}>The date goes first.</div>
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.5, color: G.muted, maxWidth: 400, textAlign: 'right' }}>
          One label for every coffee, printed in the roastery on roasting day. Four printed bag stocks, one for each roast.
        </div>
      </div>

      <svg width={1440} height={720} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden='true'>
        <defs>
          <filter id='labelShadow' x='-20%' y='-20%' width='140%' height='140%'>
            <feGaussianBlur stdDeviation={9} />
          </filter>
        </defs>
        <rect x={lx + 6} y={ly + 12} width={labelW} height={labelH} rx={6} fill='#5a3b22' opacity={0.14} filter='url(#labelShadow)' />
        <g transform={`translate(${lx} ${ly})`}>
          <Label width={labelW} roast='medium' size={500} date={{ dd: '04', mon: 'NOV', weekday: 'MONDAY' }} method='cafetiere' flat />
        </g>
        {NOTES.map((note, i) => {
          const ay = ly + labelH * note.anchor;
          const ty = noteY[i] + 13;
          const x0 = lx + labelW + 8;
          const x1 = nx - 30;
          return (
            <g key={note.n} fill='none' stroke={G.tomato} strokeWidth={1.2}>
              <circle cx={lx + labelW - 4} cy={ay} r={3} fill={G.tomato} stroke='none' />
              <path d={`M${lx + labelW - 4} ${ay} H${x0} L${x1} ${ty} H${nx - 6}`} />
            </g>
          );
        })}
      </svg>
      {NOTES.map((note, i) => (
        <div key={note.n} style={{ position: 'absolute', left: nx, top: noteY[i], width: 222, display: 'grid', gridTemplateColumns: '26px 1fr', gap: 10 }}>
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              background: G.tomato,
              color: G.cream,
              display: 'grid',
              placeItems: 'center',
              ...displayStyle(900, 72),
              fontSize: 13
            }}
          >
            {note.n}
          </span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, lineHeight: '26px' }}>{note.title}</div>
            <div style={{ fontSize: 12.5, lineHeight: 1.45, color: G.muted }}>{note.body}</div>
          </div>
        </div>
      ))}

      <div style={{ position: 'absolute', left: 872, top: 206, right: 88 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '0.16em', color: G.muted }}>COLOUR IS THE ROAST, NOT THE COUNTRY</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 14 }}>
          {ROAST_ORDER.map((r) => {
            const roast = ROASTS[r];
            return (
              <div key={r}>
                <div style={{ height: 222, borderRadius: 10, background: '#ece0cc', display: 'grid', placeItems: 'end center', overflow: 'hidden' }}>
                  <BagArt roast={r} size={500} height={262} width={112} yaw={0} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 11 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: roast.bag, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)' }} />
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{roast.label}</span>
                </div>
                <div style={{ fontSize: 12, color: G.muted, marginTop: 3 }}>
                  {roast.swatch} {roast.bag.toUpperCase()}
                </div>
                <div style={{ fontSize: 12, color: G.muted }}>{r === 'decaf' ? 'Also seasonal' : r === 'light' ? 'Espresso ink' : 'Cream ink'}</div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 26, borderTop: `1px solid ${G.lineStrong}`, paddingTop: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontFamily: G.display, fontWeight: 900, fontVariationSettings: wonk(144, 100, 1), fontSize: 84, lineHeight: 0.8, letterSpacing: '-0.04em', color: G.tomato }}>
                04
              </span>
              <span style={{ fontFamily: G.display, fontWeight: 900, fontVariationSettings: wonk(144, 0, 0), fontSize: 84, lineHeight: 0.8, letterSpacing: '-0.04em', color: G.lineStrong }}>
                04
              </span>
            </div>
            <div style={{ fontSize: 12.5, lineHeight: 1.5, color: G.muted, marginTop: 12 }}>
              Fraunces Black with Soft at 100 and Wonk on, left. Without, right. The soft figures look stamped, not typeset.
            </div>
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.05 }}>17 g to 280 ml</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.14em', marginTop: 9 }}>MEDIUM ROAST · 500 G</div>
            <div style={{ fontSize: 12.5, lineHeight: 1.5, color: G.muted, marginTop: 9 }}>
              Work Sans for anything read with wet hands. Nothing on a bag is set below 7 pt.
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 88, right: 88, top: 742, borderTop: `1px solid ${G.lineStrong}`, paddingTop: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 600, letterSpacing: '0.16em', color: G.muted }}>
          <span>NOVEMBER’S ROAST DAYS</span>
          <span>MONDAYS FOR SUBSCRIPTIONS · THURSDAYS FOR THE SHOP</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', marginTop: 14 }}>
          {ROAST_DAYS.map(([dd, wd]) => (
            <div key={dd} style={{ borderLeft: `1px solid ${G.line}`, paddingLeft: 14 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                <span
                  style={{
                    ...displayStyle(900, 144),
                    fontSize: 62,
                    lineHeight: 0.9,
                    letterSpacing: '-0.04em',
                    color: wd === 'Mon' ? G.tomato : G.espresso
                  }}
                >
                  {dd}
                </span>
                <span style={{ ...displayStyle(900, 144), fontSize: 17, color: wd === 'Mon' ? G.tomato : G.espresso }}>NOV</span>
              </div>
              <div style={{ fontSize: 12, color: G.muted, marginTop: 6 }}>{wd === 'Mon' ? 'Monday' : 'Thursday'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
