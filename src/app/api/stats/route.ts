import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalBusinesses = await prisma.businessProfile.count({
      where: { country: "Pakistan" },
    });
    const verifiedBusinesses = await prisma.businessProfile.count({
      where: { verified: true, country: "Pakistan" },
    });
    const totalSearches = await prisma.searchHistory.count();

    const emailsFound = await prisma.businessProfile.count({
      where: {
        country: "Pakistan",
        OR: [
          { generalEmail: { not: null } },
          { supportEmail: { not: null } },
          { salesEmail: { not: null } },
        ],
      },
    });

    const phonesFound = await prisma.businessProfile.count({
      where: {
        country: "Pakistan",
        officePhone: { not: null },
      },
    });

    const websitesFound = await prisma.businessProfile.count({
      where: {
        country: "Pakistan",
        officialWebsite: { not: null },
      },
    });

    const socialsFound = await prisma.businessProfile.count({
      where: {
        country: "Pakistan",
        OR: [
          { facebook: { not: null } },
          { instagram: { not: null } },
          { linkedin: { not: null } },
          { twitter: { not: null } },
          { youtube: { not: null } },
        ],
      },
    });

    const avgResult = await prisma.businessProfile.aggregate({
      where: { country: "Pakistan" },
      _avg: { confidenceScore: true },
    });

    // City breakdown
    const cityBreakdown = await prisma.businessProfile.groupBy({
      by: ["city"],
      where: { country: "Pakistan", city: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    // Industry breakdown
    const industryBreakdown = await prisma.businessProfile.groupBy({
      by: ["industry"],
      where: { country: "Pakistan", industry: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    return NextResponse.json({
      totalBusinesses,
      verifiedBusinesses,
      totalSearches,
      emailsFound,
      phonesFound,
      websitesFound,
      socialsFound,
      averageConfidence: Math.round(avgResult._avg.confidenceScore || 0),
      cityBreakdown: cityBreakdown.map((c) => ({
        city: c.city,
        count: c._count.id,
      })),
      industryBreakdown: industryBreakdown.map((i) => ({
        industry: i.industry,
        count: i._count.id,
      })),
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
