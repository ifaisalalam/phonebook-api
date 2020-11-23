import { UpdateContactDto } from '../dto/update-contact.dto';
import { updateContactSchema } from './update-contact.schema';

describe('update-contact schema', () => {
  it('should pass validation', async () => {
    const updateContactDto: UpdateContactDto = {
      name: 'John Doe',
      phone: '+91N;()/,.#*1230',
      email: 'john.doe@example.com',
    };

    const { error } = updateContactSchema.validate(updateContactDto);
    expect(error).toBeUndefined();
  });

  it('should return phone validation error', () => {
    const updateContactDto: UpdateContactDto = {
      phone: '+91N;.()/,%ABab1230',
    };

    const { error } = updateContactSchema.validate(updateContactDto);
    expect(error).toBeDefined();
    expect(error.details[0].path[0]).toEqual('phone');
  });

  it('should return email validation error', () => {
    const updateContactDto: UpdateContactDto = {
      email: 'john.doe[at]example.com',
    };

    const { error } = updateContactSchema.validate(updateContactDto);
    expect(error).toBeDefined();
    expect(error.details[0].path[0]).toEqual('email');
  });

  it('should NOT return error if no property is specified', () => {
    const updateContactDto: Partial<UpdateContactDto> = {};

    const { error } = updateContactSchema.validate(updateContactDto);
    expect(error).toBeUndefined();
  });
});
