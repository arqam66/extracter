import * as cheerio from "cheerio";
import https from "https";
import http from "http";

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
  hrEmail: string | null;
  emails: string[];

  officePhone: string | null;
  mobilePhone: string | null;
  whatsappPhone: string | null;
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
  foundedYear: string | null;
  employeeCount: string | null;

  confidenceScore: number;
  sourcesChecked: string[];
}

// ─── Constants ───────────────────────────────────────────────────────────────
export const PAKISTAN_CITIES = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
  "Multan", "Peshawar", "Quetta", "Sialkot", "Abbottabad",
  "Gujranwala", "Bahawalpur", "Sargodha", "Sukkur", "Larkana",
  "Mardan", "Mingora", "Nawabshah", "Bannu", "Dera Ghazi Khan",
  "Dera Ismail Khan", "Gwadar", "Jacobabad", "Jhang", "Jhelum",
  "Kohat", "Kotri", "Mianwali", "Mirpur", "Nowshera", "Okara",
  "Rahim Yar Khan", "Shikarpur", "Swat", "Taxila", "Toba Tek Singh",
  "Turbat", "Charsadda", "Chitral", "Daska", "Hafizabad",
  "Haripur", "Kamoke", "Karak", "Khuzdar", "Lasbela",
  "Mansehra", "Matiari", "Naushahro Feroze", "Qambar Shahdadkot",
  "Sanghar", "Thatta", "Ziarat",
] as const;

export const INDUSTRIES = [
  "Security Barriers & Bollards", "Food Venues & Restaurants", "Construction",
  "Textiles", "IT & Software", "Real Estate", "Healthcare & Hospitals",
  "Education", "Automotive", "Retail & Shopping", "Manufacturing",
  "Legal & Law Firms", "Hotels & Hospitality",
] as const;

// ─── Regex ───────────────────────────────────────────────────────────────────
const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
const PHONE_RE = /(?:\+?\d{1,4}[\s\-.]?)?\(?\d{2,4}\)?[\s\-.]?\d{3,4}[\s\-.]?\d{3,4}/g;
const PAK_PHONE_RE = /(?:\+?92[\s\-.]?)?\(?\d{2,4}\)?[\s\-.]?\d{3,4}[\s\-.]?\d{3,4}/g;

const SOCIAL_PATTERNS: Record<string, RegExp> = {
  facebook: /https?:\/\/(?:www\.)?facebook\.com\/[A-Za-z0-9._\-]+\/?/gi,
  instagram: /https?:\/\/(?:www\.)?instagram\.com\/[A-Za-z0-9._\-]+\/?/gi,
  linkedin: /https?:\/\/(?:www\.)?linkedin\.com\/(?:company|in)\/[A-Za-z0-9._\-]+\/?/gi,
  twitter: /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/[A-Za-z0-9._\-]+\/?/gi,
  tiktok: /https?:\/\/(?:www\.)?tiktok\.com\/@[A-Za-z0-9._\-]+\/?/gi,
  youtube: /https?:\/\/(?:www\.)?youtube\.com\/(?:@|channel\/|c\/|user\/)[A-Za-z0-9._\-]+\/?/gi,
  threads: /https?:\/\/(?:www\.)?threads\.net\/@?[A-Za-z0-9._\-]+\/?/gi,
  pinterest: /https?:\/\/(?:www\.)?pinterest\.com\/[A-Za-z0-9._\-]+\/?/gi,
  github: /https?:\/\/(?:www\.)?github\.com\/[A-Za-z0-9._\-]+\/?/gi,
  medium: /https?:\/\/(?:www\.)?medium\.com\/@?[A-Za-z0-9._\-]+\/?/gi,
};

// ─── Native HTTPS fetch ──────────────────────────────────────────────────────
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

function httpsGet(url: string, timeoutMs = 15000): Promise<{ status: number; data: string }> {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    const options: any = {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      timeout: timeoutMs,
    };
    if (url.startsWith("https")) {
      options.rejectUnauthorized = false;
    }
    const req = mod.get(url, options, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = res.headers.location.startsWith("http")
          ? res.headers.location
          : new URL(res.headers.location, url).toString();
        httpsGet(redirectUrl, timeoutMs).then(resolve).catch(reject);
        return;
      }
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode || 0, data }));
    });
    req.on("timeout", () => { req.destroy(); reject(new Error("Request timed out")); });
    req.on("error", reject);
  });
}

