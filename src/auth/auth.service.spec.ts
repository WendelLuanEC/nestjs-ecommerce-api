import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<Partial<UsersService>>;
  let jwtService: jest.Mocked<Partial<JwtService>>;
  let mailService: jest.Mocked<Partial<MailService>>;

  beforeEach(async () => {
    usersService = {
      create: jest.fn().mockResolvedValue({
        id: 'uuid',
        name: 'Test User',
        email: 'test@example.com',
        password: await bcrypt.hash('123456', 10),
        role: 'user',
        status: 'inactive',
      } as User),

      findByEmail: jest.fn().mockResolvedValue({
        id: 'uuid',
        name: 'Test User',
        email: 'test@example.com',
        password: await bcrypt.hash('123456', 10),
        role: 'user',
        status: 'active',
      } as User),

      activate: jest.fn().mockResolvedValue({
        id: 'uuid',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed',
        role: 'user',
        status: 'active',
      } as User),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('fake-jwt-token'),
    };

    mailService = {
      sendConfirmationEmail: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: MailService, useValue: mailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a user and send email', async () => {
    const result = await service.register({
      email: 'test@example.com',
      password: '123456',
      name: 'Test User',
    });

    expect(result).toEqual({ message: 'User created. Please confirm your email.' });
    expect(usersService.create).toHaveBeenCalled();
    expect(mailService.sendConfirmationEmail).toHaveBeenCalledWith('test@example.com');
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
    const user = { id: 'uuid', email: 'test@example.com', role: 'user' } as User;
    const result = await service.login(user);
    expect(result).toEqual({ access_token: 'fake-jwt-token' });
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: 'uuid',
      email: 'test@example.com',
      role: 'user',
    });
  });

  it('should confirm email and activate user', async () => {
  (usersService.activate as jest.Mock).mockResolvedValue({ id: 'uuid' });

  const result = await service.confirmEmail('test@example.com');

  expect(usersService.activate).toHaveBeenCalledWith('test@example.com');
  expect(result).toBeUndefined();
});


  });
