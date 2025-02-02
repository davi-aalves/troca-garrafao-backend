// src/server.ts
import Fastify from 'fastify';
import dotenv from 'dotenv';
import { userRoutes } from './routes/user.routes';

// Carregar variáveis de ambiente
dotenv.config();

// Instância do Fastify
const app = Fastify();

// Registrar as rotas
app.register(userRoutes);

// Inicializar o servidor
const start = async () => {
  try {
    await app.listen(3333);
    console.log('Servidor rodando em http://localhost:3333');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
