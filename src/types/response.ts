export class Response {
  constructor(readonly response: unknown, readonly httpCode: number = 200) {}

  static notFound(error: string) {
    return Response.error(error, 404);
  }

  static badRequest(error: string) {
    return Response.error(error, 400);
  }

  private static error(error: string, httpCode: number): Response {
    return new Response({ error }, httpCode);
  }
}
