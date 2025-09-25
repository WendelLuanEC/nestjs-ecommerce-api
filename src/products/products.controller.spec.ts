import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

const productEntity: Product = {
  id: 'uuid-123',
  name: 'Notebook Dell Inspiron',
  description: 'Notebook com i7 e 16GB RAM',
  price: 4999.9,
  stock: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([productEntity]),
            findOne: jest.fn().mockResolvedValue(productEntity),
            create: jest.fn().mockResolvedValue(productEntity),
            update: jest.fn().mockResolvedValue(productEntity),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all products', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([productEntity]);
  });

  it('should return one product by id', async () => {
    const result = await controller.findOne('uuid-123');
    expect(result).toEqual(productEntity);
  });

  it('should create a new product', async () => {
    const dto = { name: 'New', description: 'Desc', price: 100, stock: 5 };
    const result = await controller.create(dto);
    expect(result).toEqual(productEntity);
  });

  it('should update a product', async () => {
    const dto = { name: 'Updated' };
    const result = await controller.update('uuid-123', dto);
    expect(result).toEqual(productEntity);
  });

  it('should remove a product', async () => {
    const result = await controller.remove('uuid-123');
    expect(result).toBeUndefined();
  });
});
