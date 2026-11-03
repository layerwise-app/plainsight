import { Link, createFileRoute, notFound } from '@tanstack/react-router';
import { Blocks } from '~/components/case/Blocks';
import { Picture } from '~/components/site/Picture';
import { WorkPiece } from '~/components/site/WorkPiece';
import { type Project, getNextProject, getProject } from '~/content';
import { site, siteUrl } from '~/lib/site';
import { coverScale, gridSizes } from '~/lib/sizes';
import { portfolio } from '~/portfolio.config';
import { seo } from '~/utils/seo';

export const Route = createFileRoute('/work/$slug')({
  loader: ({ params }) => {
    if (!getProject(params.slug)) throw notFound();
    return { slug: params.slug };
  },
  head: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) return seo({ title: `Not found — ${portfolio.name}`, noindex: true });
    const path = `/work/${project.slug}`;
    const image = project.cover.share ?? project.cover.src;
    return seo({
      title: `${project.name} — ${portfolio.name}`,
      description: project.summary,
      path,
      image,
      imageAlt: project.coverAlt,
      type: 'article',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.name,
        headline: `${project.name}: ${project.description}`,
        description: project.summary,
        url: siteUrl(path),
        image: siteUrl(image),
        dateCreated: String(project.year),
        genre: project.disciplines,
        creator: { '@type': 'Organization', name: site.name, url: siteUrl('/') },
        sourceOrganization: { '@type': 'Organization', name: project.client }
      }
    });
  },
  component: CaseStudyPage
});

function CaseStudyPage() {
  const { slug } = Route.useLoaderData();
  const project = getProject(slug) as Project;
  const next = getNextProject(slug);

  return (
    <article>
      <header className='grid grid-cols-1 px-page pt-[clamp(120px,22svh,260px)] md:grid-cols-12 md:gap-x-gutter'>
        <p className='text-ui text-muted md:col-span-12'>
          <Link to='/work' className='link'>
            Work
          </Link>{' '}
          / {project.year}
        </p>
        <h1 className='mt-5 text-statement md:col-span-12'>
          {project.name}
          <span className='block text-muted'>{project.description}</span>
        </h1>
        <dl className='mt-[clamp(40px,5vw,80px)] grid grid-cols-2 gap-x-gutter gap-y-5 text-caption md:col-span-12 md:grid-cols-12'>
          <Meta label='Client' className='md:col-span-3'>
            {project.client}
          </Meta>
          <Meta label='Year' className='md:col-span-1'>
            {project.year}
          </Meta>
          <Meta label='Role' className='md:col-span-4 md:col-start-5'>
            {project.role.join(', ')}
          </Meta>
          <Meta label='Team' className='col-span-2 md:col-span-4'>
            {project.team.join(', ')}
          </Meta>
        </dl>
      </header>

      <div className='mt-[clamp(40px,5vw,80px)] px-page'>
        <div className='relative aspect-[4/3] overflow-hidden bg-tint md:aspect-[2/1]'>
          <Picture
            image={project.cover}
            alt={project.coverAlt}
            sizes={gridSizes({
              crop: {
                base: coverScale(project.cover.width / project.cover.height, 4 / 3),
                md: coverScale(project.cover.width / project.cover.height, 2)
              }
            })}
            priority
            className='absolute inset-0 h-full object-cover'
          />
        </div>
      </div>

      <div className='flex flex-col gap-y-[clamp(48px,6vw,104px)] px-page py-[clamp(72px,9vw,168px)]'>
        <Section title='The brief'>
          {project.problem.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Section>
        <Section title='What we decided'>
          <ol className='space-y-[1.4em]'>
            {project.decisions.map((decision, index) => (
              <li key={decision.title} className='grid grid-cols-[2.2em_1fr]'>
                <span className='text-muted'>{index + 1}</span>
                <div>
                  <h3 className='font-medium'>{decision.title}</h3>
                  <p className='mt-1'>{decision.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>
        <Section title='What happened'>
          {project.outcome.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Section>
      </div>

      <Blocks blocks={project.blocks} />

      {next ? (
        <nav
          aria-label='Next project'
          className='mt-[clamp(96px,12vw,220px)] grid grid-cols-1 px-page pb-[clamp(96px,12vw,200px)] md:grid-cols-12 md:gap-x-gutter'
        >
          <p className='mb-4 text-ui text-muted md:col-span-12'>Next project</p>
          <WorkPiece
            project={next}
            aspect={4 / 3}
            columns={6}
            className='md:col-span-6'
            headingLevel='h2'
          />
        </nav>
      ) : null}
    </article>
  );
}

function Meta({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <dt className='text-muted'>{label}</dt>
      <dd className='mt-1 text-pretty'>{children}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className='grid grid-cols-1 gap-y-4 md:grid-cols-12 md:gap-x-gutter'>
      <h2 className='text-caption font-medium md:col-span-3'>{title}</h2>
      <div className='max-w-[62ch] space-y-[0.9em] text-pretty text-prose md:col-span-7 md:col-start-5'>
        {children}
      </div>
    </section>
  );
}
