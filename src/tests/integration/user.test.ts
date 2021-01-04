import bcrypt from 'bcrypt';
import 'dotenv/config';
import request from 'supertest';
import UsersRoute from '../../api/routes/users.route';
import App from '../../app';
import { Profession } from '../../entities/profession.entity';
import { User } from '../../entities/users.entity';
import AuthService from '../../services/auth.service';
import { db } from '../util/db';
jest.mock('../../services/gcs.service');

let app: App;
beforeAll(async () => {
  const userRoute = new UsersRoute();
  app = new App([userRoute]);
  await app.initializeApp();
});

beforeEach(async () => {
  await db.clear();
});

describe('Update User', () => {
  describe('[PUT] /api/v1/users', () => {
    it('Successful user update 200', async done => {
      const { id, token } = await registerUserAndGetToken();
      const displayName = 'Omar Sherif';
      const country = 'USA';
      const phoneNumber = '+14845219653';
      const profileInfo = 'I like graphic design';
      const profession = await Profession.save({ id: 2, name: 'Digital Art' } as Profession);
      const response = await request(app.getServer()).put(`/api/v1/users`).set('Authorization', token.token).send({
        professionId: 2,
        displayName,
        country,
        phoneNumber,
        profileInfo,
      });
      const user = await User.findOne(id);
      expect(user.displayName).toBe(displayName);
      expect(user.country).toBe(country);
      expect(user.phoneNumber).toBe(phoneNumber);
      expect(user.profileInfo).toBe(profileInfo);
      expect(user.profession.id).toBe(profession.id);

      expect(response.status).toBe(200);

      done();
    });

    it('Failed user update, invalid phone number 400', async done => {
      const { id, token } = await registerUserAndGetToken();
      const displayName = 'Omar Sherif';
      const country = 'USA';
      const phoneNumber = '+20100103';
      const profileInfo = 'I like graphic design';
      const profession = await Profession.save({ id: 2, name: 'Digital Art' } as Profession);
      const response = await request(app.getServer()).put(`/api/v1/users`).set('Authorization', token.token).send({
        professionId: 2,
        displayName,
        country,
        phoneNumber,
        profileInfo,
      });

      expect(response.status).toBe(400);

      done();
    });

    it('Failed user update, inexisting profession 404', async done => {
      const { id, token } = await registerUserAndGetToken();
      const displayName = 'Omar Sherif';
      const country = 'USA';
      const phoneNumber = '+201001042218';
      const profileInfo = 'I like graphic design';

      const response = await request(app.getServer()).put(`/api/v1/users`).set('Authorization', token.token).send({
        professionId: 2,
        displayName,
        country,
        phoneNumber,
        profileInfo,
      });

      expect(response.status).toBe(404);

      done();
    });

    it('Failed user update, missing professionId 400', async done => {
      const { id, token } = await registerUserAndGetToken();
      const displayName = 'Omar Sherif';
      const country = 'USA';
      const phoneNumber = '+201001042218';
      const profileInfo = 'I like graphic design';

      const response = await request(app.getServer()).put(`/api/v1/users`).set('Authorization', token.token).send({
        displayName,
        country,
        phoneNumber,
        profileInfo,
      });

      expect(response.status).toBe(400);

      done();
    });

    it('Failed user update, missing display name 400', async done => {
      const { id, token } = await registerUserAndGetToken();
      const displayName = 'Omar Sherif';
      const country = 'USA';
      const phoneNumber = '+20100103';
      const profileInfo = 'I like graphic design';
      const profession = await Profession.save({ id: 2, name: 'Digital Art' } as Profession);
      const response = await request(app.getServer()).put(`/api/v1/users`).set('Authorization', token.token).send({
        professionId: 2,
        country,
        phoneNumber,
        profileInfo,
      });

      expect(response.status).toBe(400);

      done();
    });

    it('Failed user update, missing country 400', async done => {
      const { id, token } = await registerUserAndGetToken();
      const displayName = 'Omar Sherif';
      const country = 'USA';
      const phoneNumber = '+20100103';
      const profileInfo = 'I like graphic design';
      const profession = await Profession.save({ id: 2, name: 'Digital Art' } as Profession);
      const response = await request(app.getServer()).put(`/api/v1/users`).set('Authorization', token.token).send({
        professionId: 2,
        displayName,

        phoneNumber,
        profileInfo,
      });

      expect(response.status).toBe(400);

      done();
    });
  });
});

describe('Update Password', () => {
  describe('[PUT] /api/v1/users/password', () => {
    it('Successful user password update', async done => {
      const { id, token, password: oldPassword } = await registerUserAndGetToken();
      const newPassword = '123456';

      const response = await request(app.getServer()).put(`/api/v1/users/password`).set('Authorization', token.token).send({
        oldPassword,
        newPassword,
      });
      const user = await User.findOne(id, { select: ['id', 'password'] });
      expect(response.status).toBe(200);
      expect(bcrypt.compareSync(newPassword, user.password)).toBeTruthy();
      done();
    });

    it('Failed user password update incorrect old password 400', async done => {
      const { id, token, password: oldPassword } = await registerUserAndGetToken();
      const newPassword = '123456';

      const response = await request(app.getServer()).put(`/api/v1/users/password`).set('Authorization', token.token).send({
        oldPassword: '123',
        newPassword,
      });

      expect(response.status).toBe(400);

      done();
    });

    it('Failed user password weak new password 400', async done => {
      const { id, token, password: oldPassword } = await registerUserAndGetToken();
      const newPassword = '123456';

      const response = await request(app.getServer()).put(`/api/v1/users/password`).set('Authorization', token.token).send({
        oldPassword,
        newPassword: '123',
      });

      expect(response.status).toBe(400);

      done();
    });
  });
});

describe('Get Password', () => {
  describe('[GET] /api/v1/user', () => {
    it('Successful get user 200', async done => {
      const { id, token } = await registerUserAndGetToken();

      const response = await request(app.getServer()).get(`/api/v1/user`).set('Authorization', token.token).send({});

      expect(response.status).toBe(200);

      done();
    });
    it('Failed get user unauthorized 401', async done => {
      const { id, token } = await registerUserAndGetToken();

      const response = await request(app.getServer()).get(`/api/v1/user`);

      expect(response.status).toBe(401);

      done();
    });
  });
});

describe('Get User By Id', () => {
  describe('[GET] /api/v1/users/:id', () => {
    it('Successful get user 200', async done => {
      const { id, token } = await registerUserAndGetToken();

      const response = await request(app.getServer()).get(`/api/v1/users/${id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(id);

      done();
    });
    it('Failed to get user not found 404', async done => {
      const id = 99;

      const response = await request(app.getServer()).get(`/api/v1/users/${id}`);

      expect(response.status).toBe(404);

      done();
    });
  });
});

const registerUserAndGetToken = async () => {
  const email = 'youssefelzanaty@gmail.com';
  const password = 'a11y23q';
  const profession = await Profession.save({ id: 1, name: 'Graphic Design' } as Profession);
  const user = await User.save({
    id: 99,
    email: email,
    password: bcrypt.hashSync(password, 10),
    emailConfirmed: true,
    userType: 'freelancer',
    profession: profession,
    displayName: 'Youssef ElZanaty',
    country: 'Egypt',
    phoneNumber: '+201001042218',
  } as User);

  const token = AuthService.createAuthToken(user);
  return { id: user.id, password, token };
};
