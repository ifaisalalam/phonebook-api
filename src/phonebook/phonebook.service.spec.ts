import { Test, TestingModule } from '@nestjs/testing';
import { PhonebookService } from './phonebook.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Phonebook } from './phonebook.entity';
import { PhonebookController } from './phonebook.controller';
import { DatabaseModule } from '../database/database.module';
import { AddContactDto } from './dto/add-contact.dto';
import * as faker from 'faker';

describe('PhonebookService', () => {
  let module: TestingModule;

  let phonebookService: PhonebookService;
  const contact: Partial<Phonebook> = {
    name: 'John Doe',
    phone: '+1 0000000000',
    email: 'john.doe@example.com',
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule, TypeOrmModule.forFeature([Phonebook])],
      controllers: [PhonebookController],
      providers: [PhonebookService],
    }).compile();

    phonebookService = module.get<PhonebookService>(PhonebookService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(phonebookService).toBeDefined();
  });

  it('should add new contact', async () => {
    const addContactResponse = await phonebookService.addContact(
      <AddContactDto>contact,
    );
    expect(addContactResponse.name).toStrictEqual(contact.name);
    expect(addContactResponse.phone).toStrictEqual(contact.phone);
    expect(addContactResponse.email).toStrictEqual(contact.email);
  });

  it('should list all contacts', async () => {
    const contacts = await phonebookService.getAllContacts();
    expect(contacts).toBeDefined();
    expect(Array.isArray(contacts)).toBe(true);
    expect(contacts.length).toBeGreaterThan(0);
    expect(contacts[0]).toBeDefined();
    expect(contacts[0].name).toBeDefined();
    expect(contacts[0].phone).toBeDefined();
    expect(contacts[0].email).toBeDefined();
  });

  describe('getContactInfo', () => {
    it('should return contact info by id', async () => {
      const contacts = await phonebookService.getAllContacts();
      expect(contacts).toBeDefined();
      expect(Array.isArray(contacts)).toBe(true);
      expect(contacts.length).toBeGreaterThan(0);
      const testContact = contacts[0];

      const contactInfo = await phonebookService.getContactInfo(
        String(testContact.id),
      );
      expect(contactInfo).toBeDefined();
      expect(contactInfo.name).toStrictEqual(testContact.name);
      expect(contactInfo.phone).toStrictEqual(testContact.phone);
      expect(contactInfo.email).toStrictEqual(testContact.email);
    });

    it('should return undefined if id does not exist', async () => {
      const contactInfo = phonebookService.getContactInfo(
        '123456789abc123abc456abc',
      );
      await expect(contactInfo).resolves.toBeUndefined();
    });

    it('should return undefined if id is invalid', async () => {
      const contactInfo = phonebookService.getContactInfo('abc');
      await expect(contactInfo).resolves.toBeUndefined();
    });
  });

  describe('searchContacts', () => {
    const MAX_RESULTS_PER_PAGE = 2;
    const contacts: Partial<Phonebook>[] = [];
    const commonFirstName = faker.name.firstName();

    beforeAll(async () => {
      // Create fake contacts.
      for (let count = 0; count < 10; ++count) {
        contacts.push(<Partial<Phonebook>>{
          name: faker.name.findName(commonFirstName),
          phone: faker.phone.phoneNumber(),
          email: faker.internet.exampleEmail(),
        });
      }

      // Save generated contacts in DB.
      for (const contact of contacts) {
        await phonebookService.addContact(<AddContactDto>contact);
      }
    });

    it('should return zero results', async () => {
      const [results, total] = await phonebookService.searchContacts(
        'name',
        'name_does_not_exist',
        1,
        MAX_RESULTS_PER_PAGE,
      );

      expect(total).toStrictEqual(0);
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toEqual(0);
    });

    it('should match results without case-sensitivity', async () => {
      const contact = contacts[0];
      const [results, total] = await phonebookService.searchContacts(
        'name',
        contact.name.toUpperCase(),
        1,
        MAX_RESULTS_PER_PAGE,
      );

      expect(total).toBeGreaterThan(0);
      expect(results.length).toBeGreaterThan(0);
    });

    it('should not return results more than "MAX_RESULTS_PER_PAGE"', async () => {
      const [results, total] = await phonebookService.searchContacts(
        'name',
        commonFirstName,
        1,
        MAX_RESULTS_PER_PAGE,
      );

      expect(total).toBeGreaterThanOrEqual(contacts.length);
      expect(results.length).toBeGreaterThan(0);
      expect(results.length).toBeLessThanOrEqual(MAX_RESULTS_PER_PAGE);
    });

    it('should return different results for different pages', async () => {
      let [results] = await phonebookService.searchContacts(
        'name',
        commonFirstName,
        1,
        MAX_RESULTS_PER_PAGE,
      );

      const firstResultOfFirstPage = results[0];
      expect(firstResultOfFirstPage).toBeDefined();
      expect(firstResultOfFirstPage.id).toBeDefined();

      [results] = await phonebookService.searchContacts(
        'name',
        commonFirstName,
        2,
        MAX_RESULTS_PER_PAGE,
      );

      const firstResultOfSecondPage = results[0];
      expect(firstResultOfSecondPage).toBeDefined();
      expect(firstResultOfSecondPage.id).toBeDefined();

      expect(
        String(firstResultOfFirstPage.id) ===
          String(firstResultOfSecondPage.id),
      ).toBe(false);
    });

    it('should return contacts by matching email', async () => {
      const [, total] = await phonebookService.searchContacts(
        'email',
        '@example.com',
        1,
        MAX_RESULTS_PER_PAGE,
      );

      expect(total).toBeGreaterThan(0);
    });
  });

  describe('updateContactData', () => {
    it('should return undefined if id does not exist', async () => {
      const updateOpResponse = phonebookService.updateContactData(
        '123456789abc123abc456abc',
        <Partial<Phonebook>>{ email: 'test@example.com' },
      );

      await expect(updateOpResponse).resolves.toBeUndefined();
    });

    it('should return undefined if id is invalid', async () => {
      const updateOpResponse = phonebookService.updateContactData('abc', <
        Partial<Phonebook>
      >{ email: 'test@example.com' });

      await expect(updateOpResponse).resolves.toBeUndefined();
    });

    it('should update an existing contact', async () => {
      const contacts = await phonebookService.getAllContacts();
      const contact = contacts[0];
      const newEmail = faker.internet.email();

      const updatedContact = await phonebookService.updateContactData(
        String(contact.id),
        <Partial<Phonebook>>{ email: newEmail },
      );
      expect(updatedContact).toBeDefined();
      expect(updatedContact.email).toStrictEqual(newEmail);
      expect(updatedContact.name).toStrictEqual(contact.name);
      expect(updatedContact.phone).toStrictEqual(contact.phone);
    });
  });
});
