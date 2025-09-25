import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Product } from './products/product.entity';
import { Cart } from './cart/cart.entity';
import { CartItem } from './cart/cart-item.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Product, Cart, CartItem],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
});
