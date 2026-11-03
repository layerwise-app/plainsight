import { defineCaseStudy } from '~/content/define';
import { images } from './kestrel/images';
import motion from './kestrel/motion.mp4';

export default defineCaseStudy({
  name: 'Kestrel',
  description: 'Trading agents with limits a person can read.',
  disciplines: ['Product design', 'Design engineering'],
  client: 'Kestrel Markets AS',
  year: 2026,
  role: ['Product design', 'Interface system', 'Front-end engineering'],
  team: ['Ingrid Solberg', 'Mats Eide', 'Selma Varga'],
  summary:
    'Kestrel runs autonomous trading agents for Nordic funds. We turned its risk limits from YAML only engineers could edit into sentences risk managers change themselves, with the cost of every change shown first.',
  problem: [
    'Kestrel Markets builds autonomous trading agents for small Nordic funds. Each agent trades inside limits: how large a position may grow, how much it may lose in a day, when it may trade. In 2025 those limits lived in YAML files in a git repository. Risk managers asked engineers to change them, engineers asked what they meant, and compliance read pull requests to learn what an agent was allowed to do.',
    'The brief was a product a fund’s own people could run: risk managers changing limits without a ticket, compliance reading them without a developer in the room, and anyone able to answer, at any moment, why an agent just did what it did.'
  ],
  decisions: [
    {
      title: 'Limits are written as sentences',
      body: 'Each guardrail reads as one plain sentence with its values inline: “Never let one position grow past 8.0% of the fund.” The sentence is both the interface and the specification. It compiles to the same rule engine the YAML fed, so nothing about execution changed.'
    },
    {
      title: 'Show the cost before the change',
      body: 'Editing a value replays the agent’s last 90 days under the new limit. You see which trades it would have stopped and what that does to return and to the worst day, before anyone approves it. Tighter isn’t always better, and the chart says so.'
    },
    {
      title: 'Every action cites its rule',
      body: 'The activity log lists each order with the rule that allowed or stopped it, in the order the engine checked them. The compliance export is the same list as a PDF. It replaced a week every quarter spent rebuilding decisions from server logs.'
    },
    {
      title: 'Soft limits ask a person, and default to no',
      body: 'Above a soft limit the agent asks on the phone: what it wants, why, and how far past the limit it would go. If nobody answers in 90 seconds, the trade is declined. We tested 30, 60 and 90 seconds with three funds; 90 was the shortest window people answered in without rushing.'
    },
    {
      title: 'Two colours, one meaning each',
      body: 'Lime only ever means an agent is acting. Amber only ever means it is waiting for a person. Everything else is grey, so one glance across five agents tells you which one needs you.'
    }
  ],
  outcome: [
    'The guardrail editor launched with three funds in March 2026 and now runs for eleven. Risk managers make most limit changes themselves, and compliance signs off a new agent in days rather than weeks.',
    'We built the interface in React alongside Kestrel’s engineers and handed over the component library and its documentation in June. They have shipped two new rule types on it since.'
  ],
  cover: images.cover,
  coverAlt: 'Kestrel’s agent overview on a screen hung on a plaster wall in afternoon sun',
  motion: { src: motion },
  blocks: [
    {
      type: 'demo',
      load: () => import('./kestrel/demo'),
      still: images.demo,
      alt: 'The guardrail editor: three limits written as sentences beside a chart of the last 90 days',
      aspect: 1376 / 655,
      aspectMobile: 0.42,
      background: '#0c110f',
      caption: 'The guardrail editor, running on real sample data. Change a limit and 90 days of trades replay under it.',
      hint: 'Use − and +, or focus a value and press the arrow keys'
    },
    {
      type: 'beforeAfter',
      before: {
        image: images.before,
        alt: 'Before: the limits as YAML in a code repository, with a risk manager’s question beside line 6'
      },
      after: {
        image: images.guardrails,
        alt: 'After: the same limits as three sentences, with the 90-day replay and the trades they would stop'
      },
      caption: 'The same three limits, before and after. Drag the divide, or focus it and use the arrow keys.'
    },
    {
      type: 'text',
      heading: 'Reading the room',
      body: [
        'We spent the first two weeks on the trading floors of three funds, watching how people checked on their agents. Nobody looked at the charts first. They looked for the one agent that was behaving differently, then for the reason.',
        'So the overview is a list ordered by attention, not by performance. An agent that wants something rises to the top and turns amber; everything that is fine stays quiet.'
      ]
    },
    {
      type: 'image',
      image: images.overview,
      alt: 'The agents overview: five agents with status, today’s return, exposure and last action',
      caption: 'The overview. Each last action names the rule that allowed it.'
    },
    {
      type: 'image',
      image: images.approvals,
      alt: 'Three phone screens: a lock screen notification, the approval request with a countdown, and the confirmation',
      caption: 'A soft-limit request, from the lock screen to the confirmation. Unanswered requests decline themselves.'
    },
    {
      type: 'quote',
      text: 'I used to find out what our agents were allowed to do by reading a pull request. Now I read three sentences, and I change them myself.',
      name: 'Live Haugen',
      role: 'Head of risk, Nordre Fjord Capital'
    },
    {
      type: 'image',
      image: images.activity,
      alt: 'The activity log with a stopped trade open, listing the three rules checked in order',
      caption: 'The activity log. A stopped order shows each rule it was checked against, in order.'
    },
    {
      type: 'metrics',
      items: [
        { value: '4 days', label: 'to sign off a new agent, down from three weeks' },
        { value: '73%', label: 'of limit changes now made by risk managers, not engineers' },
        { value: '38 s', label: 'median time to answer a soft-limit request' },
        { value: '11', label: 'funds running their agents on the editor' }
      ],
      note: 'Kestrel’s figures, June to October 2026.'
    },
    {
      type: 'image',
      image: images.system,
      alt: 'Kestrel’s interface kit: six colours, Geist and Geist Mono, and a guardrail in three states',
      caption: 'Part of the interface kit we handed over.',
      inset: true
    }
  ]
});
