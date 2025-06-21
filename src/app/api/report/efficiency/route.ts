import { prisma, formatEnum } from "@/lib";
import { NextRequest, NextResponse } from "next/server";

type OrderType = "currentPaid" | "currentGenerated" | "previous";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      role,
      type,
      orderType,
      classInterval,
      maxValue
    }: {
      role: any;
      type: any;
      orderType: OrderType;
      classInterval: number;
      maxValue: number;
    } = body;

    if (!orderType || !classInterval || !maxValue) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const employees = await prisma.employee.findMany({
      select: { epi: true, region: true, exchange: true, PaidOrders: true },
      where: {
        ...(role && { role }),
        ...(type && { type }),
        NOT: { role: "MGT", type: "MGT" }
      }
    });

    const getValue = (emp: any) => {
      if (!emp.PaidOrders) return null;
      switch (orderType) {
        case "currentPaid":
          return emp.PaidOrders.monthToDatePaid;
        case "currentGenerated":
          return emp.PaidOrders.monthToDateGenerated;
        case "previous":
          return emp.PaidOrders.lastMonthPaid;
        default:
          return null;
      }
    };

    // Map with key = region-exchange-bucketLabel
    const bucketCounts = new Map<string, number>();
    const headcountMap = new Map<string, number>();

    for (const emp of employees) {
      const value = getValue(emp);
      if (value == null) continue;

      // increment headcount per region-exchange
      const regionExchangeKey = `${emp.region}-${emp.exchange}`;
      headcountMap.set(regionExchangeKey, (headcountMap.get(regionExchangeKey) || 0) + 1);

      // bucket logic
      const bucketIndex = Math.floor(value / classInterval);
      const bucketStart = bucketIndex * classInterval;
      const bucketEnd = bucketStart + classInterval;
      if (bucketStart >= maxValue) continue;

      const bucketLabel = `${bucketStart}-${bucketEnd}`;
      const bucketKey = `${regionExchangeKey}-${bucketLabel}`;

      bucketCounts.set(bucketKey, (bucketCounts.get(bucketKey) || 0) + 1);
    }

    // Reorganize into region + exchange groups
    interface ExchangeData {
      region: string;
      exchange: string;
      headcount: number;
      buckets: Record<string, number>;
    }
    const exchangesMap = new Map<string, ExchangeData>();

    for (const emp of employees) {
      const regionExchangeKey = `${emp.region}-${emp.exchange}`;
      if (!exchangesMap.has(regionExchangeKey)) {
        exchangesMap.set(regionExchangeKey, {
          region: emp.region,
          exchange: emp.exchange,
          headcount: headcountMap.get(regionExchangeKey) || 0,
          buckets: {}
        });
      }
    }

    for (const [key, count] of bucketCounts.entries()) {
      const [region, exchange, range] = key.split("-");
      const regionExchangeKey = `${region}-${exchange}`;
      const regionData = exchangesMap.get(regionExchangeKey)!;
      regionData.buckets[range] = count;
    }

    const result = Array.from(exchangesMap.values())
      .filter((x) => x.exchange !== "Exchange_N")
      .map((x) => ({
        ...x,
        region: formatEnum(x.region),
        exchange: formatEnum(x.exchange)
      }))
      .sort((a, b) => {
        const regionCompare = a.region.localeCompare(b.region);
        if (regionCompare !== 0) return regionCompare;
        return a.exchange.localeCompare(b.exchange);
      });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
