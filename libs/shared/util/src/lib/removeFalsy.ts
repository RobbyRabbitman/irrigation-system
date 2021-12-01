import { isNonNull } from './isNonNull';

export function removeFalsy<T>(obj: T): Partial<T> {
  for (const key in obj) {
    if (!isNonNull(obj[key])) delete obj[key];
  }
  return obj;
}
