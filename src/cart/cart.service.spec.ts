import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { Product } from '../products/product.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockUser = { id: 'user-uuid', email: 'user@example.com' } as any;

const mockProduct: Product = {
  id: 'prod-uuid',
  name: 'Notebook Dell Inspiron',
  description: 'i7, 16GB RAM, 512GB SSD',
  price: 4999.9,
  stock: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockCart: Cart = {
  id: 'cart-uuid',
  user: mockUser,
  items: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockCartItem: CartItem = {
  id: 'item-uuid',
  product: mockProduct,
  cart: mockCart,
  quantity: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CartService', () => {
  let service: CartService;
  let cartsRepo: Repository<Cart>;
  let itemsRepo: Repository<CartItem>;
  let productsRepo: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(CartItem),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Product),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartsRepo = module.get<Repository<Cart>>(getRepositoryToken(Cart));
    itemsRepo = module.get<Repository<CartItem>>(getRepositoryToken(CartItem));
    productsRepo = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new cart if none exists', async () => {
    (cartsRepo.findOne as jest.Mock).mockResolvedValueOnce(null);
    (cartsRepo.create as jest.Mock).mockReturnValue(mockCart);
    (cartsRepo.save as jest.Mock).mockResolvedValue(mockCart);

    const cart = await service.getCart(mockUser);

    expect(cartsRepo.create).toHaveBeenCalledWith({ user: mockUser, items: [] });
    expect(cart).toEqual(mockCart);
  });

  it('should return existing cart if found', async () => {
    (cartsRepo.findOne as jest.Mock).mockResolvedValueOnce(mockCart);

    const cart = await service.getCart(mockUser);

    expect(cart).toEqual(mockCart);
  });

//   it('should add new product to cart', async () => {
//     const emptyCart = { ...mockCart, items: [] };
//     (cartsRepo.findOne as jest.Mock).mockResolvedValue(emptyCart);
//     (productsRepo.findOne as jest.Mock).mockResolvedValue(mockProduct);

//     const createdItem = { ...mockCartItem, quantity: 2 };
//     (itemsRepo.create as jest.Mock).mockReturnValue(createdItem);
//     (itemsRepo.save as jest.Mock).mockResolvedValue(createdItem);

//     // apenas para o retorno final
//     jest.spyOn(service, 'getCart').mockResolvedValue({ ...mockCart, items: [createdItem] });

//     const result = await service.addToCart(mockUser, { productId: mockProduct.id, quantity: 2 });

//     expect(itemsRepo.create).toHaveBeenCalledWith(
//       expect.objectContaining({
//         cart: emptyCart,
//         product: mockProduct,
//         quantity: 2,
//       }),
//     );
//     expect(result.items.length).toBe(1);
//     expect(result.items[0].product.id).toBe(mockProduct.id);
//   });

  it('should throw if product not found when adding', async () => {
    (cartsRepo.findOne as jest.Mock).mockResolvedValueOnce({ ...mockCart, items: [] });
    (productsRepo.findOne as jest.Mock).mockResolvedValueOnce(null);

    await expect(
      service.addToCart(mockUser, { productId: 'invalid', quantity: 1 }),
    ).rejects.toThrow(NotFoundException);
  });

//   it('should remove item from cart', async () => {
//     const cartWithItem = {
//       ...mockCart,
//       items: [{ ...mockCartItem, product: { ...mockProduct, id: 'prod-uuid' } }],
//     };
//     (cartsRepo.findOne as jest.Mock).mockResolvedValue(cartWithItem);
//     (itemsRepo.remove as jest.Mock).mockResolvedValue(mockCartItem);

//     jest.spyOn(service, 'getCart').mockResolvedValue({ ...mockCart, items: [] });

//     const result = await service.removeFromCart(mockUser, { productId: 'prod-uuid' });

//     expect(itemsRepo.remove).toHaveBeenCalledWith(mockCartItem);
//     expect(result.items).toEqual([]);
//   });

  it('should throw if product not in cart when removing', async () => {
    (cartsRepo.findOne as jest.Mock).mockResolvedValueOnce({ ...mockCart, items: [] });

    await expect(
      service.removeFromCart(mockUser, { productId: mockProduct.id }),
    ).rejects.toThrow(NotFoundException);
  });
});
