import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConsoleLogger } from 'src/default/logger/console/console.service';
import { DataSanitizer } from '../utils/sanitize.utils';
import { JourneyContextUtil } from './journey-id/journey-id.context';

@Injectable()
export class UnifiedResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Sanitize only the password for API responses
        const sanitizedData = DataSanitizer.sanitizeData(
          data,
          [],
          ['password'],
        );
        return this.formatResponse(sanitizedData, context);
      }),
    );
  }

  private formatResponse(data: any, context: ExecutionContext): any {
    const request = context.switchToHttp().getRequest();

    const response = {
      status: 'success',
      code: 200,
      message: 'Request successful',
      data,
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
    };

    // Sanitize for logging
    const sanitizedLog = DataSanitizer.sanitizeData(response);
    ConsoleLogger.log(sanitizedLog, `${request.method} - ${request.url}`);

    return response;
  }
}
