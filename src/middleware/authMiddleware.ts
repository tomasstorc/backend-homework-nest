import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers['authorization']) {
      const token = req.headers['authorization'].split(' ')[1];
      const user = this.jwtService.verify(token);

      if (user) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ status: 'unauthorized' });
      }
    }
  }
}
