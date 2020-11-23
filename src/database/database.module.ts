import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigModule } from '../config/database/typeorm-mongo/database-config.module';
import { DatabaseConfigService } from '../config/database/typeorm-mongo/database-config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [DatabaseConfigModule],
      useFactory: (databaseConfigService: DatabaseConfigService) =>
        databaseConfigService.configuration,
      inject: [DatabaseConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
