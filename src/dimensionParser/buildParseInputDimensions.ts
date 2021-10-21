import _ from 'lodash';
import { buildDimensionDefinitions } from './buildDimensionDefinitions';
import { VariableLiterals } from '../expressionParser/statement';
import { parseDimensions, DimensionDefinitions } from './parseDimensions';
import { entries, fromEntries } from './utils';
import { AggregateError } from '../utils/error';
import { VariableEquation } from '../expressionParser/variableEquation';

export type Dimensions<DimensionNames extends VariableLiterals> = { [Name in DimensionNames[number]]: number };

export type InputDimensions<DimensionNames extends VariableLiterals> = Partial<Dimensions<DimensionNames>>;

type WorkingValue = number | null;

type SerializedWorkingDimension = {
  input: WorkingValue;
  computed: WorkingValue;
}

class WorkingDimension {
  #dimensionName: string;
  #inputValue: WorkingValue;
  #computedValue: WorkingValue = null;

  constructor(dimensionName: string, inputValue: WorkingValue) {
    this.#dimensionName = dimensionName;
    this.#inputValue = inputValue;
  }

  get computedValue() {
    return this.#computedValue;
  }

  set computedValue(computedValue: WorkingValue) {
    if (computedValue === null) {
      throw Error('Cannot set computedValue to null');
    }

    const tolerance = 0.00001;
    const hasInputConflict = this.#inputValue !== null && Math.abs(this.#inputValue - computedValue) > tolerance;
    const hasComputedConflict = (
      this.#computedValue !== null
      && Math.abs(this.#computedValue - computedValue) > tolerance
    );

    let error = null;
    if (hasInputConflict && !hasComputedConflict) {
      error = new Error(`"${this.#dimensionName}" has mismatched input value "${this.#inputValue}" and computed value "${computedValue}"`);
    }

    if (!hasInputConflict && hasComputedConflict) {
      error = new Error(`"${this.#dimensionName}" has mismatched computed values "${this.#computedValue}" and "${computedValue}"`);
    }

    if (hasInputConflict && hasComputedConflict) {
      error = new Error(`"${this.#dimensionName}" has mismatched input value "${this.#inputValue}" and computed values "${this.#computedValue}" and "${computedValue}"`);
    }

    this.#computedValue = error !== null ? null : computedValue;

    if (error) {
      throw error;
    }
  }

  hasValue() {
    return this.value !== null;
  }

  get inputValue() {
    return this.#inputValue;
  }

  get value() {
    return this.#inputValue ?? this.#computedValue ?? null;
  }

  serialize(): SerializedWorkingDimension {
    return {
      input: this.#inputValue,
      computed: this.#computedValue,
    };
  }
}

type WorkingDimensions<DimensionNames extends VariableLiterals> = {
  [Name in keyof Dimensions<DimensionNames>]: WorkingDimension
}

type SerializedWorkingDimensions<DimensionNames extends VariableLiterals> = {
  [Name in keyof Dimensions<DimensionNames>]: SerializedWorkingDimension
}

export class AggregateParseInputDimensionError<DimensionNames extends VariableLiterals> extends AggregateError {
  workingDimensions: SerializedWorkingDimensions<DimensionNames>

  constructor(
    workingDimensions: WorkingDimensions<DimensionNames>,
    errors: Error[],
  ) {
    super(errors);

    this.workingDimensions = _.mapValues(workingDimensions, (workingDimension) => workingDimension.serialize());
  }
}

type InputDimensionParser<DimensionNames extends VariableLiterals> =
  (inputDimensions: InputDimensions<DimensionNames>) => Dimensions<DimensionNames>;

const initializeAllDimensions = <DimensionNames extends VariableLiterals>(
  dimensionNames: DimensionNames,
  inputDimensions: InputDimensions<DimensionNames>,
): WorkingDimensions<DimensionNames> => {
  const allEntries = dimensionNames.map((name: DimensionNames[number]) => [
    name,
    new WorkingDimension(name, inputDimensions[name] ?? null),
  ]);

  return Object.fromEntries(allEntries);
};

export const buildParseInputDimensions = <DimensionNames extends VariableLiterals>(
  dimensionNames: DimensionNames,
  partialDefinitions: Partial<DimensionDefinitions<DimensionNames>>,
): InputDimensionParser<DimensionNames> => {
  const allDefinitions = buildDimensionDefinitions(dimensionNames, partialDefinitions);
  const equationSystems = parseDimensions<DimensionNames>(dimensionNames, allDefinitions);
  const allEquations = entries(equationSystems).flatMap(([dimensionName, equations]) => (
    equations.map((equation) => [dimensionName, equation] as [DimensionNames[number], VariableEquation<DimensionNames>])
  ));

  const parseInputDimensions = (inputDimensions: InputDimensions<DimensionNames>) => {
    const workingDimensions = initializeAllDimensions(dimensionNames, inputDimensions);

    let nextEquations = allEquations.map(([dimensionName, equation]) => ({
      dimensionName,
      equation,
      value: null as WorkingValue,
    }));

    let unsolvedCount = nextEquations.length;
    do {
      nextEquations = nextEquations.map(({ dimensionName, equation }) => {
        const requiredDimensionsNames = equation.rightExpression.getVariableNames();
        const hasRequiredDimensions = requiredDimensionsNames.every(
          (name) => workingDimensions[name].hasValue(),
        );

        let value = null;
        if (hasRequiredDimensions) {
          const variables = fromEntries(
            requiredDimensionsNames.map((name) => [name, workingDimensions[name].value as number]),
          );

          value = equation.rightExpression.compute(variables);
        }

        return { dimensionName, equation, value };
      });

      nextEquations.forEach(({ dimensionName, value }) => {
        if (value !== null) {
          workingDimensions[dimensionName].computedValue = value;
        }
      });

      nextEquations = nextEquations.filter(({ value }) => value === null);

      if (nextEquations.length === unsolvedCount) {
        const unsolvedVariableNames = entries(workingDimensions)
          .filter(([, workingDimension]) => !workingDimension.hasValue())
          .map(([variableName]) => variableName);

        const errors = unsolvedVariableNames.flatMap((variableName) => (

          equationSystems[variableName]
            .filter((equation, index, equations) => !equation.isTautology() || equations.length === 1)
            // TODO: Fix "simplify"
            .map((equation) => new Error(`Unable to solve \`${equation.simplify().simplify().simplify().toString()}\``))
        ));

        throw new AggregateParseInputDimensionError(workingDimensions, errors);
      }

      unsolvedCount = nextEquations.length;
    } while (unsolvedCount > 0);

    const dimensions = fromEntries(
      entries(workingDimensions)
        .map(([name, workingDimension]) => [name, workingDimension.value as number]),
    );

    return dimensions;
  };

  return parseInputDimensions;
};
