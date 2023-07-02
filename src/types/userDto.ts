import { User } from '../entity/user';

export type UserDto = Omit<User, 'id'>;
