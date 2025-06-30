import { prisma } from "@/lib";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const { code } = await req.json();

  const permission = await prisma.permissions.findFirst({
    include: { employee: { select: { name: true } } },
    where: { code }
  });

  if (!permission) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  await prisma.permissions.update({ where: { email: permission.email }, data: { code: null } });

  return NextResponse.json({ permission });
}
