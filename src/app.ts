import fastify from "fastify";
import { env } from "./configs/env";
import { FastifyCookieOptions } from "@fastify/cookie";
import cors from "@fastify/cors";

function builder(opts = {}) {
  const app = fastify(opts);

  // app.register(import("@fastify/jwt"), {
  //   secret: env.JWT_SECRET,
  // });
  app.register(cors,{
    origin:"http://localhost:3000",
    credentials: true,
  })
  app.register(import("@fastify/multipart"));
  app.register(import("@fastify/cookie"), {
    secret: env.COOKIE_SECRET,
    parseOptions: {},
  } as FastifyCookieOptions);
  app.register(import("@/plugins/prisma"));
  app.register(import("@/plugins/auth"));

  app.register(import("@/routes/product"), { prefix: "/api" });
  app.register(import("@/routes/category"), { prefix: "/api" });
  app.register(import("@/routes/auth/user"), { prefix: "/api" });
  app.register(import("@/routes/upload"), { prefix: "/api" });
  app.register(import("@/routes/images"), { prefix: "/" });
  return app;
}

export default function main() {
  const app = builder({
    logger: {
      transport: {
        target: "pino-pretty",
      },
    },
  });

  app.listen({ port: Number(env.PORT) }, (err) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
}
