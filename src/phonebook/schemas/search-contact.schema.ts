import * as Joi from '@hapi/joi';
import { SearchContactsDto } from '../dto/search-contacts.dto';

export const searchContactSchema = Joi.object<SearchContactsDto>({
  property: Joi.string()
    .required()
    .valid('name', 'email'),
  value: Joi.string()
    .trim()
    .required(),
  page: Joi.number()
    .optional()
    .custom(value => {
      if (value <= 0) {
        return 1;
      }

      return value;
    }),
});
