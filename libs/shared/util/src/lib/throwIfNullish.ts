import { throwExpression } from '..';

export function throwIfNullish<T>(
  value: T | null | undefined,
  error = 'null pointer'
): T {
  return value ?? throwExpression(error);
}
