import { createFileRoute } from '@tanstack/react-router';
import { Clock } from '~/components/site/Clock';
import { ContactForm } from '~/components/site/ContactForm';
import { portfolio } from '~/portfolio.config';
import { seo } from '~/utils/seo';

export const Route = createFileRoute('/contact')({
  head: () =>
    seo({
      title: `Contact — ${portfolio.name}`,
      description: `Write to ${portfolio.name} about a product, an identity or a website. We reply within two working days.`,
      path: '/contact'
    }),
  component: ContactPage
});

function ContactPage() {
  return (
    <section className='grid grid-cols-1 gap-y-16 px-page pt-[clamp(120px,22svh,260px)] pb-[clamp(96px,12vw,200px)] md:grid-cols-12 md:gap-x-gutter'>
      <div className='md:col-span-5'>
        <h1 className='max-w-[16ch] text-statement'>Tell us what you’re making.</h1>
        <p className='mt-6 max-w-[40ch] text-prose text-muted'>
          We take on four or five projects a year and reply to every message within two working days.
          A few sentences about the problem is plenty.
        </p>

        <dl className='mt-12 grid grid-cols-2 gap-x-gutter gap-y-6 text-caption md:mt-16'>
          <div className='col-span-2'>
            <dt className='text-muted'>Email</dt>
            <dd className='mt-1'>
              <a href={`mailto:${portfolio.email}`} className='link'>
                {portfolio.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className='text-muted'>Studio</dt>
            <dd className='mt-1'>
              Grünerløkka, {portfolio.location.city}
              <br />
              {portfolio.location.country}
            </dd>
          </div>
          <div>
            <dt className='text-muted'>Right now</dt>
            <dd className='mt-1'>
              <Clock />
            </dd>
          </div>
          <div className='col-span-2'>
            <dt className='text-muted'>Elsewhere</dt>
            <dd className='mt-1'>
              <ul className='flex flex-wrap gap-x-5 gap-y-1'>
                {portfolio.socials.map((social) => (
                  <li key={social.label}>
                    <a href={social.href} className='link' rel='me noopener' target='_blank'>
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>

      <div className='relative md:col-span-6 md:col-start-7'>
        <ContactForm />
      </div>
    </section>
  );
}
