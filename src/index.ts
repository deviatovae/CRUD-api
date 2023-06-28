import * as http from 'http';
import { router } from './routes';

const hostname = '127.0.0.1';
const port = 3000;

http
  .createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    router.handleRequest(req, res);
    res.end();
  })

  .listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
