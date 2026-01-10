import { Body, Controller, Post } from '@nestjs/common';
import { AuthResponse, AuthService, LoginPayload } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginPayload): AuthResponse {
    return this.authService.login(body);
  }
}
