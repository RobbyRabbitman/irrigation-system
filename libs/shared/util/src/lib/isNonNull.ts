export function isNonNull<T>(value: T): value is T {
  return value !== null && value !== undefined;
}
