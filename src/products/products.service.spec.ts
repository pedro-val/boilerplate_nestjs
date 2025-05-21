import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// Dados de teste
const mockCompany = {
  id: 1,
  pid: 'company-pid',
  name: 'Test Company',
};

const mockProduct = {
  pid: 'product-pid',
  name: 'Test Product',
  price: 3905,
  description: 'A test product',
  company: mockCompany,
};

const mockProducts = [
  mockProduct,
  {
    pid: 'product-pid-2',
    name: 'Test Product 2',
    price: 5000,
    description: 'Another test product',
    company: mockCompany,
  },
];

describe('ProductsService', () => {
  let service: ProductsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    // Criamos um mock do PrismaService
    const mockPrisma = {
      company: {
        findUnique: jest.fn(),
      },
      product: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      // Configurando os mocks
      const findUniqueMock = jest.fn().mockResolvedValue(mockCompany);
      const createMock = jest.fn().mockResolvedValue(mockProduct);
      prismaService.company.findUnique = findUniqueMock;
      prismaService.product.create = createMock;

      const productData = {
        name: 'Test Product',
        price: 3905,
        description: 'A test product',
        companyPid: mockCompany.pid,
      };

      // Executar o método
      const result = await service.create(productData);

      // Verificações
      expect(findUniqueMock).toHaveBeenCalledWith({
        where: { pid: productData.companyPid },
        select: { id: true },
      });
      expect(createMock).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });

    it('should throw BadRequestException if company not found', async () => {
      // Configurar mock para retornar null (empresa não encontrada)
      const findUniqueMock = jest.fn().mockResolvedValue(null);
      prismaService.company.findUnique = findUniqueMock;

      const productData = {
        name: 'Test Product',
        price: 3905,
        description: 'A test product',
        companyPid: 'non-existent-pid',
      };

      // Verificação da exceção
      await expect(service.create(productData)).rejects.toThrow(BadRequestException);
      expect(findUniqueMock).toHaveBeenCalledWith({
        where: { pid: 'non-existent-pid' },
        select: { id: true },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      // Configurar mock para retornar lista de produtos
      const findManyMock = jest.fn().mockResolvedValue(mockProducts);
      prismaService.product.findMany = findManyMock;

      // Executar método
      const result = await service.findAll();

      // Verificações
      expect(findManyMock).toHaveBeenCalledWith({
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
      expect(result).toEqual(mockProducts);
    });

    it('should throw BadRequestException on database error', async () => {
      // Configurar mock para lançar erro
      const findManyMock = jest.fn().mockRejectedValue(new Error('Database error'));
      prismaService.product.findMany = findManyMock;

      // Verificação da exceção
      await expect(service.findAll()).rejects.toThrow(BadRequestException);
      expect(findManyMock).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a product by pid', async () => {
      // Configurar mock para retornar um produto
      const findUniqueMock = jest.fn().mockResolvedValue(mockProduct);
      prismaService.product.findUnique = findUniqueMock;

      // Executar método
      const result = await service.findOne('product-pid');

      // Verificações
      expect(findUniqueMock).toHaveBeenCalledWith({
        where: { pid: 'product-pid' },
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
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      // Configurar mock para retornar null (produto não encontrado)
      const findUniqueMock = jest.fn().mockResolvedValue(null);
      prismaService.product.findUnique = findUniqueMock;

      // Verificação da exceção
      await expect(service.findOne('non-existent-pid')).rejects.toThrow(NotFoundException);
      expect(findUniqueMock).toHaveBeenCalledWith({
        where: { pid: 'non-existent-pid' },
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
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      const existingProduct = { id: 1, pid: 'product-pid' };
      const updatedProduct = {
        ...mockProduct,
        name: 'Updated Product',
        description: 'Updated description',
      };

      // Mock sequence: verificar se produto existe, verificar empresa se fornecido, atualizar
      const findUniqueProductMock = jest
        .fn()
        .mockResolvedValueOnce(existingProduct) // Primeira chamada - verificar produto
        .mockResolvedValueOnce(mockCompany); // Segunda chamada - verificar empresa (caso precise)

      const updateMock = jest.fn().mockResolvedValue(updatedProduct);

      prismaService.product.findUnique = findUniqueProductMock;
      prismaService.company.findUnique = findUniqueProductMock;
      prismaService.product.update = updateMock;

      const updateDto = {
        name: 'Updated Product',
        description: 'Updated description',
        companyPid: mockCompany.pid,
      };

      // Executar método
      const result = await service.update('product-pid', updateDto);

      // Verificações
      expect(findUniqueProductMock).toHaveBeenCalledWith({
        where: { pid: 'product-pid' },
        select: { id: true },
      });
      expect(findUniqueProductMock).toHaveBeenCalledWith({
        where: { pid: mockCompany.pid },
        select: { id: true },
      });
      expect(updateMock).toHaveBeenCalled();
      expect(result).toEqual(updatedProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      // Configurar mock para retornar null (produto não encontrado)
      const findUniqueMock = jest.fn().mockResolvedValue(null);
      prismaService.product.findUnique = findUniqueMock;

      const updateDto = { name: 'Updated Product' };

      // Verificação da exceção
      await expect(service.update('non-existent-pid', updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(findUniqueMock).toHaveBeenCalledWith({
        where: { pid: 'non-existent-pid' },
        select: { id: true },
      });
    });

    it('should throw BadRequestException if company not found', async () => {
      const existingProduct = { id: 1, pid: 'product-pid' };

      // Mock para produto existente mas empresa inexistente
      const productFindUniqueMock = jest.fn().mockResolvedValue(existingProduct);
      const companyFindUniqueMock = jest.fn().mockResolvedValue(null);

      prismaService.product.findUnique = productFindUniqueMock;
      prismaService.company.findUnique = companyFindUniqueMock;

      const updateDto = { companyPid: 'non-existent-company' };

      // Verificação da exceção
      await expect(service.update('product-pid', updateDto)).rejects.toThrow(BadRequestException);
      expect(productFindUniqueMock).toHaveBeenCalledWith({
        where: { pid: 'product-pid' },
        select: { id: true },
      });
      expect(companyFindUniqueMock).toHaveBeenCalledWith({
        where: { pid: 'non-existent-company' },
        select: { id: true },
      });
    });
  });

  describe('remove', () => {
    it('should remove a product successfully', async () => {
      const existingProduct = { id: 1, pid: 'product-pid' };

      // Configurar mocks
      const findUniqueMock = jest.fn().mockResolvedValue(existingProduct);
      const deleteMock = jest.fn().mockResolvedValue(undefined);

      prismaService.product.findUnique = findUniqueMock;
      prismaService.product.delete = deleteMock;

      // Executar método
      await service.remove('product-pid');

      // Verificações
      expect(findUniqueMock).toHaveBeenCalledWith({
        where: { pid: 'product-pid' },
        select: { id: true },
      });
      expect(deleteMock).toHaveBeenCalledWith({
        where: { pid: 'product-pid' },
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      // Configurar mock para retornar null (produto não encontrado)
      const findUniqueMock = jest.fn().mockResolvedValue(null);
      prismaService.product.findUnique = findUniqueMock;

      // Verificação da exceção
      await expect(service.remove('non-existent-pid')).rejects.toThrow(NotFoundException);
      expect(findUniqueMock).toHaveBeenCalledWith({
        where: { pid: 'non-existent-pid' },
        select: { id: true },
      });
    });
  });
});
