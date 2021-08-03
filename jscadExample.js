const {
  primitives: { cuboid },
  transforms: { translate },
  booleans: { subtract },
} = require('@jscad/modeling');
const main = () => {
  const outerBox = cuboid({ size: [20, 40, 40] });
  const innerBox = translate([0, 0, 2], cuboid({ size: [18, 38, 38] }));
  const container = subtract(outerBox, innerBox);

  return container;
}

module.exports = { main }
