import http from 'http';
import { UserStorage } from '../storage/userStorage';

export class UserController {
  constructor(private readonly userStorage: UserStorage) {}

  getUsers(_: http.IncomingMessage, res: http.ServerResponse) {
    const users = this.userStorage.findAll();
    res.end(JSON.stringify(users));
  }
}
