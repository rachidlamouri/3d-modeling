import { buildParseInputDimensions, InputDimensions } from '../../dimensionParser/buildParseInputDimensions';
import {
  RectangularPrism,
  Subtraction,
  CompoundModel3D,
  Cylinder,
  Translation,
} from '../../modeling';

const dimensionNames = [
  'lengthX',
  'lengthY',
  'lengthZ',

  'carabinerHoleDiameter',
  'carabinerHoleRadius',
  'carabinerHoleToEdgeMargin',
  'carabinerHoleOffsetX',

  'itemHoleDiameter',

  'channelLengthX',
  'channelLengthY',
] as const;

type DimensionNames = typeof dimensionNames;

const parseInputDimensions = buildParseInputDimensions<DimensionNames>(
  dimensionNames,
  {
    carabinerHoleRadius: 'carabinerHoleDiameter / 2',
    carabinerHoleOffsetX: 'lengthX / 2 - carabinerHoleRadius - carabinerHoleToEdgeMargin',
  },
);

class CatHook extends CompoundModel3D {
  constructor(inputDimensions: InputDimensions<DimensionNames>) {
    const {
      lengthX,
      lengthY,
      lengthZ,
      carabinerHoleOffsetX,
      carabinerHoleDiameter,
      itemHoleDiameter,
      channelLengthX,
      channelLengthY,
    } = parseInputDimensions(inputDimensions);

    super(
      new Subtraction({
        models: [
          new RectangularPrism({
            name: 'Base Rectangle',
            origin: ['center', 'center', 'bottom'],
            lengthX,
            lengthY,
            lengthZ,
          }),
          new Cylinder({
            name: 'Carabiner Hole',
            origin: 'bottom',
            axis: 'z',
            diameter: carabinerHoleDiameter,
            axialLength: lengthZ,
            transforms: [
              new Translation({
                x: carabinerHoleOffsetX,
              }),
            ],
          }),
          new Cylinder({
            name: 'Item Hole',
            origin: 'bottom',
            axis: 'z',
            diameter: itemHoleDiameter,
            axialLength: lengthZ,
          }),
          new RectangularPrism({
            name: 'Channel',
            origin: ['right', 'center', 'bottom'],
            lengthX: channelLengthX,
            lengthY: channelLengthY,
            lengthZ,
          }),
        ],
      }),
    );
  }
}

export default {
  catHook: new CatHook({
    lengthX: 30,
    lengthY: 20,
    lengthZ: 2,

    carabinerHoleDiameter: 2.5,
    carabinerHoleToEdgeMargin: 1,

    itemHoleDiameter: 5,

    channelLengthX: 20,
    channelLengthY: 1,
  }),
};
