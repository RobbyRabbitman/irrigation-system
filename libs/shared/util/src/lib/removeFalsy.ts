import { isNullish } from '..';

export function removeNullish<T>(obj: T): Partial<T> {
  for (const key in obj) if (isNullish(obj[key])) delete obj[key];
  return obj;
}
