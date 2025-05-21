# NestJS API Boilerplate

API RESTful desenvolvida com NestJS, TypeScript e PostgreSQL para gerenciamento de produtos, empresas e proprietários de empresas.

## Tecnologias Utilizadas

- **Backend**: NestJS 11, TypeScript 5
- **Banco de Dados**: PostgreSQL 15, Prisma 6 (ORM)
- **Docker**: Containerização completa da aplicação e banco de dados
- **Validação/Transformação**: class-validator, class-transformer
- **Documentação**: Swagger/OpenAPI
- **Testes**: Jest, SuperTest com isolamento de banco

## Arquitetura

O projeto implementa uma arquitetura em camadas com:

- **Controllers**: Endpoints da API, validação de entrada e documentação
- **Services**: Lógica de negócios e interação com o repositório
- **Repository (Prisma)**: Acesso ao banco de dados com tipagem segura
- **Entities/DTOs**: Modelos de dados fortemente tipados

A arquitetura utiliza injeção de dependências para facilitar testes e desacoplamento de componentes.

## Modelo de Dados

```
┌────────────────────┐     ┌────────────────────┐     ┌────────────────────┐
│   CompanyOwner     │     │      Company       │     │      Product       │
├────────────────────┤     ├────────────────────┤     ├────────────────────┤
│ id: Int (PK)       │     │ id: Int (PK)       │     │ id: Int (PK)       │
│ pid: String (UUID) │     │ pid: String (UUID) │     │ pid: String (UUID) │
│ name: String       │     │ name: String       │     │ name: String       │
│ email: String      │     │ ownerId: Int (FK)  │     │ price: Int (cents) │
│ contact: String    │     │                    │     │ description: String│
│                    │     │                    │     │ companyId: Int (FK)│
└────────────────────┘     └────────────────────┘     └────────────────────┘
        │ 1                         ▲ *                        ▲ *
        └─────────────────────────►│                          │
                                    └──────────────────────────┘
```

## Instalação e Execução

O projeto está completamente dockerizado para facilitar o deployment.

### Pré-requisitos

- Docker
- Docker Compose

### Passos para execução

1. Clone o repositório:
```bash
git clone <repositório> && cd <diretório>
```

2. Inicie a aplicação com Docker:
```bash
# Constrói e inicia os containers em background
docker-compose up -d
```

3. Acesse a documentação Swagger:
```
http://localhost:3000/api
```

4. Para encerrar a aplicação:
```bash
docker-compose down
```

### Estrutura de Containers

- **api**: Servidor NestJS executando na porta 3000
- **db**: Banco de dados PostgreSQL executando na porta 5432

## Expondo a API para cliente de teste (ngrok)

Para disponibilizar a API para clientes externos de teste, é possível usar o ngrok:

1. Instale o ngrok:
```bash
npm install -g ngrok
# Ou baixe do site: https://ngrok.com/download
```

2. Exponha a porta da API:
```bash
ngrok http 3000
```

3. Utilize a URL fornecida pelo ngrok para acessar a API e a documentação:
```
https://<id-gerado>.ngrok.io/api  # Para a documentação Swagger
```

## Endpoints Principais

- **Documentação Swagger**: `GET /api`

### Produtos
- `GET /products` - Listar todos os produtos
- `GET /products/:pid` - Obter produto por PID
- `POST /products` - Criar novo produto
- `PUT /products/:pid` - Atualizar produto existente
- `DELETE /products/:pid` - Excluir produto

### Empresas
- `GET /companies` - Listar todas as empresas
- `GET /companies/:pid` - Obter empresa por PID
- `POST /companies` - Criar nova empresa
- `PUT /companies/:pid` - Atualizar empresa existente
- `DELETE /companies/:pid` - Excluir empresa

### Proprietários de Empresas
- `GET /company-owners` - Listar todos os proprietários
- `GET /company-owners/:pid` - Obter proprietário por PID
- `POST /company-owners` - Criar novo proprietário
- `PUT /company-owners/:pid` - Atualizar proprietário existente
- `DELETE /company-owners/:pid` - Excluir proprietário

## Testes

Os testes utilizam um sistema de isolamento de banco de dados que cria schemas PostgreSQL únicos para cada teste, garantindo que os testes não interfiram no banco de dados de produção.

