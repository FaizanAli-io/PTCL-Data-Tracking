import { NextRequest } from "next/server";

export async function GET(_req: NextRequest, context: { params: { epiLast4: string } }) {
  const { epiLast4 } = await Promise.resolve(context.params);
  const epi = Number(epiLast4);

  let fsa = {
    epi: 12345678,
    name: "Faizan Ali",
    role: "Field Agent",
    exchange: "Jauhar",
    type: "Regular"
  };

  let tsa = {
    epi: 87654321,
    name: "Hira Yaqoob",
    role: "Telecom Agent",
    exchange: "Hadeed",
    type: "Regular"
  };

  if (isNaN(epi)) {
    return new Response(JSON.stringify({ error: "Invalid EPI" }), { status: 400 });
  }

  const data = epi % 2 === 0 ? fsa : tsa;
  return new Response(JSON.stringify(data), { status: 200 });
}
