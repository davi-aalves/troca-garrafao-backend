import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Verifique se o usuário com o e-mail já existe antes de criar
  const userExists = await prisma.user.findUnique({
    where: { email: "novoemail@dominio.com" },
  });

  if (!userExists) {
    await prisma.user.create({
      data: {
        email: "novoemail@dominio.com",
        password: "senha",
        name: "Usuário Exemplo",
      },
    });
    console.log("Usuário criado!");
  } else {
    console.log("Usuário com esse e-mail já existe!");
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
