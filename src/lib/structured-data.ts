import { site, siteUrl } from '~/lib/site';
import { portfolio } from '~/portfolio.config';

/** schema.org Organization for the studio, shown on Home and About. */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl('/')}#studio`,
    name: portfolio.name,
    description: site.description,
    url: siteUrl('/'),
    logo: siteUrl('/logo.png'),
    image: siteUrl(site.image),
    email: portfolio.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: portfolio.location.city,
      addressCountry: portfolio.location.country
    },
    numberOfEmployees: { '@type': 'QuantitativeValue', value: portfolio.team.length },
    member: portfolio.team.map((person) => ({
      '@type': 'Person',
      name: person.name,
      jobTitle: person.role
    })),
    knowsAbout: portfolio.services.map((service) => service.name),
    sameAs: portfolio.socials.map((social) => social.href)
  };
}
