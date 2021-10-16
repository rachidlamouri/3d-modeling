import { expect } from 'chai';
import { buildDimensionDefinitions } from '../../dimensionParser/buildDimensionDefinitions';

describe('dimensionParser/buildDimensionDefinitions', () => {
  it('defaults missing dimensions to themselves', () => {
    const dimensionNames = [
      'var1',
      'var2',
      'var3',
    ] as const;

    const result = buildDimensionDefinitions<typeof dimensionNames>(
      dimensionNames,
      {
        var2: 'var1 + var3',
      },
    );

    expect(result).to.eql({
      var1: 'var1',
      var2: 'var1 + var3',
      var3: 'var3',
    });
  });
});
