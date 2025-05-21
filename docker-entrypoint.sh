#!/bin/sh

# Verificar diretórios
echo "Listing current directory:"
ls -la
echo ""

echo "Listing dist directory (if it exists):"
ls -la dist || echo "dist directory does not exist"
echo ""

# Executar migrações do banco de dados
echo "Running migrations..."
npx prisma migrate deploy

# Executar seed para popular o banco com dados iniciais
echo "Running database seed..."
npx ts-node prisma/seed.ts

# Tentar reconstruir a aplicação no container
echo "Trying to rebuild the application..."
npm run build
echo "Listing dist directory after build:"
ls -la dist || echo "dist directory still does not exist"
echo ""

# Iniciar a aplicação
echo "Starting application..."
exec "$@" 