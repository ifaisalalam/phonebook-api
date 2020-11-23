import { searchContactSchema } from './search-contact.schema';
import { SearchContactsDto } from '../dto/search-contacts.dto';

describe('search-contact schema', () => {
  describe('valid inputs', () => {
    it('should pass property=name', async () => {
      const searchContactDto: SearchContactsDto = {
        property: 'name',
        value: 'John',
        page: 1,
      };

      const { error } = searchContactSchema.validate(searchContactDto);
      expect(error).toBeUndefined();
    });

    it('should pass property=email', async () => {
      const searchContactDto: SearchContactsDto = {
        property: 'email',
        value: 'example.com',
        page: 1,
      };

      const { error } = searchContactSchema.validate(searchContactDto);
      expect(error).toBeUndefined();
    });

    it('should pass page=undefined', async () => {
      const searchContactDto: SearchContactsDto = {
        property: 'name',
        value: 'John',
      };

      const { error } = searchContactSchema.validate(searchContactDto);
      expect(error).toBeUndefined();
    });
  });

  describe('invalid inputs', () => {
    it('should fail of property does not have a valid value', async () => {
      const searchContactDto: SearchContactsDto = {
        property: 'phone',
        value: '123',
        page: 1,
      };

      const { error } = searchContactSchema.validate(searchContactDto);
      expect(error).toBeDefined();
      expect(error.details[0].path[0]).toEqual('property');
    });

    it('should pass and set page=1 if page is less than 1', () => {
      const searchContactDto: SearchContactsDto = {
        property: 'name',
        value: 'John',
        page: 0,
      };

      const { error, value } = searchContactSchema.validate(searchContactDto);
      expect(error).toBeUndefined();
      expect(value.page).toStrictEqual(1);
    });
  });
});
