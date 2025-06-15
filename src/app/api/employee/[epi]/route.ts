import { NextRequest, NextResponse } from "next/server";
import { prisma, formatEmployee } from "@/lib";

export async function GET(_: NextRequest, { params }: { params: Promise<{ epi: string }> }) {
  const { epi } = await params;

  const employee = await prisma.employee.findFirst({ where: { epi: { endsWith: epi } } });

  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const handler =
    employee.role === "FSA"
      ? (data: any) => prisma.fSA.count({ where: data })
      : (data: any) => prisma.tSA.count({ where: data });

  const entryCount = await handler({
    epi: employee.epi,
    createdAt: {
      gte: startOfToday,
      lt: startOfTomorrow
    }
  });

  return NextResponse.json({ ...formatEmployee(employee), entryCount });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ epi: string }> }) {
  const { epi } = await params;
  const data = await req.json();
  const updated = await prisma.employee.update({
    where: { epi },
    data
  });
  return NextResponse.json(formatEmployee(updated));
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ epi: string }> }) {
  const { epi } = await params;
  await prisma.employee.delete({
    where: { epi }
  });
  return NextResponse.json({ success: true });
}
