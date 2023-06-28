import * as http from 'http';
import { Socket } from 'node:net';

export class Request extends http.IncomingMessage {
  constructor(
    socket: Socket,
    public readonly params: { [key: string]: string },
  ) {
    super(socket);
    this.params = params;
  }

  static createFromReq(
    req: http.IncomingMessage,
    params: { [key: string]: string },
  ) {
    return new Request(req.socket, params);
  }
}
