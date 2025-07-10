export class ErrorCode {
  static readonly INTERNAL_SERVER_ERROR = {
    code: 500,
    message: 'Internal Server Error',
  };
  static readonly BAD_REQUEST_ERROR = { code: 400, message: 'Bad Request' };
  static readonly UNAUTHORIZED_ERROR = { code: 401, message: 'Unauthorized' };
  static readonly FORBIDDEN_ERROR = { code: 403, message: 'Forbidden' };
  static readonly NOT_FOUND_ERROR = { code: 404, message: 'Not Found' };
  static readonly CONFLICT_ERROR = { code: 409, message: 'Conflict' };
  static readonly VALIDATION_ERROR = { code: 422, message: 'Validation Error' };
  static readonly UNPROCESSABLE_ENTITY_ERROR = {
    code: 422,
    message: 'Unprocessable Entity',
  };
  static readonly TOO_MANY_REQUESTS_ERROR = {
    code: 429,
    message: 'Too Many Requests',
  };
  static readonly SERVICE_UNAVAILABLE_ERROR = {
    code: 503,
    message: 'Service Unavailable',
  };
  static readonly GATEWAY_TIMEOUT_ERROR = {
    code: 504,
    message: 'Gateway Timeout',
  };
  static readonly HTTP_VERSION_NOT_SUPPORTED_ERROR = {
    code: 505,
    message: 'HTTP Version Not Supported',
  };
  static readonly NETWORK_ERROR = { code: 1001, message: 'Network Error' };
  static readonly UNEXPECTED_ERROR = {
    code: 1000,
    message: 'Unexpected Error',
  };
  static readonly USER_ALREADY_EXISTS = {
    code: 1002,
    message: 'User Already Exists',
  };
  static readonly INVALID_USER_INPUT = {
    code: 1003,
    message: 'Invalid User Input',
  };

  // Method to fetch error by code (optional)
  static getErrorByCode(
    code: number,
  ): { code: number; message: string } | null {
    const error = Object.values(ErrorCode).find(
      (value: any) => value.code === code,
    );
    return error || null;
  }
}
