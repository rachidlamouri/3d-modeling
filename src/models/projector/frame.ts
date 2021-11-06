import _ from 'lodash';
import {
  Cylinder,
  ModelCollection3D,
  RectangularPrism,
  Subtraction,
  Tube,
  Union,
} from '../../modeling';
import { projectorDimensions } from './dimensions';
import { LithophaneParams, Lithophane } from '../lithophane/lithophane';

export class Frame extends ModelCollection3D {
  constructor(params: Omit<LithophaneParams, 'lengthX' | 'lengthY' | 'minLengthZ' | 'maxLengthZ'>) {
    const {
      frameImageDiameter,
      frameImageMinLengthY,
      frameImageMaxLengthY,
      frameWallInnerDiameter,
      frameWallOuterDiameter,
      frameWallLengthY,
      frameWingspan,
      frameWingLengthY,
      frameWingLengthZ,
    } = projectorDimensions;

    const models = new Lithophane({
      ...params,
      lengthX: frameImageDiameter,
      lengthY: frameImageDiameter,
      minLengthZ: frameImageMinLengthY,
      maxLengthZ: frameImageMaxLengthY,
    })
      .models.map((lithophaneSlice) => (
        new Union({
          models: [
            new Subtraction({
              models: [
                lithophaneSlice,
                new Subtraction({
                  models: [
                    new RectangularPrism({
                      origin: ['center', 'center', 'bottom'],
                      lengthX: frameImageDiameter,
                      lengthY: frameImageDiameter,
                      lengthZ: frameImageMaxLengthY,
                    }),
                    new Cylinder({
                      origin: 'bottom',
                      diameter: frameImageDiameter,
                      lengthZ: frameImageMaxLengthY,
                    }),
                  ],
                }),
              ],
            }),
            new Tube({
              origin: 'bottom',
              outerDiameter: frameWallOuterDiameter,
              innerDiameter: frameWallInnerDiameter,
              lengthZ: frameWallLengthY,
            }),
            new Subtraction({
              models: [
                new Cylinder({
                  origin: 'bottom',
                  diameter: frameWingspan,
                  lengthZ: frameWingLengthY,
                }),
                new Cylinder({
                  origin: 'bottom',
                  diameter: frameWallOuterDiameter,
                  lengthZ: frameWingLengthY,
                }),
                ..._.range(2).map((index) => (
                  new RectangularPrism({
                    origin: ['center', (index === 0 ? 'front' : 'back'), 'bottom'],
                    lengthX: frameWingspan,
                    lengthY: (frameWingspan - frameWingLengthZ) / 2,
                    lengthZ: frameWingLengthY,
                    translation: {
                      y: (index === 0 ? -1 : 1) * (frameWingLengthZ / 2),
                    },
                  })
                )),
              ],
            }),
          ],
        })
      ));

    super(models);
  }
}
