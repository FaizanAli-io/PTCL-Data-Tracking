import { PrismaClient, Exchange, JobRole, JobType } from "@/generated/prisma";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const employeeData = [
  { epi: 30775948, role: "FSA" },
  { epi: 66209265, role: "FSA" },
  { epi: 50731083, role: "FSA" },
  { epi: 95731370, role: "FSA" },
  { epi: 39965222, role: "FSA" },
  { epi: 77986110, role: "FSA" },
  { epi: 69802107, role: "FSA" },
  { epi: 97639656, role: "FSA" },
  { epi: 30335980, role: "FSA" },
  { epi: 77157477, role: "FSA" },
  { epi: 69210752, role: "TSA" },
  { epi: 54295282, role: "TSA" },
  { epi: 54037199, role: "TSA" },
  { epi: 26458837, role: "TSA" },
  { epi: 38700335, role: "TSA" },
  { epi: 36073112, role: "TSA" },
  { epi: 92173212, role: "TSA" },
  { epi: 11684694, role: "TSA" },
  { epi: 10947774, role: "TSA" },
  { epi: 64159144, role: "TSA" }
];

async function main() {
  for (const { epi, role } of employeeData) {
    await prisma.employee.upsert({
      where: { epi },
      update: {},
      create: {
        epi,
        name: faker.person.fullName(),
        type: faker.helpers.arrayElement([JobType.regular, JobType.thirdParty]),
        role: role as JobRole,
        exchange: faker.helpers.arrayElement(Object.values(Exchange))
      }
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
