import http from 'http';

export type HttpHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => void;

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}
