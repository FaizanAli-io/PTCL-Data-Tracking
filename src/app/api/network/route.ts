import { prisma } from "@/lib";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { lat, lng } = await req.json();

  let result: any[] = await prisma.$queryRawUnsafe(`
    SELECT *, 
      (6371 * acos(cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${lng})) + sin(radians(${lat})) * sin(radians(latitude)))) AS distance 
    FROM "Network"
    ORDER BY distance
    LIMIT 25
  `);

  if (result.length === 0)
    result = [
      { name: "Faizan", distance: 50 },
      { name: "Naveen", distance: 45 },
      { name: "Zia", distance: 40 }
    ];

  return NextResponse.json(result);
}
