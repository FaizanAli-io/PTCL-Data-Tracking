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
    const result = await getPrismaHandler(resourceType).create(body);
    return new NextResponse(JSON.stringify(result), { status: 201 });
  } catch {
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
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const { resourceType } = await params;
    const data = await getPrismaHandler(resourceType).findMany({ where });
    return new NextResponse(JSON.stringify(data), { status: 200 });
  } catch {
    return new NextResponse(JSON.stringify({ error: "Failed to fetch records" }), { status: 500 });
  }
}
