import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    totalBusinesses: 0,
    verifiedBusinesses: 0,
    totalSearches: 0,
    emailsFound: 0,
    phonesFound: 0,
    websitesFound: 0,
    socialsFound: 0,
    averageConfidence: 0,
    cityBreakdown: [],
    industryBreakdown: [],
  });
}
