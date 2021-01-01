import bcrypt from 'bcrypt';
import 'dotenv/config';
import request from 'supertest';
import AuthRoute from '../../api/routes/auth.route';
import App from '../../app';
import { Profession } from '../../entities/profession.entity';
import { User } from '../../entities/users.entity';
import { db } from '../util/db';

let app: App;
beforeAll(async () => {
  const authRoute = new AuthRoute();
  app = new App([authRoute]);
  await app.initializeApp();
});

beforeEach(async () => {
  await db.clear();
});

describe('User Registration', () => {
  describe('[POST] /api/v1/auth/register', () => {
    it('Successful registration 201', async done => {
      const email = 'youssefelzanaty@gmail.com';

      await Profession.save({ id: 1, name: 'Graphic Design' } as Profession);
      const response = await request(app.getServer()).post(`/api/v1/auth/register`).send({
        email: email,
        password: 'a11y23q',
        userType: 'personal',
        professionId: 1,
        displayName: 'Youssef ElZanaty',
        country: 'Egypt',
        phoneNumber: '+201001042218',
      });

      const user = await User.findOne({ email: email });

      expect(response.status).toBe(201);
      expect(user).toBeDefined();
      done();
    });

    it('Conflict user registration 409', async done => {
      const email = 'youssefelzanaty@gmail.com';

      const profession = await Profession.save({ id: 1, name: 'Graphic Design' } as Profession);
      await User.save({
        email: email,
        password: 'a11y23q',
        userType: 'personal',
        profession: profession,
        displayName: 'Youssef ElZanaty',
        country: 'Egypt',
        phoneNumber: '+201001042218',
      } as User);
      const response = await request(app.getServer()).post(`/api/v1/auth/register`).send({
        email: email,
        password: 'a11y23q',
        userType: 'personal',
        professionId: 1,
        displayName: 'Youssef ElZanaty',
        country: 'Egypt',
        phoneNumber: '+201001042218',
      });

      expect(response.status).toBe(409);
      done();
    });

    it("Registration with a profession that doesn't exist 404", async done => {
      const email = 'youssefelzanaty@gmail.com';

      const response = await request(app.getServer()).post(`/api/v1/auth/register`).send({
        email: email,
        password: 'a11y23q',
        userType: 'personal',
        professionId: 1,
        displayName: 'Youssef ElZanaty',
        country: 'Egypt',
        phoneNumber: '+201001042218',
      });

      expect(response.status).toBe(404);
      done();
    });

    it('Registration with an invalid email', async done => {
      const email = 'youssefelzanatygmail.com';

      const response = await request(app.getServer()).post(`/api/v1/auth/register`).send({
        email: email,
        password: 'a11y23q',
        userType: 'personal',
        professionId: 1,
        displayName: 'Youssef ElZanaty',
        country: 'Egypt',
        phoneNumber: '+201001042218',
      });

      expect(response.status).toBe(400);
      done();
    });

    it('Registration with an invalid user type', async done => {
      const email = 'youssefelzanatygmail.com';

      const response = await request(app.getServer()).post(`/api/v1/auth/register`).send({
        email: email,
        password: 'a11y23q',
        userType: 'test',
        professionId: 1,
        displayName: 'Youssef ElZanaty',
        country: 'Egypt',
        phoneNumber: '+201001042218',
      });

      expect(response.status).toBe(400);
      done();
    });

    it('Registration with an invalid phone number', async done => {
      const email = 'youssefelzanatygmail.com';

      const response = await request(app.getServer()).post(`/api/v1/auth/register`).send({
        email: email,
        password: 'a11y23q',
        userType: 'personal',
        professionId: 1,
        displayName: 'Youssef ElZanaty',
        country: 'Egypt',
        phoneNumber: '+20100104228',
      });

      expect(response.status).toBe(400);
      done();
    });

    it('Registration with a weak password', async done => {
      const email = 'youssefelzanaty@gmail.com';

      const response = await request(app.getServer()).post(`/api/v1/auth/register`).send({
        email: email,
        password: 'a11y2',
        userType: 'personal',
        professionId: 1,
        displayName: 'Youssef ElZanaty',
        country: 'Egypt',
        phoneNumber: '+201001042218',
      });

      expect(response.status).toBe(400);
      done();
    });
  });
});

describe('User Login', () => {
  describe('[POST] /api/v1/auth/login', () => {
    it('Successful login 200', async done => {
      const email = 'youssefelzanaty@gmail.com';
      const password = 'a11y23q';
      const profession = await Profession.save({ id: 1, name: 'Graphic Design' } as Profession);
      await User.save({
        email: email,
        password: bcrypt.hashSync(password, 10),
        userType: 'personal',
        profession: profession,
        displayName: 'Youssef ElZanaty',
        country: 'Egypt',
        phoneNumber: '+201001042218',
      } as User);

      const response = await request(app.getServer()).post(`/api/v1/auth/login`).send({
        email,
        password,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      done();
    });
    it('Failed login wrong password 401', async done => {
      const email = 'youssefelzanaty@gmail.com';
      const password = 'a11y23q';
      const profession = await Profession.save({ id: 1, name: 'Graphic Design' } as Profession);
      await User.save({
        email: email,
        password: bcrypt.hashSync(password, 10),
        userType: 'personal',
        profession: profession,
        displayName: 'Youssef ElZanaty',
        country: 'Egypt',
        phoneNumber: '+201001042218',
      } as User);

      const response = await request(app.getServer()).post(`/api/v1/auth/login`).send({
        email,
        password: 'sadas',
      });

      expect(response.status).toBe(401);
      done();
    });
    it("Failed login user doesn't exist 404", async done => {
      const email = 'youssefelzanaty@gmail.com';
      const password = 'a11y23q';

      const response = await request(app.getServer()).post(`/api/v1/auth/login`).send({
        email,
        password,
      });

      expect(response.status).toBe(404);
      done();
    });
  });
});
