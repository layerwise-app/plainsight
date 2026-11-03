import { defineCaseStudy } from '~/content/define';
import { images } from './marmor/images';
import motion from './marmor/motion.mp4';
import motionTall from './marmor/motion-tall.mp4';

export default defineCaseStudy({
  name: 'Marmor',
  description: 'An identity for a 1930s cinema that shows forty films a month.',
  disciplines: ['Identity', 'Posters', 'Website'],
  client: 'Marmor Kino',
  year: 2024,
  role: ['Identity', 'Poster system', 'Website and tickets', 'Poster maker'],
  team: ['Ingrid Solberg', 'Selma Varga', 'Mats Eide'],
  summary:
    'Marmor Kino is a two-screen art house cinema in a 1938 marble building in Bergen. We gave it one rule for type, one colour a month and a poster maker its own staff use for all forty films.',
  problem: [
    'Marmor Kino opened in 1938 in a marble-clad building on Olav Kyrres gate in Bergen. It has two screens, of 226 and 58 seats, and shows about forty films a month: new releases, a retrospective, children’s matinées and the odd silent film with a pianist.',
    'Until 2024 it had a gold serif logo, a navy programme sheet and posters made from whatever template came to hand. A freelance designer charged per poster, so eight of the forty films got one. The rest were a line on the sheet.',
    'The brief was an identity the cinema could run by itself, every month, with no designer in the building. Five people work front of house. None of them use design software, and the posters go to the printer on a Wednesday.'
  ],
  decisions: [
    {
      title: 'The title fills the width, every line',
      body: 'Every title is set in Archivo at 62.5% width, and each line is sized to fill the measure exactly. FERRO runs one line with capitals 19 cm tall; A Winter in Tbilisi breaks into two lines of 12.6 and 13.2 cm. We tried a fixed size first. Long titles ran to four lines and short ones looked lost. The rule keeps forty posters a month related without making them alike.'
    },
    {
      title: 'One colour a month',
      body: 'Each month has a colour, chosen with the season’s programme: oxblood for November, spruce for December, signal yellow for January. Posters, facade cases, booklet and website all change on the first. We tried a colour per film and a colour per genre. Forty colours read as noise, and the staff argued about genres. Type is black or marble, whichever has more contrast.'
    },
    {
      title: 'An M taken from the building',
      body: 'The logotype is one line traced from a vein in the Fauske marble on the stair landing. It is drawn, not set, so it never sits quite level. We rejected film reels, projector beams and anything with sprocket holes. The building was the one thing no other cinema in Bergen had.'
    },
    {
      title: 'Times in mono, in the same place',
      body: 'Dates, times and screens are set in Fragment Mono on a four-column grid that never moves. Someone scanning a wall of posters finds “fre 15.11 18:30 Sal 1” in the same corner every time. The website, the tickets and the booklet use the same grid and the same abbreviations.'
    },
    {
      title: 'The staff make the posters',
      body: 'Mats built a poster maker that runs in the browser. Staff type the title, director, dates and month, and it sets the poster, the 6 × 3 m billboard and the ticket together, then exports print files. It knows the width of every letter, so a title is fitted before anyone adjusts it. A film takes about ten minutes.'
    }
  ],
  outcome: [
    'The identity went up on 1 September 2024 with the autumn season. Every film now gets a poster, forty or so a month, and each month’s set goes to the printer in one batch.',
    'We built the website and the ticket screens with the cinema’s booking provider, then handed over the poster maker, the type rules and the season’s colours in October. Marmor chose the colours for 2025–26 itself.'
  ],
  cover: images.cover,
  coverAlt: 'A six by three metre Kveldssol poster pasted on a cast concrete wall in late afternoon sun',
  coverTall: images['cover-tall'],
  motion: { src: motion, tall: motionTall },
  blocks: [
    {
      type: 'demo',
      load: () => import('./marmor/demo'),
      still: images.demo,
      alt: 'The poster maker: a form for the film beside the poster, billboard and ticket it sets',
      aspect: 1376 / 760,
      aspectMobile: 0.19,
      background: '#F1EEE7',
      caption: 'The poster maker the front-of-house staff use. Change the title and every line is refitted on the poster, the billboard and the ticket.',
      hint: 'Pick an example or type a title. A / forces a line break.'
    },
    {
      type: 'beforeAfter',
      before: {
        image: images.before,
        alt: 'Before: a navy programme sheet with a gold serif logo, and a sunset-gradient film poster, in the facade cases'
      },
      after: {
        image: images.after,
        alt: 'After: the November running order under NOVEMBER in oxblood, and the Kveldssol poster, in the same cases'
      },
      caption: 'November’s programme and premiere in the facade cases, set in the old templates and in the new system.'
    },
    {
      type: 'text',
      heading: 'Fitting the title',
      body: [
        'We set the first posters by hand, nudging each line until it touched both margins. It took twenty minutes a title and only we could do it. So we wrote the rule down: measure the line, divide the width by it, and that is the size.',
        'Line breaks come from the same sum. The poster maker tries every way of breaking a title, drops any that leave a one- or two-letter word on its own line, and keeps the one whose smallest line is largest. Staff can still force a break with a slash.'
      ]
    },
    {
      type: 'image',
      image: images.posters,
      alt: 'Three November posters: The Glass Orchard on two lines, Ferro on one, A Winter in Tbilisi on two',
      caption: 'Three films from November. One colour and one grid; the title decides the rest.'
    },
    {
      type: 'pair',
      images: [
        { image: images.signage, alt: 'Black enamel signs for Sal 1 and Sal 2 on the white marble of the foyer' },
        { image: images.tote, alt: 'A canvas tote printed with the vein M, with tickets for Kveldssol and Long Light on top' }
      ],
      caption: 'Wayfinding on the foyer marble, and the tote sold at the box office.'
    },
    {
      type: 'image',
      image: images.website,
      alt: 'The programme page: November in oxblood beside the evening’s screenings with times, screens and ticket status',
      caption: 'marmorkino.no. The month sits on the left in its colour; each evening’s screenings run down the right.'
    },
    {
      type: 'image',
      image: images.tickets,
      alt: 'Three phone screens: the Kveldssol film page, a seat map of Sal 1 with two seats chosen, and the ticket',
      caption: 'Two seats for the premiere. The ticket is the poster again, at the size of a phone.'
    },
    {
      type: 'quote',
      text: 'We used to choose which eight films got a poster. Now every film has one by Wednesday, and the person who booked the film makes it.',
      name: 'Signe Dahl',
      role: 'Director, Marmor Kino'
    },
    {
      type: 'metrics',
      items: [
        { value: '41', label: 'films with their own poster in November 2024, up from eight a month' },
        { value: '11 min', label: 'median time to make a poster, billboard and ticket' },
        { value: '+34%', label: 'tickets sold online, autumn 2024 against autumn 2023' },
        { value: '2,480', label: 'members in March 2025, up from 1,910 a year earlier' }
      ],
      note: 'Marmor Kino’s figures, September 2024 to March 2025.'
    },
    {
      type: 'image',
      image: images.booklet,
      alt: 'The November booklet open at week 46: the week’s screenings on the left, Kveldssol on the right',
      caption: 'The monthly booklet, printed in black and the month’s colour, open at the week of the premiere.'
    },
    {
      type: 'image',
      image: images.system,
      alt: 'The identity sheet: the vein M, the twelve colours of the 2024–25 season, and three titles each filling the same width',
      caption: 'The identity on one sheet, as we handed it over.',
      inset: true
    }
  ]
});
