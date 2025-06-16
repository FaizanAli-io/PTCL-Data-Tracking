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

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  const readSheets = async (filename: string) => {
    const filePath = path.join(process.cwd(), "public", filename);
    const buffer = await fs.readFile(filePath);
    const workbook = XLSX.read(buffer, { type: "buffer" });

    const fdh = XLSX.utils.sheet_to_json(workbook.Sheets["FDH"]) as Record<string, any>[];
    const fat = XLSX.utils.sheet_to_json(workbook.Sheets["FAT"]) as Record<string, any>[];

    return { fdh, fat };
  };

  const [ktr2, ktr3] = await Promise.all([
    readSheets("KTR2 GPON File.xlsx"),
    readSheets("KTR3 GPON File.xlsx")
  ]);

  const allFDH = [...ktr2.fdh, ...ktr3.fdh];
  const allFAT = [...ktr2.fat, ...ktr3.fat];

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

  const nearestFDH = filterAndSort(allFDH, "LAT", "LOG");
  const nearestFAT = filterAndSort(allFAT, "LAT", "LOG");

  return NextResponse.json({ fdh: nearestFDH, fat: nearestFAT });
}
