import { formatEnum } from "@/lib";
import { NextResponse } from "next/server";
import { JobRole, JobType, Region, Exchange, EntryType } from "@/generated/prisma";

export async function GET() {
  try {
    const enums = {
      roles: Object.values(JobRole),
      types: Object.values(JobType),
      entryTypes: Object.values(EntryType),
      regions: Object.values(Region).map((x) => formatEnum(x)),
      exchanges: Object.values(Exchange).map((x) => formatEnum(x))
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
