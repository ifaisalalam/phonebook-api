import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfigService {
  constructor(private configService: ConfigService) {}

  get configuration(): TypeOrmModuleOptions {
    return {
      type: 'mongodb',
      url: this.configService.get<string>('MONGO_URL'),
      useNewUrlParser: true,
      entities: [__dirname + '/../../../**/*.entity{.ts,.js}'],
      synchronize: true,
      migrationsRun: false,
      useUnifiedTopology: true,
    };
  }
}
