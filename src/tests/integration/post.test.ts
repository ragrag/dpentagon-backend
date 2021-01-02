import bcrypt from 'bcrypt';
import 'dotenv/config';
import request from 'supertest';
import PostsRoute from '../../api/routes/posts.route';
import App from '../../app';
import { Catalogue } from '../../entities/catalogue.entity';
import { Post } from '../../entities/post.entity';
import { Profession } from '../../entities/profession.entity';
import { User } from '../../entities/users.entity';
import AuthService from '../../services/auth.service';
import GCSService from '../../services/gcs.service';
jest.mock('../../services/gcs.service');
import { db } from '../util/db';

let app: App;
beforeAll(async () => {
  const postRoute = new PostsRoute();
  app = new App([postRoute]);
  await app.initializeApp();
});

beforeEach(async () => {
  await db.clear();
});

describe('Photo Post Creation', () => {
  describe('[POST] /api/v1/posts/photo', () => {
    it('Successful post creation 201', async done => {
      const mockGCSPhotoUpload = jest.fn();
      GCSService.prototype.uploadBase64 = mockGCSPhotoUpload;
      mockGCSPhotoUpload.mockReturnValue(Promise.resolve('www.google.com'));

      const { user, token } = await registerUserAndGetToken();
      const catalogue = await Catalogue.save({
        user: user,
        name: 'Art',
      } as Catalogue);
      const response = await request(app.getServer()).post(`/api/v1/posts/photo`).set('Authorization', token.token).send({
        caption: 'my new drawing',
        content: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
        catalogueId: catalogue.id,
      });
      const post = await Post.findOne(response.body.id);
      expect(response.status).toBe(201);
      expect(post).toBeDefined();
      done();
    });
    it('Success post creation without a caption 201', async done => {
      const mockGCSPhotoUpload = jest.fn();
      GCSService.prototype.uploadBase64 = mockGCSPhotoUpload;
      mockGCSPhotoUpload.mockReturnValue(Promise.resolve('www.google.com'));
      const { user, token } = await registerUserAndGetToken();
      const catalogue = await Catalogue.save({
        user: user,
        name: 'Art',
      } as Catalogue);
      const response = await request(app.getServer()).post(`/api/v1/posts/photo`).set('Authorization', token.token).send({
        caption: 'my new drawing',
        content: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
        catalogueId: catalogue.id,
      });

      const post = await Post.findOne(response.body.id);
      expect(response.status).toBe(201);
      expect(post).toBeDefined();
      done();
    });

    it('Failed post creation invalid image 400', async done => {
      const mockGCSPhotoUpload = jest.fn();
      GCSService.prototype.uploadBase64 = mockGCSPhotoUpload;
      mockGCSPhotoUpload.mockReturnValue(Promise.resolve('www.google.com'));
      const { user, token } = await registerUserAndGetToken();
      const catalogue = await Catalogue.save({
        user: user,
        name: 'Art',
      } as Catalogue);
      const response = await request(app.getServer()).post(`/api/v1/posts/photo`).set('Authorization', token.token).send({
        caption: 'my new drawing',
        content: 'test invalid base64',
        catalogueId: catalogue.id,
      });
      expect(response.status).toBe(400);
      done();
    });

    it('Failed post creation no image', async done => {
      const mockGCSPhotoUpload = jest.fn();
      GCSService.prototype.uploadBase64 = mockGCSPhotoUpload;
      mockGCSPhotoUpload.mockReturnValue(Promise.resolve('www.google.com'));
      const { user, token } = await registerUserAndGetToken();
      const catalogue = await Catalogue.save({
        user: user,
        name: 'Art',
      } as Catalogue);
      const response = await request(app.getServer()).post(`/api/v1/posts/photo`).set('Authorization', token.token).send({
        caption: 'my new drawing',
        catalogueId: catalogue.id,
      });
      expect(response.status).toBe(400);
      done();
    });

    it('Failed post creation no catalogue id', async done => {
      const mockGCSPhotoUpload = jest.fn();
      GCSService.prototype.uploadBase64 = mockGCSPhotoUpload;
      mockGCSPhotoUpload.mockReturnValue(Promise.resolve('www.google.com'));
      const { user, token } = await registerUserAndGetToken();
      const catalogue = await Catalogue.save({
        user: user,
        name: 'Art',
      } as Catalogue);
      const response = await request(app.getServer()).post(`/api/v1/posts/photo`).set('Authorization', token.token).send({
        caption: 'my new drawing',
        content: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
      });
      expect(response.status).toBe(400);
      done();
    });
    it('unauthorized post creation 401', async done => {
      const mockGCSPhotoUpload = jest.fn();
      GCSService.prototype.uploadBase64 = mockGCSPhotoUpload;
      mockGCSPhotoUpload.mockReturnValue(Promise.resolve('www.google.com'));
      const { user, token } = await registerUserAndGetToken();
      const catalogue = await Catalogue.save({
        user: user,
        name: 'Art',
      } as Catalogue);
      const response = await request(app.getServer()).post(`/api/v1/posts/photo`).send({
        caption: 'my new drawing',
        content: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
        catalogueId: catalogue.id,
      });
      expect(response.status).toBe(401);
      done();
    });
  });
});

