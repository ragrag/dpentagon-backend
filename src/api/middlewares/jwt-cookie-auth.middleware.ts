import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { User } from '../../entities/users.entity';
import './passport';

export default function authenticateWithJwtCookie(req: Request, res: Response, next: NextFunction) {
  passport.authenticate('jwt-cookiecombo', { session: false }, (err, user: User, info) => {
    if (err) return next(err);

    if (!user) {
      res.clearCookie('Authorization');
      return res.status(401).send('unauthorized');
    }
    if (!user.emailConfirmed) return res.status(403).send('Email not confirmed');
    next();
  })(req, res, next);
}
