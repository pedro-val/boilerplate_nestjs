FROM node:20-alpine

# Criar diretório da aplicação
WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY prisma ./prisma/
COPY db_mock ./db_mock/

# Instalar dependências
RUN npm ci

# Instalar ts-node globalmente para executar scripts TS
RUN npm install -g ts-node typescript

# Copiar todo o código fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Build da aplicação
RUN npm run build

# Verificar se o build foi criado
RUN ls -la dist/

# Tornar o script de entrada executável
RUN chmod +x ./docker-entrypoint.sh

# Expor porta
EXPOSE 3000

# Definir o script de entrada
ENTRYPOINT ["./docker-entrypoint.sh"]

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"] 