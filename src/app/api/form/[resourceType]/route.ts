import { startOfToday } from "date-fns";
import { getPrismaHandler } from "../prismaHandler";
import { NextRequest, NextResponse } from "next/server";

type ResourceType = "fsa" | "tsa";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ resourceType: ResourceType }> }
) {
  try {
    const body = await req.json();
    const { resourceType } = await params;
    const prisma = getPrismaHandler(resourceType);

    const { customerName, customerAddress, epi } = body;

    if (!customerName || !customerAddress) {
      return new NextResponse(
        JSON.stringify({ error: "Customer name and address are required." }),
        { status: 400 }
      );
    }

    const searchCriteria = { epi, createdAt: { gte: startOfToday() } };

    const existing = await prisma.findFirst({
      ...searchCriteria,
      OR: [{ customerName }, { customerAddress }]
    });

    if (existing) {
      return new NextResponse(
        JSON.stringify({ error: "Duplicate entry: Same name or address already used today." }),
        { status: 400 }
      );
    }

    const entry = await prisma.create(body);
    const entryCount = await prisma.count(searchCriteria);
    return new NextResponse(JSON.stringify({ entry, entryCount }), { status: 201 });
  } catch (error) {
    console.error("[ERROR]:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to create record" }), { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ resourceType: ResourceType }> }
) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const where: any = {};
    if (from || to) {
      where.createdAt = {};
      if (to) where.createdAt.lte = new Date(to);
      if (from) where.createdAt.gte = new Date(from);
    }

    const { resourceType } = await params;
    const data = await getPrismaHandler(resourceType).findMany({ where });
    return new NextResponse(JSON.stringify(data), { status: 200 });
  } catch {
    return new NextResponse(JSON.stringify({ error: "Failed to fetch records" }), { status: 500 });
  }
}
