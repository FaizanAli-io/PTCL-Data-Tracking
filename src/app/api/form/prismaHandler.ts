import { prisma } from "@/lib";

type ResourceType = "fsa" | "tsa";

export function getPrismaHandler(resourceType: ResourceType) {
  if (resourceType === "fsa") {
    return {
      create: (data: any) => prisma.fSA.create({ data }),
      findMany: (args: any) => prisma.fSA.findMany(args),
      count: (data: any) => prisma.fSA.count({ where: data }),
      find: (id: number) => prisma.fSA.findUnique({ where: { id } }),
      findFirst: (data: any) => prisma.fSA.findFirst({ where: data }),
      update: (id: number, data: any) => prisma.fSA.update({ where: { id }, data }),
      delete: (id: number) => prisma.fSA.delete({ where: { id } })
    };
  } else {
    return {
      create: (data: any) => prisma.tSA.create({ data }),
      findMany: (args: any) => prisma.tSA.findMany(args),
      count: (data: any) => prisma.tSA.count({ where: data }),
      find: (id: number) => prisma.tSA.findUnique({ where: { id } }),
      findFirst: (data: any) => prisma.tSA.findFirst({ where: data }),
      update: (id: number, data: any) => prisma.tSA.update({ where: { id }, data }),
      delete: (id: number) => prisma.tSA.delete({ where: { id } })
    };
  }
}
