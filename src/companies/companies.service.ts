import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    try {
      // Find owner by PID with type safety
      const owner = await this.prisma.companyOwner.findUnique({
        where: { pid: createCompanyDto.ownerPid },
        select: { id: true },
      });

      if (!owner) {
        throw new BadRequestException(
          `Company owner with PID ${createCompanyDto.ownerPid} not found`,
        );
      }

      // Create company with explicit typing
      const createdCompany = await this.prisma.company.create({
        data: {
          name: createCompanyDto.name,
          owner: {
            connect: { id: owner.id },
          },
        },
        select: {
          pid: true,
          name: true,
          owner: {
            select: {
              pid: true,
              name: true,
              email: true,
              contact: true,
            },
          },
          products: {
            select: {
              pid: true,
              name: true,
              price: true,
              description: true,
            },
          },
        },
      });

      return createdCompany as unknown as Company;
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error creating company');
    }
  }

  async findAll(): Promise<Company[]> {
    try {
      // Get companies with explicit type selections
      const companies = await this.prisma.company.findMany({
        select: {
          pid: true,
          name: true,
          owner: {
            select: {
              pid: true,
              name: true,
              email: true,
              contact: true,
            },
          },
          products: {
            select: {
              pid: true,
              name: true,
              price: true,
              description: true,
            },
          },
        },
      });

      return companies as unknown as Company[];
    } catch {
      throw new BadRequestException('Error retrieving companies');
    }
  }

  async findOne(pid: string): Promise<Company> {
    try {
      const company = await this.prisma.company.findUnique({
        where: { pid },
        select: {
          pid: true,
          name: true,
          owner: {
            select: {
              pid: true,
              name: true,
              email: true,
              contact: true,
            },
          },
          products: {
            select: {
              pid: true,
              name: true,
              price: true,
              description: true,
            },
          },
        },
      });

      if (!company) {
        throw new NotFoundException(`Company with PID ${pid} not found`);
      }

      return company as unknown as Company;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error retrieving company with PID ${pid}`);
    }
  }

  async update(pid: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    try {
      // Check if company exists
      const existingCompany = await this.prisma.company.findUnique({
        where: { pid },
        select: { id: true },
      });

      if (!existingCompany) {
        throw new NotFoundException(`Company with PID ${pid} not found`);
      }

      // Prepare update data with explicit typing
      type UpdateData = {
        name?: string;
        owner?: { connect: { id: number } };
      };

      const updateData: UpdateData = {};

      // Handle owner relationship update if needed
      if (updateCompanyDto.ownerPid) {
        const owner = await this.prisma.companyOwner.findUnique({
          where: { pid: updateCompanyDto.ownerPid },
          select: { id: true },
        });

        if (!owner) {
          throw new BadRequestException(
            `Company owner with PID ${updateCompanyDto.ownerPid} not found`,
          );
        }

        updateData.owner = { connect: { id: owner.id } };
      }

      // Add name field if defined
      if (updateCompanyDto.name !== undefined) {
        updateData.name = updateCompanyDto.name;
      }

      // Update with type safety
      const updatedCompany = await this.prisma.company.update({
        where: { pid },
        data: updateData,
        select: {
          pid: true,
          name: true,
          owner: {
            select: {
              pid: true,
              name: true,
              email: true,
              contact: true,
            },
          },
          products: {
            select: {
              pid: true,
              name: true,
              price: true,
              description: true,
            },
          },
        },
      });

      return updatedCompany as unknown as Company;
    } catch (error: unknown) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error updating company with PID ${pid}`);
    }
  }

  async remove(pid: string): Promise<void> {
    try {
      const company = await this.prisma.company.findUnique({
        where: { pid },
        select: {
          id: true,
          products: {
            select: {
              pid: true,
            },
          },
        },
      });

      if (!company) {
        throw new NotFoundException(`Company with PID ${pid} not found`);
      }

      if (company.products.length > 0) {
        throw new BadRequestException(
          'Cannot delete a company that has products. Please delete the products first.',
        );
      }

      await this.prisma.company.delete({
        where: { pid },
      });
    } catch (error: unknown) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error deleting company with PID ${pid}`);
    }
  }
}
