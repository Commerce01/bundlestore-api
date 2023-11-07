import { FastifyInstance, FastifyRequest } from "fastify";

export default async function CategorytRoute(fastify: FastifyInstance) {
  fastify.get("/categorys", async (request, reply) => {
    const category = await fastify.db.category.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    reply.status(200).send(category);
  });

  fastify.get(
    "/categorys/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      const { id } = request.params;
      const category = await fastify.db.category.findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      reply.status(200).send(category);
    }
  );

  fastify.post(
    "/categorys",
    async (
      request: FastifyRequest<{
        Body: {
          name: string;
        };
      }>,
      reply
    ) => {
      const { name } = request.body;
      const category = await fastify.db.category.create({
        data: {
          name,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      reply.status(201).send(category);
    }
  );

  fastify.patch(
    "/categorys/:id",
    async (
      request: FastifyRequest<{
        Body: {
          name: string;
        };
        Params: { id: string };
      }>,
      reply
    ) => {
      const { id } = request.params;
      const { name } = request.body;
      const category = await fastify.db.category.update({
        where: {
          id,
        },
        data: {
          name,
        },
      });
      reply.status(200).send(category);
    }
  );

  fastify.delete(
    "/categorys/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      const { id } = request.params;
      await fastify.db.category.delete({
        where: {
          id,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      reply.status(200).send("done!");
    }
  );
}
