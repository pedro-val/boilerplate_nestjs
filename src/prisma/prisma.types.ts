// Define explicit return types for Prisma operations
export type PrismaProduct = {
  id: number;
  pid: string;
  name: string;
  price: number;
  description: string;
  companyId: number;
  company: {
    id: number;
    pid: string;
    name: string;
    ownerId: number;
  };
};

export type PrismaCompany = {
  id: number;
  pid: string;
  name: string;
  ownerId: number;
  owner: {
    id: number;
    pid: string;
    name: string;
    email: string;
    contact: string;
  };
  products: Array<{
    id: number;
    pid: string;
    name: string;
    price: number;
    description: string;
    companyId: number;
  }>;
};

export type PrismaCompanyOwner = {
  id: number;
  pid: string;
  name: string;
  email: string;
  contact: string;
  companies: Array<{
    id: number;
    pid: string;
    name: string;
    ownerId: number;
  }>;
};
