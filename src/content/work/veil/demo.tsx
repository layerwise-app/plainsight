import { useEffect, useId, useRef, useState } from 'react';
import type * as React from 'react';
import { useReducedMotion } from '~/components/case/demo-context';
import {
  BALANCE,
  type Bar,
  type Check,
  FRESH,
  HEIGHTS,
  MARI,
  POISON,
  PRINT,
  type Print,
  V,
  checkAddress,
  describeBars,
  fingerprint,
  short
} from './screens/model';
import { Address, Avatar, Icon, Mark, Token } from './screens/ui';

const SAMPLES = [
  { id: 'saved', title: 'Mari Lunde', note: 'Saved contact, 12 March', address: MARI.address },
  { id: 'history', title: 'From your history', note: 'Sent you €0,00 yesterday, 23:14', address: POISON },
  { id: 'new', title: 'A new address', note: 'From a QR code at a market stall', address: FRESH }
] as const;

const focusRing = 'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B3BD6]';

/** Live demo: Veil's address check, and the balance that only shows while held. */
export default function VeilDemo({ initial = POISON, held }: { initial?: string; held?: boolean }) {
  const [value, setValue] = useState<string>(initial);
  const [done, setDone] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const inputId = useId();
  const hintId = useId();
  const result = checkAddress(value);
  const clean = value.replace(/\s+/g, '').toLowerCase();
  const picked = SAMPLES.find((sample) => sample.address.toLowerCase() === clean)?.id;

  const choose = (address: string) => {
    setValue(address);
    setDone(null);
  };

  return (
    <div
      className='@container min-h-full w-full'
      style={{ background: V.fog, color: V.ink, fontFamily: V.sans, fontSize: 15, letterSpacing: '-0.005em' }}
    >
      <div className='grid gap-3 p-3 @min-[480px]:gap-4 @min-[480px]:p-5 @min-[860px]:grid-cols-[minmax(0,392px)_minmax(0,1fr)] @min-[1100px]:grid-cols-[430px_minmax(0,1fr)] @min-[1100px]:gap-5 @min-[1100px]:p-8'>
        <section
          aria-label='Send euros'
          className='flex flex-col rounded-[22px] p-4 @min-[480px]:p-5'
          style={{ background: V.paper, boxShadow: `0 0 0 1px ${V.line}` }}
        >
          <div className='flex items-center justify-between'>
            <span className='flex items-center gap-2.5' style={{ fontSize: 16, fontWeight: 600 }}>
              <Mark size={22} />
              Send euros
            </span>
            <span style={{ fontSize: 12.5, color: V.faint }}>Nothing is sent</span>
          </div>

          <HoldBalance reduced={reduced} initial={held} />

          <label htmlFor={inputId} className='mt-5 block' style={{ fontSize: 13, fontWeight: 500, color: V.slate }}>
            To
          </label>
          <div
            className='mt-2 flex items-start gap-2 rounded-2xl p-1 pl-3.5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#2B3BD6]'
            style={{ background: V.white, boxShadow: `inset 0 0 0 1px ${V.lineStrong}` }}
          >
            <textarea
              id={inputId}
              aria-describedby={hintId}
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                setDone(null);
              }}
              rows={2}
              spellCheck={false}
              autoComplete='off'
              autoCapitalize='off'
              autoCorrect='off'
              placeholder='Paste or type an address'
              className='min-w-0 flex-1 resize-none bg-transparent py-2 outline-none placeholder:text-[#8D96A0]'
              style={{ fontFamily: V.mono, fontSize: 14, lineHeight: 1.5, color: V.ink, wordBreak: 'break-all' }}
            />
            {value ? (
              <button
                type='button'
                onClick={() => choose('')}
                aria-label='Clear the address'
                className={`grid size-9 shrink-0 place-items-center rounded-full ${focusRing}`}
                style={{ color: V.slate, background: 'rgba(20,23,27,0.05)' }}
              >
                <Icon name='close' size={16} stroke={2} />
              </button>
            ) : null}
          </div>
          <p id={hintId} className='mt-2' style={{ fontSize: 12.5, color: V.slate, lineHeight: 1.4 }}>
            Euro and krone addresses start with 0x and have 40 more characters.
          </p>

          <fieldset className='mt-5 grid gap-2'>
            <legend className='mb-2' style={{ fontSize: 13, fontWeight: 500, color: V.slate }}>
              Or try one. The first two look the same in most wallets.
            </legend>
            {SAMPLES.map((sample) => {
              const on = picked === sample.id;
              return (
                <button
                  key={sample.id}
                  type='button'
                  aria-pressed={on}
                  onClick={() => choose(sample.address)}
                  className={`grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl px-3.5 py-3 text-left transition-colors ${focusRing}`}
                  style={{
                    background: on ? V.white : 'rgba(20,23,27,0.035)',
                    boxShadow: on ? `inset 0 0 0 1.5px ${V.ink}` : `inset 0 0 0 1px ${V.line}`
                  }}
                >
                  <span className='min-w-0'>
                    <span className='block' style={{ fontSize: 14.5, fontWeight: 600 }}>
                      {sample.title}
                    </span>
                    <span className='mt-0.5 block truncate' style={{ fontSize: 12.5, color: V.slate }}>
                      {sample.note}
                    </span>
                  </span>
                  <span style={{ fontFamily: V.mono, fontSize: 13.5 }}>{short(sample.address)}</span>
                </button>
              );
            })}
          </fieldset>

          <div className='mt-auto flex items-start gap-2 pt-5' style={{ fontSize: 12.5, color: V.slate, lineHeight: 1.45 }}>
            <span className='mt-px'>
              <Icon name='lock' size={14} stroke={1.8} />
            </span>
            Words and colours are worked out on the device from the address itself. Nothing you type here leaves this page.
          </div>
        </section>

        <Result result={result} value={value} reduced={reduced} done={done} setDone={setDone} choose={choose} />
      </div>
    </div>
  );
}

