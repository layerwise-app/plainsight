import type * as React from 'react';
import { Lockup, VeinMark } from './Mark';
import { C, FONT, MONTHS, NOV, TITLE_STYLE } from './model';
import { Title } from './Title';

const label: React.CSSProperties = { fontFamily: FONT.mono, fontSize: 12.5, color: C.muted };

function Measure({ text, width, colour }: { text: string; width: number; colour: string }) {
  return (
    <div style={{ width }}>
      <div style={{ position: 'relative', height: 150, display: 'flex', alignItems: 'flex-end' }}>
        <div style={{ width: '100%' }}>
          <Title text={text} width={width} maxHeight={132} gap={6} unit='px' />
        </div>
        <span style={{ position: 'absolute', left: 0, top: -8, bottom: -8, width: 1, background: colour }} />
        <span style={{ position: 'absolute', right: 0, top: -8, bottom: -8, width: 1, background: colour }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, color: colour, fontFamily: FONT.mono, fontSize: 11.5 }}>
        <span style={{ height: 1, flex: 1, background: colour }} />
        <span>{width} px</span>
        <span style={{ height: 1, flex: 1, background: colour }} />
      </div>
    </div>
  );
}

/** The identity on one sheet: the mark, the season's colours and the one type rule. 1440 × 900. */
export function SystemSheet() {
  return (
    <div
      style={{
        width: 1440,
        height: 900,
        background: C.marble,
        color: C.black,
        padding: '64px 72px',
        display: 'grid',
        gridTemplateColumns: '520px 1fr',
        columnGap: 96,
        fontFamily: FONT.mono
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={label}>Logotype</div>
        <div style={{ marginTop: 34, marginLeft: -6 }}>
          <VeinMark size={420} />
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.5, marginTop: 30, maxWidth: 440 }}>
          One line, traced from a vein in the Fauske marble on the stair landing. It is drawn, not set, so it never sits on a baseline.
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 34, marginTop: 'auto' }}>
          <Lockup height={52} />
          <Lockup height={28} />
          <VeinMark size={18} hair={false} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={label}>Colour: two constants and one for each month</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 18 }}>
          {[
            ['Marmor', C.marble, C.black],
            ['Sort', C.black, C.marble]
          ].map(([name, colour, ink]) => (
            <div
              key={name}
              style={{
                height: 84,
                background: colour,
                color: ink,
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                fontSize: 12.5,
                boxShadow: `inset 0 0 0 1px ${C.line}`
              }}
            >
              <span>{name}</span>
              <span>{colour}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 4, marginTop: 12 }}>
          {MONTHS.map((m) => (
            <div key={m.id}>
              <div
                style={{
                  height: 118,
                  background: m.colour,
                  color: m.ink,
                  padding: '8px 7px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  fontSize: 10.5,
                  boxShadow: m.id === NOV.id ? `0 0 0 2px ${C.marble}, 0 0 0 3px ${C.black}` : undefined
                }}
              >
                <span>{m.en.slice(0, 3)}</span>
                <span style={{ ...TITLE_STYLE, fontSize: 22, lineHeight: 0.8 }}>{m.id.slice(5)}</span>
              </div>
              <div style={{ fontSize: 10, marginTop: 7, color: C.muted, letterSpacing: '-0.02em' }}>{m.colour.slice(1)}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.5, marginTop: 16, maxWidth: 600 }}>
          The 2024–25 season. Type is black or marble, whichever has more contrast on the month.
        </div>
        <div style={{ ...label, marginTop: 46 }}>Type: every line fills the measure</div>
        <div style={{ display: 'flex', gap: 34, marginTop: 30 }}>
          <Measure text='Ferro' width={196} colour={NOV.colour} />
          <Measure text='The Glass Orchard' width={196} colour={NOV.colour} />
          <Measure text='A Winter in Tbilisi' width={196} colour={NOV.colour} />
        </div>
        <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 34, fontSize: 12.5 }}>
          <div>
            <div style={{ ...TITLE_STYLE, fontSize: 40, lineHeight: 0.9 }}>Archivo 800, 62.5%</div>
            <div style={{ color: C.muted, marginTop: 8 }}>Titles. Size is the measure ÷ the line’s width.</div>
          </div>
          <div>
            <div style={{ fontSize: 22, lineHeight: 1.15, letterSpacing: '-0.02em' }}>fre 15.11 18:30 Sal 1</div>
            <div style={{ color: C.muted, marginTop: 12 }}>Fragment Mono for dates, times and the grid.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
