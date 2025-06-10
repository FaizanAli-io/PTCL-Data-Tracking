import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ epiLast4: string }> }
) {
  const { epiLast4 } = await params;
  const suffix = Number(epiLast4);
  if (isNaN(suffix)) {
    return NextResponse.json({ error: "Invalid EPI" }, { status: 400 });
  }

  const employees = await prisma.employee.findMany();
  const matchEmployee = employees.find((e) => String(e.epi).endsWith(epiLast4));

  return matchEmployee
    ? NextResponse.json(matchEmployee)
    : NextResponse.json({ error: "No matching employee found" }, { status: 404 });
}
