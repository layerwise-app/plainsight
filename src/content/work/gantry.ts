import { defineCaseStudy } from '~/content/define';
import { images } from './gantry/images';
import motion from './gantry/motion.mp4';
import motionTall from './gantry/motion-tall.mp4';

export default defineCaseStudy({
  name: 'Gantry',
  description: 'A builder for the internal tools nobody wants to maintain.',
  disciplines: ['Product design', 'Design system'],
  client: 'Gantry ApS',
  year: 2024,
  role: ['Product design', 'Design system', 'Prototyping in code'],
  team: ['Ingrid Solberg', 'Mats Eide', 'Selma Varga'],
  summary:
    'Gantry lets operations teams build admin tools on top of their own databases. We rebuilt its builder around bindings, so every component says where its data comes from, and new builders get a table onto live data without calling support.',
  problem: [
    'Gantry ApS, in Copenhagen, makes a builder for internal tools. Operations teams use it to put tables, forms and buttons on their own databases and APIs: refund queues, stock corrections, delivery overrides. By 2023 a table component had 54 settings across four tabs, and its data lived in a text field that read {{ query3.data }}.',
    'Gantry’s support queue showed the cost. Six in ten new builders asked for help before their first table showed real rows, and the most common question was where a query lived. The brief was a first tool anyone could finish alone, and changes safe enough to ship to people who handle money.'
  ],
  decisions: [
    {
      title: 'Every component answers one question first',
      body: 'The inspector opens on where the data comes from, written as a sentence: “Shows 14 rows from refunds_waiting on ops-eu.” Under it sits the chain from table to query to database, each step with its own state. Style and the rarely used settings moved behind two rows. We tried a separate data tab first. In testing, nobody opened it.'
    },
    {
      title: 'Bindings have names, not template strings',
      body: 'Queries are named for what they return, and components bind to them by picking from a list. The template syntax still works underneath for the one binding in twelve that needs it. Each query lists every component that reads it, and which of its columns they use, so renaming one is no longer a guess.'
    },
    {
      title: 'The canvas runs on live data, read only',
      body: 'Every query runs against a read replica while you build, so picking another query redraws the table with its real rows at once. We prototyped sample data to keep the canvas fast, and builders didn’t trust a tool they hadn’t seen with their own rows. Writes never run in preview. They say what they would have changed.'
    },
    {
      title: 'Permissions are a table you can read',
      body: 'Who may do what is one matrix of roles and actions, enforced on the server rather than by hiding buttons. A rule like “over €500 needs a second lead” is a cell, not a script. Any page can be previewed as any role before it ships.'
    },
    {
      title: 'Every deploy is a diff',
      body: 'A deploy compares the draft with what is live: components drawn side by side, SQL line by line, permission changes in words. The button stays off until Gantry has checked that every column a component reads still exists. Rolling back is one click, and people keep their place.'
    }
  ],
  outcome: [
    'The new builder went to every Gantry workspace in September 2024. In the first six months, 71% of new builders put a table on live data in their first session without contacting support, up from 38%.',
    'We designed the builder with Gantry’s product team, prototyped the inspector in React against real customer schemas, and handed over the component kit and its documentation in October. Gantry’s engineers have added three components to it since.'
  ],
  cover: images.cover,
  coverAlt:
    'Tovholm’s refund tool pulled apart into four layers on signal orange: the interface, its bindings, the SQL queries and the database table, joined by thin lines',
  coverTall: images['cover-tall'],
  motion: { src: motion, tall: motionTall },
  blocks: [
    {
      type: 'demo',
      load: () => import('./gantry/demo'),
      still: images.demo,
      alt: 'A small Gantry builder: the refunds table selected on the canvas, and an inspector saying it shows 14 rows from refunds_waiting on ops-eu',
      aspect: 1376 / 800,
      aspectMobile: 0.28,
      background: '#F6F5F1',
      caption:
        'A working corner of the builder, on Tovholm’s refund data. Pick a component, then change its query, columns or filter, and the preview follows.',
      hint: 'Click a component, or Tab to its name tag and press Enter'
    },
    {
      type: 'beforeAfter',
      before: {
        image: images.before,
        alt: 'Before: the old builder with table1 selected, 28 fields on the first of four tabs, and a comment asking which database query3 is on'
      },
      after: {
        image: images.after,
        alt: 'After: the same page with refundsTable selected, and an inspector that says it shows 14 rows from refunds_waiting on ops-eu'
      },
      caption: 'The same page in the same state, before and after. Drag the divide, or focus it and use the arrow keys.'
    },
    {
      type: 'text',
      heading: 'Watching people build',
      body: [
        'We sat with eleven operations teams in Copenhagen, Malmö and Hamburg while they built something they needed that week. Nobody struggled with layout. They struggled with one question: what is this table showing, and where does it come from?',
        'So bindings became the spine of the product. Every component, query and page answers that question in a sentence, and the answer reads the same in the canvas, the inspector and the deploy.'
      ]
    },
    {
      type: 'image',
      image: images.bindings,
      alt: 'Close-up of the inspector: the chain from refundsTable to refunds_waiting to ops-eu, and three queries to choose from with their row counts',
      caption: 'Each query shows its row count before you pick it. One with different columns says so before it swaps yours.'
    },
    {
      type: 'image',
      image: images.builder,
      alt: 'The builder with approveForm selected: it edits the row picked in refundsTable, saves with approve_refund, and names who can approve',
      caption: 'A form names what it reads and what it writes. The second-lead rule comes from Permissions, not from a script.'
    },
    {
      type: 'quote',
      text: 'I built our refund tool on a Tuesday afternoon. When finance asked who can approve anything over €500, I sent them a screenshot of one table.',
      name: 'Sofie Lund',
      role: 'Support lead, Tovholm'
    },
    {
      type: 'image',
      image: images.query,
      alt: 'The query editor: refunds_waiting in SQL, its 14 rows underneath, and the two components that read it',
      caption: 'Every query lists the components that read it and the columns they depend on.'
    },
    {
      type: 'pair',
      images: [
        {
          image: images.onboarding,
          alt: 'A new tool: ops-eu connected with a read-only user, and five tables to start from, with refunds picked'
        },
        {
          image: images.permissions,
          alt: 'Permissions as a matrix of eight actions and four roles, with approvals over €500 needing a second lead'
        }
      ],
      caption: 'A new tool starts from a table and arrives already bound. Permissions are one matrix, enforced on the server.'
    },
    {
      type: 'image',
      image: images.deploys,
      alt: 'Version 24 compared with the live version 23: a new column drawn side by side, the SQL change, a permission change and four passed checks',
      caption: 'A deploy shows what people will notice, and ships only when every binding still resolves.'
    },
    {
      type: 'metrics',
      items: [
        { value: '71%', label: 'of new builders put a table on live data in their first session, up from 38%' },
        { value: '11 min', label: 'median time from connecting a database to a working table, down from 52' },
        { value: '−64%', label: 'support tickets about queries and bindings per new workspace' },
        { value: '1 in 60', label: 'deploys rolled back, down from 1 in 14 before diffs and checks' }
      ],
      note: 'Gantry’s figures, October 2024 to March 2025.'
    },
    {
      type: 'image',
      image: images.tool,
      alt: 'Tovholm’s refund approvals as the support team sees it: 14 refunds waiting, with Lea Christensen’s open beside the approve form',
      caption: 'What the builder makes: Tovholm’s refund approvals, used by 15 people on the support team.',
      inset: true
    }
  ]
});
