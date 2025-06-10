import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const result = await prisma.network.create({ data: body });
  return new Response(JSON.stringify(result), { status: 201 });
}

export async function GET() {
  const result = await prisma.network.findMany();
  return new Response(JSON.stringify(result));
}
