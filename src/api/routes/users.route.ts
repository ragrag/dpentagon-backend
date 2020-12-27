import { Router } from 'express';
import passport from 'passport';
import '../middlewares/passport';
import UsersController from '../../controllers/users.controller';
import { UpdateUserDTO, UpdateUserPasswordDTO } from '../../common/dtos';
import Route from '../../common/interfaces/routes.interface';
import validationMiddleware from '../middlewares/validation.middleware';
import jwtAuthMiddeware from '../middlewares/jwt-cookie-auth.middleware';

class UsersRoute implements Route {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/user`, [jwtAuthMiddeware], this.usersController.getUser);
    this.router.get(`${this.path}/:id`, [jwtAuthMiddeware], this.usersController.getUserById);
    this.router.put(`${this.path}`, [jwtAuthMiddeware], validationMiddleware(UpdateUserDTO, 'body', true), this.usersController.updateUser);
    this.router.put(
      `${this.path}/password`,
      [jwtAuthMiddeware, validationMiddleware(UpdateUserPasswordDTO, 'body', true)],
      this.usersController.updateUserPassoword,
    );
    this.router.delete(`${this.path}`, [jwtAuthMiddeware], this.usersController.deleteUser);
  }
}

export default UsersRoute;
