import { Inject, Injectable } from '@nestjs/common';
import { pbkdf2, randomBytes, timingSafeEqual } from 'crypto';

export interface PasswordOptions {
  hashBytes: number;
  saltBytes: number;
  iterations: number;
  digest: string;
}

export const PASSWORD_OPTIONS = 'PASSWORD_OPTIONS';

@Injectable()
export class PasswordService {
  private readonly encoding = 'hex';
  private readonly delimiter = '.';

  public constructor(
    @Inject(PASSWORD_OPTIONS) private readonly options: PasswordOptions
  ) {}

  private readonly encode = (buffer: Buffer) => buffer.toString(this.encoding);
  private readonly decode = (string: string) =>
    Buffer.from(string, this.encoding);

  private readonly join = (
    hash: string,
    salt: string,
    { digest, iterations, hashBytes }: PasswordOptions
  ): string => [hash, salt, iterations, hashBytes, digest].join(this.delimiter);

  private readonly split = (password: string) => {
    const [hash, salt, iterations, hashBytes, digest] = password.split(
      this.delimiter
    );
    return [
      this.decode(hash),
      salt,
      Number(iterations),
      Number(hashBytes),
      digest,
    ] as const;
  };

  private readonly DEFAULT_REJECT = (
    reject: (reason?: unknown) => void,
    error: Error
  ) => reject(`Hashing failed: ${error.name}: ${error.message}`);

  public readonly hash = (password: string) =>
    new Promise<string>((resolve, reject) => {
      try {
        return randomBytes(this.options.saltBytes, (error, saltBuffer) => {
          if (error) this.DEFAULT_REJECT(reject, error);
          const salt = this.encode(saltBuffer);
          pbkdf2(
            password,
            salt,
            this.options.iterations,
            this.options.hashBytes,
            this.options.digest,
            (error, hashBuffer) => {
              if (error) this.DEFAULT_REJECT(reject, error);
              resolve(this.join(this.encode(hashBuffer), salt, this.options));
            }
          );
        });
      } catch (error) {
        this.DEFAULT_REJECT(reject, error);
      }
    });

  public readonly compare = (password: string, stored: string) =>
    new Promise<boolean>((resolve, reject) => {
      try {
        const [storedhash, salt, iterations, hashBytes, digest] =
          this.split(stored);
        pbkdf2(password, salt, iterations, hashBytes, digest, (error, hash) => {
          if (error) this.DEFAULT_REJECT(reject, error);
          resolve(timingSafeEqual(hash, storedhash));
        });
      } catch (error) {
        this.DEFAULT_REJECT(reject, error);
      }
    });
}
