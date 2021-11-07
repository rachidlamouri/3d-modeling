import {
  CompoundModel3D,
  Union,
  Tube,
  Subtraction,
  RectangularPrism,
  Cylinder,
  Translation,
} from '../../modeling';
import { projectorDimensions } from './dimensions';

export class Support extends CompoundModel3D {
  constructor() {
    const {
      supportLightHoleInnerDiameter,
      supportLightHoleHeight,
      supportBaseHeight,
      lightBaseRadius,
      supportLightBaseSupportLength,
      supportMainHeight,
      supportMainThickness,
      supportMainInnerDiameter,
      supportMainOuterDiameter,
      supportMainOverlapHeight,
      supportMainGapLength,
    } = projectorDimensions;

    super(
      new Union({
        models: [
          new Tube({
            origin: 'bottom',
            outerDiameter: supportMainOuterDiameter,
            innerRadius: lightBaseRadius - supportLightBaseSupportLength,
            height: supportBaseHeight,
          }),
          new Union({
            models: [
              new Tube({
                origin: 'bottom',
                outerDiameter: supportMainInnerDiameter,
                innerDiameter: supportLightHoleInnerDiameter,
                height: supportLightHoleHeight,
              }),
              new Subtraction({
                models: [
                  new Tube({
                    origin: 'bottom',
                    outerDiameter: supportMainOuterDiameter,
                    wallThickness: supportMainThickness,
                    height: supportMainHeight,
                  }),
                  new Union({
                    models: [
                      new RectangularPrism({
                        origin: ['center', 'center', 'bottom'],
                        lengthX: supportMainGapLength,
                        lengthY: supportMainOuterDiameter,
                        lengthZ: supportMainOverlapHeight,
                      }),
                      new RectangularPrism({
                        origin: ['center', 'center', 'bottom'],
                        lengthX: supportMainOuterDiameter,
                        lengthY: supportMainGapLength,
                        lengthZ: supportMainOverlapHeight,
                      }),
                    ],
                    transforms: [
                      new Translation({ z: supportMainHeight - supportMainOverlapHeight }),
                    ],
                  }),
                ],
              }),
            ],
            transforms: [
              new Translation({ z: supportBaseHeight }),
            ],
          }),
        ],
      }),
    );
  }
}

export class SupportTopSliceTest extends CompoundModel3D {
  constructor() {
    const {
      supportMainOuterDiameter,
      supportMainHeight,
      supportMainOverlapHeight,
    } = projectorDimensions;

    super(
      new Subtraction({
        models: [
          new Support(),
          new Cylinder({
            origin: 'bottom',
            diameter: supportMainOuterDiameter,
            height: supportMainHeight - supportMainOverlapHeight * 2,
          }),
        ],
      }),
    );
  }
}

export class SupportBottomSliceTest extends CompoundModel3D {
  constructor() {
    const {
      supportMainOuterDiameter,
      supportMainHeight,
      lightBaseHeight,
    } = projectorDimensions;

    super(
      new Subtraction({
        models: [
          new Support(),
          new Cylinder({
            origin: 'bottom',
            diameter: supportMainOuterDiameter,
            height: supportMainHeight,
            transforms: [
              new Translation({ z: lightBaseHeight }),
            ],
          }),
        ],
      }),
    );
  }
}
