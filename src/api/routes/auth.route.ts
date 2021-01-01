import { Router } from 'express';
import passport from 'passport';
import '../middlewares/passport';
import githubAccessTokenMiddleware from '../middlewares/githubAccessToken.middleware';
import googleAccessTokenMiddleware from '../middlewares/googleAccessToken.middleware';
import AuthController from '../../controllers/auth.controller';
import { CreateUserDTO } from '../../common/dtos/auth/createUser.dto';
import Route from '../../common/interfaces/routes.interface';
import validationMiddleware from '../middlewares/validation.middleware';
import jwtAuthMiddeware from '../middlewares/jwt-cookie-auth.middleware';
import { LoginUserDTO } from '../../common/dtos';
import { ForgetPasswordDTO } from '../../common/dtos/auth/forgetPassword.dto';
import { ResetPasswordDTO } from '../../common/dtos/auth/resetPassword.dto';
import { SendConfirmationEmailDTO } from '../../common/dtos/auth/sendConfirmationEmail.dto';
import { ConfirmEmailDTO } from '../../common/dtos/auth/confirmEmail.dto';

class AuthRoute implements Route {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDTO, 'body'), this.authController.register);
    this.router.post(`${this.path}/login`, validationMiddleware(LoginUserDTO, 'body'), this.authController.login);
    this.router.post(`${this.path}/password/forget`, validationMiddleware(ForgetPasswordDTO, 'body', false), this.authController.forgetPassword);
    this.router.post(`${this.path}/password/reset`, validationMiddleware(ResetPasswordDTO, 'body', false), this.authController.resetPassword);
    this.router.post(
      `${this.path}/email/confirmation/send`,
      validationMiddleware(SendConfirmationEmailDTO, 'body', false),
      this.authController.sendConfirmationEmail,
    );
    this.router.post(`${this.path}/email/confirm`, validationMiddleware(ConfirmEmailDTO, 'body', false), this.authController.confirmEmail);

    this.router.post(`${this.path}/logout`, [jwtAuthMiddeware], this.authController.logout);
    this.router.post(
      `/oauth/facebook`,
      [
        passport.authenticate('facebook-token', {
          session: false,
          scope: ['email'],
        }),
      ],
      this.authController.authenticateSocial,
      (error, req, res, next) => {
        if (error) {
          res.status(400).send(error.message);
        }
      },
    );
    this.router.post(
      `/oauth/google`,
      [
        googleAccessTokenMiddleware,
        passport.authenticate('google-oauth-token', {
          session: false,
          scope: ['email'],
        }),
      ],
      this.authController.authenticateSocial,
      (error, req, res, next) => {
        if (error) {
          res.status(400).send(error.message);
        }
      },
    );
    this.router.post(
      `/oauth/github`,
      [
        githubAccessTokenMiddleware,
        passport.authenticate('github-token', {
          session: false,
          scope: ['email'],
        }),
      ],
      this.authController.authenticateSocial,
      (error, req, res, next) => {
        if (error) {
          res.status(400).send(error.message);
        }
      },
    );
  }
}

export default AuthRoute;
