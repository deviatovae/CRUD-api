import { HttpHandler, HttpMethod } from '../types/http';
import http from 'http';

export class RoutingService {
  private readonly routes: { [key: string]: HttpHandler } = {};

  addRoute(method: HttpMethod, route: string, handler: HttpHandler) {
    const key = this.createRouteKey(method, route);
    this.routes[key] = handler;
  }

  handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
    const { url, method } = req;
    const key = this.createRouteKey(method, url);

    if (this.routes[key]) {
      this.routes[key](req, res);
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'not found' }));
    }
  }

  private createRouteKey(method: string, url: string): string {
    return `${method}_${url}`;
  }
}
