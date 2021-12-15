import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { isNonNull, throwIfNullish } from '@irrigation/shared/util';

export const LOCAL_STORAGE_PREFIX = new InjectionToken<string>('', {
  providedIn: 'root',
  factory: () => 'berapp',
});

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly storage: Storage;
  private createFullKey = (suffix: string) => `${this.prefix}.${suffix}`;

  constructor(
    @Inject(DOCUMENT) document: Document,
    @Inject(LOCAL_STORAGE_PREFIX) private readonly prefix: string
  ) {
    this.storage = throwIfNullish(document.defaultView?.localStorage);
  }

  public set<T>(key: string, value: T): T {
    isNonNull(value)
      ? this.storage.setItem(this.createFullKey(key), JSON.stringify(value))
      : this.delete(key);
    return value;
  }

  public delete(key: string) {
    this.storage.removeItem(this.createFullKey(key));
  }

  public get<T>(key: string): T | null {
    const value = this.storage.getItem(this.createFullKey(key));
    return isNonNull(value) ? JSON.parse(value) : value;
  }
}
