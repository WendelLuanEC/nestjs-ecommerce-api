import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

const mockUser = { id: 'user-uuid', email: 'user@example.com' } as any;
const mockProduct = { id: 'prod-uuid', name: 'Notebook Dell', price: 4999.9 } as any;
const mockCart = { id: 'cart-uuid', user: mockUser, items: [] } as any;

describe('CartController', () => {
  let controller: CartController;
  let service: CartService;

  const mockCartService = {
    getCart: jest.fn(),
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        { provide: CartService, useValue: mockCartService },
        // Mock global guard JwtAuthGuard para não precisar autenticar nos testes
        {
          provide: APP_GUARD,
          useValue: {
            canActivate: (context: ExecutionContext) => {
              const req = context.switchToHttp().getRequest();
              req.user = mockUser; // injeta usuário fake
              return true;
            },
          },
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return cart for user', async () => {
    mockCartService.getCart.mockResolvedValue(mockCart);

    const result = await controller.getCart({ user: mockUser } as any);

    expect(service.getCart).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockCart);
  });

  it('should add product to cart', async () => {
    const updatedCart = { ...mockCart, items: [{ product: mockProduct, quantity: 2 }] };
    mockCartService.addToCart.mockResolvedValue(updatedCart);

    const result = await controller.addToCart({ user: mockUser } as any, {
      productId: mockProduct.id,
      quantity: 2,
    });

    expect(service.addToCart).toHaveBeenCalledWith(mockUser, {
      productId: mockProduct.id,
      quantity: 2,
    });
    expect(result).toEqual(updatedCart);
  });

  it('should remove product from cart', async () => {
    const emptyCart = { ...mockCart, items: [] };
    mockCartService.removeFromCart.mockResolvedValue(emptyCart);

    const result = await controller.removeFromCart({ user: mockUser } as any, {
      productId: mockProduct.id,
    });

    expect(service.removeFromCart).toHaveBeenCalledWith(mockUser, {
      productId: mockProduct.id,
    });
    expect(result).toEqual(emptyCart);
  });
});
