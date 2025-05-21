import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaTestModule } from '../src/common/modules/prisma-test.module';
import { getTestPrismaClient } from '../src/common/utils/test-db';

describe('API Tests (E2E)', () => {
  let app: INestApplication;
  let testClient: ReturnType<typeof getTestPrismaClient>;
  let prismaService: PrismaService;

  beforeAll(async () => {
    // Inicializar o cliente de teste diretamente
    testClient = getTestPrismaClient();
    await testClient.setup();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(AppModule)
      .useModule(PrismaTestModule)
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    app.enableCors();

    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    console.log('Teste E2E inicializado com banco de dados isolado no schema:', testClient.schema);
  });

  afterAll(async () => {
    // Limpar o schema de teste após todos os testes
    if (testClient) {
      await testClient.teardown();
    }
    await app.close();
  });

  // Teste que verifica se o isolamento do banco de dados está funcionando
  it('deve usar um schema de banco de dados isolado para testes', async () => {
    // Verificar se o schema está definido
    expect(testClient.schema).toBeDefined();
    expect(testClient.schema.startsWith('test_')).toBe(true);

    // Verificar se podemos fazer consultas diretas no banco de dados
    const products = await prismaService.product.findMany();
    expect(Array.isArray(products)).toBe(true);
  });
});
