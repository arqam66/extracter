import { NextRequest, NextResponse } from "next/server";
import { extractByCityAndIndustry } from "@/lib/scraper";
import { PAKISTAN_CITIES, INDUSTRIES } from "@/lib/scraper";

export const maxDuration = 60;

export async function GET() {
  return NextResponse.json({
    searches: [],
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { city, industry } = body;

    console.log(`[Extract] Request: city=${city}, industry=${industry}`);

    if (!city || typeof city !== "string" || !PAKISTAN_CITIES.includes(city as (typeof PAKISTAN_CITIES)[number])) {
      return NextResponse.json(
        { error: `Invalid city. Must be one of: ${PAKISTAN_CITIES.join(", ")}` },
        { status: 400 }
      );
    }

    if (!industry || typeof industry !== "string" || !INDUSTRIES.includes(industry as (typeof INDUSTRIES)[number])) {
      return NextResponse.json(
        { error: `Invalid industry. Must be one of: ${INDUSTRIES.join(", ")}` },
        { status: 400 }
      );
    }

    console.log(`[Extract] Starting fresh extraction...`);
    const profiles = await extractByCityAndIndustry(city, industry);
    console.log(`[Extract] Found ${profiles.length} profiles`);

    return NextResponse.json({
      profiles,
      cached: false,
      city,
      industry,
      totalFound: profiles.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[Extract] Fatal error:", message);
    return NextResponse.json(
      { error: `Extraction failed: ${message}. Please try again.` },
      { status: 500 }
    );
  }
}
