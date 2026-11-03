import type { ErrorComponentProps } from '@tanstack/react-router';
import { Link, useRouter } from '@tanstack/react-router';

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  console.error(error);

  return (
    <section className='px-page pt-[clamp(120px,24vh,260px)] pb-[clamp(96px,16vw,220px)]'>
      <h1 className='max-w-[22ch] text-statement'>Something went wrong while loading this page.</h1>
      <p className='mt-8 flex gap-6 text-ui'>
        <button type='button' className='link' onClick={() => router.invalidate()}>
          Try again
        </button>
        <Link to='/' className='link'>
          Home
        </Link>
      </p>
    </section>
  );
}
