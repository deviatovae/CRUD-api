import { HttpHandler, HttpMethod } from '../types/http';
import http from 'http';
import * as url from 'url';
import { Request } from '../types/request';

export class RoutingService {
  private readonly routes: { [key: string]: HttpHandler } = {};

  addRoute(method: HttpMethod, route: string, handler: HttpHandler) {
    const key = this.createRouteKey(method, route);
    this.routes[key] = handler;
  }

  handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
    const { url: reqUrl, method } = req;
    const { pathname: reqPath } = url.parse(reqUrl, true);

    let matchedRoute = null;
    const params: { [key: string]: string } = {};

    for (const route in this.routes) {
      const routeRegex = new RegExp(
        '^' + route.replace(/:\w+/g, '((.*?)[^/]+)') + '$',
      );
      const match = this.createRouteKey(method, reqPath).match(routeRegex);

      if (match) {
        matchedRoute = route;
        const paramNames = route.match(/:\w+/g) || [];
        paramNames.forEach((param, index) => {
          const paramName = param.slice(1);
          params[paramName] = match[index + 1];
        });
        break;
      }
    }

    if (!matchedRoute) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'not found' }));
    }

    this.routes[matchedRoute](Request.createFromReq(req, params), res);
  }

  private createRouteKey(method: string, url: string): string {
    return `${method}_${url}`;
  }
}