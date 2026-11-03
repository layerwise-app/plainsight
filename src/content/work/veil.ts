import { defineCaseStudy } from '~/content/define';
import { images } from './veil/images';
import motion from './veil/motion.mp4';
import motionTall from './veil/motion-tall.mp4';

export default defineCaseStudy({
  name: 'Veil',
  description: 'A wallet that keeps your money private by default.',
  disciplines: ['Product design', 'Identity'],
  client: 'Veil Labs AS',
  year: 2025,
  role: ['Product design', 'Identity', 'Prototyping'],
  team: ['Selma Varga', 'Ingrid Solberg', 'Jonas Haugland'],
  summary:
    'Veil is a self-custody wallet from Bergen for everyday euros, kroner and bitcoin. We designed it so balances, contacts and labels stay private by default, and so a lookalike address is hard to mistake for a friend’s.',
  problem: [
    'Veil Labs builds a wallet for people who want to hold digital money themselves: stablecoin euros and kroner for paying friends and shops, and a little bitcoin. Its first testers liked owning their keys. They did not like what came with it. Their balance was on screen every time they paid for a coffee, every payment went to and from the same public address, and recovery meant 24 words on a sheet of paper in a drawer.',
    'One tester had lost €1,900 the year before to address poisoning. A stranger sent him a payment of nothing from an address that began and ended like his sister’s, and a week later he copied it from his history.',
    'The brief was a wallet that is private without asking anyone to understand privacy: safe to open on a tram, hard to pay the wrong person, and possible to recover without writing anything down.'
  ],
  decisions: [
    {
      title: 'Hidden is the resting state',
      body: 'Balances show only while you press and hold. Let go and they blur again. We tested an eye toggle first, as most banking apps use, and 9 of 12 testers left it on “show” after the first day. Holding costs a second and can’t be left on. The blur is drawn at a fixed width, so it doesn’t give away how many digits you have.'
    },
    {
      title: 'Addresses you can say out loud',
      body: 'Every address is shown as three words and six coloured bars, worked out on the phone from the address itself. A poisoned address copies the first and last characters people check, but it can’t copy the words. We tried printing the full address in groups of four, then highlighting changed characters. Both still asked people to read hexadecimal carefully every time, and nobody did.'
    },
    {
      title: 'A fingerprint that works in greyscale',
      body: 'Each bar has one of four heights as well as one of eight colours, so the pattern still reads for colour-blind people and in the phone’s greyscale mode. We checked it with seven colour-blind testers. Vermilion never appears in a fingerprint. It has one job in the product: telling you to stop.'
    },
    {
      title: 'Show what left the phone, not a settings page',
      body: 'Privacy settings ask you to trust them. A weekly report shows what actually happened: every request that left the phone, where it went and what it carried. Most weeks it says the same dull thing, which is the point. When something is different, like a new phone asking to pair, it is the one line in vermilion.'
    },
    {
      title: 'Recovery held by people, not paper',
      body: 'Instead of a 24-word phrase, the wallet’s key is split into three shares held by people you choose, and any two can restore it. No one of them can open it alone, and neither can Veil. We also tested two of five. Most testers couldn’t name five people without including someone they wouldn’t lend money to.'
    }
  ],
  outcome: [
    'Veil launched in Norway in September 2025 and in Sweden in March 2026. It now holds 84,000 wallets, and 71% of them have recovery set up with three people.',
    'In its first year the address check stopped 3,140 payments to lookalike addresses before they were sent. Veil knows of two that reached a poisoned address. Both were sent after the warning was dismissed, so passing it now takes two steps.',
    'We designed the identity alongside the product, and handed over the interface library and our React prototype of the address check. Veil’s engineers built the shipped version against it.'
  ],
  cover: images.cover,
  coverAlt: 'Veil’s home screen with its balance blurred, on a phone held against frosted glass with ultramarine and vermilion shapes behind it',
  coverTall: images['cover-tall'],
  motion: { src: motion, tall: motionTall },
  blocks: [
    {
      type: 'demo',
      load: () => import('./veil/demo'),
      still: images.demo,
      alt: 'Veil’s address check: Mari Lunde’s saved address above a lookalike that starts 0x7a3F9c and ends 4b2d, with different words and colours',
      aspect: 1376 / 706,
      aspectMobile: 0.25,
      background: '#E8EBEE',
      caption: 'The address check, running on the same logic as the app. Pick an address or type one. Nothing leaves the page.',
      hint: 'Choose or type an address. Press and hold the balance, or focus it and hold Space.'
    },
    {
      type: 'image',
      image: images.check,
      alt: 'Three phone screens: choosing who to pay, a match with Mari Lunde’s saved address, and a warning for a lookalike of it',
      caption: 'Choosing who to pay, a match and a lookalike. Every saved contact shows its words and colours in the list.'
    },
    {
      type: 'text',
      heading: 'Watching people check an address',
      body: [
        'We sat with 14 people in Bergen and Oslo while they sent money to someone they knew. Nobody read a whole address. Most checked the first four characters and the last four, which is exactly the part a poisoning attack copies.',
        'Words were the one thing people checked without being asked. Several read them aloud to the person they were paying. So the three words became the headline of every payment, and the address moved underneath them.'
      ]
    },
    {
      type: 'image',
      image: images.lookalike,
      alt: 'Mari Lunde’s saved address above a lookalike from the owner’s history. Ten characters match, 30 are marked as different, and the words and colour bars share nothing',
      caption: 'The two addresses up close. Ten characters match. The words and colours share nothing.'
    },
    {
      type: 'pair',
      images: [
        {
          image: images.report,
          alt: 'The weekly privacy report: 61 requests left the phone in week 44, none named its owner, and one pairing request was declined'
        },
        {
          image: images.recovery,
          alt: 'Recovery shared between three people: Mari Lunde and Henrik Aas have confirmed, Sunniva Dahl has still to accept'
        }
      ],
      caption: 'The weekly privacy report, and recovery held by three people. Any two of them can restore the wallet.'
    },
    {
      type: 'quote',
      text: 'I used to check the first four and the last four characters, like everyone does. The address that nearly got me matched both. It didn’t match the words.',
      name: 'Tuva Mjelde',
      role: 'Beta tester, Stavanger'
    },
    {
      type: 'image',
      image: images.everyday,
      alt: 'Three phone screens: activity with labels kept on the phone, the home screen with its balance shown while held, and a new receive address with its own words',
      caption: 'Activity with labels that never leave the phone, a balance held open, and a new address for every payment.'
    },
    {
      type: 'metrics',
      items: [
        { value: '3,140', label: 'payments to lookalike addresses stopped before they were sent' },
        { value: '71%', label: 'of wallets have recovery set up with three people' },
        { value: '1.4 s', label: 'median hold to read a balance' },
        { value: '84,000', label: 'wallets in Norway and Sweden' }
      ],
      note: 'Veil’s figures, September 2025 to October 2026.'
    },
    {
      type: 'image',
      image: images.system,
      alt: 'Veil’s identity: the mark at four sizes, Instrument Serif, Instrument Sans and Fragment Mono, seven colours, and the fingerprint’s eight colours and four heights',
      caption: 'Part of the identity. The mark is the only drawn element; the rest is type and colour.',
      inset: true
    }
  ]
});
