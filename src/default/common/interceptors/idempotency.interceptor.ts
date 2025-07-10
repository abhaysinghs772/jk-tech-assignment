import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ConflictException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { IdempotencyService } from 'src/default/idempotency/idempotency.service';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(private readonly idempotencyService: IdempotencyService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    // Check if the request payload is a duplicate
    const isDuplicate = await this.idempotencyService.checkDuplicateRequest(
      request.body,
    );

    if (isDuplicate) {
      throw new ConflictException('Duplicate request detected');
    }

    return next.handle();
  }
}
