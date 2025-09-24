import { Controller, Post, Body, UseGuards, Request, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'User registered successfully. A confirmation email was sent.' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Get('confirm')
  @ApiResponse({ status: 200, description: 'Email confirmed successfully.' })
  async confirmEmail(@Query('email') email: string) {
    return this.authService.confirmEmail(email);
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Login successful. Returns a JWT token.',
    schema: {
      example: { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...' },
    },
  })
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) throw new Error('Invalid credentials');
    return this.authService.login(user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Returns user profile extracted from JWT.',
    schema: {
      example: {
        userId: 'uuid-here',
        email: 'alice@example.com',
        role: 'user',
      },
    },
  })
  getProfile(@Request() req) {
    return req.user;
  }
}
