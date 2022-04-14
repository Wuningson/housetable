import { Response } from 'express';

export function SuccessResponse(
  res: Response,
  message: string,
  data: Record<string, any> | null,
  code: 200 | 201 = 200,
  status: boolean = true
) {
  let respData = {
    data,
    status,
    message
  };

  return res.status(code).json(respData);
}
