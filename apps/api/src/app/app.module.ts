import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { IrrigationSystemModule } from './irrigation-system/irrigation-system.module';
import { UserModule } from './user/user.module';
import { PumpModule } from './pump/pump.module';
import { BookingModule } from './booking/booking.module';
import { AdminGuard } from './guards/admin.guard';
import { AuthenticatedUserGuard } from './guards/authenticated-user.guard';
import * as mongooseAutoPopulate from 'mongoose-autopopulate';
import { HealthModule } from './health/health.module';
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO, {
      connectionFactory: (connection) => {
        connection.plugin(mongooseAutoPopulate);
        return connection;
      },
    }),
    PumpModule,
    AuthModule,
    UserModule,
    IrrigationSystemModule,
    BookingModule,
    HealthModule,
  ],
  providers: [AdminGuard, AuthenticatedUserGuard],
})
export class AppModule {}
