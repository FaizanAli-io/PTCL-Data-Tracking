// app/api/employee/[epiLast4]/route.ts

import { NextResponse } from "next/server";

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

interface RouteParams {
  params: {
    epiLast4: string;
  };
}

export async function GET(
  request: Request,
  { params }: RouteParams
): Promise<NextResponse<Agent | ErrorResponse>> {
  const { epiLast4 } = params;

  // Validate the input is exactly 4 digits
  if (!/^\d{4}$/.test(epiLast4)) {
    return NextResponse.json({ error: "EPI last 4 must be exactly 4 digits" }, { status: 400 });
  }

  const epi = Number(epiLast4);

  // Mock data
  const agents = {
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

  const agentType = epi % 2 === 0 ? "even" : "odd";
  const data = agents[agentType];

  return NextResponse.json(data, { status: 200 });
}
