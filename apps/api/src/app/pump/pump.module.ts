import { PumpName, PumpSchema } from '@irrigation/shared/model';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PumpController } from './pump.controller';
import { PumpService } from './pump.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PumpName, schema: PumpSchema }]),
  ],
  providers: [PumpService],
  controllers: [PumpController],
  exports: [PumpService, MongooseModule],
})
export class PumpModule {}