/** The balance, hidden until pressed and held: pointer, touch, Space or Enter. */
function HoldBalance({ reduced, initial = false }: { reduced: boolean; initial?: boolean }) {
  const [held, setHeld] = useState(initial);
  const statusId = useId();
  const transition = reduced ? 'none' : 'opacity 160ms ease, filter 220ms ease';
  const press = (event: React.KeyboardEvent) => event.key === ' ' || event.key === 'Enter';
  return (
    <div
      className='mt-4 grid grid-cols-[34px_1fr] items-center gap-3 rounded-2xl px-3.5 py-3 @min-[360px]:grid-cols-[34px_1fr_auto]'
      style={{ background: 'rgba(20,23,27,0.04)' }}
    >
      <Token kind='eur' size={34} />
      <div className='min-w-0'>
        <div style={{ fontSize: 12.5, color: V.slate }}>Everyday euros</div>
        <div className='relative mt-1 grid' style={{ fontFamily: V.serif, fontSize: 26, lineHeight: 1, letterSpacing: '-0.015em', whiteSpace: 'nowrap' }}>
          <span aria-hidden={!held} style={{ gridArea: '1 / 1', opacity: held ? 1 : 0, filter: held ? 'none' : 'blur(9px)', transition }}>
            {BALANCE.eur}
          </span>
          <span aria-hidden='true' style={{ gridArea: '1 / 1', opacity: held ? 0 : 0.85, filter: 'blur(7px)', transition, userSelect: 'none' }}>
            € 0 000,00
          </span>
        </div>
      </div>
      <button
        type='button'
        aria-describedby={statusId}
        aria-pressed={held}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          setHeld(true);
        }}
        onPointerUp={() => setHeld(false)}
        onPointerCancel={() => setHeld(false)}
        onLostPointerCapture={() => setHeld(false)}
        onKeyDown={(event) => {
          if (!press(event)) return;
          event.preventDefault();
          if (!event.repeat) setHeld(true);
        }}
        onKeyUp={(event) => {
          if (press(event)) setHeld(false);
        }}
        onBlur={() => setHeld(false)}
        onContextMenu={(event) => event.preventDefault()}
        onClick={(event) => event.preventDefault()}
        className={`col-span-2 flex h-10 select-none items-center justify-center gap-1.5 rounded-full px-3.5 @min-[360px]:col-span-1 ${focusRing}`}
        style={{
          fontSize: 13.5,
          fontWeight: 500,
          color: held ? V.white : V.ink,
          background: held ? V.ink : V.white,
          boxShadow: held ? 'none' : `inset 0 0 0 1px ${V.lineStrong}`,
          touchAction: 'none',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          transition: reduced ? 'none' : 'background-color 120ms ease, color 120ms ease'
        }}
      >
        <Icon name='hold' size={16} stroke={1.8} />
        {held ? 'Release to hide' : 'Hold to show'}
      </button>
      <span id={statusId} className='sr-only' aria-live='polite'>
        {held ? `Balance shown: ${BALANCE.eur.replace('€ ', '')} euros. Let go to hide it.` : 'Balance hidden.'}
      </span>
    </div>
  );
}

