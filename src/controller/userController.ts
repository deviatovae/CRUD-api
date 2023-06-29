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

    const userIdError = this.validateUserId(userId);
    if (userIdError) {
      return userIdError;
    }

    const user = this.userStorage.findOne(userId);
    if (!user) {
      this.userNotFound();
    }

    return new Response(user);
  }

  async createUser(req: Request) {
    const data = await req.getJSON<Omit<User, 'id'>>();

    const error = this.validateUserData(data);
    if (error) {
      return error;
    }

    const user = this.userStorage.create(data);

    return new Response(user, 201);
  }

  async updateUserById(req: Request) {
    const userId = req.params['id'];
    const data = await req.getJSON<Omit<User, 'id'>>();

    const userIdError = this.validateUserId(userId);
    if (userIdError) {
      return userIdError;
    }

    const error = this.validateUserData(data);
    if (error) {
      return error;
    }

    const user = this.userStorage.update(userId, data);
    if (!user) {
      return this.userNotFound();
    }

    return new Response(user);
  }

  deleteUserById(req: Request) {
    const userId = req.params['id'];

    const userIdError = this.validateUserId(userId);
    if (userIdError) {
      return userIdError;
    }

    const user = this.userStorage.delete(userId);
    if (!user) {
      return this.userNotFound();
    }

    return new Response(user, 204);
  }

  private validateUserId(id) {
    if (!uuid.validate(id)) {
      return Response.badRequest('userId is not valid uuid');
    }
  }

  private validateUserData(data: Omit<User, 'id'>) {
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
  }

  private userNotFound() {
    return Response.notFound('user is not found');
  }
}
