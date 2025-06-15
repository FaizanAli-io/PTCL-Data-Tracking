import { prisma, formatEmployee } from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const employees = await prisma.employee.findMany();
  return NextResponse.json(employees.map((x) => formatEmployee(x)));
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const employee = await prisma.employee.create({
    data: { ...data, epi: data.epi }
  });
  return NextResponse.json(formatEmployee(employee));
}
