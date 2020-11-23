import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ApiStrategy } from './strategies/api.strategy';
import { AuthConfigModule } from '../config/auth/auth-config.module';

describe('AuthService', () => {
  let service: AuthService;
  let configService: ConfigService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthConfigModule,
        PassportModule,
      ],
      providers: [AuthService, ApiStrategy],
    }).compile();

    service = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return false on invalid auth token', async () => {
    const invalidToken = 'invalid_token';
    const isValidToken = service.validateAuthToken(invalidToken);
    await expect(isValidToken).resolves.toBe(false);
  });

  it ('should return true on valid auth token', async () => {
    const validToken = configService.get<string>('AUTH_TOKEN');
    const isValidToken = service.validateAuthToken(validToken);
    await expect(isValidToken).resolves.toBe(true);
  })
});
