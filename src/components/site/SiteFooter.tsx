import { portfolio } from '~/portfolio.config';

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className='flex min-h-[100svh] flex-col justify-between bg-footer px-page pt-[clamp(96px,22svh,240px)] pb-5 text-footer-ink md:pb-6'>
      <div>
        <p className='max-w-[24ch] text-statement'>{portfolio.footerLine}</p>
        <a
          href={`mailto:${portfolio.email}`}
          className='link mt-[0.35em] inline-block text-[clamp(30px,8.1vw,152px)] leading-[1] tracking-[-0.05em] decoration-[0.04em] underline-offset-[0.12em]'
        >
          {portfolio.email}
        </a>
      </div>
      <div className='mt-24 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 text-ui text-footer-muted'>
        <p>
          {portfolio.name}, {portfolio.location.city} © {year}
        </p>
        <ul className='flex flex-wrap gap-x-5 gap-y-1'>
          {portfolio.socials.map((social) => (
            <li key={social.label}>
              <a href={social.href} className='link' rel='me noopener' target='_blank'>
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
