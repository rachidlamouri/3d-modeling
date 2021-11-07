import { RectangularPrism, RectangularPrismParams } from '../../../modeling';

class DemoRectangularPrism extends RectangularPrism {
  constructor(origin: RectangularPrismParams['origin']) {
    super({
      origin,
      lengthX: 20,
      lengthY: 30,
      lengthZ: 10,
    });
  }
}

export default {
  center: new DemoRectangularPrism(['center', 'center', 'center']),
  right: new DemoRectangularPrism(['right', 'center', 'center']),
  left: new DemoRectangularPrism(['left', 'center', 'center']),
  front: new DemoRectangularPrism(['center', 'front', 'center']),
  back: new DemoRectangularPrism(['center', 'back', 'center']),
  top: new DemoRectangularPrism(['center', 'center', 'top']),
  bottom: new DemoRectangularPrism(['center', 'center', 'bottom']),
};
