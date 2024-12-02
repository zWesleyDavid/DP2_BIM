# Usar a imagem oficial do Node.js
FROM node:18

# Definir o diretório de trabalho no container
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante do código para o container
COPY . .

# Build do código (se necessário)
RUN npm run build

# Expor a porta padrão do NestJS
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:dev"]
