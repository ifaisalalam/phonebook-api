import * as Joi from '@hapi/joi';
import { AddContactDto } from '../dto/add-contact.dto';
import { joiValidatePhoneUtil } from './utils/joi-validate-phone.util';

export const addContactSchema = Joi.object<AddContactDto>({
  name: Joi.string()
    .trim()
    .max(100)
    .required(),
  phone: Joi.string()
    .optional()
    .custom(joiValidatePhoneUtil),
  email: Joi.string()
    .required()
    /**
     * @see https://www.rfc-editor.org/rfc/rfc3696.txt
     */
    .max(320)
    .email()
    .custom((value: string) => value.toLowerCase()),
});
