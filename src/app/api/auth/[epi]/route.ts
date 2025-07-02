import { prisma } from "@/lib";

import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ epi: string }> }) {
  const { epi } = await params;

  const permission = await prisma.permissions.findUnique({
    where: { epi },
    include: { employee: true }
  });

  if (!permission) {
    return NextResponse.json({ error: "Permission not found" }, { status: 404 });
  }

  return NextResponse.json(permission);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ epi: string }> }) {
  const { epi } = await params;
  const { pass, level } = await req.json();

  if (!pass || typeof level !== "number") {
    return NextResponse.json({ error: "Password and level are required." }, { status: 400 });
  }

  if (level < 1 || level > 3) {
    return NextResponse.json({ error: "Level must be between 1 and 3." }, { status: 400 });
  }

  const employee = await prisma.employee.findUnique({ where: { epi } });
  if (!employee) {
    return NextResponse.json({ error: "EPI not found in employees." }, { status: 400 });
  }

  try {
    const created = await prisma.permissions.create({ data: { epi, pass, level } });

    return NextResponse.json(created);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create permission." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ epi: string }> }) {
  const { epi } = await params;
  const data = await req.json();

  const { pass, level } = data;

  if (level < 1 || level > 3) {
    return NextResponse.json({ error: "Level must be between 1 and 3." }, { status: 400 });
  }

  try {
    const updated = await prisma.permissions.update({
      where: { epi },
      data: {
        ...(pass !== undefined && { pass }),
        ...(level !== undefined && { level })
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ epi: string }> }) {
  const { epi } = await params;

  try {
    await prisma.permissions.delete({
      where: { epi }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
