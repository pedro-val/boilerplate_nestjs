import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      // Find company by PID with type safety
      const company = await this.prisma.company.findUnique({
        where: { pid: createProductDto.companyPid },
        select: { id: true },
      });

      if (!company) {
        throw new BadRequestException(`Company with PID ${createProductDto.companyPid} not found`);
      }

      // Create product with explicit typing
      const createdProduct = await this.prisma.product.create({
        data: {
          name: createProductDto.name,
          price: createProductDto.price,
          description: createProductDto.description,
          company: {
            connect: { id: company.id },
          },
        },
        select: {
          pid: true,
          name: true,
          price: true,
          description: true,
          company: {
            select: {
              pid: true,
              name: true,
            },
          },
        },
      });

      return createdProduct as unknown as Product;
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error creating product');
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      // Get products with explicit type selections
      const products = await this.prisma.product.findMany({
        select: {
          pid: true,
          name: true,
          price: true,
          description: true,
          company: {
            select: {
              pid: true,
              name: true,
            },
          },
        },
      });

      return products as unknown as Product[];
    } catch {
      throw new BadRequestException('Error retrieving products');
    }
  }

  async findOne(pid: string): Promise<Product> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { pid },
        select: {
          pid: true,
          name: true,
          price: true,
          description: true,
          company: {
            select: {
              pid: true,
              name: true,
            },
          },
        },
      });

      if (!product) {
        throw new NotFoundException(`Product with PID ${pid} not found`);
      }

      return product as unknown as Product;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error retrieving product with PID ${pid}`);
    }
  }

  async update(pid: string, updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      // Check if product exists
      const existingProduct = await this.prisma.product.findUnique({
        where: { pid },
        select: { id: true },
      });

      if (!existingProduct) {
        throw new NotFoundException(`Product with PID ${pid} not found`);
      }

      // Prepare update data with explicit typing
      type UpdateData = {
        name?: string;
        price?: number;
        description?: string;
        company?: { connect: { id: number } };
      };

      const updateData: UpdateData = {};

      // Handle company relationship update if needed
      if (updateProductDto.companyPid) {
        const company = await this.prisma.company.findUnique({
          where: { pid: updateProductDto.companyPid },
          select: { id: true },
        });

        if (!company) {
          throw new BadRequestException(
            `Company with PID ${updateProductDto.companyPid} not found`,
          );
        }

        updateData.company = { connect: { id: company.id } };
      }

      // Add other fields if defined
      if (updateProductDto.name !== undefined) {
        updateData.name = updateProductDto.name;
      }

      if (updateProductDto.price !== undefined) {
        updateData.price = updateProductDto.price;
      }

      if (updateProductDto.description !== undefined) {
        updateData.description = updateProductDto.description;
      }

      // Update with type safety
      const updatedProduct = await this.prisma.product.update({
        where: { pid },
        data: updateData,
        select: {
          pid: true,
          name: true,
          price: true,
          description: true,
          company: {
            select: {
              pid: true,
              name: true,
            },
          },
        },
      });

      return updatedProduct as unknown as Product;
    } catch (error: unknown) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error updating product with PID ${pid}`);
    }
  }

  async remove(pid: string): Promise<void> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { pid },
        select: { id: true },
      });

      if (!product) {
        throw new NotFoundException(`Product with PID ${pid} not found`);
      }

      await this.prisma.product.delete({
        where: { pid },
      });
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error deleting product with PID ${pid}`);
    }
  }
}
