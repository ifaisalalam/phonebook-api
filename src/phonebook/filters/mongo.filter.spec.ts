import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { MongoFilter } from './mongo.filter';
import { MongoError } from 'mongodb';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

describe('MongoFilter', () => {
  let mongoFilter: MongoFilter;

  const mockResponse = () => {
    const res: { [x: string]: any } = {};
    res.status = jest.fn(status => res);
    res.json = jest.fn(json => res);
    return res;
  };

  const mockArgumentHost = (mockedResponse): Partial<ArgumentsHost> =>
    <ArgumentsHost>{
      switchToHttp(): Partial<HttpArgumentsHost> {
        return {
          getResponse(): any {
            return mockedResponse;
          },
        };
      },
    };

  beforeAll(() => {
    mongoFilter = new MongoFilter();
  });

  it('should return CONFLICT response on exception code 11000', () => {
    const mongoException = new MongoError('');
    mongoException['code'] = 11000;
    const mockedResponse = mockResponse();
    mongoFilter.catch(
      mongoException,
      <ArgumentsHost>(<unknown>mockArgumentHost(mockedResponse)),
    );
    expect(mockedResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
  });

  it('should pass HttpException with its own status and message', () => {
    const httpException = new HttpException('test', HttpStatus.NOT_FOUND);
    const mockedResponse = mockResponse();
    mongoFilter.catch(
      httpException,
      <ArgumentsHost>(<unknown>mockArgumentHost(mockedResponse)),
    );
    expect(mockedResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockedResponse.json).toHaveBeenCalledWith(
      httpException.getResponse(),
    );
  });

  it('should return HTTP 500 on unknown exceptions', () => {
    const exception = new Error();
    const mockedResponse = mockResponse();
    mongoFilter.catch(
      exception,
      <ArgumentsHost>(<unknown>mockArgumentHost(mockedResponse)),
    );
    expect(mockedResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockedResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'something went wrong',
    });
  });
});
