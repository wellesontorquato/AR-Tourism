import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.poi.createMany({
    data: [
      {
        name: "Ponto Histórico Central",
        description: "Um local turístico importante.",
        category: "História",
        address: "Centro",
        lat: -9.6658,
        lng: -35.735,
        imageUrl: null,
        arUrl: null,
      },
      {
        name: "Mirante da Cidade",
        description: "Vista panorâmica incrível.",
        category: "Natureza",
        address: "Mirante",
        lat: -9.649,
        lng: -35.708,
        imageUrl: null,
        arUrl: null,
      },
    ],
  });

  console.log("Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