/** Six bars that change shape and colour when the address changes. */
function BigBars({ bars, reduced }: { bars: Bar[]; reduced: boolean }) {
  return (
    <span
      role='img'
      aria-label={`Colour fingerprint: ${describeBars(bars)}`}
      className='inline-flex h-10 items-end gap-[5px] @min-[480px]:h-14 @min-[480px]:gap-[7px] @min-[1100px]:h-16'
    >
      {bars.map((bar, index) => (
        <span
          key={index}
          className='w-[14px] rounded-[3px] @min-[480px]:w-[19px] @min-[1100px]:w-[22px]'
          style={{
            height: `${HEIGHTS[bar.height] * 100}%`,
            background: PRINT[bar.colour].hex,
            transition: reduced ? 'none' : 'height 320ms cubic-bezier(0.16,1,0.3,1), background-color 320ms ease'
          }}
        />
      ))}
    </span>
  );
}

function BigWords({ print, reduced, muted }: { print: Print; reduced: boolean; muted?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const key = print.words.join(' ');
  // biome-ignore lint/correctness/useExhaustiveDependencies: replay when the words change
  useEffect(() => {
    if (reduced || !ref.current?.animate) return;
    ref.current.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], {
      duration: 280,
      easing: 'cubic-bezier(0.16,1,0.3,1)'
    });
  }, [key, reduced]);
  return (
    <span
      ref={ref}
      className='block text-[30px] @min-[400px]:text-[36px] @min-[480px]:text-[46px] @min-[1100px]:text-[56px]'
      style={{ fontFamily: V.serif, lineHeight: 1, letterSpacing: '-0.015em', color: muted ? V.slate : V.ink }}
    >
      {print.words.map((word, index) => (
        <span key={word}>
          {index ? <span style={{ color: V.faint }}>{'\u00A0· '}</span> : null}
          {word}
        </span>
      ))}
    </span>
  );
}

function Tag({ tone, icon, children }: { tone: 'blue' | 'red' | 'quiet'; icon?: 'check' | 'warn'; children: React.ReactNode }) {
  const style = {
    blue: { color: V.blueInk, background: V.blueTint },
    red: { color: V.redInk, background: V.redTint },
    quiet: { color: V.slate, background: 'rgba(20,23,27,0.06)' }
  }[tone];
  return (
    <span className='inline-flex h-7 items-center gap-1.5 rounded-full px-3' style={{ fontSize: 13, fontWeight: 600, ...style }}>
      {icon ? <Icon name={icon} size={15} stroke={2.1} /> : null}
      {children}
    </span>
  );
}

/** One side of the comparison: who it belongs to, its words, bars and address. */
function Side({
  label,
  print,
  address,
  against,
  tone,
  reduced
}: {
  label: React.ReactNode;
  print: Print;
  address: string;
  against?: string;
  tone?: 'red';
  reduced: boolean;
}) {
  return (
    <div
      className='grid gap-3 px-4 py-4 @min-[480px]:px-5'
      style={tone === 'red' ? { background: 'rgba(255,79,31,0.07)', borderTop: '1px solid rgba(255,79,31,0.18)' } : undefined}
    >
      <div style={{ fontSize: 13, color: tone === 'red' ? V.redInk : V.slate }}>{label}</div>
      <div className='flex flex-wrap items-end justify-between gap-x-5 gap-y-3'>
        <BigWords print={print} reduced={reduced} />
        <BigBars bars={print.bars} reduced={reduced} />
      </div>
      <Address address={address} against={against} size={13} color={V.slate} />
    </div>
  );
}

function headline(result: Check) {
  switch (result.kind) {
    case 'empty':
      return 'Paste an address to check it.';
    case 'partial':
      return 'Keep going.';
    case 'invalid':
      return 'That isn’t an address.';
    case 'match':
      return `This is ${result.contact.name.split(' ')[0]}’s address.`;
    case 'lookalike':
      return `This isn’t ${result.contact.name.split(' ')[0]}’s address.`;
    case 'new':
      return 'You haven’t paid this address before.';
  }
}

function summary(result: Check) {
  switch (result.kind) {
    case 'empty':
      return 'Waiting for an address.';
    case 'partial':
      return `${result.length} of 42 characters.`;
    case 'invalid':
      return `Not an address. ${result.reason}`;
    case 'match':
      return `Matches ${result.contact.name}, saved ${result.contact.saved}. Words: ${result.print.words.join(', ')}.`;
    case 'lookalike':
      return `Warning: lookalike of ${result.contact.name}. ${result.differ} of 40 characters are different. Words: ${result.print.words.join(', ')}.`;
    case 'new':
      return `New address, not like anyone you have saved. Words: ${result.print.words.join(', ')}.`;
  }
}

