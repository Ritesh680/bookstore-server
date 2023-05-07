import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { SuccessResponse } from 'src/utils/Responses';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getAllUsers() {
    const users = await this.userRepository.query(
      'SELECT id,name,email,role,profile_image FROM users',
    );
    return SuccessResponse('Users fetched successfully', users);
  }

  async getUserById(id: number) {
    const user = await this.findUserById(id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return SuccessResponse('User fetched successfully', rest);
  }

  async createUser(userDetails: UserInfo, profileImage: Express.Multer.File) {
    try {
      const newUser = this.userRepository.create({
        ...userDetails,
        profile_image: profileImage.path,
      });
      const response = await this.userRepository.save(newUser);
      return SuccessResponse('User created successfully', response);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async editUser(id: number, userDetails: UserInfo) {
    const user = await this.findUserById(id);

    const updatedUser = this.userRepository.merge(user, userDetails);
    await this.userRepository.save(updatedUser);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = updatedUser;
    return SuccessResponse('User updated successfully', rest);
  }

  async deleteUser(id: number) {
    try {
      const user = await this.findUserById(id);
      const response = await this.userRepository.delete({ id: user.id });
      return SuccessResponse('User deleted successfully', response);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  findUserById = async (id: number) => {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new HttpException('User not found', 404);
    return user;
  };
}
