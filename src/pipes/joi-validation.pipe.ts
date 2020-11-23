import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ObjectSchema, ValidationOptions } from '@hapi/joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(
    private schema: ObjectSchema,
    private readonly validationOptions?: ValidationOptions,
  ) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error, value: validatedValue } = this.schema.validate(
      value,
      this.validationOptions,
    );
    if (error) {
      throw new BadRequestException(error.details);
    }

    return validatedValue;
  }
}
