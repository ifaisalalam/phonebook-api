import * as Joi from '@hapi/joi';
import { UpdateContactDto } from '../dto/update-contact.dto';
import { joiValidatePhoneUtil } from './utils/joi-validate-phone.util';

export const updateContactSchema = Joi.object<UpdateContactDto>({
  name: Joi.string()
    .trim()
    .optional(),
  phone: Joi.string()
    .optional()
    .custom(joiValidatePhoneUtil),
  email: Joi.string()
    .optional()
    .email(),
});
