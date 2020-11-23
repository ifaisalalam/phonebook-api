import { Test, TestingModule } from '@nestjs/testing';
import { PhonebookController } from './phonebook.controller';
import { PhonebookService } from './phonebook.service';
import { AddContactDto } from './dto/add-contact.dto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Phonebook } from './phonebook.entity';
import { DatabaseModule } from '../database/database.module';
import * as faker from 'faker';
import { NotFoundException } from '@nestjs/common';

describe('PhonebookController', () => {
  let module: TestingModule;

  let phonebookController: PhonebookController;
  const contact: Partial<Phonebook> = {
    name: 'Scooby Doo',
    phone: '+1 0000000001',
    email: 'scooby.doo@example.com',
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule, TypeOrmModule.forFeature([Phonebook])],
      controllers: [PhonebookController],
      providers: [PhonebookService],
    }).compile();

    phonebookController = module.get<PhonebookController>(PhonebookController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(phonebookController).toBeDefined();
  });

  describe('phonebook', () => {
    describe('add', () => {
      it('should add new contact', async () => {
        const addContactResponse = await phonebookController.addContact(
          <AddContactDto>contact,
        );
        expect(addContactResponse.name).toStrictEqual(contact.name);
        expect(addContactResponse.phone).toStrictEqual(contact.phone);
        expect(addContactResponse.email).toStrictEqual(contact.email);
      });
    });

    describe('list', () => {
      it('should list all contacts', async () => {
        const contacts = phonebookController.listContacts();
        await expect(contacts).resolves.toBeDefined();
      });
    });

    describe('info/:id', () => {
      it('should return contact info given the id', async () => {
        const contacts = await phonebookController.listContacts();
        const contact = contacts[0];
        const contactInfo = await phonebookController.getContactInfo(
          String(contact.id),
        );
        expect(contactInfo).toStrictEqual(contact);
      });

      it('should return error if contact not found', async () => {
        const contact = phonebookController.getContactInfo(
          '123456789abc123abc456abc',
        );
        await expect(contact).rejects.toThrowError();
      });
    });

    describe('update', () => {
      it('should return the updated contact', async () => {
        const contacts = await phonebookController.listContacts();
        const contact = contacts[0];
        const newName = faker.name.findName();
        const newPhone = faker.phone.phoneNumber();
        const newEmail = faker.internet.email();

        const updatedContact = await phonebookController.update(
          String(contact.id),
          { name: newName, phone: newPhone, email: newEmail },
        );
        expect(updatedContact.email).toStrictEqual(newEmail);
        expect(updatedContact.name).toStrictEqual(newName);
        expect(updatedContact.phone).toStrictEqual(newPhone);
        expect(updatedContact.id).toStrictEqual(contact.id);
      });

      it('should return undefined if contact does not exist', async () => {
        const updatedContact = phonebookController.update(
          '123456789abc123abc456abc',
          {
            name: faker.name.findName(),
          },
        );

        await expect(updatedContact).rejects.toThrowError();
      });
    });

    describe('search', () => {
      it('should return matching contacts by name', async () => {
        const searchResponse = await phonebookController.search({
          property: 'name',
          value: 'a',
        });

        expect(searchResponse).toBeDefined();
        expect(searchResponse.total_pages).toBeDefined();
        expect(searchResponse.count_results).toBeDefined();
        expect(searchResponse.count_page_results).toBeDefined();
        expect(searchResponse.current_page).toBeDefined();
        expect(searchResponse.results).toBeDefined();
      });

      it('should return matching contacts by email', async () => {
        const searchResponse = await phonebookController.search({
          property: 'email',
          value: '@',
        });

        expect(searchResponse).toBeDefined();
        expect(searchResponse.total_pages).toBeDefined();
        expect(searchResponse.count_results).toBeDefined();
        expect(searchResponse.count_page_results).toBeDefined();
        expect(searchResponse.current_page).toBeDefined();
        expect(searchResponse.results).toBeDefined();
      });
    });

    describe('delete/:id', () => {
      let contact: Partial<Phonebook> = {
        name: faker.name.findName().substr(0, 50),
        email: faker.internet.exampleEmail(),
      };

      beforeEach(async () => {
        contact = await phonebookController.addContact(<AddContactDto>contact);
      });

      it('should delete existing contact', async () => {
        const deleteContactResponse = await phonebookController.deleteContact(
          String(contact.id),
        );
        expect(deleteContactResponse.success).toBe(true);
        expect(deleteContactResponse.deletedContact).toStrictEqual(contact);

        const findContactResponse = phonebookController.getContactInfo(
          String(contact.id),
        );
        await expect(findContactResponse).rejects.toThrowError(
          NotFoundException,
        );
      });

      it('should return undefined if contact does not exist', async () => {
        const deleteContactResponse = phonebookController.deleteContact(
          '1234567890abc1234567890a',
        );
        await expect(deleteContactResponse).rejects.toThrowError(
          NotFoundException,
        );
      });
    });
  });
});
