import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractByCityAndIndustry } from "@/lib/scraper";
import { PAKISTAN_CITIES, INDUSTRIES } from "@/lib/scraper";

// Allow up to 60 seconds for extraction
export const maxDuration = 60;

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

    // Check for cached results (within 24 hours)
    const cachedProfiles = await prisma.businessProfile.findMany({
      where: {
        city: city,
        industry: industry,
        country: "Pakistan",
        updatedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { confidenceScore: "desc" },
    });

    if (cachedProfiles.length > 0) {
      console.log(`[Extract] Cache hit: ${cachedProfiles.length} profiles`);
      await prisma.searchHistory.create({
        data: {
          query: `${industry} in ${city}`,
          city,
          industry,
          status: "cached",
        },
      });

      return NextResponse.json({
        profiles: cachedProfiles,
        cached: true,
        city,
        industry,
      });
    }

    // Fresh extraction
    console.log(`[Extract] Starting fresh extraction...`);
    const profiles = await extractByCityAndIndustry(city, industry);
    console.log(`[Extract] Found ${profiles.length} profiles`);

    // Save each profile to database
    const savedProfiles = [];
    for (const scraped of profiles) {
      try {
        const profile = await prisma.businessProfile.create({
          data: {
            companyName: scraped.companyName,
            officialWebsite: scraped.officialWebsite,
            description: scraped.description,
            logoUrl: scraped.logoUrl,
            industry: scraped.industry,
            city: scraped.city,
            country: scraped.country,

            generalEmail: scraped.generalEmail,
            supportEmail: scraped.supportEmail,
            salesEmail: scraped.salesEmail,

            officePhone: scraped.officePhone,

            facebook: scraped.facebook,
            instagram: scraped.instagram,
            linkedin: scraped.linkedin,
            twitter: scraped.twitter,
            tiktok: scraped.tiktok,
            youtube: scraped.youtube,
            threads: scraped.threads,
            pinterest: scraped.pinterest,
            github: scraped.github,
            medium: scraped.medium,

            fullAddress: scraped.fullAddress,

            confidenceScore: scraped.confidenceScore,
            verified: scraped.confidenceScore >= 75,
          },
        });
        savedProfiles.push(profile);
      } catch (dbErr) {
        console.error(`[Extract] DB save error for ${scraped.companyName}:`, dbErr);
      }
    }

    // Record search history
    await prisma.searchHistory.create({
      data: {
        query: `${industry} in ${city}`,
        city,
        industry,
        status: "completed",
      },
    });

    console.log(`[Extract] Saved ${savedProfiles.length} profiles to database`);

    return NextResponse.json({
      profiles: savedProfiles,
      cached: false,
      city,
      industry,
      totalFound: savedProfiles.length,
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const industry = searchParams.get("industry");

    // If city/industry provided, return profiles (browse mode)
    if (city || industry) {
      const where: Record<string, unknown> = { country: "Pakistan" };
      if (city) where.city = city;
      if (industry) where.industry = industry;

      const profiles = await prisma.businessProfile.findMany({
        where,
        orderBy: { confidenceScore: "desc" },
        take: 50,
      });

      return NextResponse.json({ profiles, city, industry });
    }

    // Otherwise return search history
    const recentSearches = await prisma.searchHistory.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ searches: recentSearches });
  } catch (error) {
    console.error("[Browse] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profiles" },
      { status: 500 }
    );
  }
}
