import { Expression } from './expression.js';

export class VariableExpression extends Expression {
  constructor(properties) {
    const { variableName } = properties;
    super(properties);
    this.name = variableName;
  }

  getVariableNames() {
    return [this.name];
  }

  simplify() {
    return this;
  }

  serialize() {
    return `${this.name}`;
  }

  compute(variables) {
    return variables[this.name];
  }
}
