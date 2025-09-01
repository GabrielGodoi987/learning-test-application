import { ConfigService } from '@nestjs/config';
import { ApiKeyMiddleware } from './api-key.middleware';
import { Request, Response } from 'express';

describe('ApiKeyMiddleware', () => {
  let middleware: ApiKeyMiddleware;
  let mockNextFunction: jest.Mock;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockConfigService = {
    get: jest.fn((key: string) => {
      if (key == 'API_AUTH_KEY') {
        return 'valid_api_key';
      }
      return null;
    }),
  } as unknown as ConfigService;

  beforeAll(() => {
    mockConfigService = new ConfigService();
    middleware = new ApiKeyMiddleware(mockConfigService);
    mockNextFunction = jest.fn();
    mockRequest = { headers: {} };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });
  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should call next() function only', () => {
    mockRequest.headers = {
      'x-auth-api-key': 'valid_api_key',
    };
    const result = middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      mockNextFunction,
    );
    console.log(result);
    expect(mockNextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.send).not.toHaveBeenCalled();
  });

  it('Should return an UnAuthorizeException', () => {});

  it('should extract the token inside the header', () => {
    const header: any = (mockRequest.headers = {
      'x-auth-api-key': 'valid_api_key',
    });

    expect(middleware.extractHeader(header as Request)).toEqual(true);
  });

  it('should return an BadRequestException', () => {});
});
