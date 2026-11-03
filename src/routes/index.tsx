import { Link, createFileRoute } from '@tanstack/react-router';
import { WorkWall } from '~/components/site/WorkWall';
import { projects } from '~/content';
import { site } from '~/lib/site';
import { organizationJsonLd } from '~/lib/structured-data';
import { portfolio } from '~/portfolio.config';
import { seo } from '~/utils/seo';

export const Route = createFileRoute('/')({
  head: () =>
    seo({
      title: `${portfolio.name}, design and engineering studio in ${portfolio.location.city}`,
      description: site.description,
      path: '/',
      jsonLd: organizationJsonLd()
    }),
  component: Home
});

function Home() {
  return (
    <>
      <section className='grid grid-cols-1 px-page pt-[clamp(132px,30svh,320px)] pb-[clamp(72px,11vw,168px)] md:grid-cols-12 md:gap-x-gutter'>
        <h1 className='text-pretty text-statement md:col-span-10 lg:col-span-9'>
          {portfolio.statement}
        </h1>
        <p className='mt-7 flex gap-x-7 text-ui md:col-span-12 md:mt-9'>
          <Link to='/work' className='link'>
            All work ({projects.length})
          </Link>
          <Link to='/contact' className='link'>
            Start a project
          </Link>
        </p>
      </section>
      <h2 className='sr-only'>Selected work</h2>
      <WorkWall />
      <div className='h-[clamp(96px,14vw,220px)]' />
    </>
  );
}
