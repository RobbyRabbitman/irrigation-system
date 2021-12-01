import { UserSchema, UserName } from '@irrigation/shared/model';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserName, schema: UserSchema }]),
  ],
  providers: [UserService],
  exports: [UserService, MongooseModule],
  controllers: [UserController],
})
export class UserModule {}
