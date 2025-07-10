// src/common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConsoleLogger } from 'src/default/logger/console/console.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      status: 'error',
      code: status,
      message:
        exception.response?.message ||
        exception.message ||
        'An unexpected error occurred',
      data: null,
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
    };

    ConsoleLogger.error(
      errorResponse,
      exception.stack,
      `${request.method} - ${request.url}`,
    );

    response.status(status).json(errorResponse);
  }
}
