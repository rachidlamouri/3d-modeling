import _ from 'lodash';
import { Cylinder, CylinderOrigin, OrientationAxis } from '../../../modeling';

const axes: OrientationAxis[] = ['x', 'y', 'z'];
const origins: CylinderOrigin[] = ['bottom', 'center', 'top'];

export default Object.fromEntries(
  axes.flatMap((axis) => origins.map(
    (origin) => [
      `${axis}${_.upperFirst(origin)}`,
      new Cylinder({
        axis,
        origin,
        diameter: 10,
        axialLength: 20,
      }),
    ],
  )),
);
