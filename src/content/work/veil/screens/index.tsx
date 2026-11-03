import { Scaled } from '~/components/frames/Scaled';
import { defineScreens } from '~/content/screens';
import VeilDemo from '../demo';
import { ActivityScreen, ReceiveScreen } from './Everyday';
import { HomeScreen } from './Home';
import { RecoveryScreen, ReportScreen } from './Privacy';
import {
  EVERYDAY_BLOBS,
  EdgeScene,
  FrostScene,
  LookalikeDetail,
  PhonesShot,
  RECOVERY_BLOBS,
  REPORT_BLOBS,
  SEND_BLOBS,
  SingleShot,
  SystemSheet
} from './Scenes';
import { LookalikeScreen, MatchScreen, RecipientScreen } from './Send';

export default defineScreens({
  stills: {
    cover: { component: FrostScene, width: 1440, height: 960 },
    'cover-tall': { component: EdgeScene, width: 1152, height: 1440 },
    check: {
      component: () => (
        <PhonesShot blobs={SEND_BLOBS} screens={[<RecipientScreen key='a' />, <MatchScreen key='b' />, <LookalikeScreen key='c' />]} />
      ),
      width: 1440,
      height: 960
    },
    lookalike: { component: LookalikeDetail, width: 1440, height: 900 },
    report: {
      component: () => (
        <SingleShot blobs={REPORT_BLOBS}>
          <ReportScreen />
        </SingleShot>
      ),
      width: 1200,
      height: 1500
    },
    recovery: {
      component: () => (
        <SingleShot blobs={RECOVERY_BLOBS}>
          <RecoveryScreen />
        </SingleShot>
      ),
      width: 1200,
      height: 1500
    },
    everyday: {
      component: () => (
        <PhonesShot
          blobs={EVERYDAY_BLOBS}
          screens={[<ActivityScreen key='a' />, <HomeScreen key='b' reveal={1} />, <ReceiveScreen key='c' />]}
        />
      ),
      width: 1440,
      height: 960
    },
    system: { component: SystemSheet, width: 1440, height: 900 },
    demo: { component: () => <VeilDemo />, width: 1376, height: 706 }
  },
  motion: {
    motion: {
      component: ({ time }) => (
        <Scaled width={1440} height={960} scale={2 / 3}>
          <FrostScene time={time} />
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
          <EdgeScene time={time} />
        </Scaled>
      ),
      width: 864,
      height: 1080,
      duration: 6,
      outputWidth: 1080
    }
  }
});
