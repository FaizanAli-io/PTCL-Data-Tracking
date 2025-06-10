import { PrismaClient } from "@/generated/prisma";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

type ResourceType = "fsa" | "tsa";

function getPrismaHandler(resourceType: ResourceType) {
  if (resourceType === "fsa") {
    return {
      create: (data: any) => prisma.fSA.create({ data }),
      findMany: (where: any) => prisma.fSA.findMany({ where }),
      delete: (where: any) => prisma.fSA.delete(where)
    };
  } else {
    return {
      create: (data: any) => prisma.tSA.create({ data }),
      findMany: (where: any) => prisma.tSA.findMany({ where }),
      delete: (where: any) => prisma.tSA.delete(where)
    };
  }
}

export async function POST(req: Request, { params }: { params: { resourceType: ResourceType } }) {
  try {
    const body = await req.json();
    const handler = getPrismaHandler(params.resourceType);
    const result = await handler.create({ data: body });
    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    console.error("Error creating record:", error);
    return new Response(JSON.stringify({ error: "Failed to create record" }), { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { resourceType: ResourceType } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const where: any = {};
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const handler = getPrismaHandler(params.resourceType);
    const data = await handler.findMany({ where });
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Error fetching records:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch records" }), { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { resourceType: ResourceType } }) {
  try {
    const { id } = await req.json();
    const handler = getPrismaHandler(params.resourceType);
    await handler.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting record:", error);
    return new Response(JSON.stringify({ error: "Failed to delete record" }), { status: 500 });
  }
}
