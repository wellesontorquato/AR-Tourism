import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // (opcional) limpa antes de popular
  await prisma.poi.deleteMany();

  await prisma.poi.createMany({
    data: [
      // =========================
      // CENTRO HISTÓRICO
      // =========================
      {
        name: "Catedral Metropolitana de Maceió (Nossa Senhora dos Prazeres)",
        description: "Principal templo católico da cidade, no Centro Histórico.",
        category: "História",
        address: "Praça Dom Pedro II, Centro, Maceió - AL",
        lat: -9.665278,
        lng: -35.735556,
        imageUrl: null,
        arUrl: null,
      },
      {
        name: "Praça Dom Pedro II",
        description: "Praça histórica no coração do Centro, em frente à Catedral.",
        category: "História",
        address: "Praça Dom Pedro II, Centro, Maceió - AL",
        lat: -9.665500,
        lng: -35.735600,
        imageUrl: null,
        arUrl: null,
      },
      {
        name: "Igreja de Nosso Senhor Bom Jesus dos Martírios",
        description: "Igreja histórica conhecida pela fachada marcante e valor cultural.",
        category: "História",
        address: "Centro, Maceió - AL",
        lat: -9.665833,
        lng: -35.735000,
        imageUrl: null,
        arUrl: null,
      },
      {
        name: "Igreja de Nossa Senhora do Livramento",
        description: "Igreja tradicional do Centro, muito citada em roteiros históricos.",
        category: "História",
        address: "Centro, Maceió - AL",
        lat: -9.667232,
        lng: -35.739097,
        imageUrl: null,
        arUrl: null,
      },
      {
        name: "Igreja de Nossa Senhora do Rosário dos Homens Pretos",
        description: "Igreja histórica ligada à memória da população negra na cidade.",
        category: "História",
        address: "Centro, Maceió - AL",
        lat: -9.666000,
        lng: -35.739500,
        imageUrl: null,
        arUrl: null,
      },
      {
        name: "Teatro Deodoro",
        description: "Um dos principais patrimônios culturais e arquitetônicos do Centro.",
        category: "História",
        address: "Praça Marechal Deodoro, Centro, Maceió - AL",
        lat: -9.664722,
        lng: -35.741389,
        imageUrl: null,
        arUrl: null,
      },
      {
        name: "Praça Marechal Deodoro",
        description: "Praça histórica que integra o conjunto cultural do Centro.",
        category: "História",
        address: "Praça Marechal Deodoro, Centro, Maceió - AL",
        lat: -9.664800,
        lng: -35.741500,
        imageUrl: null,
        arUrl: null,
      },
      {
        name: "Museu Palácio Floriano Peixoto",
        description: "Museu em prédio histórico ligado à memória política e administrativa.",
        category: "História",
        address: "Centro, Maceió - AL",
        lat: -9.667139,
        lng: -35.737972,
        imageUrl: null,
        arUrl: null,
      },
      {
        name: "Palácio dos Martírios",
        description: "Sede histórica do governo estadual, símbolo político da cidade.",
        category: "História",
        address: "Centro, Maceió - AL",
        lat: -9.667139, // Mesma localização física do Museu (o museu fica no palácio)
        lng: -35.737972,
        imageUrl: null,
        arUrl: null,
      },
      {
        name: "Instituto Histórico e Geográfico de Alagoas (IHGAL)",
        description: "Instituição de preservação e pesquisa da história alagoana.",
        category: "História",
        address: "Centro, Maceió - AL",
        lat: -9.661658,
        lng: -35.737127,
        imageUrl: null,
        arUrl: null,
      },

      // =========================
      // JARAGUÁ (ÁREA HISTÓRICA)
      // =========================
      {
        name: "Bairro Histórico de Jaraguá",
        description: "Região histórica com armazéns, casario, museus e espaços culturais.",
        category: "História",
        address: "Jaraguá, Maceió - AL",
        lat: -9.672500, // Ponto central aproximado do bairro
        lng: -35.722200,
        imageUrl: null,
        arUrl: null,
      },
      {
        name: "Museu Théo Brandão de Antropologia e Folclore (UFAL)",
        description: "Museu de referência em cultura popular e folclore de Alagoas.",
        category: "História",
        address: "Av. da Paz, Maceió - AL",
        lat: -9.669368,
        lng: -35.732670,
        imageUrl: null,
        arUrl: null,
      },
      {
        name: "Museu de Arte Sacra Pierre Chalita",
        description: "Acervo de arte sacra em espaço cultural tradicional de Maceió.",
        category: "História",
        address: "Jaraguá, Maceió - AL",
        // Nota: O Museu de Arte Sacra principal fica no Centro, mas a Fundação tem o "Armazém Pierre Chalita" no Jaraguá.
        // Considerando o endereço "Jaraguá" no seu objeto, usei as coordenadas da unidade do Jaraguá (Praça Manoel Duarte).
        lat: -9.671000,
        lng: -35.724500,
        imageUrl: null,
        arUrl: null,
      },
      {
        name: "MISA — Museu da Imagem e do Som de Alagoas",
        description: "Museu dedicado à memória audiovisual e cultural do estado.",
        category: "História",
        address: "Jaraguá, Maceió - AL",
        lat: -9.672667,
        lng: -35.722222,
        imageUrl: null,
        arUrl: null,
      },
      {
        name: "Memorial à República",
        description: "Monumento/memorial ligado à memória cívica e republicana.",
        category: "História",
        address: "Jaraguá, Maceió - AL",
        lat: -9.670551,
        lng: -35.729217,
        imageUrl: null,
        arUrl: null,
      },

      // =========================
      // MEMORIAIS / MARCOS URBANOS (muito citados)
      // =========================
      {
        name: "Memorial Teotônio Vilela",
        description: "Memorial e mirante urbano, ponto marcante na orla da cidade.",
        category: "História",
        address: "Orla de Maceió - AL",
        lat: -9.673078,
        lng: -35.716752,
        imageUrl: null,
        arUrl: null,
      },
      {
        name: "Mirante da Sereia",
        description: "Marco turístico citado como monumento/mirante da cidade.",
        category: "História",
        address: "Maceió - AL",
        lat: -9.563858,
        lng: -35.645736,
        imageUrl: null,
        arUrl: null,
      },
      {
        name: "Memorial Gogó da Ema",
        description: "Memorial ligado a um símbolo histórico/cultural da orla de Maceió.",
        category: "História",
        address: "Orla de Maceió - AL",
        lat: -9.662800,
        lng: -35.706000,
        imageUrl: null,
        arUrl: null,
      },
      {
        name: "Casas Jardim - Centro",
        description: "Casa de vendas de tintas em Maceió",
        category: "Comércio",
        address: "Centro de Maceió - AL",
        lat: -9.666117572484664,
        lng: -35.738850971071734,
        imageUrl: null,
        arUrl: null,
      },

      // =========================
      // CASAS / CULTURA (citados em listas de centros culturais)
      // =========================
      {
        name: "Casa Jorge de Lima",
        description: "Espaço cultural ligado à memória literária e artística alagoana.",
        category: "História",
        address: "Centro, Maceió - AL",
        lat: -9.668778,
        lng: -35.733526,
        imageUrl: null,
        arUrl: null,
      },
    ],
    skipDuplicates: true,
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