// ─── Fetch a business page ──────────────────────────────────────────────────
async function fetchPage(url: string): Promise<string | null> {
  try {
    const { status, data } = await httpsGet(url, 10000);
    if (status < 200 || status >= 400) return null;
    if (data.includes("anomaly-modal") || data.includes("captcha")) return null;
    return data;
  } catch {
    return null;
  }
}

// ─── DuckDuckGo Search ─────────────────────────────────────────────────────
async function searchDuckDuckGo(query: string): Promise<{ title: string; url: string; snippet: string }[]> {
  try {
    const encoded = encodeURIComponent(query);
    const { status, data } = await httpsGet(`https://html.duckduckgo.com/html/?q=${encoded}`, 20000);
    if (status !== 200) return [];
    return parseDuckDuckGoResults(data);
  } catch {
    return [];
  }
}

function parseDuckDuckGoResults(html: string): { title: string; url: string; snippet: string }[] {
  const $ = cheerio.load(html);
  const results: { title: string; url: string; snippet: string }[] = [];

  $(".result").each((_, el) => {
    const $el = $(el);
    const linkEl = $el.find("a.result__a").first();
    let url = linkEl.attr("href") || "";
    const title = linkEl.text().trim();
    const snippet = $el.find(".result__snippet").text().trim();

    // Decode DuckDuckGo redirect URLs
    if (url.includes("duckduckgo.com/l/?uddg=")) {
      try {
        const uddg = new URL(url, "https://duckduckgo.com").searchParams.get("uddg");
        if (uddg) url = decodeURIComponent(uddg);
      } catch { /* keep original */ }
    }

    if (url && !url.startsWith("//") && title) {
      results.push({ title, url, snippet });
    }
  });

  return results.slice(0, 10);
}

// ─── Brave Search ───────────────────────────────────────────────────────────
async function searchBrave(query: string): Promise<{ title: string; url: string; snippet: string }[]> {
  try {
    const encoded = encodeURIComponent(query);
    const { status, data } = await httpsGet(`https://search.brave.com/search?q=${encoded}`, 20000);
    if (status === 429) {
      console.log("[Search] Brave rate-limited, retrying after delay...");
      await new Promise((r) => setTimeout(r, 3000));
      const retry = await httpsGet(`https://search.brave.com/search?q=${encoded}`, 20000);
      if (retry.status !== 200) return [];
      return parseBraveResults(retry.data);
    }
    if (status !== 200) return [];
    return parseBraveResults(data);
  } catch {
    return [];
  }
}

function parseBraveResults(html: string): { title: string; url: string; snippet: string }[] {
  if (html.includes("anomaly-modal") || html.includes("captcha")) return [];
  const $ = cheerio.load(html);
  const results: { title: string; url: string; snippet: string }[] = [];

  $('div[data-type="web"]').each((_, el) => {
    const $el = $(el);
    const linkEl = $el.find('a[href^="http"]').first();
    const url = linkEl.attr("href") || "";
    const title = $el.find("div.title").text().trim();
    const snippet = $el.find("div.generic-snippet").text().trim();

    if (url && !url.includes("brave.com") && title) {
      results.push({ title, url, snippet });
    }
  });

  return results.slice(0, 10);
}

// ─── SearXNG fallback ──────────────────────────────────────────────────────
const SEARXNG_INSTANCES = [
  "https://search.sapti.me",
  "https://searx.tiekoetter.com",
  "https://search.ononoki.org",
];

async function searchSearxng(query: string): Promise<{ title: string; url: string; snippet: string }[]> {
  for (const instance of SEARXNG_INSTANCES) {
    try {
      const encoded = encodeURIComponent(query);
      const { status, data } = await httpsGet(`${instance}/search?q=${encoded}&format=json&categories=general`, 10000);
      if (status === 200 && data.startsWith("{")) {
        const json = JSON.parse(data);
        if (json.results && json.results.length > 0) {
          return json.results
            .filter((r: { url: string; title: string }) => r.url && r.title)
            .slice(0, 10)
            .map((r: { title: string; url: string; content?: string }) => ({
              title: r.title,
              url: r.url,
              snippet: r.content || "",
            }));
        }
      }
    } catch { /* try next instance */ }
  }
  return [];
}

async function searchWeb(query: string): Promise<{ title: string; url: string; snippet: string }[]> {
  // DuckDuckGo first (scrape-friendly)
  const ddgResults = await searchDuckDuckGo(query);
  if (ddgResults.length > 0) return ddgResults;

  // Brave fallback
  for (let attempt = 0; attempt < 2; attempt++) {
    const results = await searchBrave(query);
    if (results.length > 0) return results;
    await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
  }

  // SearXNG fallback
  return searchSearxng(query);
}

