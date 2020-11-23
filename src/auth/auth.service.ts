import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  async validateAuthToken(token: string): Promise<boolean> {
    const authToken = this.configService.get<string>('AUTH_TOKEN');
    return token && token === authToken;
  }
}
