import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiBearerAuth('access-token')
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Login' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({
    schema: {
      type: 'object',
      description: 'Login details',
      properties: {
        email: {
          type: 'string',
          example: 'ritesh1@gmail.com',
        },
        password: {
          type: 'string',
          example: '1234',
        },
      },
    },
  })
  @Post('login')
  async login(@Body() login: Login) {
    return await this.authService.login(login);
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }
}
