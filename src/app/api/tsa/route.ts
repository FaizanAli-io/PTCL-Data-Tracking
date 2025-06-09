import { PrismaClient } from "@/generated/prisma";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  const result = await prisma.tSA.create({ data: body });
  return new Response(JSON.stringify(result), { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: any = {};
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  const data = await prisma.tSA.findMany({ where });
  return new Response(JSON.stringify(data), { status: 200 });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.tSA.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
