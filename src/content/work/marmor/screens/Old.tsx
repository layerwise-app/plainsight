import type * as React from 'react';

/*
 * Marmor Kino before the identity: a programme sheet made in a word
 * processor and a film poster from a template. Drawn in fonts the cinema
 * would have had to hand.
 */

const NAVY = '#1C2650';
const GOLD = '#C8A24B';
const cq = (n: number) => `${n}cqw`;
const serif = "'Instrument Serif', Georgia, serif";
const sans = "'Work Sans', Arial, sans-serif";
const display = "'Bricolage Grotesque', Arial, sans-serif";

function Reel({ size, color }: { size: string; color: string }) {
  return (
    <svg width={size} height={size} viewBox='0 0 40 40' aria-hidden='true' style={{ display: 'block' }}>
      <circle cx='20' cy='20' r='18' fill='none' stroke={color} strokeWidth='2.5' />
      <circle cx='20' cy='20' r='3' fill={color} />
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={20 + Math.cos((a * Math.PI) / 180) * 10} cy={20 + Math.sin((a * Math.PI) / 180) * 10} r='4.2' fill={color} />
      ))}
    </svg>
  );
}

const OLD_ROWS = [
  ['Fre 1.11', '19.00', 'Paper Moons'],
  ['Lør 2.11', '18.00', 'Hotel Meridian'],
  ['Søn 3.11', '16.00', 'Ulla og havet (barn)'],
  ['Tir 5.11', '19.00', 'The Quiet Hours'],
  ['Ons 6.11', '20.00', 'Copper Sky'],
  ['Fre 8.11', '19.00', 'Lanternen (1961)'],
  ['Lør 9.11', '21.00', 'Salt and Iron'],
  ['Tir 12.11', '19.30', 'The Glass Orchard'],
  ['Fre 15.11', '18.30', 'KVELDSSOL - PREMIERE!!'],
  ['Lør 16.11', '12.00', 'Reven som telte stjerner'],
  ['Tir 19.11', '19.00', 'Kveldssol'],
  ['Fre 22.11', '21.30', 'Ferro'],
  ['Lør 23.11', '18.00', 'Night Bus to Kraków'],
  ['Tor 28.11', '19.00', 'Tidevann']
];

/** The old monthly programme sheet. 70 × 100. */
export function OldProgramme({ width = '100%', style }: { width?: number | string; style?: React.CSSProperties }) {
  return (
    <div style={{ width, aspectRatio: '70 / 100', containerType: 'inline-size', position: 'relative', overflow: 'hidden', background: NAVY, color: '#fff', ...style }}>
      <div style={{ position: 'absolute', inset: cq(3), border: `${cq(0.5)} solid ${GOLD}` }} />
      <div style={{ position: 'absolute', inset: cq(4.4), border: `${cq(0.18)} solid ${GOLD}` }} />
      <div style={{ position: 'absolute', inset: 0, padding: `${cq(9)} ${cq(9)}`, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Reel size={cq(10)} color={GOLD} />
        <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: cq(13), color: GOLD, lineHeight: 1, marginTop: cq(2), textShadow: `0 ${cq(0.4)} ${cq(0.8)} rgba(0,0,0,0.5)` }}>Marmor Kino</div>
        <div style={{ fontFamily: sans, fontSize: cq(2), letterSpacing: '0.3em', marginTop: cq(1.5), color: GOLD }}>~ SIDEN 1938 ~</div>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: cq(4.6), marginTop: cq(5), letterSpacing: '0.04em' }}>PROGRAM NOVEMBER 2024</div>
        <div style={{ width: '100%', marginTop: cq(4), fontFamily: sans, fontSize: cq(2.35), textAlign: 'left' }}>
          {OLD_ROWS.map(([date, time, title], i) => (
            <div
              key={date + time}
              style={{
                display: 'grid',
                gridTemplateColumns: '24% 14% 1fr',
                padding: `${cq(0.75)} ${cq(1.5)}`,
                background: i % 2 ? 'rgba(255,255,255,0.07)' : 'transparent',
                fontWeight: title.includes('!!') ? 700 : 400,
                color: title.includes('!!') ? '#ffd76a' : undefined
              }}
            >
              <span>{date}</span>
              <span>{time}</span>
              <span>{title}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'auto', fontFamily: sans, fontSize: cq(2), lineHeight: 1.5, color: '#d6d9e6' }}>
          Billettsalg i kassen fra kl. 16.00
          <br />
          www.marmorkino.no · Tlf. 55 12 34 56
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          right: cq(5),
          top: cq(56),
          width: cq(22),
          height: cq(22),
          background: '#E23B2E',
          clipPath:
            'polygon(50% 0%, 61% 14%, 79% 9%, 79% 27%, 96% 35%, 86% 50%, 96% 65%, 79% 73%, 79% 91%, 61% 86%, 50% 100%, 39% 86%, 21% 91%, 21% 73%, 4% 65%, 14% 50%, 4% 35%, 21% 27%, 21% 9%, 39% 14%)',
          display: 'grid',
          placeItems: 'center',
          transform: 'rotate(12deg)',
          fontFamily: display,
          fontWeight: 800,
          fontSize: cq(2.5),
          lineHeight: 1.05,
          textAlign: 'center',
          color: '#fff'
        }}
      >
        NYHET!
        <br />
        Billetter
        <br />
        på nett
      </div>
    </div>
  );
}

