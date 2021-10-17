import _ from 'lodash';
import { buildParseInputDimensions, Dimensions, InputDimensions } from '../dimensionParser';
import { CompoundModel3D, Cylinder, Subtraction } from '../modeling';

const dimensionNames = [
  'reelThickness',
  'reelRadius',
  'reelDiameter',
  'reelHeight',
  'reelHoleDiameter',
  'reelHoleRadius',
  'frameCount',
  'frameDiameter',
  'frameLengthZ',
  'firstFrameAngle',
  'lastFrameAngle',
  'frameAngleZ',
] as const;

type FrameParams = {
  originAngleZ: number;
  thingParams: Dimensions<typeof dimensionNames>;
};

class Frame extends Cylinder {
  constructor({ originAngleZ, thingParams }: FrameParams) {
    const {
      frameDiameter,
      frameLengthZ,
      reelRadius,
      reelThickness,
      reelHeight,
    } = thingParams;

    super({
      origin: 'center',
      diameter: frameDiameter,
      lengthZ: frameLengthZ,
      translation: {
        y: reelRadius - reelThickness / 2,
        z: reelHeight / 2,
      },
      rotations: [
        [{ x: 90 }, 'self'],
        [{ z: originAngleZ }, 'origin'],
      ],
    });
  }
}

export class Thing extends CompoundModel3D {
  static parseInputDimensions = buildParseInputDimensions<typeof dimensionNames>(
    dimensionNames,
    {
      reelThickness: '4',
      reelDiameter: '2 * reelRadius',
      reelHoleDiameter: '2 * reelHoleRadius',
      reelHoleRadius: 'reelRadius - reelThickness',
      frameCount: '4',
      frameLengthZ: '2 * reelThickness', // doubling to force a hole
      firstFrameAngle: '90',
      lastFrameAngle: '-90',
      frameAngleZ: '(lastFrameAngle - firstFrameAngle) / (frameCount - 1)',
    },
  )

  constructor(inputParams: InputDimensions<typeof dimensionNames>) {
    const params = Thing.parseInputDimensions(inputParams);
    const {
      reelDiameter,
      reelHeight,
      reelHoleDiameter,
      frameCount,
      firstFrameAngle,
      frameAngleZ,
    } = params;

    super(
      new Subtraction({
        minuend: new Cylinder({
          origin: 'bottom',
          diameter: reelDiameter,
          height: reelHeight,
        }),
        subtrahends: [
          new Cylinder({
            origin: 'bottom',
            diameter: reelHoleDiameter,
            height: reelHeight,
          }),
          ..._.range(frameCount).map((index) => (
            new Frame({
              originAngleZ: firstFrameAngle + index * frameAngleZ,
              thingParams: params,
            })
          )),
        ],
      }),
    );
  }
}
