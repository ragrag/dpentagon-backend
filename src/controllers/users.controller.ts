import { NextFunction, Request, Response } from 'express';
import * as _ from 'lodash';
import { UpdateUserDTO, UpdateUserPasswordDTO } from '../common/dtos';
import { RequestWithUser } from '../common/interfaces/auth.interface';
import { User } from '../entities/users.entity';
import userService from '../services/users.service';

class UsersController {
  public userService = new userService();

  public getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userResponse = _.omit(req.user, ['password']);
      res.status(200).json({ ...userResponse });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const findOneUserData: User = await this.userService.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.user.id);
      const { displayName, photo, profileBio }: UpdateUserDTO = req.body;
      const updateUserDTO: UpdateUserDTO = { displayName, photo, profileBio };
      await this.userService.updateUser(userId, updateUserDTO);

      res.status(200).json();
    } catch (error) {
      next(error);
    }
  };

  public updateUserPassoword = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.user.id);
      const { oldPassword, newPassword }: UpdateUserPasswordDTO = req.body;

      const updateUserPasswordDTO: UpdateUserPasswordDTO = { oldPassword, newPassword };
      await this.userService.updateUserPassword(userId, updateUserPasswordDTO);

      res.status(200).json();
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const deleteUserData: User = await this.userService.deleteUser(userId);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
