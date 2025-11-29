export function assertIsNotUndefined<T>(
  value: T | undefined,
): asserts value is T {
  if (value === undefined) {
    throw new Error('Value is undefined');
  }
}
