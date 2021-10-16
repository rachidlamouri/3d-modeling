export class AggregateError extends Error {
  errors: Error[]
  messages: string[];

  constructor(errors: Error[]) {
    const messages = errors.map((error) => error.message);
    const message = [
      `AggregateError: ${errors.length} errors`,
      ...messages,
    ].join('\n');

    super(message);

    this.errors = errors;
    this.messages = messages;
  }
}
