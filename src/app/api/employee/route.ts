import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serialize";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const employees = await prisma.employee.findMany();
  return NextResponse.json(serializeBigInt(employees));
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const employee = await prisma.employee.create({
    data: { ...data, epi: BigInt(data.epi) }
  });
  return NextResponse.json(serializeBigInt(employee));
}
