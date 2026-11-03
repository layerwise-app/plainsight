import { Link } from '@tanstack/react-router';

export function NotFound() {
  return (
    <section className='px-page pt-[clamp(120px,24vh,260px)] pb-[clamp(96px,16vw,220px)]'>
      <h1 className='max-w-[22ch] text-statement'>
        There is nothing at this address. It may have moved when the work was rearranged.
      </h1>
      <p className='mt-8 flex gap-6 text-ui'>
        <Link to='/' className='link'>
          Home
        </Link>
        <Link to='/work' className='link'>
          All work
        </Link>
      </p>
    </section>
  );
}
