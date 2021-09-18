export class Expression {
  constructor({ input }) {
    this.type = this.constructor.name;
    this.input = input;
  }
}
