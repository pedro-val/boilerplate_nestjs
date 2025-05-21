import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

type ProductWithCompany = {
  pid: string;
  name: string;
  price: number;
  description: string;
  company: {
    pid: string;
    name: string;
  };
};

type CompanyWithRelations = {
  pid: string;
  name: string;
  owner: {
    pid: string;
    name: string;
    email: string;
    contact: string;
  };
  products: Array<{
    pid: string;
    name: string;
    price: number;
    description: string;
  }>;
};

type CompanyOwnerWithRelations = {
  pid: string;
  name: string;
  email: string;
  contact: string;
  companies: Array<{
    pid: string;
    name: string;
  }>;
};

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  // Product typed methods
  async findUniqueProduct(
    where: { pid: string } | { id: number },
    include?: { company?: boolean },
  ): Promise<ProductWithCompany | null> {
    return this.product.findUnique({
      where,
      include: include || { company: true },
    }) as Promise<ProductWithCompany | null>;
  }

  async findManyProducts(params: {
    skip?: number;
    take?: number;
    cursor?: { pid: string } | { id: number };
    where?: Record<string, unknown>;
    orderBy?: Record<string, 'asc' | 'desc'>;
    include?: { company?: boolean };
  }): Promise<ProductWithCompany[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.product.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: include || { company: true },
    }) as Promise<ProductWithCompany[]>;
  }

  async createProduct(data: {
    name: string;
    price: number;
    description: string;
    company: { connect: { id: number } };
  }): Promise<ProductWithCompany> {
    return this.product.create({
      data,
      include: { company: true },
    }) as Promise<ProductWithCompany>;
  }

  async updateProduct(params: {
    where: { pid: string } | { id: number };
    data: {
      name?: string;
      price?: number;
      description?: string;
      company?: { connect: { id: number } };
    };
  }): Promise<ProductWithCompany> {
    const { where, data } = params;
    return this.product.update({
      data,
      where,
      include: { company: true },
    }) as Promise<ProductWithCompany>;
  }

  async deleteProduct(
    where: { pid: string } | { id: number },
  ): Promise<{ id: number; pid: string }> {
    return this.product.delete({
      where,
    });
  }

  // Company typed methods
  async findUniqueCompany(
    where: { pid: string } | { id: number },
    include?: { owner?: boolean; products?: boolean },
  ): Promise<CompanyWithRelations | null> {
    return this.company.findUnique({
      where,
      include: include || { owner: true, products: true },
    }) as Promise<CompanyWithRelations | null>;
  }

  async findManyCompanies(params: {
    skip?: number;
    take?: number;
    cursor?: { pid: string } | { id: number };
    where?: Record<string, unknown>;
    orderBy?: Record<string, 'asc' | 'desc'>;
    include?: { owner?: boolean; products?: boolean };
  }): Promise<CompanyWithRelations[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.company.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: include || { owner: true, products: true },
    }) as Promise<CompanyWithRelations[]>;
  }

  async createCompany(data: {
    name: string;
    owner: { connect: { id: number } };
  }): Promise<CompanyWithRelations> {
    return this.company.create({
      data,
      include: { owner: true, products: true },
    }) as Promise<CompanyWithRelations>;
  }

  async updateCompany(params: {
    where: { pid: string } | { id: number };
    data: {
      name?: string;
      owner?: { connect: { id: number } };
    };
  }): Promise<CompanyWithRelations> {
    const { where, data } = params;
    return this.company.update({
      data,
      where,
      include: { owner: true, products: true },
    }) as Promise<CompanyWithRelations>;
  }

  async deleteCompany(
    where: { pid: string } | { id: number },
  ): Promise<{ id: number; pid: string }> {
    return this.company.delete({
      where,
    });
  }

  // CompanyOwner typed methods
  async findUniqueCompanyOwner(
    where: { pid: string } | { id: number },
    include?: { companies?: boolean },
  ): Promise<CompanyOwnerWithRelations | null> {
    return this.companyOwner.findUnique({
      where,
      include: include || { companies: true },
    }) as Promise<CompanyOwnerWithRelations | null>;
  }

  async findManyCompanyOwners(params: {
    skip?: number;
    take?: number;
    cursor?: { pid: string } | { id: number };
    where?: Record<string, unknown>;
    orderBy?: Record<string, 'asc' | 'desc'>;
    include?: { companies?: boolean };
  }): Promise<CompanyOwnerWithRelations[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.companyOwner.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: include || { companies: true },
    }) as Promise<CompanyOwnerWithRelations[]>;
  }

  async createCompanyOwner(data: {
    name: string;
    email: string;
    contact: string;
  }): Promise<CompanyOwnerWithRelations> {
    return this.companyOwner.create({
      data,
      include: { companies: true },
    }) as Promise<CompanyOwnerWithRelations>;
  }

  async updateCompanyOwner(params: {
    where: { pid: string } | { id: number };
    data: {
      name?: string;
      email?: string;
      contact?: string;
    };
  }): Promise<CompanyOwnerWithRelations> {
    const { where, data } = params;
    return this.companyOwner.update({
      data,
      where,
      include: { companies: true },
    }) as Promise<CompanyOwnerWithRelations>;
  }

  async deleteCompanyOwner(
    where: { pid: string } | { id: number },
  ): Promise<{ id: number; pid: string }> {
    return this.companyOwner.delete({
      where,
    });
  }
}
