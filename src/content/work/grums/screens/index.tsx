import { Scaled } from '~/components/frames/Scaled';
import { defineScreens } from '~/content/screens';
import GrumsDemo from '../demo';
import { LabelSheet } from './Labels';
import { LetterboxScene } from './Letterbox';
import { NextBagScreen, SmsScreen } from './Phone';
import { BrowserShot, CoverScene, PhoneShot } from './Scenes';
import { ShopHome, SubscribePage } from './Shop';

export default defineScreens({
  stills: {
    cover: { component: CoverScene, width: 1440, height: 960 },
    shop: {
      component: () => (
        <BrowserShot url='grums.no'>
          <ShopHome />
        </BrowserShot>
      ),
      width: 1440,
      height: 900
    },
    subscribe: {
      component: () => (
        <BrowserShot url='grums.no/abonnement'>
          <SubscribePage />
        </BrowserShot>
      ),
      width: 1440,
      height: 900
    },
    labels: { component: LabelSheet, width: 1440, height: 960 },
    letterbox: { component: LetterboxScene, width: 1440, height: 960 },
    'next-bag': {
      component: () => (
        <PhoneShot tone='#C8A273' rotate={-4} seed={5}>
          <NextBagScreen />
        </PhoneShot>
      ),
      width: 1200,
      height: 1500
    },
    sms: {
      component: () => (
        <PhoneShot tone='#E2432C' rotate={3} seed={8} leafCenter={[0.86, 0.12]}>
          <SmsScreen />
        </PhoneShot>
      ),
      width: 1200,
      height: 1500
    },
    demo: { component: GrumsDemo, width: 1376, height: 770 }
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
    }
  }
});
