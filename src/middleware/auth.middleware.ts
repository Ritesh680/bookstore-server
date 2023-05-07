import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { JwtServices } from 'src/modules/jwt/jwt.service';

export async function auth(req: Request, res: Response, next: NextFunction) {
  const jwtService = new JwtServices(new JwtService());
  const token = req.headers.authorization;
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Invalid token supplied' });
  }
  const tokenString = token.split(' ')[1];

  try {
    const payload = await jwtService.verifyToken(tokenString);
    req['user'] = payload.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
