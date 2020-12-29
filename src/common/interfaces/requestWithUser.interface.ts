import { Request } from 'express';
import { User } from '../../entities/users.entity';

export interface RequestWithUser extends Request {
  user?: User;
}
