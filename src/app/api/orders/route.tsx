import { prisma } from "@/lib";
import { NextResponse } from "next/server";
import { orderFields } from "@/types/types";

export async function GET() {
  try {
    const data = await prisma.paidOrders.findMany({
      include: { employee: { select: { name: true } } }
    });

    return NextResponse.json(
      data
        .sort((a, b) => Number(a.epi) - Number(b.epi))
        .map(({ employee, ...rest }) => ({ ...rest, name: employee.name }))
    );
  } catch (error) {
    console.error("Failed to fetch paid orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    const results = await Promise.allSettled(
      data.map((item: any) => {
        const payload: Record<string, number> = {};

        for (const key of orderFields) {
          const value = Number(item[key]);
          payload[key] = isNaN(value) ? 0 : value;
        }

        return prisma.paidOrders.upsert({
          update: payload,
          where: { epi: String(item.epi) },
          create: { epi: String(item.epi), ...payload }
        });
      })
    );

    const failed = results.filter((r) => r.status === "rejected").length;
    const success = results.length - failed;

    return NextResponse.json({ success, failed });
  } catch (err) {
    console.error("Error uploading orders:", err);
    return NextResponse.json({ error: "Failed to upload orders" }, { status: 500 });
  }
}
