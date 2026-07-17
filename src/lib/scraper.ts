import * as cheerio from "cheerio";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface ScrapedProfile {
  companyName: string;
  officialWebsite: string | null;
  description: string | null;
  logoUrl: string | null;
  industry: string | null;
  city: string | null;
  country: string;

  generalEmail: string | null;
  supportEmail: string | null;
  salesEmail: string | null;
  emails: string[];

  officePhone: string | null;
  phones: string[];

  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  twitter: string | null;
  tiktok: string | null;
  youtube: string | null;
  threads: string | null;
  pinterest: string | null;
  github: string | null;
  medium: string | null;

  fullAddress: string | null;

  confidenceScore: number;
  sourcesChecked: string[];
}

// ─── Constants ───────────────────────────────────────────────────────────────
export const PAKISTAN_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Hyderabad",
  "Abbottabad",
] as const;

export const INDUSTRIES = [
  "Security Barriers & Bollards",
  "Food Venues & Restaurants",
  "Construction",
  "Textiles",
  "IT & Software",
  "Real Estate",
  "Healthcare & Hospitals",
  "Education",
  "Automotive",
  "Retail & Shopping",
  "Manufacturing",
  "Legal & Law Firms",
  "Hotels & Hospitality",
] as const;

// ─── Regex helpers ───────────────────────────────────────────────────────────
const EMAIL_RE =
  /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
const PHONE_RE =
  /(?:\+?\d{1,4}[\s\-.]?)?\(?\d{2,4}\)?[\s\-.]?\d{3,4}[\s\-.]?\d{3,4}/g;

const SOCIAL_PATTERNS: Record<string, RegExp> = {
  facebook:
    /https?:\/\/(?:www\.)?facebook\.com\/[A-Za-z0-9._\-]+\/?/gi,
  instagram:
    /https?:\/\/(?:www\.)?instagram\.com\/[A-Za-z0-9._\-]+\/?/gi,
  linkedin:
    /https?:\/\/(?:www\.)?linkedin\.com\/(?:company|in)\/[A-Za-z0-9._\-]+\/?/gi,
  twitter:
    /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/[A-Za-z0-9._\-]+\/?/gi,
  tiktok:
    /https?:\/\/(?:www\.)?tiktok\.com\/@[A-Za-z0-9._\-]+\/?/gi,
  youtube:
    /https?:\/\/(?:www\.)?youtube\.com\/(?:@|channel\/|c\/|user\/)[A-Za-z0-9._\-]+\/?/gi,
  threads:
    /https?:\/\/(?:www\.)?threads\.net\/@?[A-Za-z0-9._\-]+\/?/gi,
  pinterest:
    /https?:\/\/(?:www\.)?pinterest\.com\/[A-Za-z0-9._\-]+\/?/gi,
  github:
    /https?:\/\/(?:www\.)?github\.com\/[A-Za-z0-9._\-]+\/?/gi,
  medium:
    /https?:\/\/(?:www\.)?medium\.com\/@?[A-Za-z0-9._\-]+\/?/gi,
};

