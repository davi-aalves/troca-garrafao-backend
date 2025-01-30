import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function swapRoutes(app: FastifyInstance) {
  app.post(
    "/swap",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const userId = (request.user as { id: string }).id;

      await prisma.swap.create({
        data: { userId },
      });

      return reply
        .status(201)
        .send({ message: "Troca registrada com sucesso" });
    }
  );

  app.get("/swaps", async (request, reply) => {
    const swaps = await prisma.swap.findMany({
      include: { user: true },
    });

    return reply.send(swaps);
  });
}
