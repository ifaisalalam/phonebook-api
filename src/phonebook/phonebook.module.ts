import { Module } from '@nestjs/common';
import { PhonebookController } from './phonebook.controller';
import { PhonebookService } from './phonebook.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Phonebook } from './phonebook.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Phonebook])],
  controllers: [PhonebookController],
  providers: [PhonebookService],
})
export class PhonebookModule {}
