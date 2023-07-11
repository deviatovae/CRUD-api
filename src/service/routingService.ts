import { HttpHandler, HttpMethod } from '../types/http';
import http from 'http';
import * as url from 'url';
import { Request } from '../types/request';
import { Response } from '../types/response';

export class RoutingService {
  private readonly routes: { [key: string]: HttpHandler } = {};

  addRoute(method: HttpMethod, route: string, handler: HttpHandler) {
    const key = this.createRouteKey(method, route);
    this.routes[key] = handler;
  }

  async handleRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ): Promise<void> {
    const { url: reqUrl, method } = req;
    const { pathname: reqPath } = url.parse(reqUrl, true);

    let matchedRoute = null;
    const params: { [key: string]: string } = {};

    for (const route in this.routes) {
      const routeRegex = new RegExp(
        '^' + route.replace(/:\w+/g, '((.*?)[^/]+)') + '$',
      );

      const key = this.createRouteKey(method, reqPath);
      const match = key.match(routeRegex);

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

    const headers = { 'Content-Type': 'application/json' };
    let response;

    try {
      response = !matchedRoute
        ? Response.notFound('not found')
        : this.routes[matchedRoute](Request.createFromReq(req, params));

      if (response instanceof Promise) {
        response = await response;
      }

      if (!response) {
        res.writeHead(200, headers);
        res.end();
        return;
      }
    } catch (e) {
      response = Response.internalError();
    } finally {
      res.writeHead(response.httpCode, headers);
      res.end(JSON.stringify(response.response));
    }
  }

  private createRouteKey(method: string, url: string): string {
    return `${method}_${url}`;
  }
}
