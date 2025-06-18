import { prisma } from "@/lib";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await prisma.paidOrders.findMany({
      include: { employee: { select: { name: true } } }
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch paid orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    for (const item of data) {
      await prisma.paidOrders.upsert({
        where: { epi: item.epi },
        update: {
          orderCount: item.orderCount,
          monthToDate: item.monthToDate
        },
        create: {
          epi: item.epi,
          orderCount: item.orderCount,
          monthToDate: item.monthToDate
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error uploading orders:", err);
    return NextResponse.json({ error: "Failed to upload orders" }, { status: 500 });
  }
}
