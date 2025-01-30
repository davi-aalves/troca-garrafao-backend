import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function authRoutes(app: FastifyInstance) {
  // Registra o método 'authenticate' no Fastify
  app.decorate("authenticate", async function (request, reply) {
    try {
      // Verifica o token JWT presente no cabeçalho da requisição
      await request.jwtVerify();
    } catch (err) {
      // Retorna erro caso o token seja inválido ou não esteja presente
      reply.status(401).send({ error: "Token inválido ou ausente" });
    }
  });

  // Rota de registro de usuário
  app.post("/register", async (request, reply) => {
    const { name, email, password, role } = request.body as {
      name: string;
      email: string;
      password: string;
      role?: "USER" | "ADMIN";
    };

    // Gera uma senha criptografada
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário no banco de dados
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: role || "USER" },
    });

    return reply.status(201).send(user);
  });

  // Rota de login do usuário
  app.post("/login", async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    // Encontra o usuário no banco de dados com o email fornecido
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.status(400).send({ error: "Usuário não encontrado" });
    }

    // Verifica se a senha informada corresponde à senha armazenada
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return reply.status(400).send({ error: "Senha incorreta" });
    }

    // Cria e assina um token JWT com o ID e a role do usuário
    const token = app.jwt.sign({ id: user.id, role: user.role });

    // Retorna o token gerado
    return reply.send({ token });
  });
}
