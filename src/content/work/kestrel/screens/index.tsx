import { Scaled } from '~/components/frames/Scaled';
import { defineScreens } from '~/content/screens';
import KestrelDemo from '../demo';
import { ActivityScreen, YamlScreen } from './Activity';
import { GuardrailsScreen } from './Guardrails';
import { Overview } from './Overview';
import { ApprovalScreen, ApprovedScreen, LockScreen } from './Phone';
import { PhonesShot, Shot, SystemSheet, WallScene } from './Scenes';

export default defineScreens({
  stills: {
    cover: { component: WallScene, width: 1440, height: 960 },
    overview: {
      component: () => (
        <Shot>
          <Overview />
        </Shot>
      ),
      width: 1440,
      height: 900
    },
    guardrails: {
      component: () => (
        <Shot url='app.kestrel.no/guardrails'>
          <GuardrailsScreen />
        </Shot>
      ),
      width: 1440,
      height: 900
    },
    before: {
      component: () => (
        <Shot url='git.kestrel.internal/agents/momentum-nordics'>
          <YamlScreen />
        </Shot>
      ),
      width: 1440,
      height: 900
    },
    activity: {
      component: () => (
        <Shot url='app.kestrel.no/activity'>
          <ActivityScreen />
        </Shot>
      ),
      width: 1440,
      height: 900
    },
    approvals: {
      component: () => <PhonesShot screens={[<LockScreen key='a' />, <ApprovalScreen key='b' />, <ApprovedScreen key='c' />]} />,
      width: 1440,
      height: 960
    },
    system: { component: SystemSheet, width: 1440, height: 900 },
    demo: { component: KestrelDemo, width: 1376, height: 655 }
  },
  motion: {
    motion: {
      component: ({ time }) => (
        <Scaled width={1440} height={960} scale={2 / 3}>
          <WallScene time={time} />
        </Scaled>
      ),
      width: 960,
      height: 640,
      duration: 6,
      outputWidth: 1600
    }
  }
});
