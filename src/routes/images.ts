import { FastifyInstance, FastifyRequest } from "fastify";
import fs from "fs";

const path = __dirname.split("\\").slice(0, -2).join("\\") + "/public/images";

export default async function ImagesRoute(fastify: FastifyInstance) {
  fastify.get("/images", async (request, reply) => {
    const files = await fs.promises.readdir(path).catch((err) => {
      console.error(err);
      return [];
    });
    const images = files.map((file) => {
      return {
        name: file,
        url: `http://localhost:4000/assets/${file}`,
      };
    });
    return reply.status(200).send(images);
  });
  fastify.get(
    "/assets/:name",
    async (request: FastifyRequest<{ Params: { name: string } }>, reply) => {
      const { name } = request.params;
      const file = await fs.promises.readFile(`${path}/${name}`).catch(() => {
        return null;
      });

      if (!file) return reply.status(404).send({ messsge: "File not found" });

      const type = "image/" + name.split(".").slice(-1)[0];
      return reply.status(200).type(type).send(file);
    }
  );
}
