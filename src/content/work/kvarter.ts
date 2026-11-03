import { defineCaseStudy } from '~/content/define';
import { images } from './kvarter/images';
import motion from './kvarter/motion.mp4';
import motionTall from './kvarter/motion-tall.mp4';

export default defineCaseStudy({
  name: 'Kvarter',
  description: 'A housing co-op’s noticeboard, bookings and meetings in one app.',
  disciplines: ['Product design', 'Identity'],
  client: 'Kvarter AS',
  year: 2025,
  role: ['Product design', 'Identity', 'Illustration', 'Front-end engineering'],
  team: ['Selma Varga', 'Ingrid Solberg', 'Mats Eide'],
  summary:
    'Kvarter runs the shared life of Norwegian housing co-ops. We designed the app residents use for notices, bookings, faults and the annual vote, and an identity drawn from the buildings they live in.',
  problem: [
    'Kvarter AS is an Oslo startup that makes software for borettslag, the resident-owned housing co-ops of 40 to 400 flats found on almost every street in the city. In 2024 a typical co-op still ran on a cork board by each entrance, a paper sheet on the laundry room door, a spreadsheet on the chair’s laptop and an annual meeting that a third of the flats attended.',
    'Kvarter had a booking tool used by nine co-ops. The brief was one app a whole co-op would open every week: notices from styret, the board, plus shared spaces, fault reports and the annual vote. It had to work for a student renting a room and for a widow who has lived in the same flat since 1962, and it could not leave out the flats that would never install it.'
  ],
  decisions: [
    {
      title: 'Flat numbers first, names by choice',
      body: 'Everyone appears by flat number, H0204, unless they choose to show a name. We tested names by default with two co-ops, and four residents in ten switched them off within a week. Several said they did not want neighbours counting how often they did laundry. Flat numbers are what people already wrote on the paper sheet, so nobody had to learn anything new.'
    },
    {
      title: 'Styret’s notices and neighbours’ posts live apart',
      body: 'The cork board put a water shut-off next to a lost cat and last winter’s Christmas tree collection. Our first prototype kept that in a single feed, and in testing half the residents scrolled past the shut-off. Now notices from styret sit in their own list, set in brick, pinned while they matter and taken down when they are over. Everything else goes on the neighbours’ noticeboard.'
    },
    {
      title: 'Styret posts once, and every flat hears',
      body: 'About one flat in five in the pilot co-ops would never install an app. Rather than chase them, a notice goes out three ways from the same form: as a notification, as a text to the flats that asked for one, and as an A4 sheet for each stairwell, ready to print. The paper is part of the product, not a fallback.'
    },
    {
      title: 'The booking sheet keeps the house rules',
      body: 'Rules used to be taped to the laundry room door and argued about on the stairs. In Kvarter they are part of the grid: two hours a day per flat, three nights in the guest flat, closed while the water is off. When the app says no, it says why in one sentence. We tried having styret approve bookings instead; no chair wanted that job.'
    },
    {
      title: 'An identity taken from the buildings',
      body: 'The colours come from a 1962 brick block at dusk, and each has one job: brick is styret, moss is yours, window yellow is new. Fault categories are drawings rather than photos, so reporting a broken light takes two taps and nobody has to photograph their landing. The mark is four windows with one lit.'
    }
  ],
  outcome: [
    'Kvarter launched the app in 14 co-ops in January 2026, 2,310 flats in all, and has signed 31 more since. Fjellhagen, the 64-flat pilot on the cover, held its first annual meeting with digital voting in May: 58 flats voted, against 23 the year before.',
    'We built the interface in React with Kvarter’s two engineers and handed over the identity, the illustration set and the component library in November 2025. They have since added the party room and a key register using the same parts.'
  ],
  cover: images.cover,
  coverAlt: 'A 1962 brick housing block at dusk with windows lit and a birch in front, and Kvarter’s home feed on a phone',
  coverTall: images['cover-tall'],
  motion: { src: motion, tall: motionTall },
  blocks: [
    {
      type: 'demo',
      load: () => import('./kvarter/demo'),
      still: images.demo,
      alt: 'The booking week for Laundry room 1: neighbours’ hours by flat number, a closed morning while the water is off, and your booking on Saturday',
      aspect: 1376 / 700,
      aspectMobile: 0.32,
      background: '#F3ECE1',
      caption: 'The booking sheet, running on a sample week at Fjellhagen. Book, cancel, and try to break the house rules.',
      hint: 'Click or tap a slot, or use the arrow keys and Enter'
    },
    {
      type: 'beforeAfter',
      before: {
        image: images.before,
        alt: 'Before: the cork board by the entrance of number 12, with a water shut-off, a dugnad sign-up, a lost cat and last winter’s Christmas tree notice'
      },
      after: {
        image: images.after,
        alt: 'After: the same wall with the board gone, and the same notices as two lists in the app, one from styret and one from neighbours'
      },
      caption: 'One week of notices at number 12, on the cork board and in Kvarter. Drag the divide, or focus it and use the arrow keys.'
    },
    {
      type: 'text',
      heading: 'Standing in the stairwell',
      body: [
        'We started by photographing the noticeboards of 22 co-ops in Oslo and Bærum. On the average board, 4 of 11 notes had expired, and the one that mattered most that week was rarely on top.',
        'Then we sat in on three board meetings. One chair spent two evenings a month settling laundry disputes by text. Most of the product came from those two places: the board by the door and the chair’s phone.'
      ]
    },
    {
      type: 'image',
      image: images.notices,
      alt: 'Three phone screens: the home feed with a pinned notice from styret, the water shut-off notice with how many flats have read it, and the dugnad sign-up',
      caption: 'Home, a notice from styret and the spring dugnad. Brick is only ever used for styret.'
    },
    {
      type: 'image',
      image: images.meeting,
      alt: 'Three phone screens: proposal 4 on charging points in the garage, the vote with For selected, and the result, adopted with 41 for and 14 against',
      caption: 'The annual meeting. Each flat has one secret vote, cast from home or in the room, and the result shows the two-thirds line it had to cross.'
    },
    {
      type: 'quote',
      text: 'I used to run the laundry room by text message. Now the sheet says no for me, and it says it more politely than I did.',
      name: 'Tone Bakke',
      role: 'Chair of styret, Fjellhagen borettslag'
    },
    {
      type: 'image',
      image: images.faults,
      alt: 'Two phone screens: nine drawn categories for reporting a fault, and a fixed fault with its four steps from report to repair',
      caption: 'Reporting a fault. Three reports of the same broken light became one job for the caretaker.'
    },
    {
      type: 'pair',
      images: [
        {
          image: images.directory,
          alt: 'The neighbours directory for number 12: most flats shown by number, one by name with a styret tag'
        },
        {
          image: images.privacy,
          alt: 'Privacy settings: flat number only, first name, or full name, with a laundry booking shown as neighbours see it'
        }
      ],
      caption: 'Flat number is the default everywhere. A name is something you choose to show.'
    },
    {
      type: 'image',
      image: images.admin,
      alt: 'Styret’s web view: a new notice about the water shut-off that closes the laundry rooms and reaches 52 flats in the app, 3 by text and 9 on paper',
      caption: 'Styret’s side. One notice reaches every flat: in the app, by text, or on a printed sheet for the stairwell.'
    },
    {
      type: 'metrics',
      items: [
        { value: '58 of 64', label: 'flats voted at Fjellhagen’s annual meeting, up from 23 the year before' },
        { value: '81%', label: 'of flats in the first 14 co-ops open the app at least once a week' },
        { value: '2 h', label: 'median time for styret to see a fault report, down from four days by email' },
        { value: '45', label: 'co-ops on Kvarter, from 14 at launch' }
      ],
      note: 'Kvarter’s figures, January to October 2026.'
    },
    {
      type: 'image',
      image: images.onboarding,
      alt: 'Two phone screens: entering flat number H0204 under a drawing of the flat door, and waiting for styret to confirm against the share register',
      caption: 'Joining. Styret checks each flat against the share register, or the resident types the code from a letter in their postbox.'
    },
    {
      type: 'image',
      image: images.system,
      alt: 'Kvarter’s identity: the four-window mark, five colours with one meaning each, Bricolage Grotesque in two widths, and the drawn fault categories',
      caption: 'Part of the identity and interface kit we handed over.',
      inset: true
    }
  ]
});
