import { JobRole, JobType, Region, Exchange } from "@/generated/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const enums = {
      roles: Object.values(JobRole),
      types: Object.values(JobType),
      regions: Object.values(Region),
      exchanges: Object.values(Exchange)
    };

    return NextResponse.json({
      success: true,
      data: enums
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch enum values"
      },
      { status: 500 }
    );
  }
}
