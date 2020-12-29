import { NextFunction, Request, Response } from 'express';
import * as _ from 'lodash';
import { CreateUserDTO } from '../common/dtos/user/createUser.dto';
import { RequestWithUser } from '../common/interfaces/auth.interface';
import { User } from '../entities/users.entity';
import AuthService from '../services/auth.service';
import { plainToClass } from 'class-transformer';
import { LoginUserDTO } from '../common/dtos';
class AuthController {
  public authService = new AuthService();

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDTO = plainToClass(CreateUserDTO, req.body, { excludeExtraneousValues: true });
      const signUpUserData: User = await this.authService.register(userData);

      res.status(201).json({ id: signUpUserData.id });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: LoginUserDTO = plainToClass(LoginUserDTO, req.body);
      const { token, findUser } = await this.authService.login(userData);

      res.cookie('Authorization', token, {
        httpOnly: true,
        signed: true,
        sameSite: 'strict',
        secure: true,
      });

      const userResponse = _.omit(findUser, ['password']);

      res.status(200).json({ ...userResponse, token });
    } catch (error) {
      next(error);
    }
  };

  public authenticateSocial = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = await this.authService.createToken(req.user as User);

    res.cookie('Authorization', token, {
      httpOnly: true,
      signed: true,
      sameSite: 'strict',
      secure: true,
    });
    const userResponse = _.pick(req.user, ['email', 'displayName', 'id']);
    return res.status(200).json({ token: token, ...userResponse });
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.clearCookie('Authorization');
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
