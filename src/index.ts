import * as http from 'http';
import { createApp } from './createApp';

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

http.createServer(createApp()).listen(+port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
