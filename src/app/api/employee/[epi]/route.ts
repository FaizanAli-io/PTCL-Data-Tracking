import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serialize";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ epi: string }> }) {
  const { epi } = await params;
  const suffix = Number(epi);
  if (isNaN(suffix)) {
    return NextResponse.json({ error: "Invalid EPI" }, { status: 400 });
  }

  const employees = await prisma.employee.findMany();
  const matchEmployee = employees.find((e) => String(e.epi).endsWith(epi));

  return matchEmployee
    ? NextResponse.json({ ...matchEmployee, epi: matchEmployee.epi.toString() })
    : NextResponse.json({ error: "No matching employee found" }, { status: 404 });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ epi: string }> }) {
  const { epi } = await params;
  const data = await req.json();
  const updated = await prisma.employee.update({
    where: { epi: BigInt(epi) },
    data
  });
  return NextResponse.json(serializeBigInt(updated));
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ epi: string }> }) {
  const { epi } = await params;
  await prisma.employee.delete({
    where: { epi: BigInt(epi) }
  });
  return NextResponse.json({ success: true });
}
