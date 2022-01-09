import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.stategy';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { PasswordService, PASSWORD_OPTIONS } from './password.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: String(process.env.JWT_SECRET),
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    PasswordService,
    {
      provide: PASSWORD_OPTIONS,
      useValue: {
        hashBytes: Number(process.env.PASSWORD_HASH_BYTES),
        saltBytes: Number(process.env.PASSWORD_SALT_BYTES),
        iterations: Number(process.env.PASSWORD_ITERATIONS),
        digest: process.env.PASSWORD_DIGEST,
      },
    },
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
