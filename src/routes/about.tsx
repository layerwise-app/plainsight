import { createFileRoute } from '@tanstack/react-router';
import type * as React from 'react';
import { organizationJsonLd } from '~/lib/structured-data';
import { portfolio } from '~/portfolio.config';
import { seo } from '~/utils/seo';

export const Route = createFileRoute('/about')({
  head: () =>
    seo({
      title: `About — ${portfolio.name}`,
      description: `${portfolio.name} is ${portfolio.team.length} people in ${portfolio.location.city} who design and build products, identities and websites. Services, experience and clients.`,
      path: '/about',
      jsonLd: organizationJsonLd()
    }),
  component: AboutPage
});

function AboutPage() {
  const [lead, ...rest] = portfolio.bio;
  return (
    <div className='px-page pt-[clamp(120px,22svh,260px)] pb-[clamp(96px,12vw,200px)]'>
      <div className='grid grid-cols-1 md:grid-cols-12 md:gap-x-gutter'>
        <h1 className='text-statement md:col-span-3'>About</h1>
        <p className='mt-3 text-pretty text-statement md:col-span-8 md:col-start-5 md:mt-0'>{lead}</p>
      </div>

      <div className='mt-[clamp(72px,10vw,176px)] flex flex-col gap-y-[clamp(56px,7vw,112px)]'>
        <Section title='The studio'>
          <div className='max-w-[62ch] space-y-[0.9em] text-prose'>
            {rest.map((paragraph) => (
              <p key={paragraph} className='text-pretty'>
                {paragraph}
              </p>
            ))}
          </div>
          <ul className='mt-10 grid grid-cols-2 gap-x-gutter gap-y-4 text-caption md:grid-cols-4'>
            {portfolio.team.map((person) => (
              <li key={person.name}>
                {person.name}
                <span className='block text-muted'>{person.role}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title='Services'>
          <ul className='grid grid-cols-1 gap-x-gutter gap-y-8 md:grid-cols-2'>
            {portfolio.services.map((service) => (
              <li key={service.name} className='text-caption'>
                <h3 className='font-medium'>{service.name}</h3>
                <p className='mt-1 max-w-[44ch] text-pretty text-muted'>{service.detail}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title='Experience'>
          <ol className='border-b border-line text-caption'>
            {portfolio.experience.map((item) => (
              <li
                key={item.years + item.title}
                className='grid grid-cols-[72px_1fr] gap-x-4 border-t border-line py-3.5 md:grid-cols-[96px_1fr_1.4fr] md:gap-x-gutter'
              >
                <span className='text-muted'>{item.years}</span>
                <span>{item.title}</span>
                <span className='col-start-2 text-muted md:col-start-auto'>{item.detail}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section title='Selected clients'>
          <ul className='columns-2 gap-x-gutter text-caption md:columns-3'>
            {portfolio.clients.map((client) => (
              <li key={client} className='break-inside-avoid pb-1.5'>
                {client}
              </li>
            ))}
          </ul>
        </Section>

        <Section title='CV'>
          <a href={portfolio.cv.href} download className='link text-prose'>
            Download {portfolio.cv.label}
          </a>
          <span className='ml-3 text-caption text-muted'>{portfolio.cv.size}</span>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className='grid grid-cols-1 gap-y-5 md:grid-cols-12 md:gap-x-gutter'>
      <h2 className='text-caption font-medium md:col-span-3'>{title}</h2>
      <div className='md:col-span-8 md:col-start-5'>{children}</div>
    </section>
  );
}
