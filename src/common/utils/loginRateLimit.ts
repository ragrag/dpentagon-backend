import rateLimit from 'express-rate-limit';

export const loginRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === 'production' ? 10 : 10000,
  message: 'Too many requests',
});
