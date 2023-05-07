import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/typeorm/entities/User';

@Injectable()
export class JwtServices {
  constructor(private readonly jwtService: JwtService) {}
  async generateAccessToken(user: User): Promise<string> {
    const payload = { user };
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
  }

  async generateRefreshToken(user: User): Promise<string> {
    const payload = { user };
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      return payload;
    } catch (error) {
      throw new HttpException('Invalid token you have giben', 401);
    }
  }
}
