import { NextRequest, NextResponse } from "next/server";

type Agent = {
  epi: number;
  name: string;
  role: string;
  exchange: string;
  type: string;
};

type ErrorResponse = {
  error: string;
};

export async function GET(
  _req: NextRequest,
  { params }: { params: { epiLast4: number } }
): Promise<NextResponse<Agent | ErrorResponse>> {
  const { epiLast4 } = params;

  const agents: Record<string, Agent> = {
    even: {
      epi: 12345678,
      name: "Faizan Ali",
      role: "Field Agent",
      exchange: "Jauhar",
      type: "Regular"
    },
    odd: {
      epi: 87654321,
      name: "Hira Yaqoob",
      role: "Telecom Agent",
      exchange: "Hadeed",
      type: "Regular"
    }
  };

  const agentType = epiLast4 % 2 === 0 ? "even" : "odd";
  const data = agents[agentType];

  return NextResponse.json(data, { status: 200 });
}
