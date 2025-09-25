import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let mailService: MailService;
  let jwtService: JwtService;

  const hashedPassword = bcrypt.hashSync('123456', 10);

  const mockUser = {
    id: 'uuid',
    name: 'Test User',
    email: 'test@example.com',
    password: hashedPassword,
    role: 'user',
    status: 'inactive',
  };

  const mockUsersService = {
    create: jest.fn().mockResolvedValue(mockUser),
    findByEmail: jest.fn().mockResolvedValue({ ...mockUser, status: 'active' }),
    activate: jest.fn().mockResolvedValue(undefined),
  };

  const mockMailService = {
    sendConfirmationEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('fake-jwt-token'),
    verify: jest.fn().mockReturnValue({ email: 'test@example.com' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: MailService, useValue: mockMailService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    mailService = module.get<MailService>(MailService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a user and send email', async () => {
    const result = await service.register({
      name: 'Test User',
      email: 'test@example.com',
      password: '123456',
    });

    expect(result).toEqual({ message: 'User created. Please confirm your email.' });
    expect(usersService.create).toHaveBeenCalled();
    expect(mailService.sendConfirmationEmail).toHaveBeenCalledWith(
      'test@example.com',
      expect.any(String),
    );
  });

  it('should validate user with correct password', async () => {
    const user = await service.validateUser('test@example.com', '123456');
    expect(user).toBeDefined();
    expect(user?.email).toBe('test@example.com');
  });

  it('should return null if password is wrong', async () => {
    const user = await service.validateUser('test@example.com', 'wrongpass');
    expect(user).toBeNull();
  });

  it('should login and return JWT token', async () => {
    const user = { ...mockUser, status: 'active' };
    const result = await service.login(user);

    expect(result).toEqual({ access_token: 'fake-jwt-token' });
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: 'uuid',
      email: 'test@example.com',
      role: 'user',
    });
  });

  it('should confirm email and activate user', async () => {
    const result = await service.confirmEmail('fake-jwt-token');

    expect(usersService.activate).toHaveBeenCalledWith('test@example.com');
    expect(result).toEqual({ message: 'Email confirmado! Agora você pode fazer login.' });
  });
});
