import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function authRoutes(app: FastifyInstance) {
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
