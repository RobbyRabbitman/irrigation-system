import { throwExpression } from './throwExpression';

export function throwIfNullish<T>(
  value: T | null | undefined,
  error = new Error('nullish value')
): T {
  return value ?? throwExpression(error);
}
