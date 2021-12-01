import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { IrrigationSystemModule } from './irrigation-system/irrigation-system.module';
import { UserModule } from './user/user.module';
import { PumpModule } from './pump/pump.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO),
    PumpModule,
    AuthModule,
    UserModule,
    IrrigationSystemModule,
    BookingModule,
  ],
})
export class AppModule {}
