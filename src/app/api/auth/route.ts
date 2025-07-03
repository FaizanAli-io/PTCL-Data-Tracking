import { prisma } from "@/lib";
import { NextRequest, NextResponse } from "next/server";

function generateRandomPassword(length = 12) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const { epi, password } = await request.json();

    if (!epi || !password) {
      return NextResponse.json(
        { success: false, message: "EPI and password are required." },
        { status: 400 }
      );
    }

    const user = await prisma.permissions.findUnique({
      include: { employee: { select: { name: true } } },
      where: { epi }
    });

    if (!user || user.pass !== password) {
      return NextResponse.json(
        { success: false, message: "Invalid EPI or password." },
        { status: 401 }
      );
    }

    if (user.level < 4)
      await prisma.permissions.update({ where: { epi }, data: { pass: generateRandomPassword() } });

    const cookieValue = encodeURIComponent(
      JSON.stringify({
        epi: user.epi,
        level: user.level,
        name: user.employee.name
      })
    );

    const response = NextResponse.json({ success: true, message: "Login successful." });

    response.headers.append(
      "Set-Cookie",
      `permission=${cookieValue}; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax; Secure=false`
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const users = await prisma.permissions.findMany({
      include: { employee: { select: { name: true } } }
    });

    const result = users.map((user) => ({
      epi: user.epi,
      pass: user.pass,
      level: user.level,
      name: user.employee.name
    }));

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch permissions." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();

  if (body.resetAll && body.newPassword) {
    try {
      const updated = await prisma.permissions.updateMany({
        where: { level: { lt: 4 } },
        data: { pass: body.newPassword }
      });
      return NextResponse.json({ success: true, count: updated.count });
    } catch (err) {
      return NextResponse.json(
        { success: false, error: "Failed to reset passwords" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
}
