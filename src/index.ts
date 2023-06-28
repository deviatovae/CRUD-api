import * as http from 'http';

const hostname = '127.0.0.1';
const port = 3000;

type HttpHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => void;

const usersHandler: HttpHandler = (req, res) => {
  res.end(
    JSON.stringify([
      {
        id: 1,
        name: 'User',
        age: 25,
        hobbies: ['jogging', 'mountain biking'],
      },
    ]),
  );
};

http
  .createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });

    const url = req.url;

    const routes: { [key: string]: HttpHandler } = {
      '/api/users': usersHandler,
    };

    if (routes[url]) {
      routes[url](req, res);
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'not found' }));
    }
  })

  .listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
