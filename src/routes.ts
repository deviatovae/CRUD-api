import { RoutingService } from './service/routingService';
import { UserController } from './controller/userController';
import { UserStorage } from './storage/userStorage';
import { HttpMethod } from './types/http';

export const router = new RoutingService();
const userController = new UserController(new UserStorage());

router.addRoute(
  HttpMethod.GET,
  '/api/users',
  userController.getUsers.bind(userController),
);

router.addRoute(
  HttpMethod.GET,
  '/api/users/:id',
  userController.getUserById.bind(userController),
);

router.addRoute(
  HttpMethod.POST,
  '/api/users',
  userController.createUser.bind(userController),
);
