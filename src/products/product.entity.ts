import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('products')
export class Product {
  @ApiProperty({ example: 'uuid-product-id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Smartphone Samsung Galaxy S23' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ example: 'Último modelo com câmera de 200MP' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ example: 3999.9 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ example: 50 })
  @Column({ type: 'int', default: 0 })
  stock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
