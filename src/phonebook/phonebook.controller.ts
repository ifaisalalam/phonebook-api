import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiAuthGuard } from '../auth/guards/api-auth.guard';
import { PhonebookService } from './phonebook.service';
import { AddContactDto } from './dto/add-contact.dto';
import { SearchContactsDto } from './dto/search-contacts.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Phonebook } from './phonebook.entity';
import { MongoFilter } from './filters/mongo.filter';
import { JoiValidationPipe } from '../pipes/joi-validation.pipe';
import { addContactSchema } from './schemas/add-contact.schema';
import { searchContactSchema } from './schemas/search-contact.schema';
import { updateContactSchema } from './schemas/update-contact.schema';

@Controller('phonebook')
@UseGuards(ApiAuthGuard)
export class PhonebookController {
  constructor(private readonly phonebookService: PhonebookService) {}

  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  @UseFilters(MongoFilter)
  async addContact(
    @Body(new JoiValidationPipe(addContactSchema, { stripUnknown: true }))
    addContactDto: AddContactDto,
  ) {
    return this.phonebookService.addContact(addContactDto);
  }

  @Get('list')
  @HttpCode(HttpStatus.OK)
  listContacts() {
    // TODO: Implement pagination.
    return this.phonebookService.getAllContacts();
  }

  @Get('info/:id')
  @HttpCode(HttpStatus.OK)
  async getContactInfo(@Param('id') id: string) {
    const info = await this.phonebookService.getContactInfo(id);
    if (!info) {
      throw new NotFoundException('contact not found');
    }

    return info;
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async search(
    @Query(new JoiValidationPipe(searchContactSchema, { convert: true }))
    query: SearchContactsDto,
  ): Promise<{
    count_results: number;
    total_pages: number;
    results: Phonebook[];
    current_page: number;
    count_page_results: number;
  }> {
    const MAX_RESULTS_PER_PAGE = 10;
    const page = parseInt(String(query.page || '1'));

    const [results, total] = await this.phonebookService.searchContacts(
      query.property,
      query.value,
      page,
      MAX_RESULTS_PER_PAGE,
    );

    return {
      count_results: total,
      total_pages: Math.ceil(total / MAX_RESULTS_PER_PAGE),
      current_page: page,
      count_page_results: Math.min(total, MAX_RESULTS_PER_PAGE),
      results,
    };
  }

  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  @UseFilters(MongoFilter)
  async update(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(updateContactSchema, { stripUnknown: true }))
    updateContactDto: UpdateContactDto,
  ) {
    const updateResponse = await this.phonebookService.updateContactData(
      id,
      updateContactDto,
    );
    if (!updateResponse) {
      throw new NotFoundException('contact does not exist');
    }

    return updateResponse;
  }
}