/** The old film poster: a sunset gradient and whatever fonts were installed. 70 × 100. */
export function OldFilmPoster({ width = '100%', style }: { width?: number | string; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        width,
        aspectRatio: '70 / 100',
        containerType: 'inline-size',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(120% 70% at 50% 62%, #ffb347 0%, #f2652f 26%, #8e2a52 56%, #2a1240 82%, #120a1f 100%)',
        color: '#fff',
        ...style
      }}
    >
      <div style={{ position: 'absolute', left: '-10%', right: '-10%', top: '64%', bottom: 0, background: 'linear-gradient(#1a0f22, #07040b)' }} />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '64%',
          width: cq(36),
          height: cq(36),
          marginLeft: cq(-18),
          marginTop: cq(-18),
          borderRadius: '50%',
          background: 'radial-gradient(circle, #fff6d8 0%, #ffd27a 40%, rgba(255,160,60,0) 72%)'
        }}
      />
      <div style={{ position: 'absolute', inset: 0, padding: cq(7), display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ fontFamily: sans, fontSize: cq(2.6), letterSpacing: '0.35em', marginTop: cq(3) }}>EN FILM AV INGEBORG RAA</div>
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: cq(17),
            lineHeight: 1,
            marginTop: cq(5),
            letterSpacing: '-0.01em',
            textShadow: `0 ${cq(0.6)} ${cq(2)} rgba(0,0,0,0.6), 0 0 ${cq(6)} rgba(255,180,80,0.7)`
          }}
        >
          Kveldssol
        </div>
        <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: cq(5), marginTop: cq(2), color: '#ffe2b8' }}>En sommer. Et fyr. Et farvel.</div>
        <div
          style={{
            marginTop: 'auto',
            background: '#d32f2f',
            fontFamily: sans,
            fontWeight: 700,
            fontSize: cq(4.2),
            padding: `${cq(1.4)} ${cq(6)}`,
            transform: 'rotate(-3deg)',
            boxShadow: `0 ${cq(0.6)} ${cq(1.4)} rgba(0,0,0,0.5)`
          }}
        >
          PREMIERE 15. NOVEMBER!
        </div>
        <div style={{ fontFamily: sans, fontSize: cq(1.6), lineHeight: 1.35, color: 'rgba(255,255,255,0.62)', marginTop: cq(5), letterSpacing: '0.02em' }}>
          MOTLYS FILM PRESENTERER EN FILM AV INGEBORG RAA · FOTO JONAS LIE MØRCH · KLIPP SIRI HOLM · MUSIKK ARVID SKOG · PRODUSENT ANNE BERG · NORSK FILMINSTITUTT · VESTLAND FILMSENTER
        </div>
        <div style={{ marginTop: cq(4), display: 'flex', alignItems: 'center', gap: cq(2), color: GOLD }}>
          <Reel size={cq(5)} color={GOLD} />
          <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: cq(5.4) }}>Marmor Kino</span>
        </div>
      </div>
    </div>
  );
}
