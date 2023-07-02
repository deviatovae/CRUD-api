import { describe, expect, it } from '@jest/globals';
import { createApp } from '../src/createApp';
import request from 'supertest';
import { UserStorage } from '../src/storage/userStorage';
import { v4 as uuid } from 'uuid';
import { UserDto } from '../src/types/userDto';
import { User } from '../src/entity/user';

describe('First scenario: testing get list of users and get userById', () => {
  const app = createApp();
  const userStorage = new UserStorage();

  it('Should get a list of users', (done) => {
    request(app)
      .get('/api/users')
      .expect('Content-Type', 'application/json')
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(userStorage.findAll());
        done();
      })
      .catch((err) => done(err));
  });

  it('Should get a user by their id', (done) => {
    const user = userStorage.findAll()[0];
    const userId = user?.id;

    request(app)
      .get(`/api/users/${userId}`)
      .expect('Content-Type', 'application/json')
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(user);
        done();
      })
      .catch((err) => done(err));
  });

  it('Should return the 404 error when requesting a not existing user', (done) => {
    const userId = uuid();
    request(app)
      .get(`/api/users/${userId}`)
      .expect('Content-Type', 'application/json')
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ error: 'user is not found' });
        done();
      })
      .catch((err) => done(err));
  });

  it('After passing an in valid userId (not uuid), it should return a validation error', (done) => {
    request(app)
      .get(`/api/users/123456`)
      .expect('Content-Type', 'application/json')
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({ error: 'userId is not valid uuid' });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('Second scenario: testing creating of a new user', () => {
  const app = createApp();

  it('Should return an error when a required field is missing in request', (done) => {
    const fields: (keyof UserDto)[] = ['name', 'age', 'hobbies'];
    const requests = fields.map((field) => {
      const data: Partial<UserDto> = {
        name: 'Tester',
        age: 23,
        hobbies: [],
      };

      delete data[field];

      return request(app)
        .post('/api/users')
        .send(data)
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({
            error: 'Required field(s) is not provided',
          });
        });
    });

    Promise.all(requests)
      .then(() => done())
      .catch((err) => done(err));
  });

  const user: Partial<User> = {
    name: 'Tester',
    age: 24,
    hobbies: ['Water Skiing', 'Surfing'],
  };

  it('Should return a new user', (done) => {
    request(app)
      .post('/api/users')
      .send(user)
      .expect(201)
      .then((response) => {
        expect(response.body).not.toBeUndefined();
        user.id = response.body.id;
        expect(response.body).toEqual(user);
        done();
      });
  });

  it('Should return a list of users with a newly created user', (done) => {
    request(app)
      .get('/api/users')
      .expect(200)
      .then((response) => {
        const userFromList = response.body.find(
          ({ id: userId }) => user.id === userId,
        );
        expect(userFromList).toEqual(user);
        done();
      });
  });
});

describe('Third scenario: testing deleting a user', () => {
  const app = createApp();
  let userIdToDelete;

  it('Should get the id from the first user', (done) => {
    request(app)
      .get('/api/users')
      .expect(200)
      .then((response) => {
        userIdToDelete = response.body[0]?.id;
        expect(userIdToDelete).toBeTruthy();
        done();
      });
  });

  it('Should delete the found user by id', (done) => {
    request(app)
      .delete(`/api/users/${userIdToDelete}`)
      .expect(204)
      .end((err) => (err ? done(err) : done()));
  });

  it('Should return an error when trying to delete a deleted user', (done) => {
    request(app)
      .delete(`/api/users/${userIdToDelete}`)
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ error: 'user is not found' });
        done();
      })
      .catch((err) => done(err));
  });

  it('Should not return the deleted user', (done) => {
    request(app)
      .get(`/api/users`)
      .expect(200)
      .then((response) => {
        const hasDeletedUser = !response.body.every(
          (user) => user?.id !== userIdToDelete,
        );
        expect(hasDeletedUser).toBeFalsy();
        done();
      })
      .catch((err) => done(err));
  });
});
