import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PumpName, PumpSchema } from '../model/api/pump/pump.model';
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
