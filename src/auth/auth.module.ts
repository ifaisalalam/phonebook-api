import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { ApiStrategy } from './strategies/api.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, PassportModule],
  providers: [AuthService, ApiStrategy],
  exports: [AuthService],
})
export class AuthModule {}
