import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ epiLast4: string }> }
) {
  const { epiLast4 } = await params;

  const epi = Number(epiLast4);
  if (isNaN(epi)) {
    return NextResponse.json({ error: "Invalid EPI" }, { status: 400 });
  }

  const fsa = {
    epi: 12345678,
    name: "Faizan Ali",
    role: "Field Agent",
    exchange: "Jauhar",
    type: "Regular"
  };

  const tsa = {
    epi: 87654321,
    name: "Hira Yaqoob",
    role: "Telecom Agent",
    exchange: "Hadeed",
    type: "Regular"
  };

  const data = epi % 2 === 0 ? fsa : tsa;

  return NextResponse.json(data);
}
