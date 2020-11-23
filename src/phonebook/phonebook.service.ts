import { Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { Phonebook } from './phonebook.entity';
import { AddContactDto } from './dto/add-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID } from 'mongodb';

@Injectable()
export class PhonebookService {
  constructor(
    @InjectRepository(Phonebook)
    private readonly phonebookRepository: MongoRepository<Phonebook>,
  ) {}

  async addContact(data: AddContactDto): Promise<Phonebook> {
    return this.phonebookRepository.save(new Phonebook(data));
  }

  async getAllContacts(): Promise<Phonebook[]> {
    return this.phonebookRepository.find();
  }

  async getContactInfo(id: string): Promise<Phonebook> {
    if (!ObjectID.isValid(id)) {
      return undefined;
    }

    return this.phonebookRepository.findOne(<unknown>id);
  }

  async searchContacts(
    property: string,
    value: string,
    page: number,
    maxResultsPerPage: number,
  ): Promise<[Phonebook[], number]> {
    return this.phonebookRepository.findAndCount({
      where: { [property]: { $regex: value, $options: 'i' } },
      take: maxResultsPerPage,
      skip: page - 1,
    });
  }

  async updateContactData(
    id: string,
    data: Partial<Phonebook>,
  ): Promise<Phonebook | undefined> {
    if (!ObjectID.isValid(id)) {
      return undefined;
    }

    const phonebook = await this.phonebookRepository.findOne(id);
    if (!phonebook) {
      return undefined;
    }

    phonebook.name = data.name || phonebook.name;
    phonebook.phone = data.phone || phonebook.phone;
    phonebook.email = data.email || phonebook.email;

    return this.phonebookRepository.save(phonebook);
  }

  async deleteContact(id: string) {
    if (!ObjectID.isValid(id)) {
      return undefined;
    }

    const contact = await this.phonebookRepository.findOne(id);
    if (!contact) {
      return undefined;
    }

    await this.phonebookRepository.delete(contact);
    return contact;
  }
}
