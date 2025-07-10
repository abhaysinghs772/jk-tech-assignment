import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventsType } from 'src/default/common/constants/events.option';
import { DateTimeUtil } from 'src/default/common/utils/date-time.util';
import { DataSanitizer } from 'src/default/common/utils/sanitize.utils';
import { Formatter } from 'src/default/common/utils/format.util';
import { JourneyContextUtil } from 'src/default/common/interceptors/journey-id/journey-id.context';

export class ConsoleLogger extends Logger {
  private static instance: ConsoleLogger;
  private readonly isConsoleEnabled: boolean;
  private readonly eventEmitter: EventEmitter2;

  private constructor(eventEmitter: EventEmitter2) {
    super();
    this.eventEmitter = eventEmitter;
    this.isConsoleEnabled = process.env.ENABLE_CONSOLE_LOG === 'true';
  }

  static initialize(eventEmitter: EventEmitter2): void {
    if (!ConsoleLogger.instance) {
      ConsoleLogger.instance = new ConsoleLogger(eventEmitter);
    }
  }

  static getInstance(): ConsoleLogger {
    if (!ConsoleLogger.instance) {
      throw new Error(
        'ConsoleLogger not initialized. Call initialize() first.',
      );
    }
    return ConsoleLogger.instance;
  }

  static log(message: any, context?: string): void {
    // Sanitize password, accessToken, and refreshToken for logs
    const sanitizedMessage = DataSanitizer.sanitizeData(
      message,
      [],
      ['password', 'accessToken', 'refreshToken'],
    );
    this.getInstance().writeLog('LOG', sanitizedMessage, context);
  }

  static error(message: any, trace?: string, context?: string): void {
    // Sanitize password, accessToken, and refreshToken for logs
    const sanitizedMessage = DataSanitizer.sanitizeData(
      message,
      [],
      ['password', 'accessToken', 'refreshToken'],
    );
    this.getInstance().writeLog('ERROR', sanitizedMessage, context, trace);
  }

  static warn(message: any, context?: string): void {
    // Sanitize password, accessToken, and refreshToken for logs
    const sanitizedMessage = DataSanitizer.sanitizeData(
      message,
      [],
      ['password', 'accessToken', 'refreshToken'],
    );
    this.getInstance().writeLog('WARN', sanitizedMessage, context);
  }

  static debug(message: any, context?: string): void {
    // Sanitize password, accessToken, and refreshToken for logs
    const sanitizedMessage = DataSanitizer.sanitizeData(
      message,
      [],
      ['password', 'accessToken', 'refreshToken'],
    );
    this.getInstance().writeLog('DEBUG', sanitizedMessage, context);
  }

  static verbose(message: string, context?: string): void {
    // Sanitize password, accessToken, and refreshToken for logs
    const sanitizedMessage = DataSanitizer.sanitizeData(
      message,
      [],
      ['password', 'accessToken', 'refreshToken'],
    );
    this.getInstance().writeLog(
      'VERBOSE',
      Formatter.safeStringify(sanitizedMessage),
      context,
    );
  }

  private writeLog(
    level: string,
    message: any,
    context?: string,
    trace?: string,
  ): void {
    const timestamp = new Date().toISOString();
    const pid = process.pid;
    const contextString = context ? `[${context}] ` : '';

    // Retrieve journeyId from JourneyContextUtil
    const journeyId = JourneyContextUtil.get('journeyId') || null;

    const formattedMessage = `[Nest] ${pid}  - ${DateTimeUtil.format(timestamp, 'dd/mm/yyyy, h:mm:ss aa')}     ${level.padEnd(
      3,
    )} ${contextString} ${Formatter.safeStringify(message)} ${journeyId ? ` - [${journeyId}]` : ''} ${trace ? `\n\n${trace}` : ''}`;

    // Log to console
    if (this.isConsoleEnabled) {
      console.log(formattedMessage);
    }

    // Emit event for remote logging in production
    if (process.env.NODE_ENV === 'production') {
      this.eventEmitter.emit(EventsType.REMOTE_LOG, {
        level,
        message,
        context,
        trace,
        journeyId,
      });
    }
  }
}
