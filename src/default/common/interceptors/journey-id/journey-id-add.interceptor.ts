import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { JourneyContextUtil } from './journey-id.context';

@Injectable()
export class JourneyIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const journeyId = uuidv4();

    req.journeyId = journeyId;

    const initialData = new Map<string, string>();
    initialData.set('journeyId', journeyId);

    return new Observable((observer) => {
      JourneyContextUtil.run(() => {
        next.handle().subscribe({
          next: (value) => observer.next(value),
          error: (err) => observer.error(err),
          complete: () => observer.complete(),
        });
      }, initialData);
    });
  }
}
