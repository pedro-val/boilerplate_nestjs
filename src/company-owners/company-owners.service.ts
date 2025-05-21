import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyOwnerDto } from './dto/create-company-owner.dto';
import { UpdateCompanyOwnerDto } from './dto/update-company-owner.dto';
import { CompanyOwner } from './entities/company-owner.entity';

@Injectable()
export class CompanyOwnersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCompanyOwnerDto: CreateCompanyOwnerDto): Promise<CompanyOwner> {
    try {
      const createdOwner = await this.prisma.companyOwner.create({
        data: {
          name: createCompanyOwnerDto.name,
          email: createCompanyOwnerDto.email,
          contact: createCompanyOwnerDto.contact,
        },
        select: {
          pid: true,
          name: true,
          email: true,
          contact: true,
          companies: {
            select: {
              pid: true,
              name: true,
            },
          },
        },
      });

      return createdOwner as unknown as CompanyOwner;
    } catch {
      throw new BadRequestException('Error creating company owner');
    }
  }

  async findAll(): Promise<CompanyOwner[]> {
    try {
      const owners = await this.prisma.companyOwner.findMany({
        select: {
          pid: true,
          name: true,
          email: true,
          contact: true,
          companies: {
            select: {
              pid: true,
              name: true,
            },
          },
        },
      });

      return owners as unknown as CompanyOwner[];
    } catch {
      throw new BadRequestException('Error retrieving company owners');
    }
  }

  async findOne(pid: string): Promise<CompanyOwner> {
    try {
      const owner = await this.prisma.companyOwner.findUnique({
        where: { pid },
        select: {
          pid: true,
          name: true,
          email: true,
          contact: true,
          companies: {
            select: {
              pid: true,
              name: true,
            },
          },
        },
      });

      if (!owner) {
        throw new NotFoundException(`Company owner with PID ${pid} not found`);
      }

      return owner as unknown as CompanyOwner;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error retrieving company owner with PID ${pid}`);
    }
  }

  async update(pid: string, updateCompanyOwnerDto: UpdateCompanyOwnerDto): Promise<CompanyOwner> {
    try {
      const existingOwner = await this.prisma.companyOwner.findUnique({
        where: { pid },
        select: { id: true },
      });

      if (!existingOwner) {
        throw new NotFoundException(`Company owner with PID ${pid} not found`);
      }

      // Prepare update data with explicit typing
      type UpdateData = {
        name?: string;
        email?: string;
        contact?: string;
      };

      const updateData: UpdateData = {};

      if (updateCompanyOwnerDto.name !== undefined) {
        updateData.name = updateCompanyOwnerDto.name;
      }

      if (updateCompanyOwnerDto.email !== undefined) {
        updateData.email = updateCompanyOwnerDto.email;
      }

      if (updateCompanyOwnerDto.contact !== undefined) {
        updateData.contact = updateCompanyOwnerDto.contact;
      }

      const updatedOwner = await this.prisma.companyOwner.update({
        where: { pid },
        data: updateData,
        select: {
          pid: true,
          name: true,
          email: true,
          contact: true,
          companies: {
            select: {
              pid: true,
              name: true,
            },
          },
        },
      });

      return updatedOwner as unknown as CompanyOwner;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error updating company owner with PID ${pid}`);
    }
  }

  async remove(pid: string): Promise<void> {
    try {
      const owner = await this.prisma.companyOwner.findUnique({
        where: { pid },
        select: {
          id: true,
          companies: {
            select: {
              pid: true,
            },
          },
        },
      });

      if (!owner) {
        throw new NotFoundException(`Company owner with PID ${pid} not found`);
      }

      if (owner.companies.length > 0) {
        throw new BadRequestException(
          'Cannot delete a company owner that has companies. Please delete the companies first.',
        );
      }

      await this.prisma.companyOwner.delete({
        where: { pid },
      });
    } catch (error: unknown) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error deleting company owner with PID ${pid}`);
    }
  }
}
