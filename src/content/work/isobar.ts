import { defineCaseStudy } from '~/content/define';
import { images } from './isobar/images';
import motion from './isobar/motion.mp4';
import motionTall from './isobar/motion-tall.mp4';

export default defineCaseStudy({
  name: 'Isobar',
  description: 'Climate data that a planning office can act on.',
  disciplines: ['Data visualisation', 'Product design'],
  client: 'Isobar Climate',
  year: 2025,
  role: ['Product design', 'Data visualisation', 'Front-end engineering'],
  team: ['Selma Varga', 'Mats Eide', 'Jonas Haugland'],
  summary:
    'Isobar Climate supplies downscaled climate data to Norwegian municipalities. We designed the product their planners and engineers use to see how their own municipality is changing, compare scenarios for 2050 and 2100, and take a plain-language report to council.',
  problem: [
    'Isobar Climate is a non-profit of nine people in Bergen. It turns ten regional climate models into 1 km grids for Norwegian municipalities: temperature, heavy rain and snow, back to 1961 and forward to 2100. Until 2024 it sent them out as data files and a 60-page PDF per municipality.',
    'The people who need the numbers are planners deciding where to build and engineers sizing drains. Few had ever opened the files. Every autumn, before the budget round, they emailed Isobar the same three questions: how much has it changed here, how much will it change, and what should we plan for.',
    'The brief was one product that answers those questions for your own municipality, and hands you something a council can read in the five minutes it gives each item. It had to work on a projector in a bright room and on paper.'
  ],
  decisions: [
    {
      title: 'Keep 1961–1990 as the normal',
      body: 'Climate services have moved to 1991–2020 as the standard normal. We tested both with eight planners. Against the newer normal, 2025 looked half a degree warm, and two of the eight read that as “not much has changed”. Against 1961–1990 it is 1.5 °C. We kept the older normal everywhere, and every chart says which one it uses.'
    },
    {
      title: 'One colour scale, balanced by measurement',
      body: 'Every temperature in the product, on the map, the stripes and the scenario dots, uses one scale: blue through sand to red, centred on the normal. Our first version used the brand red and blue as they were, and warm years looked about a third louder than cold ones. We rebuilt it in OKLab so both arms lose lightness at the same rate, and checked it for the three common forms of colour blindness. The number is always printed beside the colour.'
    },
    {
      title: 'Dots, not a smooth heat map',
      body: 'The map is a halftone: one dot per square kilometre, coloured by temperature and sized by the shade of the terrain. A smooth raster, our first attempt, read as a weather forecast, and planners trusted it down to their own street. Dots say “1 km” without a legend, and the valleys and fjords stay recognisable, so people find home before they read a number.'
    },
    {
      title: 'Every number comes with a sentence',
      body: 'Each year, station and scenario has a sentence written from the same data: “In 2018, Voss was 1.9 °C warmer than the 1961–1990 normal; the summer had 14 days above 25 °C.” Planners were pasting these into their case papers, so we built the council report from them: two typeset A4 pages, with the method version and data date in the footer.'
    },
    {
      title: 'Alerts for the person with the spade',
      body: 'Engineers on call act on heavy-rain days, not on 2100. Their alert turns the forecast into a 24-hour total against the 30 mm line that defines a heavy-rain day, then lists the culverts and drains to check, in order. The climate record sits underneath it: Granvin now has 10.3 days like this a year, up from 8.7.'
    }
  ],
  outcome: [
    'Isobar launched in March 2025 with six municipalities in Vestland and now serves 23. Planning offices write their own council summaries, and data questions by email before the budget round fell from about 140 in 2024 to 31.',
    'We built the product in React with Isobar’s two developers and handed over the chart components, the colour scale with its tests, and the report templates in August. They have since added a drought view on the same parts.'
  ],
  cover: images.cover,
  coverAlt: 'A west-coast fjord printed as a field of coloured dots: blue on the cold peaks, red in the warmer valleys, with hairline labels for Lønahorgi, Myrkdalen and Granvin in 1961',
  coverTall: images['cover-tall'],
  motion: { src: motion, tall: motionTall },
  blocks: [
    {
      type: 'demo',
      load: () => import('./isobar/demo'),
      still: images.demo,
      alt: 'The year scrubber: a halftone map of Voss beside warming stripes for 1961–2025, with 2018 selected and its sentence',
      aspect: 1376 / 860,
      aspectMobile: 0.39,
      background: '#F3F2EC',
      caption: 'The year scrubber, running on Isobar’s sample data for Voss. Pick a station and a year, or press play to run 1961 to 2025.',
      hint: 'Drag the stripes, or focus them and use the arrow keys'
    },
    {
      type: 'text',
      heading: 'Three questions',
      body: [
        'We read two years of email from planning offices to Isobar. Nearly all of it asked one of three things: how much has it changed here, how much will it change, and what should we write in the plan.',
        'So the product has three pages, one per question. Each ends in something a planner can lift straight into a case paper: a sentence, a number with its unit, or a chart that names its own baseline.'
      ]
    },
    {
      type: 'image',
      image: images.overview,
      alt: 'The Isobar overview for Voss: a halftone map of 2016–2025 temperatures, warming stripes since 1961 and a table of five stations',
      caption: 'The overview. Each dot is a square kilometre; each stripe is one year for the whole municipality.'
    },
    {
      type: 'image',
      image: images.station,
      alt: 'The Voss station page: annual temperature bars either side of the 1961–1990 normal with an 11-year mean, heavy-rain days since 1961 and the five wettest days',
      caption: 'A station page with 2018 under the cursor. Bars sit either side of the normal; the ink line is the 11-year mean.'
    },
    {
      type: 'pair',
      images: [
        { image: images['poster-1961'], alt: 'A poster of the fjord in 1961: blue peaks, grey slopes and pale red valleys, with the year set large' },
        { image: images['poster-2025'], alt: 'The same poster for 2025: red from the water to the snowline, with only the summit near the normal' }
      ],
      caption: 'Posters for the launch in council chambers: the same fjord, coloured by 1961 and by 2025.'
    },
    {
      type: 'image',
      image: images.scenarios,
      alt: 'The scenarios page: low, medium and high emissions for 2050 and 2100 as dots with ranges, planning advice, and a table of rain, snow and hot days',
      caption: 'Scenarios for 2050 and 2100. Isobar’s climate staff write the advice; the product only places it.'
    },
    {
      type: 'quote',
      text: 'I used to send the council a table and a link. Now I send two pages, and the questions are about what to do, not what the numbers mean.',
      name: 'Ingvild Rønneberg',
      role: 'Planning engineer, Hardanger'
    },
    {
      type: 'image',
      image: images.report,
      alt: 'The exported council report: two typeset A4 pages with warming stripes, three headline figures, actions for the municipality, scenarios and a small halftone map',
      caption: 'The council report. Two A4 pages, written from the same sentences the product shows.'
    },
    {
      type: 'image',
      image: images.alert,
      alt: 'Three phone screens: a lock-screen heavy-rain alert for Granvin, the 24-hour forecast against the 30 mm line, and the culverts to check',
      caption: 'A heavy-rain day for the engineer on call, from the lock screen to the last culvert.'
    },
    {
      type: 'metrics',
      items: [
        { value: '23', label: 'municipalities using Isobar, up from 6 at launch' },
        { value: '78%', label: 'fewer data questions by email before the budget round' },
        { value: '11 min', label: 'median time from opening Isobar to an exported council report' },
        { value: '41', label: 'council case papers that quoted an Isobar sentence in 2025' }
      ],
      note: 'Isobar Climate’s figures, March to October 2025.'
    },
    {
      type: 'image',
      image: images.method,
      alt: 'The method page: the colour scale as drawn and under three kinds of colour blindness, its lightness profile, how to read the map, and the palette',
      caption: 'The method page. The scale’s lightness profile is the test we ship with it.',
      inset: true
    }
  ]
});
