import { LeanDocumentOrArray } from 'mongoose';

export function isDocument<T extends Document | Document[]>(
  data:
    | string
    | Record<string, any>
    | string[]
    | Record<string, any>[]
    | undefined
): data is LeanDocumentOrArray<T> {
  return data && typeof data !== 'string' ? true : false;
}

export const btcRate = 41205.5;
export const eurRate = 1.09;
