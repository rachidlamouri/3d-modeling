import { VariableLiterals } from '../expressionParser/statement';
import type { DimensionDefinitions, PartialDimensionDefinitions } from './parseDimensions';

export const buildDimensionDefinitions = <DimensionNames extends VariableLiterals>
  (
    dimensionNames: readonly DimensionNames[number][],
    partialDefinitions: PartialDimensionDefinitions<DimensionNames>,
  ): DimensionDefinitions<DimensionNames> => {
  const definitionEntries = dimensionNames.map((name) => [name, partialDefinitions[name] ?? name]);
  return Object.fromEntries(definitionEntries);
};
