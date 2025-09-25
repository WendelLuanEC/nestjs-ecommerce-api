import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Obter carrinho do usuário logado' })
  @ApiResponse({
    status: 200,
    description: 'Retorna o carrinho com os produtos adicionados.',
    schema: {
      example: {
        id: 'uuid-do-carrinho',
        user: {
          id: 'uuid-do-usuario',
          email: 'alice@example.com',
        },
        items: [
          {
            id: 'uuid-item',
            product: {
              id: 'uuid-produto',
              name: 'Notebook Dell Inspiron',
              price: 4999.9,
            },
            quantity: 2,
          },
        ],
      },
    },
  })
  async getCart(@Request() req) {
    return this.cartService.getCart(req.user);
  }

  @Post('add')
  @ApiOperation({ summary: 'Adicionar produto ao carrinho' })
  @ApiBody({
    type: AddToCartDto,
    examples: {
      exemplo1: {
        summary: 'Adicionar 2 notebooks',
        value: {
          productId: 'uuid-do-produto',
          quantity: 2,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Produto adicionado com sucesso. Retorna o carrinho atualizado.',
  })
  async addToCart(@Request() req, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(req.user, dto);
  }

  @Post('remove')
  @ApiOperation({ summary: 'Remover produto do carrinho' })
  @ApiBody({
    type: RemoveFromCartDto,
    examples: {
      exemplo1: {
        summary: 'Remover produto pelo ID',
        value: {
          productId: 'uuid-do-produto',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Produto removido do carrinho. Retorna o carrinho atualizado.',
  })
  async removeFromCart(@Request() req, @Body() dto: RemoveFromCartDto) {
    return this.cartService.removeFromCart(req.user, dto);
  }
}
