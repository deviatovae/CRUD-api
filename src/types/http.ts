import { Request } from './request';
import { Response } from './response';

export type HttpHandler = (req: Request) => Response;

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}
