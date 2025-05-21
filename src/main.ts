import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('API para gerenciamento de produtos, empresas e proprietários de empresas')
    .setVersion('1.0')
    .addTag('products', 'Operações relacionadas a produtos')
    .addTag('companies', 'Operações relacionadas a empresas')
    .addTag('company-owners', 'Operações relacionadas a proprietários de empresas')
    .addServer('http://localhost:3000', 'Servidor de desenvolvimento')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Customizar as opções do Swagger UI
  const customOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none', // none, list or full
      defaultModelsExpandDepth: 0,
      filter: true,
      showExtensions: true,
    },
    customSiteTitle: 'API Documentation',
  };

  SwaggerModule.setup('api', app, document, customOptions);

  // Habilitar CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'https://4534-168-205-107-117.ngrok-free.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation is available at: ${await app.getUrl()}/api`);
}

// Garantir que a promise seja executada e capturar erros
bootstrap().catch(err => console.error('Failed to start application:', err));
