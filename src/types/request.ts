import * as http from 'http';

export class Request extends http.IncomingMessage {
  constructor(
    req: http.IncomingMessage,
    public readonly params: { [key: string]: string },
  ) {
    super(req.socket);

    Object.assign(this, req);
    this.params = params;
  }

  static createFromReq(
    req: http.IncomingMessage,
    params: { [key: string]: string },
  ) {
    return new Request(req, params);
  }

  async getBody() {
    return new Promise<string>((resolve, reject) => {
      const body = [];
      this.on('error', (err) => {
        reject(err);
      })
        .on('data', (chunk) => {
          body.push(chunk);
        })
        .on('end', () => {
          resolve(Buffer.concat(body).toString());
        });
    });
  }

  async getJSON<T>(): Promise<T> {
    return JSON.parse(await this.getBody()) as T;
  }
}
