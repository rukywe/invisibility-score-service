export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

export class ValidationError extends CustomError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class ExternalApiError extends CustomError {
  constructor(message: string) {
    super(message, 502);
  }
}

export class S3UploadError extends CustomError {
  constructor(message: string) {
    super(message, 500);
  }
}