```bash
# Executar todos os testes com cobertura
npm run test:all

# Executar apenas testes unitários
npm run test

# Executar testes e2e
npm run test:e2e

# Executar cobertura de testes
npm run test:cov
```

## Schema do Prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Product {
  id          Int      @id @default(autoincrement())
  pid         String   @unique @default(uuid())
  price       Int      // Stored in cents
  name        String
  description String
  company     Company  @relation(fields: [companyId], references: [id])
  companyId   Int

  @@map("products")
}

model Company {
  id        Int           @id @default(autoincrement())
  pid       String        @unique @default(uuid())
  name      String
  owner     CompanyOwner  @relation(fields: [ownerId], references: [id])
  ownerId   Int
  products  Product[]

  @@map("companies")
}

model CompanyOwner {
  id        Int       @id @default(autoincrement())
  pid       String    @unique @default(uuid())
  name      String
  email     String
  contact   String
  companies Company[]

  @@map("company_owners")
}
```

## Funcionalidades

- CRUD completo para produtos, empresas e proprietários
- Relacionamentos entre entidades respeitados
- Preços armazenados em centavos internamente, mas expostos em reais com casas decimais nas APIs
- IDs internos (id) nunca expostos, apenas PIDs externos (UUID)
- Documentação completa com Swagger
- Validação de dados com class-validator
- Transformação de dados com class-transformer
- Interceptors para transformação de respostas
- Dockerizado com PostgreSQL

## Estrutura de Banco de Dados

### Produtos (products)
- id: integer (PK, interno)
- pid: uuid (identificador externo)
- price: integer (armazenado em centavos)
- name: string
- description: string
- company_id: referência à tabela companies

### Empresas (companies)
- id: integer (PK, interno)
- pid: uuid (identificador externo)
- name: string
- owner_id: referência à tabela company_owners

### Proprietários de Empresas (company_owners)
- id: integer (PK, interno)
- pid: uuid (identificador externo)
- name: string
- email: string
- contact: string

## Requisitos

- Node.js (versão 16+)
- npm ou yarn
- Docker e Docker Compose (para ambiente containerizado)
- PostgreSQL (local ou via Docker)

## Scripts disponíveis

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod

# Docker
npm run docker:build  # Constrói as imagens
npm run docker:up     # Inicia os containers
npm run docker:down   # Para os containers
npm run docker:logs   # Exibe logs dos containers
npm run docker:start  # Script completo para iniciar o ambiente

# Prisma
npm run prisma:generate  # Gera o cliente Prisma
npm run prisma:migrate   # Executa migrações

# Testes
npm run test        # Executa testes unitários
npm run test:e2e    # Executa testes e2e
npm run test:cov    # Executa cobertura de testes

# Linting/Formato
npm run lint      # Executa o linter
npm run lint:fix  # Corrige problemas de lint e formato
npm run format    # Formata o código
```

## Endpoints Principais

### Produtos
- `GET /products` - Listar todos os produtos
- `GET /products/:pid` - Obter produto por PID
- `POST /products` - Criar novo produto
- `PUT /products/:pid` - Atualizar produto existente
- `DELETE /products/:pid` - Excluir produto

### Empresas
- `GET /companies` - Listar todas as empresas
- `GET /companies/:pid` - Obter empresa por PID
- `POST /companies` - Criar nova empresa
- `PUT /companies/:pid` - Atualizar empresa existente
- `DELETE /companies/:pid` - Excluir empresa

### Proprietários de Empresas
- `GET /company-owners` - Listar todos os proprietários
- `GET /company-owners/:pid` - Obter proprietário por PID
- `POST /company-owners` - Criar novo proprietário
- `PUT /company-owners/:pid` - Atualizar proprietário existente
- `DELETE /company-owners/:pid` - Excluir proprietário

## Exemplos de Requisições

### Criar um proprietário de empresa

```bash
curl -X POST http://localhost:3000/company-owners \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john.doe@example.com", "contact": "+1234567890"}'
```

### Criar uma empresa

```bash
curl -X POST http://localhost:3000/companies \
  -H "Content-Type: application/json" \
  -d '{"name": "Company Example", "ownerPid": "OWNER_PID_AQUI"}'
```

### Criar um produto

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Product Example", "price": 39.05, "description": "Product description", "companyPid": "COMPANY_PID_AQUI"}'
```

## Licença

[MIT](LICENSE)
