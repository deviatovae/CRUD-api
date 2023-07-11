import * as http from 'http';
import cluster from 'cluster';
import { availableParallelism } from 'os';
import * as url from 'url';
import { configDotenv } from 'dotenv';
import { createApp } from './createApp';

configDotenv();
const hostname = '127.0.0.1';
const port = parseInt(process.env.PORT || '3000', 10);
const protocol = process.env.PROTOCOL;

const numCPUs = availableParallelism();
let requestNum = 0;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({ PORT: port + i + 1 });
  }

  http
    .createServer(async function (req, res) {
      const nextPort = port + (requestNum++ % numCPUs) + 1;
      const hostname = req.headers.host;
      const fullUrl = `${protocol}://${hostname}${req.url}`;
      const options: http.RequestOptions = {
        ...url.parse(fullUrl),
        port: nextPort,
        headers: req.headers,
        method: req.method,
      };

      req.pipe(
        http.request(options, (response) => {
          res.writeHead(response.statusCode, response.headers);
          response.pipe(res);
        }),
      );
    })

    .listen(port, hostname, () => {
      console.log(`Server is running at http://${hostname}:${port}/`);
    });
} else {
  const app = createApp();
  http
    .createServer(async function (req, res) {
      console.log('Response from cluster with port: ' + port);
      await app(req, res);
    })

    .listen(port, hostname, () => {
      console.log(`Instance is running at http://${hostname}:${port}/`);
    });
}
