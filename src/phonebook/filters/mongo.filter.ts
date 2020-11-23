import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class MongoFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const response: Response = host.switchToHttp().getResponse<Response>();
    if (exception.code === 11000) {
      return response.status(HttpStatus.CONFLICT).json({
        message: `email already exists`,
      });
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : { statusCode: status, message: 'something went wrong' };

    return response.status(status).json(message);
  }
}
