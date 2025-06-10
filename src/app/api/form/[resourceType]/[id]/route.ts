import { NextRequest, NextResponse } from "next/server";
import { getPrismaHandler } from "../../prismaHandler";

type ResourceType = "fsa" | "tsa";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ resourceType: ResourceType; id: string }> }
) {
  const { resourceType, id } = await params;
  const record = await getPrismaHandler(resourceType).find(Number(id));
  return new NextResponse(JSON.stringify(record), { status: 200 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ resourceType: ResourceType; id: string }> }
) {
  const { resourceType, id } = await params;
  const data = await req.json();
  const updated = await getPrismaHandler(resourceType).update(Number(id), data);
  return new NextResponse(JSON.stringify(updated), { status: 200 });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ resourceType: ResourceType; id: string }> }
) {
  const { resourceType, id } = await params;
  await getPrismaHandler(resourceType).delete(Number(id));
  return new NextResponse(null, { status: 204 });
}
