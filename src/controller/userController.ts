import { UserStorage } from '../storage/userStorage';
import { Request } from '../types/request';
import * as uuid from 'uuid';
import { Response } from '../types/response';
import { User } from '../entity/user';

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

  async createUser(req: Request) {
    const data = await req.getJSON<Omit<User, 'id'>>();

    if (!data.age || !data.name || !data.hobbies) {
      return Response.badRequest('Required field(s) is not provided');
    }

    if (typeof data.age !== 'number' || data.age <= 0 || data.age >= 120) {
      return Response.badRequest('Provided age is not correct');
    }

    if (typeof data.name !== 'string' || data.name.length >= 32) {
      return Response.badRequest('Provided name is not correct');
    }

    if (!Array.isArray(data.hobbies)) {
      return Response.badRequest('Provided hobbies should be an array');
    }

    if (!data.hobbies.every((hobby) => typeof hobby === 'string' && hobby)) {
      return Response.badRequest('Hobby should be a non-empty string');
    }

    const user = this.userStorage.create(data);

    return new Response(user);
  }
}
