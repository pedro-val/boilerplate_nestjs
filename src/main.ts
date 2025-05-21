// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configuração CORS global - mais permissiva para trabalhar com ngrok
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Accept,Authorization,Origin,X-Requested-With',
    exposedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
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

  app.use('/api-json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(document);
  });

  const customOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      defaultModelsExpandDepth: 0,
      filter: true,
      showExtensions: true,
      yaml: false,
      url: '/api-json',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'API Documentation',
    explorer: true,
    useGlobalPrefix: true,
  };

  SwaggerModule.setup('api', app, document, customOptions);

  await app.listen(process.env.PORT ?? 3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation is available at: ${await app.getUrl()}/api`);
  console.log(`OpenAPI JSON available at: ${await app.getUrl()}/api-json`);
}

bootstrap().catch(err => console.error('Failed to start application:', err));
