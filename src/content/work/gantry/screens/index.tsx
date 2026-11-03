import { Scaled } from '~/components/frames/Scaled';
import { defineScreens } from '~/content/screens';
import { ToolScreen } from './App';
import { BuilderScreen } from './Builder';
import { DeployScreen } from './Deploys';
import { BindingsDetail, OnboardingShot, PanelShot, PermissionsPanel } from './Details';
import { QueryScreen } from './Queries';
import { CoverScene, TallScene } from './Scenes';
import { Shot } from './Shot';
import GantryDemo from '../demo';

const BUILD = 'tovholm.gantry.app/refund-approvals';

export default defineScreens({
  stills: {
    cover: { component: CoverScene, width: 1440, height: 960 },
    'cover-tall': { component: TallScene, width: 1152, height: 1440 },
    builder: {
      component: () => (
        <Shot url={`${BUILD}/build`}>
          <BuilderScreen selected='form' />
        </Shot>
      ),
      width: 1440,
      height: 900
    },
    bindings: { component: () => <BindingsDetail />, width: 1440, height: 960 },
    query: {
      component: () => (
        <Shot url={`${BUILD}/queries/refunds_waiting`}>
          <QueryScreen />
        </Shot>
      ),
      width: 1440,
      height: 900
    },
    permissions: {
      component: () => (
        <PanelShot design={[720, 620]} scale={1.42}>
          <PermissionsPanel />
        </PanelShot>
      ),
      width: 1200,
      height: 1200
    },
    onboarding: { component: () => <OnboardingShot />, width: 1200, height: 1200 },
    deploys: {
      component: () => (
        <Shot url={`${BUILD}/deploys/v24`}>
          <DeployScreen />
        </Shot>
      ),
      width: 1440,
      height: 900
    },
    tool: {
      component: () => (
        <Shot url='tools.tovholm.dk/refunds'>
          <ToolScreen />
        </Shot>
      ),
      width: 1440,
      height: 900
    },
    demo: { component: GantryDemo, width: 1376, height: 800 },
    before: {
      component: () => (
        <Shot url='tovholm.gantry.app/editor/refund-tool-v2'>
          <BuilderScreen old />
        </Shot>
      ),
      width: 1440,
      height: 900
    },
    after: {
      component: () => (
        <Shot url={`${BUILD}/build`}>
          <BuilderScreen selected='table' />
        </Shot>
      ),
      width: 1440,
      height: 900
    }
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
