import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

interface Owner {
  pid: string;
  name: string;
  email: string;
  contact: string;
}

interface Company {
  pid: string;
  name: string;
  owner_id: number;
}

interface Product {
  pid: string;
  name: string;
  price: number;
  description: string;
  company_id: number;
}

const prisma = new PrismaClient();

async function loadJsonFile<T>(filename: string): Promise<T[]> {
  const filePath = path.join(__dirname, '..', 'db_mock', filename);
  const fileContent = await fs.promises.readFile(filePath, 'utf-8');
  return JSON.parse(fileContent) as T[];
}

async function main() {
  try {
    // Load mock data
    const owners = await loadJsonFile<Owner>('owners.json');
    const companies = await loadJsonFile<Company>('companies.json');
    const products = await loadJsonFile<Product>('products.json');

    console.log('🌱 Starting database seed...');

    // Create company owners
    console.log('Creating company owners...');
    for (const owner of owners) {
      await prisma.companyOwner.upsert({
        where: { pid: owner.pid },
        update: {
          name: owner.name,
          email: owner.email,
          contact: owner.contact,
        },
        create: {
          pid: owner.pid,
          name: owner.name,
          email: owner.email,
          contact: owner.contact,
        },
      });
    }

    // Create companies
    console.log('Creating companies...');
    for (const company of companies) {
      await prisma.company.upsert({
        where: { pid: company.pid },
        update: {
          name: company.name,
          owner: { connect: { id: company.owner_id } },
        },
        create: {
          pid: company.pid,
          name: company.name,
          owner: { connect: { id: company.owner_id } },
        },
      });
    }

    // Create products
    console.log('Creating products...');
    for (const product of products) {
      await prisma.product.upsert({
        where: { pid: product.pid },
        update: {
          name: product.name,
          price: product.price,
          description: product.description,
          company: { connect: { id: product.company_id } },
        },
        create: {
          pid: product.pid,
          name: product.name,
          price: product.price,
          description: product.description,
          company: { connect: { id: product.company_id } },
        },
      });
    }

    console.log('✅ Database seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