describe('Get Post By Id', () => {
  describe('[POST] /api/v1/posts/:d', () => {
    it('Successfully found post 200', async done => {
      const { user } = await registerUserAndGetToken();
      const postId = 1;
      const catalogue = await Catalogue.save({
        user: user,
        name: 'Art',
      } as Catalogue);
      const post = await Post.save({
        caption: 'My latest drawing',
        url: 'https://static.wikia.nocookie.net/vampirediaries/images/1/16/Damon-S8.jpg/revision/latest?cb=20170225081735',
        postType: 'photo',
        id: postId,
        profession: user.profession,
        catalogue: catalogue,
      } as Post);

      const response = await request(app.getServer()).get(`/api/v1/posts/${postId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('postType');
      done();
    });

    it('Failed post not found 404', async done => {
      const postId = 1;
      const response = await request(app.getServer()).get(`/api/v1/posts/${postId}`);

      expect(response.status).toBe(404);

      done();
    });

    it('Invlid post id 400', async done => {
      const response = await request(app.getServer()).get(`/api/v1/posts/s`);
      expect(response.status).toBe(400);
      done();
    });
  });
});

describe('Get User posts', () => {
  describe('[POST] /api/v1/users/:id/posts', () => {
    it('Successfully found posts 200', async done => {
      const { user } = await registerUserAndGetToken();

      const catalogue = await Catalogue.save({
        user: user,
        name: 'Art',
      } as Catalogue);
      await Post.save({
        caption: 'My latest drawing',
        url: 'https://static.wikia.nocookie.net/vampirediaries/images/1/16/Damon-S8.jpg/revision/latest?cb=20170225081735',
        postType: 'photo',
        id: 1,
        profession: user.profession,
        catalogue: catalogue,
      } as Post);

      await Post.save({
        caption: 'My latest drawing',
        url: 'https://static.wikia.nocookie.net/vampirediaries/images/1/16/Damon-S8.jpg/revision/latest?cb=20170225081735',
        postType: 'photo',
        id: 2,
        profession: user.profession,
        catalogue: catalogue,
      } as Post);

      const response = await request(app.getServer()).get(`/api/v1/users/${user.id}/posts`);

      expect(response.status).toBe(200);
      expect(response.body.posts).toHaveLength(2);

      done();
    });
    it('Invalid user id 400', async done => {
      const response = await request(app.getServer()).get(`/api/v1/users/sdsa/posts`);

      expect(response.status).toBe(400);

      done();
    });
  });
});

const registerUserAndGetToken = async () => {
  const email = 'youssefelzanaty@gmail.com';
  const password = 'a11y23q';
  const profession = await Profession.save({ id: 1, name: 'Graphic Design' } as Profession);
  const user = await User.save({
    email: email,
    password: bcrypt.hashSync(password, 10),
    userType: 'personal',
    profession: profession,
    displayName: 'Youssef ElZanaty',
    country: 'Egypt',
    phoneNumber: '+201001042218',
  } as User);

  const token = AuthService.createToken(user);
  return { user, token };
};
