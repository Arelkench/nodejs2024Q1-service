import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggingService } from '../logging/logging.service';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  constructor(private readonly LoggingService: LoggingService) {}

  catch(exception: any, host: ArgumentsHost) {
    const argumentHost = host.switchToHttp();

    const res = argumentHost.getResponse<Response>();
    const { url, method, headers, query, body } =
      argumentHost.getRequest<Request>();

    const trace = exception instanceof Error ? exception.stack : undefined;

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: any;

    switch (true) {
      case exception instanceof HttpException:
        statusCode = exception.getStatus();
        errorResponse = exception.getResponse();

        break;

      case exception instanceof ForbiddenException:
        statusCode = HttpStatus.FORBIDDEN;
        errorResponse = {
          statusCode,
          message: 'Access forbidden.',
        };

        break;

      case exception instanceof UnauthorizedException:
        statusCode = HttpStatus.FORBIDDEN;
        errorResponse = {
          statusCode,
          message: 'Authentication failed.',
        };

        break;

      case exception instanceof BadRequestException:
        statusCode = HttpStatus.BAD_REQUEST;
        errorResponse = {
          statusCode,
          message: exception.getResponse(),
        };

        break;

      default:
        errorResponse = {
          statusCode,
          message: 'Internal server error.',
        };
    }

    this.LoggingService.error({
      url,
      query,
      method,
      statusCode,
      headers,
      body,
      trace,
      errorResponse,
      message: errorResponse.message || 'Internal server error',
    });

    res.status(statusCode).json({
      errorResponse,
    });
  }
}
