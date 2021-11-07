import { Translation } from '../../modeling';
import { projectorDimensions } from './dimensions';
import { FrameHoleAssembly } from './frameHoleAssembly';
import { FrameTemplate } from './frameTemplate';
import { Light } from './light';
import {
  Reel,
  ReelFrameChannelSliceTest,
  ReelFrameHoleSliceTest,
  ReelLowerSliceTest,
} from './reel';
import { Shade, ShadeSliceTest } from './shade';
import { ShadeAndTrack, ShadeAndTrackLowerSliceTest } from './shadeAndTrack';
import { Support, SupportBottomSliceTest, SupportTopSliceTest } from './support';
import { Track } from './track';

const {
  supportBaseHeight,
  lightLightBottomHeight,
  trackBaseHeight,
  reelHeightAllowance,
} = projectorDimensions;

export default {
  light: new Light(),
  support: new Support(),
  shade: new Shade(),
  track: new Track(),
  shadeAndTrack: new ShadeAndTrack(),

  frameHoleAssembly: new FrameHoleAssembly({ originAngleZ: 0 }),
  reel: new Reel(),

  supportTopSliceTest: new SupportTopSliceTest(),
  supportBottomSliceTest: new SupportBottomSliceTest(),

  shadeSliceTest: new ShadeSliceTest(),

  reelLowerSliceTest: new ReelLowerSliceTest(),
  shadeAndTrackLowerSliceTest: new ShadeAndTrackLowerSliceTest(),

  frameTemplate: new FrameTemplate(),
  reelFrameHoleSliceTest: new ReelFrameHoleSliceTest(),
  reelFrameChannelSliceTest: new ReelFrameChannelSliceTest(),

  demoSupport: new Support(),
  demoLight: new Light(new Translation({ z: supportBaseHeight })),
  demoShadeAndTrack: new ShadeAndTrack(new Translation({ z: supportBaseHeight + lightLightBottomHeight })),
  demoReel: new Reel(new Translation({ z: lightLightBottomHeight + trackBaseHeight + reelHeightAllowance })),
};
