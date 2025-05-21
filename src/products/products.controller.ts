import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransformResponseInterceptor } from '../common/interceptors/transform-response.interceptor';
import { Product } from './entities/product.entity';

@ApiTags('products')
@Controller('products')
@UseInterceptors(TransformResponseInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type: Product,
    schema: {
      example: {
        pid: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Product Example',
        price: 39.05,
        description: 'A detailed product description',
        company: {
          pid: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Company Example',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'Return all products.',
    schema: {
      type: 'array',
      items: {
        properties: {
          pid: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          name: {
            type: 'string',
            example: 'Product Example',
          },
          price: {
            type: 'number',
            example: 39.05,
          },
          description: {
            type: 'string',
            example: 'A detailed product description',
          },
          company: {
            type: 'object',
            properties: {
              pid: {
                type: 'string',
                example: '550e8400-e29b-41d4-a716-446655440001',
              },
              name: {
                type: 'string',
                example: 'Company Example',
              },
            },
          },
        },
      },
    },
  })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':pid')
  @ApiOperation({ summary: 'Get a product by pid' })
  @ApiParam({
    name: 'pid',
    description: 'The pid of the product',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the found product.',
    schema: {
      properties: {
        pid: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440000',
        },
        name: {
          type: 'string',
          example: 'Product Example',
        },
        price: {
          type: 'number',
          example: 39.05,
        },
        description: {
          type: 'string',
          example: 'A detailed product description',
        },
        company: {
          type: 'object',
          properties: {
            pid: {
              type: 'string',
              example: '550e8400-e29b-41d4-a716-446655440001',
            },
            name: {
              type: 'string',
              example: 'Company Example',
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  findOne(@Param('pid') pid: string) {
    return this.productsService.findOne(pid);
  }

  @Put(':pid')
  @ApiOperation({ summary: 'Update a product by pid' })
  @ApiParam({
    name: 'pid',
    description: 'The pid of the product',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully updated.',
    schema: {
      properties: {
        pid: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440000',
        },
        name: {
          type: 'string',
          example: 'Updated Product',
        },
        price: {
          type: 'number',
          example: 45.99,
        },
        description: {
          type: 'string',
          example: 'Updated product description',
        },
        company: {
          type: 'object',
          properties: {
            pid: {
              type: 'string',
              example: '550e8400-e29b-41d4-a716-446655440001',
            },
            name: {
              type: 'string',
              example: 'Company Example',
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  update(@Param('pid') pid: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(pid, updateProductDto);
  }

  @Delete(':pid')
  @ApiOperation({ summary: 'Delete a product by pid' })
  @ApiParam({
    name: 'pid',
    description: 'The pid of the product',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  remove(@Param('pid') pid: string) {
    return this.productsService.remove(pid);
  }
}
