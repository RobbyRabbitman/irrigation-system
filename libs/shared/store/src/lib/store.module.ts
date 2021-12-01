import { ModuleWithProviders, NgModule } from '@angular/core';
import { ApiModule, BASE_PATH } from '@irrigation/generated/client';
import { StoreService } from './store.service';

@NgModule({
  imports: [ApiModule],
})
export class StoreModule {
  public static forRoot(api: string): ModuleWithProviders<StoreModule> {
    return {
      ngModule: StoreModule,
      providers: [
        {
          provide: BASE_PATH,
          useValue: api,
        },
        StoreService,
      ],
    };
  }
}
