import { defineCaseStudy } from '~/content/define';
import { images } from './grums/images';
import motion from './grums/motion.mp4';

export default defineCaseStudy({
  name: 'Grums',
  description: 'A coffee subscription that sends what you’ll actually drink.',
  disciplines: ['Identity', 'Packaging', 'E-commerce'],
  client: 'Grums Kaffe AS',
  year: 2024,
  role: ['Brand identity', 'Packaging system', 'Shop and subscription design', 'Front-end engineering'],
  team: ['Ingrid Solberg', 'Jonas Haugland', 'Mats Eide'],
  summary:
    'Grums is a small roastery in Trondheim that sells most of its coffee by subscription. We redrew the brand and its bags around the roast date, and rebuilt the subscription so it works out how much to send from how a household drinks.',
  problem: [
    'Grums Kaffe roasts about 900 kg a week in a former bakery in Svartlamon, Trondheim, and two thirds of it goes out by subscription. Until 2023 the subscription had two settings: 250 g or 500 g, every two weeks. Subscribers either ran out by day ten or found three unopened bags in the cupboard. Both groups cancelled, and the average subscription lasted four and a half months.',
    'The owners asked for a brand that looked as careful as the coffee, and a subscription people would keep without a discount code. It turned out to be one brief. The bag had to say when the coffee was roasted, and the shop had to send the right amount of it.'
  ],
  decisions: [
    {
      title: 'The roast date is the biggest thing on the bag',
      body: 'Coffee is at its best from about four days to four weeks after roasting, and the customers who care most look for the date first. So the date gets the space most brands give their logo: the day in Fraunces Black, the month beside it, on a cream label printed from the roast log. We tried a best-before date first. In testing, people read it as a deadline and threw out coffee that was still good.'
    },
    {
      title: 'Colour means roast, not origin',
      body: 'Grums changes its single origins every six to eight weeks, so a colour per country would have meant new bags every quarter. Instead the bag is the roast: kraft for light, tomato for medium, espresso for dark, green for decaf and seasonal blends. That is four printed bag stocks, and one label printed in the roastery on roasting day.'
    },
    {
      title: 'The subscription sizes itself',
      body: 'Instead of choosing a bag, you answer four questions: cups a day, how many of you, how you brew and which roast. The shop works out grams a week, then picks the bag and the number of weeks between deliveries that finish each bag inside three weeks. Our first prototype asked for grams directly. Nobody knew.'
    },
    {
      title: 'Skip or nudge by text',
      body: 'Two days before each roast, subscribers get a text saying what is coming and when. Reply SKIP to move the delivery, or LATER to push it a week. The same two choices sit on the account page, two taps from the home screen. We built an app prototype first; 14 of 200 testers installed it.'
    },
    {
      title: 'A soft serif you can read at seven in the morning',
      body: 'Fraunces carries the name, the dates and the coffee names, with its Soft and Wonk axes turned up so the labels look stamped rather than typeset. Work Sans does everything else, from brew guides to the checkout. Nothing on a bag is set below 7 pt, because people read them with wet hands.'
    }
  ],
  outcome: [
    'The new bags and the subscription launched in March 2024. By October the average subscription had run 9.1 months, against 4.5 before. Fewer than one cancellation in five now gives too much or too little coffee as the reason, down from three in five.',
    'We built the shop in React on Grums’s existing order system. The label template prints from the roast log on a thermal printer beside the roaster, so the date on every bag is set by roasting it, and nobody types it.'
  ],
  cover: images.cover,
  coverAlt: 'Four Grums coffee bags in kraft, green, tomato and espresso on a terracotta table in low morning sun, beside a cup of coffee',
  motion: { src: motion },
  blocks: [
    {
      type: 'demo',
      load: () => import('./grums/demo'),
      still: images.demo,
      alt: 'The subscription builder: four questions on the left, and on the right the plan it gives, 1 kg every two weeks, with the next three roast dates',
      aspect: 1376 / 770,
      aspectMobile: 0.5,
      background: '#F3EBDC',
      caption: 'The subscription builder, running as it does in the shop. Change an answer and the bag, the rhythm and the price follow.',
      hint: 'Use − and +, or Tab to a choice and use the arrow keys'
    },
    {
      type: 'text',
      heading: 'Six weeks of cupboards',
      body: [
        'We asked 140 subscribers to photograph their coffee shelf every Sunday for six weeks. The pictures told the story the cancellations had, from the other side. Households of two with a cafetière drank nearly twice what they ordered. People living alone with an espresso machine drank about half.',
        'Taste had little to do with it. Brew method and headcount did, and the old shop asked about neither. They became the questions in the builder above, and the reason the plan is shown in grams and days rather than in bags.'
      ]
    },
    {
      type: 'image',
      image: images.shop,
      alt: 'The Grums shop front page in a browser: the headline “Coffee in the amount you drink.”, a tomato panel with two bags, and this week’s four coffees with their roast dates',
      caption: 'The shop’s front page. Every coffee shows the day it was roasted, never a best-before.'
    },
    {
      type: 'video',
      src: motion,
      poster: images.cover,
      alt: 'Four Grums bags and a cup of coffee on a terracotta table, their shadows moving slowly as the sun climbs',
      caption: 'The four roasts, one colour each: kraft is light, tomato medium, espresso dark and green decaf.'
    },
    {
      type: 'image',
      image: images.labels,
      alt: 'The label system sheet: a large label with numbered notes on the roast date, origin, roast and brew guide, the four bag colours, and November’s roast days',
      caption: 'The label system. One template for every coffee, printed from the roast log at the end of each batch.'
    },
    {
      type: 'pair',
      images: [
        {
          image: images['next-bag'],
          alt: 'A phone showing the next bag, roasted 18 November, with Skip and Nudge buttons and Nudge open on “A week later”'
        },
        {
          image: images.sms,
          alt: 'A text thread with Grums: the reminder, the reply LATER, and the confirmation of the new dates'
        }
      ],
      caption: 'Moving a delivery, on the account page and by text. Both take two steps, and both move the bag after it too.'
    },
    {
      type: 'quote',
      text: 'We used to win people back with discount codes. Now they don’t leave. The bag is the size they drink, and when life gets in the way they reply to a text.',
      name: 'Hanne Grøtte',
      role: 'Co-founder and head roaster, Grums Kaffe'
    },
    {
      type: 'image',
      image: images.subscribe,
      alt: 'The subscription page: three steps explained above the builder, set for one person drinking two mugs of filter a day',
      caption: 'The subscription page. One person, two mugs of filter a day: 500 g every two weeks, at 9,27 kr a cup.'
    },
    {
      type: 'image',
      image: images.letterbox,
      alt: 'An opened Grums letterbox box from above: the printed lid, a 500 g bag in the tray, a brew card for the cafetière, and a closed box with its Posten label',
      caption: 'The letterbox box. The lid says when the next bag comes; the card says how to brew this one.'
    },
    {
      type: 'metrics',
      items: [
        { value: '9.1 months', label: 'average subscription length, up from 4.5' },
        { value: '18%', label: 'of cancellations blame too much or too little coffee, down from 61%' },
        { value: '54%', label: 'of skips and nudges now made by replying to a text' },
        { value: '3,120', label: 'active subscribers in October, up from 1,840 at launch' }
      ],
      note: 'Grums Kaffe’s figures, March to October 2024.'
    }
  ]
});
