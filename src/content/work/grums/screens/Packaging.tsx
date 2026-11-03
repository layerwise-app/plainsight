import { G, wonk } from './brand';

const sans = (weight: number, size: number, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: G.sans,
  fontWeight: weight,
  fontSize: size,
  ...extra
});

/** A barcode that looks scanned, drawn from a fixed pattern. */
export function Barcode({ x, y, width, height, seed = 7 }: { x: number; y: number; width: number; height: number; seed?: number }) {
  const bars: [number, number][] = [];
  let cursor = 0;
  let n = seed;
  while (cursor < width) {
    n = (n * 9301 + 49297) % 233280;
    const w = 0.5 + (n % 4) * 0.45;
    bars.push([cursor, w]);
    cursor += w + 0.6 + ((n >> 3) % 3) * 0.4;
  }
  return (
    <g fill={G.espresso}>
      {bars.map(([bx, bw]) => (bx + bw <= width ? <rect key={bx} x={x + bx} y={y} width={bw} height={height} /> : null))}
    </g>
  );
}

/** The round roast stamp, inked by hand on every box. */
export function Stamp({ x, y, r, dd, mon, rotate = -9, ink = G.tomato }: { x: number; y: number; r: number; dd: string; mon: string; rotate?: number; ink?: string }) {
  const id = `stamp-${dd}-${mon}-${Math.round(r)}`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} fill={ink} opacity={0.92}>
      <defs>
        <path id={id} d={`M ${-r * 0.8} ${r * 0.1} A ${r * 0.8} ${r * 0.8} 0 1 1 ${r * 0.8} ${r * 0.1}`} />
        <filter id={`${id}-rough`} x='-10%' y='-10%' width='120%' height='120%'>
          <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves={2} seed={3} />
          <feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3 2.2' />
          <feComposite in='SourceGraphic' operator='in' />
        </filter>
      </defs>
      <g filter={`url(#${id}-rough)`}>
        <circle r={r} fill='none' stroke={ink} strokeWidth={r * 0.06} />
        <circle r={r * 0.62} fill='none' stroke={ink} strokeWidth={r * 0.025} />
        <text style={sans(700, r * 0.15, { letterSpacing: '0.14em' })}>
          <textPath href={`#${id}`} startOffset='50%' textAnchor='middle'>
            ROASTED IN TRONDHEIM
          </textPath>
        </text>
        <text y={r * 0.2} textAnchor='middle' style={{ fontFamily: G.display, fontWeight: 900, fontSize: r * 0.62, fontVariationSettings: wonk(144, 100, 1), letterSpacing: '-0.03em' }}>
          {dd}
        </text>
        <text y={r * 0.46} textAnchor='middle' style={sans(700, r * 0.17, { letterSpacing: '0.2em' })}>
          {mon}
        </text>
      </g>
    </g>
  );
}

/** Posten's letterbox label, Grums's way round. */
export function ShippingLabel({ x, y, width = 128, rotate = 0, weight = '0,6 kg' }: { x: number; y: number; width?: number; rotate?: number; weight?: string }) {
  const k = width / 128;
  const h = 78 * k;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${k})`}>
      <rect x={0.6} y={1} width={128} height={78} rx={2} fill='#000' opacity={0.12} />
      <rect width={128} height={78} rx={2} fill='#fbf8f2' />
      <rect width={128} height={13} rx={2} fill={G.espresso} />
      <rect y={8} width={128} height={5} fill={G.espresso} />
      <text x={6} y={9} fill='#fbf8f2' style={sans(700, 5.6, { letterSpacing: '0.18em' })}>
        PAKKE I POSTKASSEN
      </text>
      <text x={122} y={9} textAnchor='end' fill='#fbf8f2' style={sans(500, 5)}>
        A-post
      </text>
      <g fill={G.espresso}>
        <text x={6} y={22} style={sans(500, 4.4)} opacity={0.6}>
          Til
        </text>
        <text x={6} y={30} style={sans(600, 6.4)}>
          Marte Kvam
        </text>
        <text x={6} y={37.5} style={sans(400, 5.6)}>
          Øvre Bakklandet 12
        </text>
        <text x={6} y={44.5} style={sans(400, 5.6)}>
          7013 Trondheim
        </text>
        <text x={80} y={22} style={sans(500, 4.4)} opacity={0.6}>
          Fra
        </text>
        <text x={80} y={29} style={sans(500, 4.6)}>
          Grums Kaffe AS
        </text>
        <text x={80} y={35} style={sans(400, 4.4)}>
          Mellomveien 4
        </text>
        <text x={80} y={41} style={sans(400, 4.4)}>
          7042 Trondheim
        </text>
      </g>
      <Barcode x={6} y={52} width={64} height={16} seed={11} />
      <text x={6} y={74} fill={G.espresso} style={sans(500, 4.2, { letterSpacing: '0.12em' })}>
        70 4219 0386 1124 NO
      </text>
      <text x={122} y={62} textAnchor='end' fill={G.espresso} style={{ fontFamily: G.display, fontWeight: 900, fontSize: 13, fontVariationSettings: wonk(144, 100, 1) }}>
        {weight}
      </text>
      <text x={122} y={72} textAnchor='end' fill={G.espresso} style={sans(500, 4.4)}>
        Ons 6. nov
      </text>
      <rect width={128} height={78} rx={2} fill='none' stroke='#000' strokeOpacity={0.1} strokeWidth={0.4} />
      <rect width={128} height={h / k} fill='none' />
    </g>
  );
}

/** The lid of the letterbox box, 330 × 236 mm. */
export function BoxLid({ dd = '04', mon = 'NOV', weight }: { dd?: string; mon?: string; weight?: string }) {
  const L = 330;
  const W = 236;
  return (
    <g>
      <rect width={70} height={W} fill={G.tomato} />
      <text
        transform={`translate(52 ${W - 16}) rotate(-90)`}
        fill={G.cream}
        style={{ fontFamily: G.display, fontWeight: 900, fontSize: 58, fontVariationSettings: wonk(144, 100, 1), letterSpacing: '-0.02em' }}
      >
        grums
      </text>
      <text x={92} y={44} fill={G.espresso} style={{ fontFamily: G.display, fontWeight: 700, fontSize: 21, fontVariationSettings: wonk(72, 100, 1), letterSpacing: '-0.01em' }}>
        Roasted on Monday.
      </text>
      <text x={92} y={68} fill={G.espresso} style={{ fontFamily: G.display, fontWeight: 700, fontSize: 21, fontVariationSettings: wonk(72, 100, 1), letterSpacing: '-0.01em' }}>
        In your letterbox
      </text>
      <text x={92} y={92} fill={G.espresso} style={{ fontFamily: G.display, fontWeight: 700, fontSize: 21, fontVariationSettings: wonk(72, 100, 1), letterSpacing: '-0.01em' }}>
        on Wednesday.
      </text>
      <text x={92} y={114} fill={G.espresso} opacity={0.75} style={sans(500, 7.2)}>
        Skip or move the next one: reply to our text,
      </text>
      <text x={92} y={124} fill={G.espresso} opacity={0.75} style={sans(500, 7.2)}>
        or go to grums.no/neste
      </text>
      <ShippingLabel x={L - 150} y={W - 98} width={138} rotate={-1.2} weight={weight} />
      <Stamp x={164} y={176} r={33} dd={dd} mon={mon} rotate={-13} />
    </g>
  );
}
