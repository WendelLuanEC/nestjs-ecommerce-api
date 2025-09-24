import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let repo: {
    create: jest.Mock;
    save: jest.Mock;
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should hash password when creating user', async () => {
    const dto = { name: 'Test', email: 'test@example.com', password: '123456' };

    repo.create.mockReturnValue({ ...dto } as User);
    repo.save.mockResolvedValue({ ...dto, id: 'uuid', password: 'hashedpass' } as User);

    const user = (await service.create(dto)) as unknown as User;

    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
    expect(user.password).not.toBe(dto.password);
  });

  it('should find a user by email', async () => {
    repo.findOne.mockResolvedValue({ id: 'uuid', email: 'test@example.com' } as User);

    const user = (await service.findByEmail('test@example.com')) as User;

    expect(repo.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    expect(user.email).toBe('test@example.com');
  });
});