// ─── Search via DuckDuckGo HTML ─────────────────────────────────────────────
async function searchDuckDuckGo(
  query: string
): Promise<{ title: string; url: string; snippet: string }[]> {
  const encoded = encodeURIComponent(query);
  const url = `https://html.duckduckgo.com/html/?q=${encoded}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  const html = await res.text();
  const $ = cheerio.load(html);
  const results: { title: string; url: string; snippet: string }[] = [];

  $(".result").each((_, el) => {
    const titleEl = $(el).find(".result__a");
    const snippetEl = $(el).find(".result__snippet");
    const href = titleEl.attr("href") || "";

    let finalUrl = href;
    if (href.includes("uddg=")) {
      try {
        const parsed = new URL(href, "https://duckduckgo.com");
        finalUrl = parsed.searchParams.get("uddg") || href;
      } catch {
        finalUrl = href;
      }
    }

    if (finalUrl && !finalUrl.includes("duckduckgo.com")) {
      results.push({
        title: titleEl.text().trim(),
        url: finalUrl,
        snippet: snippetEl.text().trim(),
      });
    }
  });

  return results.slice(0, 10);
}

// ─── Fetch & parse a page ────────────────────────────────────────────────────
async function fetchPage(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    clearTimeout(timeout);
    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) return null;

    return await res.text();
  } catch {
    return null;
  }
}

function extractEmails(text: string): string[] {
  const matches = text.match(EMAIL_RE) || [];
  const clean = matches
    .map((e) => e.toLowerCase())
    .filter(
      (e) =>
        !e.endsWith(".png") &&
        !e.endsWith(".jpg") &&
        !e.endsWith(".svg") &&
        !e.includes("example.com") &&
        !e.includes("sentry") &&
        !e.includes("webpack")
    );
  return [...new Set(clean)];
}

function extractPhones(text: string): string[] {
  const matches = text.match(PHONE_RE) || [];
  const clean = matches
    .map((p) => p.trim())
    .filter((p) => p.replace(/\D/g, "").length >= 7);
  return [...new Set(clean)];
}

function extractSocials(
  html: string
): Record<string, string | null> {
  const result: Record<string, string | null> = {};
  for (const [platform, pattern] of Object.entries(SOCIAL_PATTERNS)) {
    const match = html.match(pattern);
    if (match) {
      result[platform] = match[0].replace(/\/+$/, "");
    } else {
      result[platform] = null;
    }
  }
  return result;
}

function extractMeta(
  $: cheerio.CheerioAPI
): { description: string | null; logoUrl: string | null } {
  const description =
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content") ||
    null;

  const logoUrl =
    $('meta[property="og:image"]').attr("content") ||
    $('link[rel="icon"]').attr("href") ||
    null;

  return { description, logoUrl };
}

// ─── Extract business name from search result title ──────────────────────────
function extractBusinessName(title: string, snippet: string): string {
  // Remove common suffixes like " - Home", " | Official Site", etc.
  let name = title
    .replace(/\s*[-|–]\s*(Home|Official|Website|Contact|About).*$/i, "")
    .replace(/\s*\|\s*.*$/i, "")
    .replace(/\s*-\s*.*$/i, "")
    .trim();

  // If name is too short, try snippet
  if (name.length < 3) {
    name = snippet.split(/[.\n]/)[0].trim();
  }

  return name || title;
}

// ─── Filter out non-business results ─────────────────────────────────────────
const SKIP_DOMAINS = [
  "facebook.com",
  "instagram.com",
  "linkedin.com",
  "twitter.com",
  "x.com",
  "youtube.com",
  "tiktok.com",
  "wikipedia.org",
  "yelp.com",
  "crunchbase.com",
  "glassdoor.com",
  "indeed.com",
  "bloomberg.com",
  "zoominfo.com",
  "google.com",
  "mapquest.com",
  "yellowpages.com",
  "tripadvisor.com",
];

function isBusinessResult(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return !SKIP_DOMAINS.some((d) => hostname.includes(d));
  } catch {
    return false;
  }
}

// ─── Scrape a single business profile ────────────────────────────────────────
async function scrapeSingleBusiness(
  companyName: string,
  websiteUrl: string,
  city: string,
  industry: string
): Promise<ScrapedProfile> {
  const profile: ScrapedProfile = {
    companyName,
    officialWebsite: websiteUrl,
    description: null,
    logoUrl: null,
    industry,
    city,
    country: "Pakistan",
    generalEmail: null,
    supportEmail: null,
    salesEmail: null,
    emails: [],
    officePhone: null,
    phones: [],
    facebook: null,
    instagram: null,
    linkedin: null,
    twitter: null,
    tiktok: null,
    youtube: null,
    threads: null,
    pinterest: null,
    github: null,
    medium: null,
    fullAddress: null,
    confidenceScore: 0,
    sourcesChecked: [],
  };

  let points = 0;

  const mainHtml = await fetchPage(websiteUrl);
  if (mainHtml) {
    profile.sourcesChecked.push("Official Website");
    const $ = cheerio.load(mainHtml);
    const meta = extractMeta($);
    profile.description = meta.description;
    profile.logoUrl = meta.logoUrl;

    const emails = extractEmails(mainHtml);
    const phones = extractPhones($("body").text());
    profile.emails.push(...emails);
    profile.phones.push(...phones);

    const homeSocials = extractSocials(mainHtml);
    for (const [key, val] of Object.entries(homeSocials)) {
      if (val) {
        (profile as unknown as Record<string, unknown>)[key] = val;
      }
    }

    points += 20;

    // Try /contact page
    try {
      const base = new URL(websiteUrl);
      const contactUrl = `${base.origin}/contact`;
      const contactHtml = await fetchPage(contactUrl);
      if (contactHtml) {
        profile.sourcesChecked.push("Contact Page");
        const contactEmails = extractEmails(contactHtml);
        const contactPhones = extractPhones(
          cheerio.load(contactHtml)("body").text()
        );
        profile.emails.push(...contactEmails);
        profile.phones.push(...contactPhones);

        const contactSocials = extractSocials(contactHtml);
        for (const [key, val] of Object.entries(contactSocials)) {
          if (val && !profile[key as keyof ScrapedProfile]) {
            (profile as unknown as Record<string, unknown>)[key] = val;
          }
        }
        points += 10;
      }
    } catch {
      // skip
    }

    // Try /about page
    try {
      const base = new URL(websiteUrl);
      const aboutUrl = `${base.origin}/about`;
      const aboutHtml = await fetchPage(aboutUrl);
      if (aboutHtml) {
        profile.sourcesChecked.push("About Page");
        const aboutEmails = extractEmails(aboutHtml);
        profile.emails.push(...aboutEmails);

        const aboutSocials = extractSocials(aboutHtml);
        for (const [key, val] of Object.entries(aboutSocials)) {
          if (val && !profile[key as keyof ScrapedProfile]) {
            (profile as unknown as Record<string, unknown>)[key] = val;
          }
        }
        points += 5;
      }
    } catch {
      // skip
    }

    points += 15;
  }

  // Deduplicate
  profile.emails = [...new Set(profile.emails)];
  profile.phones = [...new Set(profile.phones)];

  if (profile.emails.length > 0) {
    points += 15;
    for (const email of profile.emails) {
      const lower = email.toLowerCase();
      if (
        lower.startsWith("info@") ||
        lower.startsWith("contact@") ||
        lower.startsWith("hello@")
      ) {
        profile.generalEmail = email;
      } else if (
        lower.startsWith("support@") ||
        lower.startsWith("help@")
      ) {
        profile.supportEmail = email;
      } else if (
        lower.startsWith("sales@") ||
        lower.startsWith("business@")
      ) {
        profile.salesEmail = email;
      } else if (!profile.generalEmail) {
        profile.generalEmail = email;
      }
    }
  }

  if (profile.phones.length > 0) {
    profile.officePhone = profile.phones[0];
    points += 10;
  }

  const socials = [
    "facebook",
    "instagram",
    "linkedin",
    "twitter",
    "youtube",
    "tiktok",
  ];
  const foundSocials = socials.filter(
    (s) => profile[s as keyof ScrapedProfile]
  );
  points += Math.min(foundSocials.length * 5, 25);

  profile.confidenceScore = Math.min(points, 100);

  return profile;
}

// ─── Main: Extract businesses by city + industry ─────────────────────────────
export async function extractByCityAndIndustry(
  city: string,
  industry: string
): Promise<ScrapedProfile[]> {
  // Build multiple search queries for better coverage
  const queries = [
    `${industry} companies in ${city} Pakistan`,
    `${industry} suppliers ${city} Pakistan contact`,
    `${industry} businesses ${city} Pakistan`,
  ];

  const allResults: { title: string; url: string; snippet: string }[] = [];
  const seenUrls = new Set<string>();

  // Run searches in parallel
  const searchBatches = await Promise.all(
    queries.map((q) => searchDuckDuckGo(q))
  );

  for (const results of searchBatches) {
    for (const r of results) {
      try {
        const hostname = new URL(r.url).hostname;
        if (!seenUrls.has(hostname) && isBusinessResult(r.url)) {
          seenUrls.add(hostname);
          allResults.push(r);
        }
      } catch {
        continue;
      }
    }
  }

  // Scrape each business (limit to 8 to avoid timeouts)
  const profiles: ScrapedProfile[] = [];
  const toScrape = allResults.slice(0, 8);

  const scrapeResults = await Promise.allSettled(
    toScrape.map(async (result) => {
      const name = extractBusinessName(result.title, result.snippet);
      return scrapeSingleBusiness(name, result.url, city, industry);
    })
  );

  for (const result of scrapeResults) {
    if (result.status === "fulfilled" && result.value.confidenceScore > 0) {
      profiles.push(result.value);
    }
  }

  // Sort by confidence score descending
  profiles.sort((a, b) => b.confidenceScore - a.confidenceScore);

  return profiles;
}
