import { faker } from "@faker-js/faker";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

const generateEPIs = () =>
  Array.from({ length: 10 }, () => faker.number.int({ min: 10000000, max: 99999999 }));

const createFSAEntries = async (epi: number) => {
  const count = faker.number.int({ min: 20, max: 40 });
  for (let i = 0; i < count; i++) {
    await prisma.fSA.create({
      data: {
        epi,
        customerName: faker.person.fullName(),
        customerPSTN: "021" + faker.string.numeric(7),
        customerMobile: "03" + faker.string.numeric(9),
        customerAddress: faker.location.streetAddress(),
        customerLatitude: parseFloat(faker.location.latitude()),
        customerLongitude: parseFloat(faker.location.longitude()),
        currentInternetProvider: faker.company.name(),
        currentInternetPrice: faker.number.int({ min: 500, max: 3000 }),
        reason: faker.lorem.words(3),
        remarks: faker.lorem.sentence()
      }
    });
  }
};

const createTSAEntries = async (epi: number) => {
  const count = faker.number.int({ min: 20, max: 40 });
  for (let i = 0; i < count; i++) {
    await prisma.tSA.create({
      data: {
        epi,
        customerName: faker.person.fullName(),
        customerPSTN: "021" + faker.string.numeric(7),
        customerMobile: "03" + faker.string.numeric(9),
        customerAddress: faker.location.streetAddress(),
        currentInternetProvider: faker.company.name(),
        currentInternetPrice: faker.number.int({ min: 500, max: 3000 }),
        reason: faker.lorem.words(3),
        remarks: faker.lorem.sentence()
      }
    });
  }
};

const main = async () => {
  const fsaEPIs = generateEPIs();
  const tsaEPIs = generateEPIs();

  let i = 0;
  for (const epi of fsaEPIs) {
    await createFSAEntries(epi);
    console.log("FSA", ++i, epi);
  }
  for (const epi of tsaEPIs) {
    await createTSAEntries(epi);
    console.log("TSA", ++i, epi);
  }
};

main().finally(() => prisma.$disconnect());
