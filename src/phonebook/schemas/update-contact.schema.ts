import * as Joi from '@hapi/joi';
import { UpdateContactDto } from '../dto/update-contact.dto';
import { joiValidatePhoneUtil } from './utils/joi-validate-phone.util';

export const updateContactSchema = Joi.object<UpdateContactDto>({
  name: Joi.string()
    .trim()
    .max(100)
    .optional(),
  phone: Joi.string()
    .optional()
    .custom(joiValidatePhoneUtil),
  email: Joi.string()
    .optional()
    /**
     * @see https://www.rfc-editor.org/rfc/rfc3696.txt
     */
    .max(320)
    .email()
    .custom((value: string) => value.toLowerCase()),
});
