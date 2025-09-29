import 'dotenv/config';
import { DataSource } from 'typeorm';
import { CartItem } from './cart/cart-item.entity';
import { Cart } from './cart/cart.entity';
import { Product } from './products/product.entity';
import { User } from './users/user.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'nestuser',
  password: process.env.DB_PASSWORD || 'nestpass',
  database: process.env.DB_NAME || 'nestdb',
  entities: [User, Product, Cart, CartItem],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
});
