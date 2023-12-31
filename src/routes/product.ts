import { Product } from "@prisma/client";
import { FastifyInstance, FastifyRequest } from "fastify";

export default async function ProductRoute(fastify: FastifyInstance) {
  fastify.get("/products", async (request : FastifyRequest<{Querystring:{slug:string}}>, reply) => {
    const {slug} = request.query;
    if (slug) {
       const product = await fastify.db.product.findFirstOrThrow({
        where:{
          slug,
        },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return reply.status(200).send(product);
    }
    const product = await fastify.db.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return reply.status(200).send(product);
  });

  fastify.get(
    "/products/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      const { id } = request.params;
      const product = await fastify.db.product.findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug:true
            },
          },
        },
      });
      reply.status(200).send(product);
    }
  );

  fastify.post(
    "/products",
    async (
      request: FastifyRequest<{
        Body: {
          prooduct_type: Product;
          categories_id?:string;

        };
      }>,
      reply
    ) => {
      const { prooduct_type, categories_id} = request.body;
      try {
        if (categories_id) {
          const product = await fastify.db.product.create({
            data: {
             ...prooduct_type,
              category: {
                connect: {
                  id: categories_id,
                },
              },
            },
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          });
          return reply.status(201).send(product);
        }
        const product = await fastify.db.product.create({
          data:prooduct_type,
        });
        return reply.status(201).send(product);
      } catch (error) {
        reply.status(500).send({ message: error });
      }
    }
  );

  fastify.patch(
    "/products/:id",
    async (
      request: FastifyRequest<{
        Body: {
          prooduct_type: Product;
        };
        Params: { id: string };
      }>,
      reply
    ) => {
      const { id } = request.params;
      const { prooduct_type } = request.body;
      const product = await fastify.db.product.update({
        where: {
          id,
        },
        data: prooduct_type,
      });
      reply.status(200).send(product);
    }
  );

  fastify.delete(
    "/products/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      const { id } = request.params;
      await fastify.db.product.delete({
        where: {
          id,
        },
      });
      reply.status(200).send("done!");
    }
  );
}
