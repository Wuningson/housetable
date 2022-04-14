import { Response } from 'express';

const ErrorStatusCode = {
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER: 500
};

export default class CustomError extends Error {
  name: ErrorName;
  statusCode: number;

  constructor(name: ErrorName, description: string) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.statusCode = ErrorStatusCode[name];

    Error.captureStackTrace(this);
  }
}

export function handleError(error: any, res: Response) {
  console.log(error);
  const response: ErrorResponseBody = {
    name: 'INTERNAL_SERVER',
    status: false,
    message: 'Something went wrong'
  };

  let statusCode = 500;

  if (error instanceof CustomError) {
    response.name = error.name;
    response.message = error.message;
    statusCode = error.statusCode;
  } else if (error instanceof Error) {
    response.message = error.message;
  }

  return res.status(statusCode).json(response);
}
