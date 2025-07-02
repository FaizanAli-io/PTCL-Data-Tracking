import { prisma } from "@/lib";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await prisma.paidOrders.findMany({
      include: { employee: { select: { name: true } } }
    });

    return NextResponse.json(data.sort((a, b) => (b.lastMonthPaid ?? 0) - (a.lastMonthPaid ?? 0)));
  } catch (error) {
    console.error("Failed to fetch paid orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    for (const item of data) {
      const payload = {
        lastMonthPaid: item.lastMonthPaid,
        monthToDatePaid: item.monthToDatePaid,
        monthToDateCompleted: item.monthToDateCompleted,
        monthToDateGenerated: item.monthToDateGenerated
      };

      try {
        await prisma.paidOrders.upsert({
          update: payload,
          where: { epi: item.epi },
          create: { epi: item.epi, ...payload }
        });
      } catch (err) {
        console.error(`Failed to upsert for EPI ${item.epi}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error uploading orders:", err);
    return NextResponse.json({ error: "Failed to upload orders" }, { status: 500 });
  }
}
