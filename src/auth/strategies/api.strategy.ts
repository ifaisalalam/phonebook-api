import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class ApiStrategy extends PassportStrategy(Strategy, 'api') {
  constructor(private authService: AuthService) {
    super({
      passReqToCallback: false,
    });
  }

  async validate(
    token: string,
    callback: (error: Error, params: any) => void,
  ): Promise<any> {
    const isValidToken = await this.authService.validateAuthToken(token);
    if (!isValidToken) {
      throw new UnauthorizedException();
    }

    return callback(null, {});
  }
}
