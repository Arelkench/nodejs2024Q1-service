import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly customLoggerService: LoggingService) {}

  use(req: Request, res: Response, next: () => void) {
    res.on('finish', () => {
      this.customLoggerService.log(
        `${req.method} ${req.originalUrl}: Query params: ${JSON.stringify(
          req.query,
        )}, Body: ${JSON.stringify(req.body)}, ${res.statusCode}.)}`,
      );
    });

    next();
  }
}
