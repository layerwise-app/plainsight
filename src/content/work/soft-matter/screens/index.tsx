import { Scaled } from '~/components/frames/Scaled';
import { defineScreens } from '~/content/screens';
import SoftMatterDemo from '../demo';
import { BrowserShot, CoverScene, IdentitySheet, MotionGuide, PhonesShot, Poster } from './Scenes';
import { HomePage, MobileHome, MobileProject, MobileWork, ProjectPage } from './Site';

export default defineScreens({
  stills: {
    cover: { component: CoverScene, width: 1440, height: 960 },
    home: {
      component: () => (
        <BrowserShot>
          <HomePage />
        </BrowserShot>
      ),
      width: 1440,
      height: 900
    },
    project: {
      component: () => (
        <BrowserShot url='softmatter.dk/work/slow-tide'>
          <ProjectPage />
        </BrowserShot>
      ),
      width: 1440,
      height: 900
    },
    mobile: {
      component: () => <PhonesShot screens={[<MobileHome key='a' />, <MobileWork key='b' />, <MobileProject key='c' />]} />,
      width: 1440,
      height: 960
    },
    identity: { component: IdentitySheet, width: 1440, height: 960 },
    'motion-guide': { component: MotionGuide, width: 1440, height: 900 },
    'poster-wax': { component: () => <Poster material='wax' />, width: 1080, height: 1440 },
    'poster-glass': { component: () => <Poster material='glass' />, width: 1080, height: 1440 },
    demo: { component: ({ time }) => <SoftMatterDemo time={time ?? 0} />, width: 1376, height: 760 }
  },
  motion: {
    motion: {
      component: ({ time }) => (
        <Scaled width={1440} height={960} scale={2 / 3}>
          <CoverScene time={time} pixelRatio={1.15} />
        </Scaled>
      ),
      width: 960,
      height: 640,
      duration: 6,
      outputWidth: 1600
    }
  }
});
