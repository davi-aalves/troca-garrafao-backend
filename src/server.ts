import fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import jwt from "@fastify/jwt";
import bcrypt from "bcrypt";
import { authRoutes } from "./routes/auth";
// import { swapRoutes } from "./routes/swaps"; // Importando as rotas de swap

const app = fastify();
const prisma = new PrismaClient();

// Registra o plugin CORS
app.register(cors);

// Registra o plugin JWT
app.register(jwt, {
  secret: process.env.JWT_SECRET || "supersecret",
});

// 🚀 Adiciona a função de autenticação globalmente
app.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();

    if (
      !request.user ||
      typeof request.user !== "object" ||
      !("id" in request.user)
    ) {
      throw new Error("Token inválido");
    }
  } catch (err) {
    reply.status(401).send({ error: "Token inválido ou ausente" });
  }
});

// Registra as rotas de autenticação
app.register(authRoutes);

// Registra as rotas de swap depois da autenticação
// app.register(swapRoutes);

// Rota para listar os usuários
app.get("/users", async () => {
  return prisma.user.findMany();
});

// Rota para adicionar um usuário
app.post("/users", async (request, reply) => {
  const { name, email, password, role } = request.body as {
    name: string;
    email: string;
    password: string;
    role?: "USER" | "ADMIN";
  };

  try {
    // Gera um hash da senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: role || "USER" },
    });

    return reply.status(201).send(user);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return reply.status(500).send({ error: "Erro interno do servidor" });
  }
});

// Inicialização do servidor
app.listen({ port: 3333 }, () => {
  console.log("🚀 Servidor rodando em http://localhost:3333");
});
