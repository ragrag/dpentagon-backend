import { Router } from 'express';
import passport from 'passport';
import '../middlewares/passport';
import PostsController from '../../controllers/posts.controller';
import Route from '../../common/interfaces/routes.interface';
import validationMiddleware from '../middlewares/validation.middleware';
import jwtAuthMiddeware from '../middlewares/jwt-cookie-auth.middleware';
import { CreatePhotoPostDTO } from '../../common/dtos/post/createPhotoPost.dto';
import { ObjectIdDTO } from '../../common/dtos/common/objectId.dto';

class PostsRoute implements Route {
  public path = '/posts';
  public router = Router();
  public postController = new PostsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/photo`,
      [jwtAuthMiddeware, validationMiddleware(CreatePhotoPostDTO, 'body', true)],
      this.postController.createPhotoPost,
    );
    // this.router.post(`${this.path}/video`, this.postController.createVideoPost);
    // this.router.get(`${this.path}`, this.postController.getPosts);
    this.router.get(`${this.path}/:id`, [validationMiddleware(ObjectIdDTO, 'params', false)], this.postController.getPostById);
    // this.router.delete(`${this.path}/:id`, [jwtAuthMiddeware], this.postController.deletePostById);
  }
}

export default PostsRoute;
