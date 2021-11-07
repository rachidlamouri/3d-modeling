import _ from 'lodash';
import { CylinderOrigin, OrientationAxis, Tube } from '../../../modeling';

const axes: OrientationAxis[] = ['x', 'y', 'z'];
const origins: CylinderOrigin[] = ['bottom', 'center', 'top'];

export default Object.fromEntries(
  axes.flatMap((axis) => origins.map(
    (origin) => [
      `${axis}${_.upperFirst(origin)}`,
      new Tube({
        axis,
        origin,
        outerDiameter: 20,
        wallThickness: 2,
        axialLength: 10,
      }),
    ],
  )),
);
