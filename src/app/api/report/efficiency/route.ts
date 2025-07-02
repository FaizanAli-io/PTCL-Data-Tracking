import { prisma, formatEnum } from "@/lib";
import { NextRequest, NextResponse } from "next/server";

interface ExchangeData {
  region: string;
  exchange: string;
  headcount: number;
  buckets: Record<string, number>;
}

interface Employee {
  epi: string;
  region: string;
  exchange: string;
  PaidOrders: {
    lastMonthPaid: number | null;
    monthToDatePaid: number | null;
    monthToDateCompleted: number | null;
    monthToDateGenerated: number | null;
  } | null;
}

type OrderType = "previous" | "currentPaid" | "currentGenerated" | "currentCompleted";

export async function POST(req: NextRequest) {
  try {
    const {
      role,
      type,
      orderType,
      classInterval,
      maxValue
    }: {
      role?: any;
      type?: any;
      orderType: OrderType;
      classInterval: number;
      maxValue: number;
    } = await req.json();

    if (!orderType || !classInterval || !maxValue || classInterval < 1 || maxValue > 25) {
      return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
    }

    const employees: Employee[] = await prisma.employee.findMany({
      select: { epi: true, region: true, exchange: true, PaidOrders: true },
      where: {
        ...(role && { role }),
        ...(type && { type }),
        NOT: {
          OR: [{ role: "MGT" }, { type: "MGT" }]
        }
      }
    });

    const valueMap: Record<OrderType, (emp: any) => number> = {
      currentPaid: (emp) => emp.PaidOrders?.monthToDatePaid ?? 0,
      currentGenerated: (emp) => emp.PaidOrders?.monthToDateGenerated ?? 0,
      currentCompleted: (emp) => emp.PaidOrders?.monthToDateCompleted ?? 0,
      previous: (emp) => emp.PaidOrders?.lastMonthPaid ?? 0
    };

    const getValue = (emp: any) => valueMap[orderType](emp);

    const exchangesMap = new Map<string, ExchangeData>();

    for (const emp of employees) {
      const value = getValue(emp);
      if (value == null) continue;

      const regionExchangeKey = `${emp.region}-${emp.exchange}`;
      if (!exchangesMap.has(regionExchangeKey)) {
        exchangesMap.set(regionExchangeKey, {
          region: emp.region,
          exchange: emp.exchange,
          headcount: 0,
          buckets: {}
        });
      }

      const regionData = exchangesMap.get(regionExchangeKey)!;
      regionData.headcount++;

      const bucketIndex = Math.floor(value / classInterval);
      const bucketStart = bucketIndex * classInterval;

      const bucketLabel =
        bucketStart >= maxValue
          ? `${maxValue}+`
          : classInterval === 1
          ? `${bucketStart}`
          : `${bucketStart}-${bucketStart + classInterval - 1}`;

      regionData.buckets[bucketLabel] = (regionData.buckets[bucketLabel] || 0) + 1;
    }

    const labels: string[] = [];
    if (classInterval === 1) {
      for (let i = 0; i < maxValue; i++) labels.push(`${i}`);
    } else {
      for (let i = 0; i < maxValue; i += classInterval)
        labels.push(`${i}-${i + classInterval - 1}`);
    }
    labels.push(`${maxValue}+`);

    const data = Array.from(exchangesMap.values())
      .filter((x) => x.exchange !== "Exchange_N")
      .map((x) => ({ ...x, region: formatEnum(x.region), exchange: formatEnum(x.exchange) }))
      .sort((a, b) => a.region.localeCompare(b.region) || a.exchange.localeCompare(b.exchange));

    return NextResponse.json({ labels, data }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
