# Plainsight

A quiet portfolio for a design and engineering studio, or for one designer.
It has five pages: Home, Work, a case study for each project, About and
Contact. White pages and one grotesque typeface leave all the colour to the
work. The sample owner is Halden, a fictional studio of four in Oslo, and
its eight projects are fictional too.

Built with TanStack Start, React, Tailwind CSS and Cloudflare D1, on
[Layerwise](https://layerwise.app).

## Where things are

| What                                                   | Where                                   |
| ------------------------------------------------------ | --------------------------------------- |
| Name, statement, bio, team, clients, email, fonts, colours | `src/portfolio.config.ts`           |
| One case study                                         | `src/content/work/<slug>.ts`            |
| Its images, videos and live demo                       | `src/content/work/<slug>/`              |
| The CV linked from About                               | `public/halden-studio-cv.pdf` (`cv.href`) |
| Default link preview image                             | `public/og-image.jpg`                   |
| Logo and favicons                                      | `public/logo.svg`, then `pnpm render-icons` |
| Contact messages                                       | the `messages` table in the database    |

## Add a project

1. Put your images anywhere. Name the main one `cover`, for example
   `cover.png`. Then run:

   ```bash
   pnpm add-images my-project ~/Desktop/cover.png ~/Desktop/home-screen.png
   ```

   This writes 800, 1600 and 2880 px WebP files to
   `src/content/work/my-project/`, never wider than the original, along with
   each image's size and a blur placeholder. Each image gets the lowest WebP
   quality that still looks the same, and flat graphics are stored with a
   limited palette when that is smaller. An image named `cover` also gets
   a 1200×630 share JPG. GIFs are copied unchanged. SVGs are rejected, so
   export them as PNG first. To save one file under another name, use
   `--name cover`.

   Images only shown half the page wide don't need the 2880 px file. Once
   the case study uses an image, `pnpm add-images` stops at the widest size
   its block shows: 1456 px in a pair or tall cover, 1920 px when inset. To
   apply this to images you added earlier, run `pnpm fit-images`. To set a
   limit by hand, pass `--max 1456`.
2. The first run also creates `src/content/work/my-project.ts` with every
   field filled in as a placeholder. Replace the placeholders. Images are
   available as `images.cover`, `images['home-screen']` and so on.
3. The project now appears on Home, Work and `/sitemap.xml`. To place it,
   add its slug to `workOrder` in `src/portfolio.config.ts`. Unlisted
   projects follow the listed ones, newest year first.

To hide a project without deleting it, rename its file to start with `_`.
For example, `_my-project.ts` is skipped.

### Blocks

A case study's `blocks` run in order below its brief, decisions and outcome:

```ts
{ type: 'image', image: images.home, alt: '…', caption: '…', inset: true }
{ type: 'pair', images: [{ image: images.a, alt: '…' }, { image: images.b, alt: '…' }] }
{ type: 'video', src: film, poster: images.cover, alt: '…' }      // import film from './my-project/film.mp4'
{ type: 'text', heading: '…', body: ['…', '…'] }
{ type: 'quote', text: '…', name: '…', role: '…' }
{ type: 'beforeAfter', before: { image, alt }, after: { image, alt }, caption: '…' }
{ type: 'metrics', items: [{ value: '4 days', label: '…' }], note: '…' }
{ type: 'demo', load: () => import('./my-project/demo'), still: images.demo, alt: '…', aspect: 16 / 9 }
```

On Home, hovering a project plays a short loop if the project sets
`motion: { src }`, where `src` is an imported `.mp4`. The wall also has
tall slots. `coverTall` and `motion: { src, tall }` add portrait cuts for
them; without these, tall slots crop the wide cover and loop. Keep loops
under about 8 seconds and 2 MB, with no sound.

### Swap a live demo for an image or video

A `demo` block mounts the React component in `load`. Its `still` is shown
while the component loads, and also if the component fails or the browser
has no WebGL. To drop the live component, change the block to
`{ type: 'image', image: images.demo, alt: '…' }` or to a `video` block,
then delete the `demo.tsx` file. Each demo is a separate file, so pages
without one don't download it.

## Replace the sample work

1. Delete the sample projects: every `src/content/work/<slug>.ts` and its
   `src/content/work/<slug>/` folder. Leave `src/content/work/` in place.
2. Add your own as above, and set `workOrder`.
3. Edit `src/portfolio.config.ts`: name, statement, bio, team, services,
   experience, clients, email and socials. Set `ownerEmail` if contact
   messages should also be emailed to you.
4. Delete the sample fonts you no longer use from `public/fonts/` and from
   `src/styles/work-fonts.css`. Those fonts exist only for the sample
   screens.
5. Run `pnpm render-studio` to rebuild the CV PDF and the default share
   image from your details, or replace `public/halden-studio-cv.pdf` and
   `public/og-image.jpg` with your own and update `cv` in the config.
6. Replace `public/logo.svg` with your own square logo and run
   `pnpm render-icons`.

The sample screens are React components in `src/content/work/<slug>/screens/`.
`pnpm render-work <slug>` renders them to the images and loops next to them.
Images get the same widths and quality choice as `pnpm add-images`. Each
loop gets the smallest file whose VMAF score against its frames stays at 91
or above. It needs Chrome or `pnpm exec playwright install chromium`, plus
`ffmpeg`.
Your own work doesn't need this: images and video go through
`pnpm add-images`.

## Fonts and colours

Both are set in `src/portfolio.config.ts`.

- **Colours.** Change the values in `colors`. Keep `ink` and `muted` at 4.5:1
  or more against `background`, and `footerInk` against `footer`.
- **Font.** Put the `.woff2` files in `public/fonts/<name>/` with the font's
  licence. Then point `fonts.sans.files` at them and set `family`. The
  `fallback` values scale Arial to the web font's size so text doesn't shift
  when the font loads. For a font other than Schibsted Grotesk, set
  `sizeAdjust` so a line of Arial is as wide as a line of your font. A tool
  such as Fontaine or Capsize can calculate it.

### Included fonts

All fonts are under the SIL Open Font License 1.1. Each folder in
`public/fonts/` holds its `OFL.txt`.

| Font                | Used for                     |
| ------------------- | ---------------------------- |
| Schibsted Grotesk   | The site                     |
| Geist, Geist Mono   | Kestrel sample screens       |
| Instrument Sans, Instrument Serif, Fragment Mono | Veil, Marmor and Kvarter samples |
| Unbounded, Manrope  | Soft Matter sample           |
| Archivo, Bricolage Grotesque, Work Sans | Marmor and Kvarter samples |
| Spline Sans, Spline Sans Mono | Isobar sample      |
| IBM Plex Sans, IBM Plex Mono | Gantry and Kvarter samples |
| Fraunces, Work Sans | Grums sample                 |

## Contact form

Messages are checked on the server and saved to the `messages` table. A
hidden field catches bots, and each sender can send 3 messages every 10
minutes. When `ownerEmail` is set, each message is also emailed there with
`env.EMAIL`, and replying answers the sender. The local preview never sends
real email: messages appear under Email → Local in Layerwise.

## Search and sharing

Every page sets its title, description and canonical URL. Home and About
include Organization structured data, and each case study includes
CreativeWork data with its cover as the share image. `/sitemap.xml` lists
the pages and every case study. After connecting a custom domain, set
`site.url` in `src/lib/site.ts`.

## Commands

```bash
pnpm dev                     # Layerwise runs this for you
pnpm check-types
pnpm lint
pnpm test
pnpm build
pnpm add-images <slug> <image...> [--name <name>] [--max <px>]
pnpm fit-images [slug...]    # drop image widths no block shows
pnpm render-work [slug...]   # sample screens to images and loops
pnpm render-studio           # CV PDF and default share image
pnpm render-icons            # logo.png and every favicon from public/logo.svg
pnpm db:generate --name <change>
pnpm db:migrate
```
