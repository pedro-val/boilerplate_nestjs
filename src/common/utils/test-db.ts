import { PrismaClient } from '@prisma/client';

// Função para gerar ID único sem dependência externa
function generateUniqueId(): string {
  return `test_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// Cria uma conexão única por teste usando um schema dinâmico
export const getTestPrismaClient = () => {
  // Usa um schema único para cada teste para evitar conflitos
  const schema = generateUniqueId();

  // URL para banco de dados de teste
  const url = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/nestjs';

  // Extrai a URL base e adiciona o schema de teste
  const dbUrl = new URL(url);
  const searchParams = new URLSearchParams(dbUrl.search);
  searchParams.set('schema', schema);
  dbUrl.search = searchParams.toString();

  // Cria um cliente Prisma com o schema de teste
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: dbUrl.toString(),
      },
    },
  });

  return {
    prisma,
    schema,
    url: dbUrl.toString(),
    // Limpa os dados após o teste
    async cleanup() {
      // Desconecta o cliente
      await prisma.$disconnect();
    },
    // Inicializa o schema para o teste
    async setup() {
      // Cria o schema
      await prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);

      // Executa as migrações no schema - cada comando em uma chamada separada
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "${schema}"."company_owners" (
          "id" SERIAL PRIMARY KEY,
          "pid" TEXT UNIQUE NOT NULL,
          "name" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "contact" TEXT NOT NULL
        )
      `);

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "${schema}"."companies" (
          "id" SERIAL PRIMARY KEY,
          "pid" TEXT UNIQUE NOT NULL,
          "name" TEXT NOT NULL,
          "ownerId" INTEGER NOT NULL,
          FOREIGN KEY ("ownerId") REFERENCES "${schema}"."company_owners"("id") ON DELETE CASCADE
        )
      `);

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "${schema}"."products" (
          "id" SERIAL PRIMARY KEY,
          "pid" TEXT UNIQUE NOT NULL,
          "price" INTEGER NOT NULL,
          "name" TEXT NOT NULL,
          "description" TEXT NOT NULL,
          "companyId" INTEGER NOT NULL,
          FOREIGN KEY ("companyId") REFERENCES "${schema}"."companies"("id") ON DELETE CASCADE
        )
      `);
    },
    // Remove o schema após o teste
    async teardown() {
      // Remove todos os objetos do schema
      await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
      await this.cleanup();
    },
  };
};
