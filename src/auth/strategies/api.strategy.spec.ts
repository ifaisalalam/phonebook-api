import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ApiStrategy } from './api.strategy';
import { AuthConfigModule } from '../../config/auth/auth-config.module';
import { AuthService } from '../auth.service';

describe('ApiStrategy', () => {
  let strategy: ApiStrategy;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthConfigModule, PassportModule],
      providers: [AuthService, ApiStrategy],
    }).compile();

    strategy = module.get<ApiStrategy>(ApiStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should fail on invalid auth token', async () => {
    const invalidToken = 'invalid_token';
    const callback = jest.fn(err => err);
    await expect(
      strategy.validate(invalidToken, callback),
    ).rejects.toBeDefined();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  it('should pass on valid auth token', async () => {
    const validToken = configService.get<string>('AUTH_TOKEN');
    const callback = jest.fn(err => err);
    await expect(
      strategy.validate(validToken, callback),
    ).resolves.toBeDefined();
    expect(callback).toHaveBeenCalled();
    expect(callback.mock.calls[0][0]).toBeNull();
  });
});
