import { FastifyInstance, FastifyRequest } from "fastify";

type User = {
  id: string;
  iat: string;
  exp: string;
};

export default async function OrderRoute(fastify: FastifyInstance) {
  fastify.get(
    "/order",
    { preValidation: [fastify.authenticate] },
    async (
      request: FastifyRequest<{ Headers: { authorization: string } }>,
      reply
    ) => {
      const { id } = request.user as User;
      const user = await fastify.db.user.findUnique({
        where: {
          id,
        },
      });
      if (user?.role !== "admin")
        return reply.status(403).send({ message: "Yopu are not admin" });

      const orders = await fastify.db.order.findMany({
        include: {
          user: true,
          orderDetail: true,
        },
      });
      return reply.status(200).send(orders);
    }
  );

  fastify.get(
    "/order/:orderId",
    { preValidation: [fastify.authenticate] },
    async (
      request: FastifyRequest<{
        Headers: { authorization: string };
        Params: { id: string };
      }>,
      reply
    ) => {
      const { id } = request.user as User;
      const params = request.params;
      const user = await fastify.db.user.findUnique({
        where: {
          id,
        },
      });
      if (user?.role !== "admin")
        return reply.status(403).send({ message: "Yopu are not admin" });

      const orders = await fastify.db.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          user: true,
          orderDetail: true,
        },
      });
      return reply.status(200).send(orders);
    }
  );
  fastify.post(
    "/order",
    { preValidation: [fastify.authenticate] },
    async (
      request: FastifyRequest<{
        Headers: { authorization: string };
        Body: { productId: string; quantity: number };
      }>,
      reply
    ) => {
      const { id } = request.user as User;
      const { productId, quantity } = request.body;
      const user = await fastify.db.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) return reply.status(404).send({ message: "User not found" });

      const orders = await fastify.db.order.create({
        data: {
          user: {
            connect: {
              id,
            },
          },
          orderDetail: {
            create: {
              productId,
              quantity: 1,
            },
          },
        },
      });
      return reply.status(201).send(orders);
    }
  );

  fastify.patch(
    "/order/:orderId",
    { preValidation: [fastify.authenticate] },
    async (
      request: FastifyRequest<{
        Params: { orderId: string };
        Body: { productId: string; quantity: number };
        Headers: { authorization: string };
      }>,
      reply
    ) => {
      const { orderId } = request.params;
      const { productId, quantity } = request.body;
      const orders = await fastify.db.orderDetail.update({
        where: {
          orderId: orderId,
        },
        data: {
          productId,
          quantity,
        },
      });
      if (!orders) return reply.status(404).send({ message: "User not found" });
      return reply.status(200).send(orders);
    }
  );

  fastify.delete(
    "/order/:orderId",
    { preValidation: [fastify.authenticate] },
    async (
      request: FastifyRequest<{
        Params: { orderId: string };
        Headers: { authorization: string };
      }>,
      reply
    ) => {
      const { id } = request.user as User;
      const { orderId } = request.params;
      const user = await fastify.db.user.findUnique({
        where: { id },
      });
      if (!user) return reply.status(404).send({ message: "User not found" });
      await fastify.db.order.delete({
        where: {
          id: orderId,
        },
      });
      return reply.status(200).send({ message: "Order deleted" });
    }
  );
}
