import { NextFunction, Request, Response } from 'express';
import * as _ from 'lodash';
import { CreateUserDTO } from '../common/dtos/auth/createUser.dto';
import { RequestWithUser } from '../common/interfaces/auth.interface';
import { User } from '../entities/users.entity';
import AuthService from '../services/auth.service';
import { plainToClass } from 'class-transformer';
import { LoginUserDTO } from '../common/dtos';
import { eventEmitter, Events } from '../common/utils/eventEmitter';
import { ResetPasswordDTO } from '../common/dtos/auth/resetPassword.dto';
import { ConfirmEmailDTO } from '../common/dtos/auth/confirmEmail.dto';
import { ForgetPasswordDTO } from '../common/dtos/auth/forgetPassword.dto';
import { SendConfirmationEmailDTO } from '../common/dtos/auth/sendConfirmationEmail.dto';
class AuthController {
  public authService = new AuthService();

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDTO = plainToClass(CreateUserDTO, req.body, { excludeExtraneousValues: true });
      const user: User = await this.authService.register(userData);
      const token = AuthService.createAuthToken(user);

      // res.cookie('Authorization', token, {
      //   httpOnly: true,
      //   signed: true,
      //   sameSite: process.env.NODE_ENV === 'development' ? 'none' : 'strict',
      //   secure: process.env.NODE_ENV === 'development' ? false : true,
      // });

      const userResponse = _.omit(user, ['password']);
      res.status(201).json({ ...userResponse, token });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: LoginUserDTO = plainToClass(LoginUserDTO, req.body);
      const { token, user } = await this.authService.login(userData);

      res.cookie('Authorization', token, {
        httpOnly: true,
        signed: true,
        // sameSite: process.env.NODE_ENV === 'development' ? 'none' : 'strict',
        sameSite: 'none',
        secure: process.env.NODE_ENV === 'development' ? false : true,
        expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
      });

      const userResponse = _.omit(user, ['password']);

      res.status(200).json({ ...userResponse, token });
    } catch (error) {
      next(error);
    }
  };

  public authenticateSocial = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = await AuthService.createAuthToken(req.user as User);

    res.cookie('Authorization', token, {
      httpOnly: true,
      signed: true,
      sameSite: process.env.NODE_ENV === 'development' ? 'none' : 'strict',
      secure: process.env.NODE_ENV === 'development' ? false : true,
    });
    const userResponse = _.pick(req.user, ['email', 'displayName', 'id']);
    return res.status(200).json({ token: token, ...userResponse });
  };

  public forgetPassword = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const forgetPasswordDTO: ForgetPasswordDTO = plainToClass(ForgetPasswordDTO, req.body, { excludeExtraneousValues: true });
      await this.authService.sendPasswordResetEmail(forgetPasswordDTO);
      res.status(202).send();
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const passwordResetDTO: ResetPasswordDTO = plainToClass(ResetPasswordDTO, req.body, { excludeExtraneousValues: true });
      await this.authService.resetPassword(passwordResetDTO);

      res.status(200).send();
    } catch (error) {
      next(error);
    }
  };

  public sendConfirmationEmail = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const confirmationEmailDTO: SendConfirmationEmailDTO = plainToClass(SendConfirmationEmailDTO, req.body, { excludeExtraneousValues: true });
      await this.authService.sendEmailConfirmation(confirmationEmailDTO);
      res.status(202).send();
    } catch (error) {
      next(error);
    }
  };

  public confirmEmail = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const confirmEmailDTO: ConfirmEmailDTO = plainToClass(ConfirmEmailDTO, req.body, { excludeExtraneousValues: true });
      await this.authService.confirmEmail(confirmEmailDTO);

      res.status(200).send();
    } catch (error) {
      next(error);
    }
  };

  public logout = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.clearCookie('Authorization');
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
