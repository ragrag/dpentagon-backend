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

describe('Testing User Registration', () => {
  describe('[POST] /api/v1/register', () => {
    it('Successful registration 201', async done => {
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
      done();
    });
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
    const response = await request(app.getServer()).post(`/api/v1/register`).send({
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
});
