import fastify from "fastify";
import cors from "@fastify/cors"
import { PrismaClient } from "@prisma/client";

const app = fastify();
const prisma = new PrismaClient();

app.register(cors);

// Rota para listar os usuários
app.get("/users", async () => {
  return prisma.user.findMany();
});

// Rota para adicionar um usuário
app.post("/users", async (request, reply) => {
  const { name, email, role } = request.body as { name: string; email: string; role?: "USER" | "ADMIN" };
  
  const user = await prisma.user.create({
    data: {name, email, role: role || "USER" },
  });

  return reply.status(201).send(user);
});

// Inicialização do servidor
app.listen({ port: 3333 }, () => {
  console.log("🚀 Servidor rodando em http://localhost:3333");
});
