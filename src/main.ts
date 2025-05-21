// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const fullUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.API_URL || 'https://4534-168-205-107-117.ngrok-free.app'
      : 'http://localhost:3000';

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('API para gerenciamento de produtos, empresas e proprietários de empresas')
    .setVersion('1.0')
    .addTag('products', 'Operações relacionadas a produtos')
    .addTag('companies', 'Operações relacionadas a empresas')
    .addTag('company-owners', 'Operações relacionadas a proprietários de empresas')
    .addServer(fullUrl, 'API Server')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Customizar as opções do Swagger UI
  const customOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      defaultModelsExpandDepth: 0,
      filter: true,
      showExtensions: true,
      // Adicionar a configuração para usar a URL do host atual
      urls: [
        {
          url: '',
          name: 'Default',
        },
      ],
      // Isso faz com que o Swagger use a URL base de onde está sendo acessado
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'API Documentation',
    explorer: true,
    // Isso é crucial para fazer o Swagger funcionar com ngrok
    useGlobalPrefix: true,
  };

  SwaggerModule.setup('api', app, document, customOptions);

  await app.listen(process.env.PORT ?? 3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation is available at: ${await app.getUrl()}/api`);
}

bootstrap().catch(err => console.error('Failed to start application:', err));
