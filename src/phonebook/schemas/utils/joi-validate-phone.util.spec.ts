import { Context, LanguageMessages, CustomHelpers } from '@hapi/joi';
import { joiValidatePhoneUtil } from './joi-validate-phone.util';

describe('joiValidatePhoneUtil', () => {
  it('should pass on valid phone number', () => {
    const value = '+095678 9./N*#;,()';
    const mockHelpers = {
      message: jest.fn<any, [LanguageMessages, Context]>(err => err),
    };

    const validatedValue = joiValidatePhoneUtil(
      value,
      <CustomHelpers>(<unknown>mockHelpers),
    );
    expect(validatedValue).toStrictEqual(value);
    expect(mockHelpers.message).toHaveBeenCalledTimes(0);
  });

  it('should fail invalid phone number', () => {
    const value = '+%^abc123';
    const mockHelpers = {
      message: jest.fn<any, [LanguageMessages, Context]>(err => err),
    };

    const validatedValue = joiValidatePhoneUtil(
      value,
      <CustomHelpers>(<unknown>mockHelpers),
    );
    const expectedError = { custom: 'invalid phone number' };
    expect(validatedValue).toStrictEqual(expectedError);
    expect(mockHelpers.message).toHaveBeenCalled();
    expect(mockHelpers.message.mock.calls[0][0]).toStrictEqual(expectedError);
  });

  it('should fail too long phone number', () => {
    const value = '90123456789001234567890';
    const mockHelpers = {
      message: jest.fn<any, [LanguageMessages, Context]>(err => err),
    };

    const validatedValue = joiValidatePhoneUtil(
      value,
      <CustomHelpers>(<unknown>mockHelpers),
    );
    const expectedError = { custom: 'invalid phone number' };
    expect(validatedValue).toStrictEqual(expectedError);
    expect(mockHelpers.message).toHaveBeenCalled();
    expect(mockHelpers.message.mock.calls[0][0]).toStrictEqual(expectedError);
  });
});
