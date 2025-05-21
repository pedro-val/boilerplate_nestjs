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
