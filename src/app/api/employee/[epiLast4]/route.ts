import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: { epiLast4: string } }) {
  const epiLast4 = params.epiLast4;

  if (!epiLast4 || isNaN(Number(epiLast4))) {
    return NextResponse.json({ error: "Invalid EPI" }, { status: 400 });
  }

  const epi = Number(epiLast4);
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

  return NextResponse.json(data, { status: 200 });
}
