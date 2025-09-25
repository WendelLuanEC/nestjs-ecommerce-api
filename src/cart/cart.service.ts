import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartsRepo: Repository<Cart>,
    @InjectRepository(CartItem) private itemsRepo: Repository<CartItem>,
    @InjectRepository(Product) private productsRepo: Repository<Product>,
  ) {}

  async getCart(user: User): Promise<Cart> {
    let cart = await this.cartsRepo.findOne({
      where: { user: { id: user.id } },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartsRepo.create({ user, items: [] });
      await this.cartsRepo.save(cart);
    }

    return cart;
  }

  async addToCart(user: User, dto: AddToCartDto): Promise<Cart> {
    const cart = await this.getCart(user);

    const product = await this.productsRepo.findOne({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Produto não encontrado');

    let item = cart.items.find((i) => i.product.id === dto.productId);

    if (item) {
      item.quantity += dto.quantity;
    } else {
      item = this.itemsRepo.create({
        cart,
        product,
        quantity: dto.quantity,
      });
      cart.items.push(item);
    }

    await this.itemsRepo.save(item);
    return this.getCart(user);
  }

  async removeFromCart(user: User, dto: RemoveFromCartDto): Promise<Cart> {
    const cart = await this.getCart(user);

    const item = cart.items.find((i) => i.product.id === dto.productId);
    if (!item) throw new NotFoundException('Produto não está no carrinho');

    await this.itemsRepo.remove(item);
    return this.getCart(user);
  }
}
