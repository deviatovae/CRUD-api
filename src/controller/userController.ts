import http from 'http';
import { UserStorage } from '../storage/userStorage';
import { Request } from '../types/request';
import * as uuid from 'uuid';

export class UserController {
  constructor(private readonly userStorage: UserStorage) {}

  getUsers(_: Request, res: http.ServerResponse) {
    const users = this.userStorage.findAll();
    res.end(JSON.stringify(users));
  }

  getUserById(req: Request, res: http.ServerResponse) {
    const userId = req.params['id'];

    if (!uuid.validate(userId)) {
      res.writeHead(400);
      res.end(
        JSON.stringify({
          error: 'userId is not valid uuid',
        }),
      );
      return;
    }

    const user = this.userStorage.findOne(userId);
    if (!user) {
      res.writeHead(404);
      res.end(
        JSON.stringify({
          error: 'user is not found',
        }),
      );
      return;
    }

    res.end(JSON.stringify(user));
  }
}
