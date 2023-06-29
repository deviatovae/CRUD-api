import { User } from '../entity/user';
import { v4 as uuid } from 'uuid';

export class UserStorage {
  private readonly users: User[] = [
    {
      id: 'fa7a2d74-92e3-4b5e-b6c2-b3f86d523596',
      name: 'User1',
      age: 25,
      hobbies: ['jogging', 'mountain biking'],
    },
    {
      id: '98bb6146-7a45-4e67-9bbf-ad3a493930d3',
      name: 'User2',
      age: 30,
      hobbies: ['tennis', 'hiking'],
    },
    {
      id: 'f5796e0f-b138-4f3a-a8eb-3e4769e6ecd5',
      name: 'User',
      age: 15,
      hobbies: ['guitar', 'programming', 'anime'],
    },
  ];

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    return this.users.find(({ id: userId }) => id === userId);
  }

  create(user: Omit<User, 'id'>) {
    const newUser = { id: uuid(), ...user };
    this.users.push(newUser);
    return newUser;
  }

  update(id: string, { name, age, hobbies }: Omit<User, 'id'>) {
    const user = this.findOne(id);
    if (!user) {
      return null;
    }
    user.name = name;
    user.age = age;
    user.hobbies = hobbies;

    return user;
  }
}
