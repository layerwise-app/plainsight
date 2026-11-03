import { Scaled } from '~/components/frames/Scaled';
import { defineScreens } from '~/content/screens';
import MarmorDemo from '../demo';
import { BookletScene, FacadeScene, SignageScene, ToteScene } from './Objects';
import { OldFilmPoster, OldProgramme } from './Old';
import { Poster, ProgrammePoster, posterFilm } from './Poster';
import { CoverScene, PhonesShot, SeriesScene, TallScene, WebShot } from './Scenes';
import { SystemSheet } from './System';

const CASE = 452 - 36;

export default defineScreens({
  stills: {
    cover: { component: CoverScene, width: 1440, height: 960 },
    'cover-tall': { component: TallScene, width: 1152, height: 1440 },
    posters: { component: SeriesScene, width: 1440, height: 960 },
    website: { component: WebShot, width: 1440, height: 900 },
    tickets: { component: PhonesShot, width: 1440, height: 960 },
    system: { component: SystemSheet, width: 1440, height: 900 },
    booklet: { component: BookletScene, width: 1440, height: 960 },
    signage: { component: SignageScene, width: 1200, height: 1500 },
    tote: { component: ToteScene, width: 1200, height: 1500 },
    before: {
      component: () => <FacadeScene posters={[<OldProgramme key='a' width={CASE} />, <OldFilmPoster key='b' width={CASE} />]} />,
      width: 1440,
      height: 960
    },
    after: {
      component: () => <FacadeScene posters={[<ProgrammePoster key='a' width={CASE} />, <Poster key='b' film={posterFilm('kveldssol')} width={CASE} />]} />,
      width: 1440,
      height: 960
    },
    demo: { component: MarmorDemo, width: 1376, height: 760 }
  },
  motion: {
    motion: {
      component: ({ time }) => (
        <Scaled width={1440} height={960} scale={2 / 3}>
          <CoverScene time={time} />
        </Scaled>
      ),
      width: 960,
      height: 640,
      duration: 6,
      outputWidth: 1600
    },
    'motion-tall': {
      component: ({ time }) => (
        <Scaled width={1152} height={1440} scale={0.75}>
          <TallScene time={time} />
        </Scaled>
      ),
      width: 864,
      height: 1080,
      duration: 6,
      outputWidth: 1080
    }
  }
});
