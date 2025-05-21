import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { getTestPrismaClient } from '../utils/test-db';

/**
 * Este módulo fornece um PrismaService específico para testes
 * que isola cada teste em seu próprio schema PostgreSQL
 */
@Module({
  providers: [
    {
      provide: PrismaService,
      useFactory: async () => {
        // Criamos uma instância do teste cliente
        const testClient = getTestPrismaClient();

        // Configuramos o schema
        try {
          await testClient.setup();

          // Retornamos o cliente como serviço
          return testClient.prisma as PrismaService;
        } catch (error) {
          console.error('Erro ao inicializar o cliente de teste:', error);
          // Em caso de erro, retornar uma instância simples do PrismaService
          return new PrismaService();
        }
      },
    },
  ],
  exports: [PrismaService],
})
export class PrismaTestModule {}
