import { AddContactDto } from '../dto/add-contact.dto';
import { addContactSchema } from './add-contact.schema';

describe('add-contact schema', () => {
  it('should pass validation', async () => {
    const addContactDto: AddContactDto = {
      name: 'John Doe',
      phone: '+91N;()/,.#*1230',
      email: 'john.doe@example.com',
    };

    const { error } = addContactSchema.validate(addContactDto);
    expect(error).toBeUndefined();
  });

  it('should return phone validation error', () => {
    const addContactDto: AddContactDto = {
      name: 'John Doe',
      phone: '+91N;.()/,%ABab1230',
      email: 'john.doe@example.com',
    };

    const { error } = addContactSchema.validate(addContactDto);
    expect(error).toBeDefined();
    expect(error.details[0].path[0]).toEqual('phone');
  });

  it('should return email validation error', () => {
    const addContactDto: AddContactDto = {
      name: 'John Doe',
      phone: '1234567890',
      email: 'john.doe[at]example.com',
    };

    const { error } = addContactSchema.validate(addContactDto);
    expect(error).toBeDefined();
    expect(error.details[0].path[0]).toEqual('email');
  });

  it('should return missing name error', () => {
    const addContactDto: Partial<AddContactDto> = {
      phone: '1234567890',
      email: 'john.doe[at]example.com',
    };

    const { error } = addContactSchema.validate(addContactDto);
    expect(error).toBeDefined();
    expect(error.details[0].path[0]).toEqual('name');
  });

  it('should return missing email error', () => {
    const addContactDto: Partial<AddContactDto> = {
      name: 'John Doe',
      phone: '1234567890',
    };

    const { error } = addContactSchema.validate(addContactDto);
    expect(error).toBeDefined();
    expect(error.details[0].path[0]).toEqual('email');
  });

  it('should NOT return error for missing phone', () => {
    const addContactDto: Partial<AddContactDto> = {
      name: 'John Doe',
      email: 'john.doe@example.com',
    };

    const { error } = addContactSchema.validate(addContactDto);
    expect(error).toBeUndefined();
  });
});
