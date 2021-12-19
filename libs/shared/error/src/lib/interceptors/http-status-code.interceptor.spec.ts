import { TestBed } from '@angular/core/testing';

import { HttpStatusCodeInterceptor } from './http-status-code.interceptor';

describe('HttpStatusCodeInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpStatusCodeInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HttpStatusCodeInterceptor = TestBed.inject(HttpStatusCodeInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
