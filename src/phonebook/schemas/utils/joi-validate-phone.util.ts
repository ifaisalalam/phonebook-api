import { CustomValidator } from '@hapi/joi';

export const joiValidatePhoneUtil: CustomValidator = (value, helpers) => {
  const allowedCharacters = /^[ 0123456789(\/)N,*;#+.]+$/;
  const validPhoneNumber = allowedCharacters.test(value) && value.length <= 20;
  if (!validPhoneNumber) {
    return helpers.message({ custom: 'invalid phone number' });
  }

  return value;
};
