import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  imports: [UserModule],
})
export class HealthModule {}
