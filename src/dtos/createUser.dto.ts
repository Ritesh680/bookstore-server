export class CreateUserDto {
  id: number;
  name: string;
  password: string;
  email: string;
  confirmPassword: string;
  profile_image: string;
}
