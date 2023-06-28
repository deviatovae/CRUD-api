import http from 'http';
import { Request } from './request';

export type HttpHandler = (req: Request, res: http.ServerResponse) => void;

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}
