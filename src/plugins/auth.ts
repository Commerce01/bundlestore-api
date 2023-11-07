import fp from "fastify-plugin";
import fastify, {
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import fastifyJwt from "@fastify/jwt";
import { env } from "@/configs/env";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest<{ Headers: { authorization: string } }>,
      reply: FastifyReply
    ) => Promise<void>;
  }
}

const authPlugin: FastifyPluginAsync = async (fastify, opts) => {
  fastify.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: "1h",
    },
  });

  fastify.decorate(
    "authenticate",
    async (
      request: FastifyRequest<{ Headers: { authorization: string } }>,
      reply: FastifyReply
    ) => {
      try {
        await request.jwtVerify();
      } catch (error) {
        reply.status(401).send({ Message: "Unauthorized" });
      }
    }
  );
};

export default fp(authPlugin);
