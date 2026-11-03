import { Link, createFileRoute } from '@tanstack/react-router';
import { Picture } from '~/components/site/Picture';
import { projects } from '~/content';
import { gridSizes } from '~/lib/sizes';
import { portfolio } from '~/portfolio.config';
import { seo } from '~/utils/seo';

export const Route = createFileRoute('/work/')({
  head: () =>
    seo({
      title: `Work — ${portfolio.name}`,
      description: `Every case study by ${portfolio.name}: ${projects
        .slice(0, 4)
        .map((project) => project.name)
        .join(', ')} and more, with the decisions behind them.`,
      path: '/work'
    }),
  component: WorkIndex
});

const pad = (n: number) => String(n).padStart(2, '0');

function WorkIndex() {
  const years = projects.map((project) => project.year);
  const span = years.length ? `${Math.min(...years)} to ${Math.max(...years)}` : '';

  return (
    <section className='px-page pt-[clamp(120px,22svh,260px)] pb-[clamp(96px,12vw,200px)]'>
      <div className='grid grid-cols-1 md:grid-cols-12 md:gap-x-gutter'>
        <h1 className='text-statement md:col-span-3'>Work</h1>
        <p className='mt-3 max-w-[36ch] text-statement text-muted md:col-span-8 md:col-start-5 md:mt-0'>
          {projects.length} projects from {span}, each designed and built in the studio.
        </p>
      </div>

      <ol className='mt-[clamp(64px,9vw,140px)] border-b border-line'>
        {projects.map((project, index) => (
          <li key={project.slug} className='border-t border-line'>
            <Link
              to='/work/$slug'
              params={{ slug: project.slug }}
              className='group grid grid-cols-[88px_1fr] items-start gap-x-4 py-4 text-caption md:grid-cols-12 md:gap-x-gutter md:py-5'
            >
              <div className='relative aspect-[3/2] overflow-hidden bg-tint md:order-last md:col-span-2 md:col-start-11'>
                <Picture
                  image={project.cover}
                  alt=''
                  sizes={gridSizes({ md: 2, base: '88px' })}
                  className='absolute inset-0 h-full object-cover'
                />
              </div>
              <div className='contents max-md:block'>
                <p className='text-muted tabular-nums md:col-span-1'>{pad(index + 1)}</p>
                <h2 className='font-medium md:col-span-2 max-md:mt-0.5'>
                  <span className='link decoration-transparent group-hover:decoration-current'>
                    {project.name}
                  </span>
                </h2>
                <p className='text-pretty md:col-span-4'>{project.description}</p>
                <p className='text-muted md:col-span-2 max-md:mt-1.5'>
                  {project.disciplines.join(', ')}
                </p>
                <p className='text-muted tabular-nums max-md:hidden md:col-span-1'>{project.year}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
