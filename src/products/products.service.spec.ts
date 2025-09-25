import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const productEntity: Product = {
  id: 'uuid-123',
  name: 'Notebook Dell Inspiron',
  description: 'Notebook com i7 e 16GB RAM',
  price: 4999.9,
  stock: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ProductsService', () => {
  let service: ProductsService;
  let repo: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            find: jest.fn().mockResolvedValue([productEntity]),
            findOne: jest.fn().mockResolvedValue(productEntity),
            create: jest.fn().mockReturnValue(productEntity),
            save: jest.fn().mockResolvedValue(productEntity),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repo = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all products', async () => {
    const result = await service.findAll();
    expect(result).toEqual([productEntity]);
  });

  it('should return one product by id', async () => {
    const result = await service.findOne('uuid-123');
    expect(result).toEqual(productEntity);
  });

  it('should throw NotFoundException if product not found', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
    await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
  });

  it('should create a new product', async () => {
    const dto = { name: 'Test', description: 'Desc', price: 100, stock: 5 };
    const result = await service.create(dto);
    expect(result).toEqual(productEntity);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalled();
  });

  it('should update a product', async () => {
    const dto = { name: 'Updated Product' };
    jest.spyOn(repo, 'save').mockResolvedValue({ ...productEntity, ...dto });
    const result = await service.update('uuid-123', dto);
    expect(result.name).toBe('Updated Product');
  });

  it('should remove a product', async () => {
    const result = await service.remove('uuid-123');
    expect(result).toBeUndefined();
    expect(repo.remove).toHaveBeenCalledWith(productEntity);
  });
});
