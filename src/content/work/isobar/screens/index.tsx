import { Scaled } from '~/components/frames/Scaled';
import { defineScreens } from '~/content/screens';
import IsobarDemo from '../demo';
import { MethodScreen } from './Method';
import { Overview } from './Overview';
import { AlertScreen, RainLockScreen, SitesScreen } from './Phone';
import { ReportPageOne, ReportPageTwo } from './Report';
import { ScenariosScreen } from './Scenarios';
import { CoverScene, PhonesShot, PosterScene, ReportScene, Shot, TallScene } from './Scenes';
import { StationScreen } from './Station';

export default defineScreens({
  stills: {
    cover: { component: CoverScene, width: 1440, height: 960 },
    'cover-tall': { component: TallScene, width: 1152, height: 1440 },
    overview: {
      component: () => (
        <Shot>
          <Overview />
        </Shot>
      ),
      width: 1440,
      height: 900
    },
    station: {
      component: () => (
        <Shot url='isobar.no/voss/stations/voss' tone='ink'>
          <StationScreen />
        </Shot>
      ),
      width: 1440,
      height: 900
    },
    scenarios: {
      component: () => (
        <Shot url='isobar.no/voss/scenarios' tone='cold'>
          <ScenariosScreen />
        </Shot>
      ),
      width: 1440,
      height: 900
    },
    method: {
      component: () => (
        <Shot url='isobar.no/method'>
          <MethodScreen />
        </Shot>
      ),
      width: 1440,
      height: 900
    },
    report: {
      component: () => <ReportScene pages={[<ReportPageOne key='1' />, <ReportPageTwo key='2' />]} tone='ink' />,
      width: 1440,
      height: 960
    },
    alert: {
      component: () => <PhonesShot screens={[<RainLockScreen key='a' />, <AlertScreen key='b' />, <SitesScreen key='c' />]} />,
      width: 1440,
      height: 960
    },
    'poster-1961': { component: () => <PosterScene year={1961} />, width: 1200, height: 1500 },
    'poster-2025': { component: () => <PosterScene year={2025} />, width: 1200, height: 1500 },
    demo: { component: IsobarDemo, width: 1376, height: 860 }
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
      // In the sample order this plays only in the wall's 3-column slot,
      // 738 px wide at 1512 px (2x).
      outputWidth: 744
    }
  }
});
