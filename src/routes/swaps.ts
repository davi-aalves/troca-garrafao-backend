// src/plugins/auth.ts
import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function authRoutes(app: FastifyInstance) {
  // Registra o método 'authenticate' no Fastify
  app.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify(); // Verifica o token JWT
    } catch (err) {
      reply.status(401).send({ error: "Token inválido ou ausente" });
    }
  });

  // Outras rotas (register, login)
  app.post("/register", async (request, reply) => {
    const { name, email, password, role } = request.body as {
      name: string;
      email: string;
      password: string;
      role?: "USER" | "ADMIN";
    };

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: role || "USER" },
    });

    return reply.status(201).send(user);
  });

  app.post("/login", async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.status(400).send({ error: "Usuário não encontrado" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return reply.status(400).send({ error: "Senha incorreta" });
    }

    const token = app.jwt.sign({ id: user.id, role: user.role });

    return reply.send({ token });
  });
}
