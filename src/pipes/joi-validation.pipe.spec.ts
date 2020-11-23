import { JoiValidationPipe } from './joi-validation.pipe';
import * as Joi from '@hapi/joi';
import { BadRequestException } from '@nestjs/common';

interface Value {
  name: string;
}

describe('JoiValidationPipe', () => {
  const joiSchema: Joi.ObjectSchema = Joi.object<Value>({
    name: Joi.string()
      .trim()
      .required(),
  });

  it('should return validated value', () => {
    const joiValidationPipe = new JoiValidationPipe(joiSchema);
    const value: Value = { name: 'John Doe' };
    const transformedValue = joiValidationPipe.transform(value, {
      type: 'custom',
    });
    expect(transformedValue).toStrictEqual(value);
  });

  it('should throw exception on validation failure', () => {
    const joiValidationPipe = new JoiValidationPipe(joiSchema);
    const value: Partial<Value> = {};
    const t = () => joiValidationPipe.transform(value, { type: 'custom' });
    expect(t).toThrowError(BadRequestException);
  });
});
