import { 
  Controller, Post, Body, UseGuards, Request, Get, Query, UnauthorizedException 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { 
  ApiTags, ApiResponse, ApiBearerAuth, ApiOperation, ApiBody 
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiBody({
    type: RegisterDto,
    examples: {
      user: {
        summary: 'Usuário comum',
        value: {
          name: 'Alice Doe',
          email: 'alice@example.com',
          password: '123456',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description:
      'Usuário registrado com sucesso. Um e-mail de confirmação foi enviado.',
    schema: {
      example: {
        message: 'User created. Please confirm your email.',
      },
    },
  })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Get('confirm')
  @ApiOperation({ summary: 'Confirmar conta via token recebido no e-mail' })
  @ApiResponse({
    status: 200,
    description: 'Conta confirmada com sucesso',
    schema: {
      example: { message: 'Email confirmado! Agora você pode fazer login.' },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou expirado',
    schema: {
      example: {
        statusCode: 401,
        message: 'Token inválido ou expirado.',
        error: 'Unauthorized',
      },
    },
  })
  async confirmEmail(@Query('token') token: string) {
    return this.authService.confirmEmail(token);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login do usuário (apenas após confirmação de conta)' })
  @ApiBody({
    type: LoginDto,
    examples: {
      valid: {
        summary: 'Exemplo de login válido',
        value: {
          email: 'alice@example.com',
          password: '123456',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso. Retorna um token JWT.',
    schema: {
      example: { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...' },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas ou conta não confirmada',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      },
    },
  })
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.authService.login(user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Perfil do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados do usuário autenticado extraídos do JWT.',
    schema: {
      example: {
        userId: 'uuid-here',
        email: 'alice@example.com',
        role: 'user',
      },
    },
  })
  async getProfile(@Request() req) {
    return req.user;
  }
}
