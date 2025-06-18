import path from "path";
import * as XLSX from "xlsx";
import fs from "fs/promises";
import { getDistance } from "geolib";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const lat = parseFloat(req.nextUrl.searchParams.get("lat") || "");
  const lng = parseFloat(req.nextUrl.searchParams.get("lng") || "");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "5");
  const threshold = parseFloat(req.nextUrl.searchParams.get("threshold") || "0");
  const type = (req.nextUrl.searchParams.get("type") || "GPON").toUpperCase();

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  const getFilenames = () => {
    return type === "XDSL"
      ? ["KTR2 XDSL.xlsx", "KTR3 XDSL.xlsx"]
      : ["KTR2 GPON.xlsx", "KTR3 GPON.xlsx"];
  };

  const getSheetNames = () => {
    return type === "XDSL" ? { first: "DC", second: "DP" } : { first: "FDH", second: "FAT" };
  };

  const filenames = getFilenames();
  const sheets = getSheetNames();

  const readSheets = async (filename: string) => {
    const filePath = path.join(process.cwd(), "public", filename);
    const buffer = await fs.readFile(filePath);
    const workbook = XLSX.read(buffer, { type: "buffer" });

    const sheet1 = XLSX.utils.sheet_to_json(workbook.Sheets[sheets.first]) as Record<string, any>[];
    const sheet2 = XLSX.utils.sheet_to_json(workbook.Sheets[sheets.second]) as Record<
      string,
      any
    >[];

    return { sheet1, sheet2 };
  };

  const [ktr2, ktr3] = await Promise.all([readSheets(filenames[0]), readSheets(filenames[1])]);

  const allSheet1 = [...ktr2.sheet1, ...ktr3.sheet1];
  const allSheet2 = [...ktr2.sheet2, ...ktr3.sheet2];

  const filterAndSort = <T extends Record<string, any>>(
    data: T[],
    latKey: string,
    lngKey: string
  ): T[] =>
    data
      .map((item) => ({
        ...item,
        distance: getDistance(
          { latitude: lat, longitude: lng },
          {
            latitude: parseFloat(item[latKey]),
            longitude: parseFloat(item[lngKey])
          }
        )
      }))
      .filter((item) => !threshold || item.distance <= threshold)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

  const latKey = "LAT";
  const lngKey = "LOG";

  const result1 = filterAndSort(allSheet1, latKey, lngKey);
  const result2 = filterAndSort(allSheet2, latKey, lngKey);

  return NextResponse.json(
    type === "XDSL" ? { dc: result1, dp: result2 } : { fdh: result1, fat: result2 }
  );
}
