import { Router } from 'express';
import passport from 'passport';
import '../middlewares/passport';
import UsersController from '../../controllers/users.controller';
import { UpdateUserDTO, UpdateUserPasswordDTO } from '../../common/dtos';
import Route from '../../common/interfaces/routes.interface';
import validationMiddleware from '../middlewares/validation.middleware';
import jwtAuthMiddeware from '../middlewares/jwt-cookie-auth.middleware';
import { UpdateUserPhotoDTO } from '../../common/dtos/user/updateUserPhoto.dto';

class UsersRoute implements Route {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/user`, [jwtAuthMiddeware], this.usersController.getUser);
    this.router.delete(`/user`, [jwtAuthMiddeware], this.usersController.deleteUser);
    this.router.get(`${this.path}/:id`, this.usersController.getUserById);

    this.router.put(
      `${this.path}/photo`,
      [jwtAuthMiddeware, validationMiddleware(UpdateUserPhotoDTO, 'body', false)],
      this.usersController.updateUserPhoto,
    );
    this.router.put(
      `${this.path}/coverphoto`,
      [jwtAuthMiddeware, validationMiddleware(UpdateUserPhotoDTO, 'body', false)],
      this.usersController.updateUserCoverPhoto,
    );
    this.router.delete(`${this.path}/photo`, [jwtAuthMiddeware], this.usersController.deleteUserPhoto);
    this.router.delete(`${this.path}/coverphoto`, [jwtAuthMiddeware], this.usersController.deleteUserCoverPhoto);

    this.router.put(`${this.path}`, [jwtAuthMiddeware], validationMiddleware(UpdateUserDTO, 'body', false), this.usersController.updateUser);
    this.router.put(
      `${this.path}/password`,
      [jwtAuthMiddeware, validationMiddleware(UpdateUserPasswordDTO, 'body', false)],
      this.usersController.updateUserPassoword,
    );
    this.router.delete(`${this.path}`, [jwtAuthMiddeware], this.usersController.deleteUser);
  }
}

export default UsersRoute;
