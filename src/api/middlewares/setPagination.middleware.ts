import { Request, Response, NextFunction } from 'express';

/**
 * set page and limit with default values 1 and 20
 */

export default function setPagination(req: Request | any, res: Response, next: NextFunction) {
  req.query.page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) || 1 : 1;

  req.query.limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) || 0 : 20;

  if (req.query.page < 1) req.query.page = 1;

  if (req.query.limit > 50) req.query.limit = 50;
  if (req.query.limit <= 0) req.query.limit = 20;

  next();
}
