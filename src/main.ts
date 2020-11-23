import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { NestExpressApplication } from '@nestjs/platform-express';

import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const appConfig: ConfigService = app.get<ConfigService>('ConfigService');

  app.set(
    'trust proxy',
    !['development', 'test'].includes(appConfig.get<string>('NODE_ENV')),
  );

  const port = appConfig.get<number>('PORT');
  await app.listen(port);
}
bootstrap();
