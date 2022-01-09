import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService, PASSWORD_OPTIONS } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordService,
        {
          provide: PASSWORD_OPTIONS,
          useValue: {
            hashBytes: 8,
            saltBytes: 4,
            iterations: 5,
            digest: 'SHA256',
          },
        },
      ],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should hash and verify 'cookie123' with 'cookie123", async () => {
    const password = 'cookie123';
    const hash = await service.hash(password);
    const result = await service.compare(password, hash);
    expect(result).toBe(true);
  });

  it('should not hash deterministic', async () => {
    const password = 'cookie123';
    const hash = await service.hash(password);
    const hash2 = await service.hash(password);
    expect(hash).not.toBe(hash2);
  });
});