function Result({
  result,
  value,
  reduced,
  done,
  setDone,
  choose
}: {
  result: Check;
  value: string;
  reduced: boolean;
  done: string | null;
  setDone: (text: string | null) => void;
  choose: (address: string) => void;
}) {
  const clean = value.replace(/\s+/g, '');
  const saved = fingerprint(MARI.address);
  const action = (text: string, tone: 'blue' | 'ghost' | 'red', onClick: () => void) => (
    <button
      type='button'
      onClick={onClick}
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 ${focusRing}`}
      style={{
        fontSize: 15,
        fontWeight: 600,
        ...(tone === 'blue'
          ? { background: V.blue, color: V.white }
          : tone === 'red'
            ? { color: V.redInk, boxShadow: 'inset 0 0 0 1px rgba(199,56,13,0.4)' }
            : { color: V.ink, boxShadow: `inset 0 0 0 1px ${V.lineStrong}` })
      }}
    >
      {text}
    </button>
  );

  return (
    <section
      aria-label='Address check'
      className='flex min-w-0 flex-col rounded-[22px] p-4 @min-[480px]:p-6 @min-[1100px]:p-8'
      style={{ background: V.white, boxShadow: `0 0 0 1px ${V.line}` }}
    >
      <p className='sr-only' aria-live='polite'>
        {summary(result)}
        {done ? ` ${done}` : ''}
      </p>
      <div className='flex min-h-7 flex-wrap items-center gap-2'>
        {result.kind === 'match' ? (
          <Tag tone='blue' icon='check'>
            Matches {result.contact.name}
          </Tag>
        ) : result.kind === 'lookalike' ? (
          <Tag tone='red' icon='warn'>
            Lookalike of {result.contact.name}
          </Tag>
        ) : result.kind === 'new' ? (
          <Tag tone='quiet'>New address</Tag>
        ) : result.kind === 'invalid' ? (
          <Tag tone='quiet'>Not checked</Tag>
        ) : (
          <Tag tone='quiet'>Address check</Tag>
        )}
        {result.kind === 'match' ? <span style={{ fontSize: 13, color: V.slate }}>saved {result.contact.saved}</span> : null}
      </div>

      <h3
        className='mt-4 text-[30px] @min-[480px]:text-[38px] @min-[1100px]:text-[44px]'
        style={{ fontFamily: V.serif, fontWeight: 400, lineHeight: 1.02, letterSpacing: '-0.015em', textWrap: 'balance' }}
      >
        {headline(result)}
      </h3>

      {result.kind === 'lookalike' ? (
        <>
          <p className='mt-3 max-w-[62ch]' style={{ fontSize: 15, lineHeight: 1.5, color: V.slate, textWrap: 'pretty' }}>
            It starts <Code>{clean.slice(0, 2 + result.prefix)}</Code> and ends <Code>{clean.slice(42 - result.suffix)}</Code>, like hers,
            so it passes the usual glance at the ends. {result.differ === 1 ? 'One character' : `${result.differ} characters`} in between{' '}
            {result.differ === 1 ? 'is' : 'are'} different, and so are the words. Addresses like this send you €0,00 so they sit in your
            history, ready to be copied.
          </p>
          <div className='mt-5 overflow-hidden rounded-2xl' style={{ boxShadow: `0 0 0 1px ${V.line}`, background: V.paper }}>
            <Side label={`Saved for ${result.contact.name}, ${result.contact.saved}`} print={fingerprint(result.contact.address)} address={result.contact.address} reduced={reduced} />
            <Side label='The address you pasted' print={result.print} address={clean} against={result.contact.address} tone='red' reduced={reduced} />
          </div>
          <div className='mt-5 flex flex-wrap items-center gap-2.5'>
            {action(`Use ${result.contact.name.split(' ')[0]}’s saved address`, 'blue', () => choose(result.contact.address))}
            {action('Block this address', 'red', () => setDone('Blocked. Veil won’t suggest it again.'))}
          </div>
        </>
      ) : result.kind === 'match' ? (
        <>
          <p className='mt-3 max-w-[62ch]' style={{ fontSize: 15, lineHeight: 1.5, color: V.slate, textWrap: 'pretty' }}>
            Every character matches the address you saved for {result.contact.name.split(' ')[0]}, so the words and colours are the same
            as the day you saved it. If she reads you her three words, they will be these.
          </p>
          <div className='mt-5 overflow-hidden rounded-2xl' style={{ boxShadow: `0 0 0 1px ${V.line}`, background: V.paper }}>
            <div className='grid gap-3 px-4 py-4 @min-[480px]:px-5'>
              <div className='flex items-center gap-2.5' style={{ fontSize: 13, color: V.slate }}>
                <Avatar initials={result.contact.initials} tint={result.contact.tint} size={26} />
                {result.contact.name} · {result.contact.last}
              </div>
              <div className='flex flex-wrap items-end justify-between gap-x-5 gap-y-3'>
                <BigWords print={result.print} reduced={reduced} />
                <BigBars bars={result.print.bars} reduced={reduced} />
              </div>
              <Address address={clean} size={13} color={V.slate} />
            </div>
          </div>
          <div className='mt-5 flex flex-wrap items-center gap-2.5'>
            {action(`Continue to amount`, 'blue', () => setDone('This is where the demo ends. Nothing was sent.'))}
          </div>
        </>
      ) : result.kind === 'new' ? (
        <>
          <p className='mt-3 max-w-[62ch]' style={{ fontSize: 15, lineHeight: 1.5, color: V.slate, textWrap: 'pretty' }}>
            It doesn’t start or end like anyone you’ve saved, so it isn’t a lookalike. It is just unknown. Before you send, ask the person
            to read you their three words, by phone or face to face.
          </p>
          <div className='mt-5 overflow-hidden rounded-2xl' style={{ boxShadow: `0 0 0 1px ${V.line}`, background: V.paper }}>
            <div className='grid gap-3 px-4 py-4 @min-[480px]:px-5'>
              <div style={{ fontSize: 13, color: V.slate }}>Ask them to read you</div>
              <div className='flex flex-wrap items-end justify-between gap-x-5 gap-y-3'>
                <BigWords print={result.print} reduced={reduced} />
                <BigBars bars={result.print.bars} reduced={reduced} />
              </div>
              <Address address={clean} size={13} color={V.slate} />
            </div>
          </div>
          <div className='mt-5 flex flex-wrap items-center gap-2.5'>
            {action('They read the same words', 'blue', () => setDone('Saved as a new contact, on this phone only.'))}
            {action('They didn’t', 'ghost', () => setDone('Good catch. Ask them to send the address again.'))}
          </div>
        </>
      ) : (
        <>
          <p className='mt-3 max-w-[62ch]' style={{ fontSize: 15, lineHeight: 1.5, color: V.slate }}>
            {result.kind === 'partial'
              ? `${result.length} of 42 characters. Veil checks the whole address, not just the ends, so it waits for all of it.`
              : result.kind === 'invalid'
                ? result.reason
                : 'Veil turns every address into three words and six coloured bars. The same address always gives the same ones; a lookalike never does.'}
          </p>
          <div className='mt-5 rounded-2xl px-4 py-4 @min-[480px]:px-5' style={{ boxShadow: `0 0 0 1px ${V.line}`, background: V.paper }}>
            <div style={{ fontSize: 13, color: V.slate }}>For example, Mari Lunde’s address always reads</div>
            <div className='mt-3 flex flex-wrap items-end justify-between gap-x-5 gap-y-3'>
              <BigWords print={saved} reduced={reduced} muted />
              <BigBars bars={saved.bars} reduced={reduced} />
            </div>
            {result.kind === 'partial' ? <Progress length={result.length} /> : null}
          </div>
        </>
      )}

      {done ? (
        <p className='mt-4 flex items-center gap-2' style={{ fontSize: 14, color: V.ink }}>
          <Icon name='check' size={16} stroke={2.2} color={V.blue} />
          {done}
        </p>
      ) : null}
    </section>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return <span style={{ fontFamily: V.mono, fontSize: '0.9em', color: V.ink, wordBreak: 'break-all' }}>{children}</span>;
}

/** 40 ticks, one for each character after 0x. */
function Progress({ length }: { length: number }) {
  const filled = Math.max(0, length - 2);
  return (
    <div className='mt-4 flex gap-[3px]' aria-hidden='true'>
      {Array.from({ length: 40 }, (_, index) => (
        <span
          key={index}
          className='h-2 flex-1 rounded-[2px]'
          style={{ background: index < filled ? V.ink : V.mist }}
        />
      ))}
    </div>
  );
}
