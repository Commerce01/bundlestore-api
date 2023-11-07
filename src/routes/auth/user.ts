/* eslint-disable @typescript-eslint/no-unused-vars */
import { comparePassword, hashPassword } from "@/lib/hashpassword";
import {
  LoginSchema,
  LoginType,
  RegisterSchema,
  RegisterType,
} from "@/types/user";

import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";



type DECODED = {
  id: string;
  iat: number;
  exp: number;
};

export default async function UserRoute(fastify: FastifyInstance) {
  fastify.get(
    "/users",
    { preValidation: [fastify.authenticate] },
    async (
      request: FastifyRequest<{ Headers: { authorization: string } }>,
      reply
    ) => {
      try {
        const requser = request.user as DECODED;
        const users = await fastify.db.user.findUnique({
          where: {
            id: requser.id,
          },
        });
        if (!users) {
          return reply.status(404).send({ message: "User not found" });
        }
        return reply.status(200).send(users);
      } catch (error) {
        reply.status(500).send({ Message: error });
      }
    }
  );

  fastify.post(
    "/login",
    async (request: FastifyRequest<{ Body: LoginType }>, reply) => {
      try {
        const { email, password } = request.body;
        await LoginSchema.parseAsync(request.body);

        const user = await fastify.db.user.findUnique({
          where: {
            email,
          },
        });

        if (user) {
          const isPasswordMatch = await comparePassword(
            password,
            user.password
          );

          if (!isPasswordMatch) {
            return reply.status(400).send({ message: "Wrong password" });
          }
          const token = fastify.jwt.sign({ id: user.id });
          return reply
            // .setCookie("token", token, {
            //   path: "/",
            //   httpOnly: true,
            //   secure: true,
            //   expires: new Date(Date.now() + 60 * 60 * 1000),
            // })
            .send({token : token });
        }

        return reply.status(400).send({ message: "Email not found" });
      } catch (error) {
        reply.status(500).send({ message: error });
      }
    }
  );

fastify.post(
  "/verify-token",
  async (
    request: FastifyRequest<{Headers: {authorization: string}}>,
    reply
  ) => {
    try {
      await request.jwtVerify();
      return reply.status(200).send({message : "Token is vaid"});
    } catch(error) {
      reply.status(401).send({ message:"Token is invalid"});
    }
  }
);

  fastify.post(
    "/register",
    async (request: FastifyRequest<{ Body: RegisterType }>, reply) => {
      try {
        const { name, password, email, address, phone } = request.body;

        const hashedPassword = await hashPassword(password);

        await RegisterSchema.parseAsync(request.body);
        const userExist = await fastify.db.user.findFirst({
          where: {
            email,
          },
        });

        if (userExist) {
          return reply.status(400).send({ Message: "Email already exist" });
        }

        const user = await fastify.db.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            address,
            phone,
          },
        });

        reply.status(201).send(user);
      } catch (error) {
        reply.status(500).send({ error });
      }
    }
  );
}
