export class InvalidDataOrState extends Error {
  kind: 'invalid-data-or-state' = 'invalid-data-or-state';
  statusCode = 422;
  error: string;
  details: string | undefined;

  constructor(error: string, description: string, details: any = undefined) {
    super(description);
    this.error = error;
    this.details = details;
  }
}

export class Unauthenticated extends Error {
  kind: 'unauthenticated' = 'unauthenticated';
  error: 'missing-token' | 'invalid-token';
  statusCode = 401;

  constructor(error: 'missing-token' | 'invalid-token') {
    super('Unauthenticated.');
    this.error = error;
  }
}

export class Unauthorized extends Error {
  statusCode = 403;
  constructor() {
    super('Unauthorized.');
  }
}

export class BadRequest extends Error {
  kind: 'bad-request' = 'bad-request';
  statusCode = 400;
  reason: string;
  extra: any;

  constructor(reason: string, extra: any = undefined) {
    super(`Bad request: ${reason}`);
    this.statusCode = 400;
    this.reason = reason;
    this.extra = extra;
  }
}

export class InternalServerError extends Error {
  cause: any;

  constructor(cause: any) {
    super('Internal Server Error');
    this.cause = cause;
  }
}