// ─── Extract helpers ────────────────────────────────────────────────────────
function extractEmails(text: string): string[] {
  const matches = text.match(EMAIL_RE) || [];
  return [...new Set(matches.map(e => e.toLowerCase()).filter(e =>
    !e.endsWith(".png") && !e.endsWith(".jpg") && !e.endsWith(".svg") &&
    !e.includes("example.com") && !e.includes("sentry") && !e.includes("webpack") &&
    !e.includes("wixpress") && !e.includes("sentry.io") && !e.includes("schema.org") &&
    !e.includes("w3.org") && !e.includes("googleapis") && !e.includes("cloudflare") &&
    e.length < 80
  ))];
}

function extractPhones(text: string): string[] {
  const pakMatches = text.match(PAK_PHONE_RE) || [];
  const generalMatches = text.match(PHONE_RE) || [];
  const all = [...pakMatches, ...generalMatches];
  return [...new Set(all.map(p => {
    let cleaned = p.trim().replace(/^[^0-9+]+|[^0-9]+$/g, ""); // Clean non-numeric/non-plus boundaries
    return cleaned;
  }).filter(p => {
    const digits = p.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
  }))];
}

function extractSocials(html: string): Record<string, string | null> {
  const result: Record<string, string | null> = {};
  for (const [platform, pattern] of Object.entries(SOCIAL_PATTERNS)) {
    const match = html.match(pattern);
    result[platform] = match ? match[0].replace(/\/+$/, "") : null;
  }
  return result;
}

function extractMeta($: cheerio.CheerioAPI) {
  const description =
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content") || null;
  const logoUrl =
    $('meta[property="og:image"]').attr("content") ||
    $('link[rel="icon"]').attr("href") ||
    $('link[rel="shortcut icon"]').attr("href") || null;
  return { description, logoUrl };
}

function extractJsonLd($: cheerio.CheerioAPI): Record<string, string> {
  const data: Record<string, string> = {};
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const json = JSON.parse($(el).html() || "");
      if (json.name) data.name = json.name;
      if (json.description) data.description = json.description;
      if (json.telephone) data.phone = json.telephone;
      if (json.email) data.email = json.email;
      if (json.address) {
        const a = json.address;
        data.address = [a.streetAddress, a.addressLocality, a.addressRegion, a.addressCountry].filter(Boolean).join(", ");
      }
      if (json.url) data.url = json.url;
      if (json.foundingDate) data.founded = json.foundingDate;
      if (json.employeeCount) data.employees = json.employeeCount;
      if (json.sameAs && Array.isArray(json.sameAs)) {
        for (const url of json.sameAs) {
          if (typeof url === "string") {
            if (url.includes("facebook.com")) data.facebook = url;
            if (url.includes("instagram.com")) data.instagram = url;
            if (url.includes("linkedin.com")) data.linkedin = url;
            if (url.includes("twitter.com") || url.includes("x.com")) data.twitter = url;
            if (url.includes("youtube.com")) data.youtube = url;
          }
        }
      }
    } catch { /* */ }
  });
  return data;
}

function extractAddress($: cheerio.CheerioAPI, html: string): string | null {
  // Try JSON-LD first
  const jsonLd = extractJsonLd($);
  if (jsonLd.address) return jsonLd.address;

  // Try common address patterns in text
  const bodyText = $("body").text();
  const addressPatterns = [
    /(?:address|location|office|headquarters|visit us|find us)[:\s]+([A-Z][^.!?\n]{10,80})/i,
    /(?:Plot|Office|Suite|Floor|Building|Tower|Centre|Center|Block|Sector|Phase|Area|Colony|Gulshan|DHA|Clifton|Gulberg|Johar|Malir|SITE|Saddar|Township)[^.!?\n]{5,80}/i,
  ];
  for (const pattern of addressPatterns) {
    const match = bodyText.match(pattern);
    if (match) return (match[1] || match[0]).trim().slice(0, 120);
  }
  return null;
}

function extractBusinessName(title: string, snippet: string): string {
  let name = title
    .replace(/\s*[-|–]\s*(Home|Official|Website|Contact|About|Services|Products).*$/i, "")
    .replace(/\s*\|\s*.*$/i, "")
    .replace(/\s*[-–]\s*[^-–]*$/i, "")
    .trim();
  if (name.length < 3) name = snippet.split(/[.\n]/)[0].trim();
  return name || title;
}

