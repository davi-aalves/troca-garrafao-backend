import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      id: string;
      role: "USER" | "ADMIN";
    };
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<void>;
  }
}
