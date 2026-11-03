import { Link } from '@tanstack/react-router';
import { portfolio } from '~/portfolio.config';
import { Clock } from './Clock';

const nav = [
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' }
] as const;

export function SiteHeader() {
  return (
    <header className='relative z-10 grid grid-cols-2 items-baseline gap-x-4 gap-y-1.5 px-page pt-[18px] text-ui md:grid-cols-12 md:gap-x-gutter md:pt-6'>
      <Link
        to='/'
        className='col-start-1 row-start-1 justify-self-start text-[15px] font-semibold tracking-[-0.035em] md:col-span-3'
        aria-label={`${portfolio.name}, home`}
      >
        {portfolio.name}
      </Link>
      <nav aria-label='Main' className='col-span-2 row-start-2 md:col-span-4 md:col-start-6 md:row-start-1'>
        <ul className='flex gap-x-3.5 md:gap-x-6'>
          {nav.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className='transition-colors duration-200 hover:text-muted aria-[current=page]:underline aria-[current=page]:decoration-1 aria-[current=page]:underline-offset-[0.25em]'
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Clock className='col-start-2 row-start-1 justify-self-end md:col-span-3 md:col-start-10' />
    </header>
  );
}