const SKIP_DOMAINS = [
  "facebook.com", "instagram.com", "linkedin.com", "twitter.com", "x.com",
  "youtube.com", "tiktok.com", "wikipedia.org", "yelp.com", "crunchbase.com",
  "glassdoor.com", "indeed.com", "bloomberg.com", "zoominfo.com", "google.com",
  "mapquest.com", "yellowpages.com", "tripadvisor.com", "pinterest.com",
  "reddit.com", "quora.com", "medium.com", "wordpress.com", "blogspot.com",
  "aeroleads.com", "mustakbil.com", "techbehemoths.com", "scribd.com",
  "d7leadfinder.com", "businessbook.pk", "urdupoint.com", "contactout.com",
  "pakistanembassy.dk", "pakbusinessworld.com", "lookup.pk", "ypages.pk",
];

function isBusinessResult(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname.toLowerCase();

    // Allow Google Maps or Google Business Profile links
    if (hostname.includes("google.com") && (pathname.includes("/maps") || pathname.includes("/place") || hostname.startsWith("maps."))) {
      return true;
    }

    return !SKIP_DOMAINS.some(d => hostname.includes(d));
  } catch {
    return false;
  }
}

// ─── Scrape a single business ───────────────────────────────────────────────
async function scrapeSingleBusiness(
  companyName: string, websiteUrl: string, city: string, industry: string, snippet?: string
): Promise<ScrapedProfile> {
  const profile: ScrapedProfile = {
    companyName, officialWebsite: websiteUrl, description: null, logoUrl: null,
    industry, city, country: "Pakistan",
    generalEmail: null, supportEmail: null, salesEmail: null, hrEmail: null, emails: [],
    officePhone: null, mobilePhone: null, whatsappPhone: null, phones: [],
    facebook: null, instagram: null, linkedin: null, twitter: null, tiktok: null,
    youtube: null, threads: null, pinterest: null, github: null, medium: null,
    fullAddress: null, foundedYear: null, employeeCount: null,
    confidenceScore: 0, sourcesChecked: [],
  };

  let points = 0;
  const isGoogleMaps = websiteUrl.includes("google.com/maps") || websiteUrl.includes("maps.google.com");

  if (isGoogleMaps) {
    profile.sourcesChecked.push("Google Business Profile");
    profile.officialWebsite = null; // Reset to null so we don't display Google Maps as the official website
    points += 25; // Good starting confidence points for a verified Google listing

    // Clean up Google Maps title
    const cleanName = companyName
      .replace(/\s*-\s*Google\s*Maps/i, "")
      .replace(/\s*\|\s*Google\s*Maps/i, "")
      .trim();
    profile.companyName = cleanName;

    if (snippet) {
      profile.description = snippet;

      // Extract phones from search snippet
      const phonesInSnippet = extractPhones(snippet);
      if (phonesInSnippet.length > 0) {
        profile.phones.push(...phonesInSnippet);
        points += 10;
      }

      // Extract emails from snippet
      const emailsInSnippet = extractEmails(snippet);
      if (emailsInSnippet.length > 0) {
        profile.emails.push(...emailsInSnippet);
        points += 10;
      }

      // Parse Address from snippet if snippet has location hints
      const addrMatch = snippet.match(/(?:Plot|Office|Suite|Floor|Building|Tower|Centre|Center|Block|Sector|Phase|Area|Colony|Gulshan|DHA|Clifton|Gulberg|Johar|SITE|Saddar|Township|Road|Street)[^.!?|]{5,80}/i);
      if (addrMatch) {
        profile.fullAddress = addrMatch[0].trim();
        points += 10;
      }
    }

    // Attempt to search for the company's official website using the clean name
    try {
      const searchQuery = `"${cleanName}" ${city} Pakistan official website`;
      const searchResults = await searchWeb(searchQuery);
      let realWebsite: string | null = null;

      for (const res of searchResults) {
        if (isBusinessResult(res.url) && !res.url.includes("google.com")) {
          realWebsite = res.url;
          break;
        }
      }

      if (realWebsite) {
        profile.officialWebsite = realWebsite;
        profile.sourcesChecked.push("Official Website (from GBP Search)");
        points += 15;

        // Scrape the found real website
        const pagesToCrawl = [
          { url: realWebsite, label: "Official Website", points: 15 },
          { url: (() => { try { return new URL(realWebsite!).origin + "/contact"; } catch { return null; } })(), label: "Contact Page", points: 10 },
          { url: (() => { try { return new URL(realWebsite!).origin + "/about"; } catch { return null; } })(), label: "About Page", points: 5 },
        ];

        for (const page of pagesToCrawl) {
          if (!page.url) continue;
          const html = await fetchPage(page.url);
          if (!html) continue;

          const $ = cheerio.load(html);

          const meta = extractMeta($);
          if (meta.description && !profile.description) profile.description = meta.description;
          if (meta.logoUrl && !profile.logoUrl) profile.logoUrl = meta.logoUrl;

          const jsonLd = extractJsonLd($);
          if (jsonLd.phone) profile.phones.push(jsonLd.phone);
          if (jsonLd.email) profile.emails.push(jsonLd.email);
          if (jsonLd.address && !profile.fullAddress) profile.fullAddress = jsonLd.address;
          if (jsonLd.facebook && !profile.facebook) profile.facebook = jsonLd.facebook;
          if (jsonLd.instagram && !profile.instagram) profile.instagram = jsonLd.instagram;
          if (jsonLd.linkedin && !profile.linkedin) profile.linkedin = jsonLd.linkedin;

          // Extract mailto: and tel: links directly from the HTML anchors
          $('a[href^="mailto:"]').each((_, el) => {
            const mail = $(el).attr("href")?.replace(/^mailto:/i, "").trim().split("?")[0];
            if (mail) profile.emails.push(mail);
          });
          $('a[href^="tel:"]').each((_, el) => {
            const tel = $(el).attr("href")?.replace(/^tel:/i, "").trim().split("?")[0];
            if (tel) profile.phones.push(tel);
          });

          profile.emails.push(...extractEmails(html));
          profile.phones.push(...extractPhones($("body").text()));

          // Socials from links
          const socials = extractSocials(html);
          for (const [key, val] of Object.entries(socials)) {
            if (val && !profile[key as keyof ScrapedProfile]) {
              (profile as unknown as Record<string, unknown>)[key] = val;
            }
          }
          points += page.points;
        }
      }
    } catch (e) {
      console.error("[GBP Website Scrape] Failed:", e);
    }

  } else {
    // Normal scraping for directly found websites
    const pagesToCrawl = [
      { url: websiteUrl, label: "Official Website", points: 20 },
      { url: (() => { try { return new URL(websiteUrl).origin + "/contact"; } catch { return null; } })(), label: "Contact Page", points: 10 },
      { url: (() => { try { return new URL(websiteUrl).origin + "/about"; } catch { return null; } })(), label: "About Page", points: 5 },
      { url: (() => { try { return new URL(websiteUrl).origin + "/services"; } catch { return null; } })(), label: "Services Page", points: 3 },
      { url: (() => { try { return new URL(websiteUrl).origin + "/team"; } catch { return null; } })(), label: "Team Page", points: 2 },
    ];

    for (const page of pagesToCrawl) {
      if (!page.url) continue;
      const html = await fetchPage(page.url);
      if (!html) continue;

      profile.sourcesChecked.push(page.label);
      const $ = cheerio.load(html);

      // Extract data from each page
      const meta = extractMeta($);
      if (meta.description && !profile.description) profile.description = meta.description;
      if (meta.logoUrl && !profile.logoUrl) profile.logoUrl = meta.logoUrl;

      const jsonLd = extractJsonLd($);
      if (jsonLd.phone && !profile.officePhone) profile.phones.push(jsonLd.phone);
      if (jsonLd.email) profile.emails.push(jsonLd.email);
      if (jsonLd.address && !profile.fullAddress) profile.fullAddress = jsonLd.address;
      if (jsonLd.founded && !profile.foundedYear) profile.foundedYear = jsonLd.founded;
      if (jsonLd.employees && !profile.employeeCount) profile.employeeCount = jsonLd.employees;
      if (jsonLd.facebook && !profile.facebook) profile.facebook = jsonLd.facebook;
      if (jsonLd.instagram && !profile.instagram) profile.instagram = jsonLd.instagram;
      if (jsonLd.linkedin && !profile.linkedin) profile.linkedin = jsonLd.linkedin;
      if (jsonLd.twitter && !profile.twitter) profile.twitter = jsonLd.twitter;
      if (jsonLd.youtube && !profile.youtube) profile.youtube = jsonLd.youtube;

      // Extract mailto: and tel: links directly from the HTML anchors
      $('a[href^="mailto:"]').each((_, el) => {
        const mail = $(el).attr("href")?.replace(/^mailto:/i, "").trim().split("?")[0];
        if (mail) profile.emails.push(mail);
      });
      $('a[href^="tel:"]').each((_, el) => {
        const tel = $(el).attr("href")?.replace(/^tel:/i, "").trim().split("?")[0];
        if (tel) profile.phones.push(tel);
      });

      profile.emails.push(...extractEmails(html));
      profile.phones.push(...extractPhones($("body").text()));

      const socials = extractSocials(html);
      for (const [key, val] of Object.entries(socials)) {
        if (val && !profile[key as keyof ScrapedProfile]) {
          (profile as unknown as Record<string, unknown>)[key] = val;
        }
      }

      if (!profile.fullAddress) {
        const addr = extractAddress($, html);
        if (addr) profile.fullAddress = addr;
      }

      points += page.points;
    }
  }

  // Deduplicate
  profile.emails = [...new Set(profile.emails)];
  profile.phones = [...new Set(profile.phones)];

  // Categorize emails
  if (profile.emails.length > 0) {
    points += 15;
    for (const email of profile.emails) {
      const lower = email.toLowerCase();
      if (lower.startsWith("info@") || lower.startsWith("contact@") || lower.startsWith("hello@")) {
        profile.generalEmail = email;
      } else if (lower.startsWith("support@") || lower.startsWith("help@")) {
        profile.supportEmail = email;
      } else if (lower.startsWith("sales@") || lower.startsWith("business@")) {
        profile.salesEmail = email;
      } else if (lower.startsWith("hr@") || lower.startsWith("careers@") || lower.startsWith("jobs@")) {
        profile.hrEmail = email;
      } else if (!profile.generalEmail) {
        profile.generalEmail = email;
      }
    }
  }

  if (profile.phones.length > 0) {
    profile.officePhone = profile.phones[0];
    if (profile.phones.length > 1) profile.mobilePhone = profile.phones[1];
    // Find WhatsApp (usually starts with +92)
    const whatsapp = profile.phones.find(p => p.includes("92") || p.includes("+92"));
    if (whatsapp) profile.whatsappPhone = whatsapp;
    points += 10;
  }

  const socialPlatforms = ["facebook", "instagram", "linkedin", "twitter", "youtube", "tiktok", "threads", "pinterest", "github", "medium"];
  const foundSocials = socialPlatforms.filter(s => profile[s as keyof ScrapedProfile]);
  points += Math.min(foundSocials.length * 3, 30);

  profile.confidenceScore = Math.min(points, 100);
  return profile;
}

