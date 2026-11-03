import { type WallRow, layoutWall, projects } from '~/content';
import { portfolio } from '~/portfolio.config';
import { WorkPiece } from './WorkPiece';

/** Home's editorial wall of work, laid out by `layoutWall`. */
export function WorkWall() {
  const rows = layoutWall(projects, portfolio.interludes);
  return (
    <div id='work' className='flex flex-col gap-y-[clamp(64px,9vw,152px)] px-page'>
      {rows.map((row, index) => (
        // Only the first row is above the fold, so only its images load early.
        <Row key={rowKey(row)} row={row} first={index === 0} />
      ))}
    </div>
  );
}

function rowKey(row: WallRow) {
  if (row.kind === 'statement') return row.text;
  if (row.kind === 'full') return row.item.slug;
  return row.items.map((item) => item.slug).join('+');
}

function Row({ row, first }: { row: WallRow; first: boolean }) {
  if (row.kind === 'statement') return <Interlude text={row.text} />;

  if (row.kind === 'full') {
    return (
      <WorkPiece
        project={row.item}
        aspect={2.05}
        aspectMobile={4 / 3}
        columns={12}
        priority={first}
      />
    );
  }

  if (row.kind === 'pair') {
    const [a, b] = row.items;
    const wide = 'md:col-span-7';
    const narrow = 'md:col-span-5';
    return (
      <div className='grid grid-cols-1 gap-x-gutter gap-y-14 md:grid-cols-12'>
        <WorkPiece
          project={a}
          className={row.flip ? narrow : wide}
          aspect={row.flip ? 4 / 5 : 4 / 3}
          columns={row.flip ? 5 : 7}
          priority={first}
        />
        <WorkPiece
          project={b}
          className={row.flip ? wide : narrow}
          aspect={row.flip ? 4 / 3 : 4 / 5}
          columns={row.flip ? 7 : 5}
          priority={first}
        />
      </div>
    );
  }

  const [a, b, c] = row.items;
  return (
    <div className='grid grid-cols-1 gap-x-gutter gap-y-14 md:grid-cols-12 md:items-start'>
      <WorkPiece project={a} className='md:col-span-5' aspect={4 / 5} columns={5} />
      <WorkPiece
        project={b}
        className='md:col-span-3 md:mt-[clamp(120px,16vw,280px)]'
        aspect={3 / 4}
        aspectMobile={4 / 5}
        columns={3}
      />
      <WorkPiece
        project={c}
        className='md:col-span-4'
        aspect={1}
        aspectMobile={4 / 3}
        columns={4}
      />
    </div>
  );
}

function Interlude({ text }: { text: string }) {
  return (
    <div className='grid grid-cols-1 py-[clamp(24px,5vw,96px)] md:grid-cols-12 md:gap-x-gutter'>
      <p className='text-balance text-statement md:col-span-8 md:col-start-5'>{text}</p>
    </div>
  );
}
