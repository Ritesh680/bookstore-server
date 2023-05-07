import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import { JwtServices } from '../jwt/jwt.service';
import { JwtService } from '@nestjs/jwt';

const jwtService = new JwtServices(new JwtService());

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async login(login: Login) {
    const { email, password } = login;
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (!user || user.password !== password) {
      throw new HttpException('Invalid credentials', 401);
    }

    const access_token = await jwtService.generateAccessToken(user);
    const refresh_token = await jwtService.generateRefreshToken(user);

    return {
      success: true,
      message: 'Login success',
      token: { access_token, refresh_token },
    };
  }

  logout() {
    return {
      success: true,
      message: 'Logout success',
    };
  }
}
