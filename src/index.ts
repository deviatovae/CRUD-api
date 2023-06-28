import * as http from 'http';
import { router } from './routes';

const hostname = '127.0.0.1';
const port = 3000;

http
  .createServer(function (req, res) {
    router.handleRequest(req, res);
  })

  .listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
