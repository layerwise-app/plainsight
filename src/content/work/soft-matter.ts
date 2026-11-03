import { defineCaseStudy } from '~/content/define';
import { images } from './soft-matter/images';
import motion from './soft-matter/motion.mp4';

export default defineCaseStudy({
  name: 'Soft Matter',
  description: 'An identity and website for a studio that makes software feel physical.',
  disciplines: ['Identity', 'Website', 'WebGL'],
  client: 'Soft Matter',
  year: 2025,
  role: ['Identity', 'Website design', 'WebGL and front-end engineering'],
  team: ['Jonas Haugland', 'Ingrid Solberg', 'Mats Eide'],
  summary:
    'Soft Matter makes installations people touch. We gave the Copenhagen studio an identity built on one idea, two drops joining, and a website whose first screen is a piece of their work: wax, clay and glass drops you can push, drawn live by a 3 KB shader.',
  problem: [
    'Soft Matter is a studio of nine in Copenhagen. They make installations and interactive pieces for museums and brands: walls of water you push with your hands, shop windows where glazes melt as you walk past. Their website was a grid of video thumbnails on black. It weighed 38 MB, took four seconds to show anything on a phone, and looked like every other studio’s reel. After losing two pitches in 2024, a museum told them the site “didn’t feel like the thing you showed us in the room”.',
    'The brief was an identity and a site that behave like the work. Something to touch on the first screen, a mark that still reads at 9 pt in a museum’s exhibition credits, and a home page that runs on a procurement officer’s four-year-old laptop. It also had to be looked after by developers who write installation software in C++, not websites.'
  ],
  decisions: [
    {
      title: 'The first screen is a piece of work',
      body: 'We cut a showreel first. It was 14 MB and looked like everyone else’s. The home page is now a scene of soft drops you can push, raymarched in one fragment shader with no libraries. Only the box around the drops is raymarched; the floor, shadows and contact shading are worked out per drop, which keeps it at 60 fps on integrated graphics. Without WebGL, visitors see a still of the same scene.'
    },
    {
      title: 'Materials, not themes',
      body: 'Clay, wax and glass change how the drops look and how they move. Clay is heavy and slow to settle. Wax holds on to anything it touches. Glass springs back and keeps to itself. We dropped a dark mode early, because, as Freja Holm put it, no gallery has one. The same three presets now drive the studio’s installation toolkit, so the site and the work use the same words.'
    },
    {
      title: 'A mark that joins',
      body: 'The mark is two drops joined by a neck, drawn with the same smooth-minimum maths as the scene. It has three states, apart, touching and joined, and moves between them on a single spring. We drew a soft custom wordmark as well and threw it away: at the 9 pt size museums print credits, it read as a smudge. The wordmark is Unbounded, lowercase and tightly tracked.'
    },
    {
      title: 'Colour that survives shadow',
      body: 'We chose the palette under the scene’s light rather than on white paper. Grey shadows made the drops look like a product render, so the ambient light is lilac and every shadow on the cream floor stays coloured. Type is plum ink, #1D1530, never black, so text sits in the same light as the work.'
    },
    {
      title: 'Pages that load before you notice',
      body: 'Each case page leads with one still or one live scene, then the facts, then the story. Films load only when someone taps them. The home page went from 38 MB to 1.6 MB, and the shader that draws the scene is under 3 KB gzipped.'
    }
  ],
  outcome: [
    'The site launched in March 2025, a week before the open studio that introduced the identity. Over the next six months, the median visit to the home page went from 38 seconds to 2 minutes 10, and 41% of visitors pushed the drops at least once.',
    'New enquiries rose from about four a month to eleven, and two museum briefs since have named the site as the reason Soft Matter was asked to pitch. We handed the scene over as one documented component. Their developers have since added a fourth material, felt, without calling us.'
  ],
  cover: images.cover,
  coverAlt: 'A peach wax drop and a lilac one joined by a soft neck on a pale lilac floor, with smaller drops around them',
  motion: { src: motion },
  blocks: [
    {
      type: 'demo',
      load: () => import('./soft-matter/demo'),
      still: images.demo,
      alt: 'The Soft Matter playground: eight wax drops on a lilac floor, with controls for clay, wax and glass, and for pushing or pulling',
      aspect: 1376 / 760,
      aspectMobile: 0.62,
      background: '#D9CDF7',
      caption: 'The home page scene, running live. Each material changes how the drops look and how they move.',
      hint: 'Drag the floor, or focus it and use the arrow keys'
    },
    {
      type: 'text',
      heading: 'Built like an installation',
      body: [
        'Soft Matter’s installations run one loop, sixty times a second: sense, simulate, draw. We built the site the same way. A small spring simulation decides where every drop goes, and the shader only draws them. It never moves anything itself.',
        'That split made the scene easy to hand over. The studio’s developers tune springs as plain numbers in one file, and nobody has had to open the shader since launch.'
      ]
    },
    {
      type: 'image',
      image: images.home,
      alt: 'The Soft Matter home page in a browser: the headline “Software with a bit of give.” beside two joined drops, selected work below',
      caption: 'The home page. The scene is the hero, and the work starts one scroll down.'
    },
    {
      type: 'video',
      src: motion,
      poster: images.cover,
      alt: 'The peach and lilac drops part and join again in a six-second loop',
      caption: 'The campaign loop. Two drops part and join every six seconds, on the open studio screens and in social posts.'
    },
    {
      type: 'image',
      image: images.identity,
      alt: 'The identity sheet: the soft matter lockup, the mark apart, touching and joined, five colours, Unbounded and Manrope, and the three materials',
      caption: 'The identity on one sheet, down to how the wordmark sits in a 9 pt exhibition credit.'
    },
    {
      type: 'pair',
      images: [
        { image: images['poster-wax'], alt: 'An open studio poster: three wax drops in a chain on lilac, with the word wax set large' },
        { image: images['poster-glass'], alt: 'An open studio poster: glass drops casting coloured shadows on peach, with the word glass set large' }
      ],
      caption: 'Posters for the June open studio, one per room. Each shows the scene in that room’s material.'
    },
    {
      type: 'image',
      image: images['motion-guide'],
      alt: 'A page of the motion guidelines: the mark joining in seven frames above its spring curve, and four rules',
      caption: 'From the motion guidelines. The mark and every interface share one spring: stiffness 180, damping 17.'
    },
    {
      type: 'quote',
      text: 'Our old site showed videos of things you could touch. Now the first thing you do on it is touch something. Clients mention the drops before the work, and then they ask how we made them.',
      name: 'Freja Holm',
      role: 'Founder and creative director, Soft Matter'
    },
    {
      type: 'image',
      image: images.mobile,
      alt: 'Three phones: the home page with the scene and headline, the work index, and the Slow Tide case page on plum',
      caption: 'On a phone, each scene is recomposed for a tall frame rather than shrunk.'
    },
    {
      type: 'image',
      image: images.project,
      alt: 'The Slow Tide case page: title, six facts and a dusk scene of drops along a wall',
      caption: 'A case page: one image, the facts, then the story. The film loads only when tapped.'
    },
    {
      type: 'metrics',
      items: [
        { value: '2:10', label: 'median time on the home page, up from 0:38' },
        { value: '41%', label: 'of visitors push the drops at least once' },
        { value: '11', label: 'new enquiries a month, up from four' },
        { value: '1.6 MB', label: 'home page weight, down from 38 MB' }
      ],
      note: 'Soft Matter’s figures, March to August 2025.'
    }
  ]
});
