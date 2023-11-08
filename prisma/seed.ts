import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
 
  const product = await prisma.product.createMany({
    data: [{
      name: "SP-1",
      price: 1690 ,
      description: "",
      stock:10,
      slug:"4291001",
      images: [
        "http://localhost:4000/assets/S2.jpg"
      ]
    },
  {
      name:"Arceus",
      price:1500,
      description:"",
      stock:10,
      slug:"4291002",
      images: [
        "http://localhost:4000/assets/S3-.png"
      ]
  },{
    name:"Giyu",
    price:1300,
    description:"",
    stock:10,
    slug:"4291003",
    images:[
      "http://localhost:4000/assets/S4.jpg"
    ]
  },{
    name:"Iron mam mark2",
    price:3500,
    description:"",
    stock:10,
    slug:"4291004",
    images:[
      "http://localhost:4000/assets/S5.jpg"
    ]
  }]
      
  });

  const category = await prisma.category.create({
    data: { name: "Hot and Hit" , slug:"hot-and-hit"},
  });

  console.log({ product, category });
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
