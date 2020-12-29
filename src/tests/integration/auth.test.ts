import 'dotenv/config';
import request from 'supertest';
import AuthRoute from '../../api/routes/auth.route';
import App from '../../app';
import { Profession } from '../../entities/profession.entity';
import { User } from '../../entities/users.entity';
import { db } from '../util/db';

let app;
beforeAll(async () => {
  const authRoute = new AuthRoute();
  app = new App([authRoute]);
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

beforeEach(async () => {
  await db.clear();
});

afterAll(async () => {
  await db.clear();
  await db.close();
});

describe('Testing User Registration', () => {
  describe('[POST] /api/v1/register', () => {
    it('Successful registration 200', async () => {
      const email = 'youssefelzanaty@gmail.com';

      await Profession.save({ id: 1, name: 'Graphic Design' } as Profession);
      const response = await request(app.getServer()).post(`/api/v1/register`).send({
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
    });
  });
});