// ─── Main extraction ───────────────────────────────────────────────────────
export async function extractByCityAndIndustry(
  city: string, industry: string
): Promise<ScrapedProfile[]> {
  const queries = [
    `${industry} companies in ${city} Pakistan contact email phone`,
    `${industry} suppliers ${city} Pakistan website`,
    `${industry} businesses directory ${city} Pakistan`,
    `${industry} ${city} Pakistan email phone address`,
  ];

  const allResults: { title: string; url: string; snippet: string }[] = [];
  const seenUrls = new Set<string>();

  const searchBatches = await Promise.allSettled(queries.map(q => searchWeb(q)));
  for (const result of searchBatches) {
    if (result.status === "fulfilled") {
      for (const r of result.value) {
        try {
          const urlObj = new URL(r.url);
          const isGoogle = urlObj.hostname.toLowerCase().includes("google.com");
          const dedupKey = isGoogle ? r.url : urlObj.hostname;

          if (!seenUrls.has(dedupKey) && isBusinessResult(r.url)) {
            seenUrls.add(dedupKey);
            allResults.push(r);
          }
        } catch { continue; }
      }
    }
  }

  const profiles: ScrapedProfile[] = [];
  const toScrape = allResults.slice(0, 12); // Slightly larger slice to allow more results including Google Maps

  const scrapeResults = await Promise.allSettled(
    toScrape.map(async (result) => {
      const name = extractBusinessName(result.title, result.snippet);
      return scrapeSingleBusiness(name, result.url, city, industry, result.snippet);
    })
  );

  for (const result of scrapeResults) {
    if (result.status === "fulfilled" && result.value.confidenceScore > 0) {
      profiles.push(result.value);
    }
  }

  profiles.sort((a, b) => b.confidenceScore - a.confidenceScore);
  return profiles;
}
