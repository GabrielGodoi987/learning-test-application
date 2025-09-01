import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const hasAuthApiKey = this.extractHeader(req);
    if (hasAuthApiKey) {
      next();
    } else {
      throw new UnauthorizedException('User is not allowed');
    }
  }

  extractHeader(resquest: Request): boolean {
    // recebe a request
    // faz a extração do cabeçalho x-auth-api-key
    const header = resquest.headers['x-auth-api-key'];
    // verifica se está certo(em relação a nossa api key verdadeira)
    console.log(header);
    // retorna true ou false
    return true;
  }
}
