// src/routes/user.routes.ts
import { FastifyInstance } from 'fastify';
import { UserService } from '../services/user.service';

export async function userRoutes(app: FastifyInstance) {
  // Rota para registro de usuário
  app.post('/register', async (request, reply) => {
    const { username, password } = request.body as { username: string; password: string };
    try {
      const user = await UserService.createUser(username, password);
      return reply.status(201).send(user);
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao registrar usuário' });
    }
  });
}
