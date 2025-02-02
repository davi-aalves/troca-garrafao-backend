# Usa a imagem oficial do Node.js (versão Alpine é mais leve)
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos package.json e package-lock.json para o container
COPY package.json package-lock.json ./

# Instala as dependências (garantindo instalação no ambiente Linux)
RUN npm ci

# Copia o restante do código para o container
COPY . .

# Expõe a porta 3333 para acesso externo
EXPOSE 3333

# Comando para iniciar o backend
CMD ["npm", "run", "dev"]
