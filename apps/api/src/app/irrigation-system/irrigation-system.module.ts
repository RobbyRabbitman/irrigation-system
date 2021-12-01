import {
  IrrigationSystemName,
  IrrigationSystemSchema,
} from '@irrigation/shared/model';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IrrigationSystemService } from './irrigation-system.service';
import { IrrigationSystemController } from './irrigation-system.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: IrrigationSystemName, schema: IrrigationSystemSchema },
    ]),
  ],
  providers: [IrrigationSystemService],
  exports: [IrrigationSystemService, MongooseModule],
  controllers: [IrrigationSystemController],
})
export class IrrigationSystemModule {}
