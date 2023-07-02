import { describe, expect, it } from '@jest/globals';
import { createApp } from '../src/createApp';
import request from 'supertest';
import { UserStorage } from '../src/storage/userStorage';
import { v4 as uuid } from 'uuid';

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

// it('should ', (done) => {
//   const data: Omit<User, 'id'> = {
//     name: '111',
//     age: 23,
//     hobbies: [],
//   };
//   request(app)
//     .post('/api/users')
//     .send(data)
//     .expect(201)
//     .end(function (err) {
//       if (err) return done(err);
//       return done();
//     });
// });
