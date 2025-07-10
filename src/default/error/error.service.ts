import { Injectable } from '@nestjs/common';
import { ErrorCode } from './error.code';

@Injectable()
export class ErrorHandlingService {
  handleError(error: any): any {
    // Extract or default error message and code
    const customMessage =
      error.message ?? ErrorCode.INTERNAL_SERVER_ERROR.message;
    const customCode = error.code ?? ErrorCode.INTERNAL_SERVER_ERROR.code;

    // Normalize the details field
    const errorDetails =
      typeof error.response === 'object' ? error.response : null;

    // Construct the error response
    return {
      status: 'error',
      code: customCode,
      message: customMessage,
      details: errorDetails,
    };
  }
}
