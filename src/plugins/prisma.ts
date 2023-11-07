import { PrismaClient } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    db: PrismaClient;
  }
}

const prismaPlugin: FastifyPluginAsync = async (fastify) => {
  const prisma = new PrismaClient();

  fastify.decorate("db", prisma);

  fastify.addHook("onClose", async (instance) => {
    instance.log.info("Closing connection to database");
    await instance.db.$disconnect();
  });
};

export default fp(prismaPlugin);
