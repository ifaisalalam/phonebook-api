import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

import { AppConfigModule } from './config/app/app-config.module';
import { PhonebookModule } from './phonebook/phonebook.module';

@Module({
  imports: [AppConfigModule, DatabaseModule, AuthModule, PhonebookModule],
})
export class AppModule {}
