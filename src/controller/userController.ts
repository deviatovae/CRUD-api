import { UserStorage } from '../storage/userStorage';
import { Request } from '../types/request';
import * as uuid from 'uuid';
import { Response } from '../types/response';

export class UserController {
  constructor(private readonly userStorage: UserStorage) {}

  getUsers(): Response {
    return new Response(this.userStorage.findAll());
  }

  getUserById(req: Request) {
    const userId = req.params['id'];

    if (!uuid.validate(userId)) {
      return Response.badRequest('userId is not valid uuid');
    }

    const user = this.userStorage.findOne(userId);
    if (!user) {
      return Response.notFound('user is not found');
    }

    return new Response(user);
  }
}
