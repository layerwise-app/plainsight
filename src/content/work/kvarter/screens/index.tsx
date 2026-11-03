import { Scaled } from '~/components/frames/Scaled';
import { defineScreens } from '~/content/screens';
import KvarterDemo from '../demo';
import { AppBoardScene, NoticeboardScene } from './Board';
import { DugnadScreen, FeedScreen, NoticeScreen } from './Feed';
import { FaultCategoriesScreen, FaultStatusScreen } from './Faults';
import { ProposalScreen, ResultsScreen, VoteScreen } from './Meeting';
import { DirectoryScreen, OnboardingFlatScreen, OnboardingVerifyScreen, PrivacyScreen } from './People';
import { AdminShot, CoverScene, PhonesShot, SystemSheet, TallScene } from './Scenes';

export default defineScreens({
  stills: {
    cover: { component: CoverScene, width: 1440, height: 960 },
    'cover-tall': { component: TallScene, width: 1152, height: 1440 },
    notices: {
      component: () => <PhonesShot tone='brick' screens={[<FeedScreen key='a' />, <NoticeScreen key='b' />, <DugnadScreen key='c' />]} />,
      width: 1440,
      height: 960
    },
    meeting: {
      component: () => <PhonesShot tone='dusk' screens={[<ProposalScreen key='a' />, <VoteScreen key='b' />, <ResultsScreen key='c' />]} />,
      width: 1440,
      height: 960
    },
    faults: {
      component: () => (
        <PhonesShot tone='moss' phone={334} gap={120} lift={[-16, 16]} screens={[<FaultCategoriesScreen key='a' />, <FaultStatusScreen key='b' />]} />
      ),
      width: 1440,
      height: 960
    },
    directory: {
      component: () => <PhonesShot tone='paper' width={1200} height={1400} phone={420} lift={[0]} screens={[<DirectoryScreen key='a' />]} />,
      width: 1200,
      height: 1400
    },
    privacy: {
      component: () => <PhonesShot tone='yellow' width={1200} height={1400} phone={420} lift={[0]} screens={[<PrivacyScreen key='a' />]} />,
      width: 1200,
      height: 1400
    },
    onboarding: {
      component: () => (
        <PhonesShot tone='paper' phone={334} gap={120} lift={[16, -16]} screens={[<OnboardingFlatScreen key='a' />, <OnboardingVerifyScreen key='b' />]} />
      ),
      width: 1440,
      height: 960
    },
    admin: { component: AdminShot, width: 1440, height: 900 },
    system: { component: SystemSheet, width: 1440, height: 900 },
    before: { component: NoticeboardScene, width: 1440, height: 960 },
    after: { component: AppBoardScene, width: 1440, height: 960 },
    demo: { component: KvarterDemo, width: 1376, height: 700 }
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
