import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const hasAuthApiKey = this.extractHeader(req);
    if (hasAuthApiKey) {
      next();
    } else {
      throw new UnauthorizedException('User is not allowed');
    }
  }

  extractHeader(req: Request): boolean {
    const token = req.headers['x-auth-api-key'];

    if (
      Array.isArray(token) ||
      token != this.configService.get('API_AUTH_KEY')
    ) {
      throw new BadRequestException('Token incorrect or bad format');
    }

    return true;
  }
}
