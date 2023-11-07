import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Commerce",
      email: "secretcm94@gmail.com",
      password: "asdf1234",
    },
  });

  const product = await prisma.product.create({
    data: {
      name: "Product 1",
      price: 100,
      description: "Product 1 description",
    },
  });

  const category = await prisma.category.create({
    data: { name: "Category 1" },
  });

  console.log({ user, product, category });
  console.log("Seeding done!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    await prisma.$disconnect();
    throw err;
  });
