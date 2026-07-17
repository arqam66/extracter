<div align="center">

# Pakistan BizIntel

**Pakistan Business Intelligence & Contact Extraction Platform**

Extract verified business contacts, social media profiles, and official online presence across Pakistan — organized by **city** and **industry**.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

</div>

---

## Overview

Pakistan BizIntel is a web scraping and business intelligence platform purpose-built for the **Pakistan market**. Instead of searching by company name or website, you simply select a **city** and an **industry** — and the platform automatically discovers, scrapes, and catalogs business profiles matching that combination.

Every extracted profile includes emails, phone numbers, social media links, physical addresses, and a confidence score — all organized in a clean dashboard with city and industry breakdowns.

---

## Features

### Core Extraction
- **City + Industry Selection** — Pick from 11 Pakistani cities and 13 industry categories; the platform handles the rest
- **Multi-Query Search** — Runs 3 parallel DuckDuckGo searches per city+industry combo for maximum coverage (e.g. `"Security Barriers companies in Karachi Pakistan"`, `"Security Barriers suppliers Karachi Pakistan contact"`, `"Security Barriers businesses Karachi Pakistan"`)
- **Multi-Business Extraction** — Discovers and scrapes up to 8 business websites per extraction run
- **Deep Page Crawling** — Crawls each business's homepage, `/contact`, and `/about` pages using Cheerio HTML parsing
- **Email Extraction** — Regex-based email discovery with filtering (excludes image extensions, example.com, sentry, webpack)
- **Phone Number Extraction** — Pakistani and international phone number pattern matching (minimum 7 digits)
- **Social Media Discovery** — Detects profiles across 10 platforms via URL pattern matching in HTML source
- **Confidence Scoring** — 0-100 score calculated from data completeness: website found (+20), contact page (+10), about page (+5), homepage crawled (+15), emails found (+15), phones found (+10), social media presence (up to +25)

### Dashboard & Analytics
- **Real-Time Stats** — Total businesses, emails found, phones found, social accounts, verified count
- **City Breakdown** — Number of extracted businesses per city, sorted by count
- **Industry Breakdown** — Number of extracted businesses per industry, sorted by count
- **Search History** — Click any previous extraction to re-run it instantly
- **Cache Indicator** — Shows whether results are fresh or loaded from the 24-hour cache

### UI/UX
- **Glassmorphism Design** — Modern glass-card UI with frosted backgrounds and gradient accents
- **Animated Loading Phases** — Progress indicator showing: searching → finding → extracting → discovering → verifying
- **Confidence Ring** — Circular visual indicator with color-coded reliability labels (Verified/Reliable/Possible/Low)
- **Copy-to-Clipboard** — One-click copy for emails, phones, addresses, and website URLs
- **Responsive Layout** — Works on desktop and mobile with auto-fitting CSS grids

---

## Supported Locations

### Cities (11)

| City | Province | Notes |
|------|----------|-------|
| Karachi | Sindh | Largest city, commercial capital |
| Lahore | Punjab | Cultural capital, tech hub |
| Islamabad | ICT | Federal capital |
| Rawalpindi | Punjab | Twin city of Islamabad |
| Faisalabad | Punjab | Textile & industrial hub |
| Multan | Punjab | Agricultural & industrial center |
| Peshawar | KPK | Northwest hub |
| Quetta | Balochistan | Provincial capital |
| Sialkot | Punjab | Sports goods & surgical instruments |
| Hyderabad | Sindh | Industrial center |
| Abbottabad | KPK | Education & tourism |

### Industries (13)

| Industry | Description |
|----------|-------------|
| Security Barriers & Bollards | Road barriers, bollards, perimeter security, access control equipment |
| Food Venues & Restaurants | Restaurants, cafes, catering, food chains, bakeries |
| Construction | Contractors, builders, architecture, materials supply |
| Textiles | Garment manufacturers, fabric suppliers, fashion houses |
| IT & Software | Software houses, IT services, web development, digital agencies |
| Real Estate | Property developers, agents, housing societies |
| Healthcare & Hospitals | Hospitals, clinics, pharmaceutical companies, medical equipment |
| Education | Schools, colleges, universities, coaching centers |
| Automotive | Car dealers, spare parts, workshops, transport companies |
| Retail & Shopping | Malls, wholesale markets, retail chains, e-commerce |
| Manufacturing | Factories, industrial production, FMCG |
| Legal & Law Firms | Lawyers, legal services, corporate law, chambers |
| Hotels & Hospitality | Hotels, motels, guest houses, event venues |

---

## Architecture

```mermaid
flowchart TD
    subgraph Frontend ["Frontend (Next.js Client)"]
        A["City Dropdown + Industry Dropdown"] -->|POST /api/search {city, industry}| B[API Route]
        A2[Dashboard Stats] -->|GET /api/stats| B2[Stats API Route]
        A3[Extraction History] -->|GET /api/search| B3[History API Route]
    end

    subgraph API ["API Layer (Next.js Route Handlers)"]
        B --> C{Cache Hit?}
        C -->|Yes| D[Return Cached Profiles]
        C -->|No| E[Scraper Engine]
        E --> F["Persist to Database (multiple profiles)"]
        D --> G[Return Response to Client]
        F --> G
    end

    subgraph Scraper ["Scraper Engine (src/lib/scraper.ts)"]
        E --> Q1["Query 1: {industry} companies in {city} Pakistan"]
        E --> Q2["Query 2: {industry} suppliers {city} Pakistan contact"]
        E --> Q3["Query 3: {industry} businesses {city} Pakistan"]
        Q1 --> S[DuckDuckGo Search]
        Q2 --> S
        Q3 --> S
        S --> D1[Deduplicate URLs]
        D1 --> D2["Filter out social media / directories"]
        D2 --> SC["Scrape each business (up to 8)"]
        SC --> F1[Fetch Homepage]
        SC --> F2[Fetch /contact]
        SC --> F3[Fetch /about]
        F1 --> EX[Extract Emails, Phones, Socials]
        F2 --> EX
        F3 --> EX
        EX --> CS[Calculate Confidence Score]
        CS --> F
    end

    subgraph DB ["Database (SQLite + Prisma)"]
        F --> I[(BusinessProfile)]
        B3 --> I2[(SearchHistory)]
        B2 --> I
        I -.->|1:N| I2
    end

    style Frontend fill:#1a1a2e,stroke:#6c5ce7,color:#f0f0f5
    style API fill:#16213e,stroke:#4fc3f7,color:#f0f0f5
    style Scraper fill:#0f3460,stroke:#00e5ff,color:#f0f0f5
    style DB fill:#1a1a2e,stroke:#00e676,color:#f0f0f5
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 16 (App Router, Turbopack) | Server-side rendering, API routes, hot reload |
| UI | React 19, Tailwind CSS 4 | Component rendering, utility-first styling |
| Language | TypeScript 5 | Type safety, IntelliSense, compile-time checks |
| Database | SQLite via Prisma ORM 6 | Local persistence, migrations, type-safe queries |
| Scraping | Cheerio 1.2 | jQuery-like HTML parsing on the server |
| Search | DuckDuckGo HTML | Free search engine (no API key required) |
| Fonts | Inter + Outfit (Google Fonts) | Clean UI typography |

---

## Project Structure

```
extracter/
├── prisma/
│   ├── schema.prisma              # Database schema (BusinessProfile, SearchHistory)
│   └── dev.db                     # SQLite database file
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── search/
│   │   │   │   └── route.ts       # POST: extract by city+industry, GET: browse/history
│   │   │   └── stats/
│   │   │       └── route.ts       # GET: dashboard statistics with city/industry breakdown
│   │   ├── globals.css            # Global styles, glassmorphism theme, animations
│   │   ├── layout.tsx             # Root layout with floating orbs background
│   │   └── page.tsx               # Main page: city/industry selectors, results, dashboard
│   ├── components/
│   │   └── SearchResult.tsx       # Business profile card with contacts, socials, confidence ring
│   └── lib/
│       ├── prisma.ts              # Prisma client singleton
│       └── scraper.ts             # Core extraction engine (DuckDuckGo + Cheerio)
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── README.md
```

---

## Database Schema

### BusinessProfile

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (cuid) | Unique identifier |
| `createdAt` | DateTime | Record creation timestamp |
| `updatedAt` | DateTime | Last update timestamp (used for cache TTL) |
| `companyName` | String | Extracted business name |
| `legalName` | String? | Legal/registered name |
| `brandName` | String? | Brand/trade name |
| `logoUrl` | String? | Logo URL from og:image or favicon |
| `description` | String? | Meta description from the website |
| `industry` | String? | Industry category (e.g. "Security Barriers & Bollards") |
| `category` | String? | Sub-category |
| `foundedYear` | String? | Year founded |
| `employeeCount` | String? | Employee count range |
| `headquarters` | String? | HQ location |
| `companyType` | String? | Company type (Pvt Ltd, etc.) |
| `officialWebsite` | String? | Primary website URL |
| `contactPage` | String? | Contact page URL |
| `aboutPage` | String? | About page URL |
| `generalEmail` | String? | info@, contact@, hello@ email |
| `supportEmail` | String? | support@, help@ email |
| `salesEmail` | String? | sales@, business@ email |
| `officePhone` | String? | Primary phone number |
| `country` | String? | Always "Pakistan" |
| `state` | String? | Province |
| `city` | String? | City name (e.g. "Karachi") |
| `street` | String? | Street address |
| `fullAddress` | String? | Complete address string |
| `facebook` | String? | Facebook page URL |
| `instagram` | String? | Instagram profile URL |
| `linkedin` | String? | LinkedIn company page URL |
| `twitter` | String? | X/Twitter profile URL |
| `tiktok` | String? | TikTok profile URL |
| `youtube` | String? | YouTube channel URL |
| `threads` | String? | Threads profile URL |
| `pinterest` | String? | Pinterest profile URL |
| `github` | String? | GitHub profile URL |
| `medium` | String? | Medium profile URL |
| `confidenceScore` | Int | 0-100 score based on data completeness |
| `verified` | Boolean | True if confidenceScore >= 75 |

**Indexes:** `city`, `industry`, `(city, industry)` composite, `country`

### SearchHistory

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (cuid) | Unique identifier |
| `createdAt` | DateTime | Search timestamp |
| `query` | String | Search query string (e.g. "Security Barriers & Bollards in Karachi") |
| `city` | String? | City searched |
| `industry` | String? | Industry searched |
| `status` | String | "completed" or "cached" |
| `profileId` | String? | Linked BusinessProfile ID |

---

## API Reference

### `POST /api/search` — Extract Businesses

Triggers a full extraction run for a city + industry combination. Scrapes DuckDuckGo, crawls business websites, and saves results to the database.

**Request Body:**
```json
{
  "city": "Karachi",
  "industry": "Security Barriers & Bollards"
}
```

**Valid Cities:**
`Karachi`, `Lahore`, `Islamabad`, `Rawalpindi`, `Faisalabad`, `Multan`, `Peshawar`, `Quetta`, `Sialkot`, `Hyderabad`, `Abbottabad`

**Valid Industries:**
`Security Barriers & Bollards`, `Food Venues & Restaurants`, `Construction`, `Textiles`, `IT & Software`, `Real Estate`, `Healthcare & Hospitals`, `Education`, `Automotive`, `Retail & Shopping`, `Manufacturing`, `Legal & Law Firms`, `Hotels & Hospitality`

**Response (Fresh):**
```json
{
  "profiles": [
    {
      "id": "clx1234...",
      "companyName": "ABC Security Solutions",
      "officialWebsite": "https://abcsecurity.pk",
      "description": "Leading security barrier manufacturer in Pakistan...",
      "industry": "Security Barriers & Bollards",
      "city": "Karachi",
      "country": "Pakistan",
      "generalEmail": "info@abcsecurity.pk",
      "supportEmail": "support@abcsecurity.pk",
      "salesEmail": null,
      "officePhone": "+92 21 1234 5678",
      "facebook": "https://facebook.com/abcsecurity",
      "instagram": null,
      "linkedin": "https://linkedin.com/company/abcsecurity",
      "twitter": null,
      "tiktok": null,
      "youtube": null,
      "fullAddress": "Industrial Area, SITE, Karachi",
      "confidenceScore": 80,
      "verified": true,
      ...
    },
    ...
  ],
  "cached": false,
  "city": "Karachi",
  "industry": "Security Barriers & Bollards",
  "totalFound": 5
}
```

**Response (Cached — within 24 hours):**
```json
{
  "profiles": [...],
  "cached": true,
  "city": "Karachi",
  "industry": "Security Barriers & Bollards"
}
```

**Error Response:**
```json
{
  "error": "Invalid city. Must be one of: Karachi, Lahore, Islamabad, ..."
}
```

---

### `GET /api/search` — Browse / History

Without parameters, returns the 20 most recent extraction history entries.

With query parameters, filters stored business profiles:

```
GET /api/search?city=Karachi
GET /api/search?industry=Construction
GET /api/search?city=Lahore&industry=IT & Software
```

**Response:**
```json
{
  "profiles": [...],
  "city": "Karachi",
  "industry": null
}
```

or for history:

```json
{
  "searches": [
    {
      "id": "...",
      "query": "Security Barriers & Bollards in Karachi",
      "city": "Karachi",
      "industry": "Security Barriers & Bollards",
      "status": "completed",
      "createdAt": "2026-07-17T10:30:00.000Z"
    }
  ]
}
```

---

### `GET /api/stats` — Dashboard Statistics

Returns aggregate statistics for the Pakistan database with city and industry breakdowns.

**Response:**
```json
{
  "totalBusinesses": 45,
  "verifiedBusinesses": 30,
  "totalSearches": 12,
  "emailsFound": 38,
  "phonesFound": 42,
  "websitesFound": 45,
  "socialsFound": 28,
  "averageConfidence": 72,
  "cityBreakdown": [
    { "city": "Karachi", "count": 15 },
    { "city": "Lahore", "count": 12 },
    { "city": "Islamabad", "count": 8 }
  ],
  "industryBreakdown": [
    { "industry": "Security Barriers & Bollards", "count": 10 },
    { "industry": "Food Venues & Restaurants", "count": 8 },
    { "industry": "Construction", "count": 7 }
  ]
}
```

---

## How It Works — Step by Step

### 1. User Selects City + Industry

The user picks a city (e.g. "Karachi") and an industry (e.g. "Security Barriers & Bollards") from two dropdown menus, then clicks **Extract**.

### 2. Parallel DuckDuckGo Searches

The scraper constructs 3 search queries and runs them in parallel:
- `"Security Barriers & Bollards companies in Karachi Pakistan"`
- `"Security Barriers & Bollards suppliers Karachi Pakistan contact"`
- `"Security Barriers & Bollards businesses Karachi Pakistan"`

This maximizes the chance of finding relevant businesses.

### 3. Result Filtering & Deduplication

Results are deduplicated by hostname. Social media sites (Facebook, Instagram, LinkedIn, Twitter, YouTube, TikTok), directories (Yelp, YellowPages, Google Maps), and encyclopedias (Wikipedia) are automatically filtered out — only real business websites proceed.

### 4. Business Name Extraction

Each business name is extracted from the search result title by stripping common suffixes like "— Home", "| Official Website", etc.

### 5. Website Crawling (Per Business)

For each of the up to 8 businesses found, the scraper fetches:
1. **Homepage** — Extracts meta description, logo, emails, phones, social links
2. **/contact page** — Additional emails, phones, and social links
3. **/about page** — Additional emails and social links

All fetches have a 10-second timeout with abort controller.

### 6. Data Extraction

- **Emails**: Regex `[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}` with noise filtering
- **Phones**: Regex matching international formats, minimum 7 digits
- **Socials**: URL pattern matching for 10 platforms (Facebook, Instagram, LinkedIn, X, TikTok, YouTube, Threads, Pinterest, GitHub, Medium)
- **Meta**: `og:description`, `meta[name="description"]`, `og:image`, `link[rel="icon"]`

### 7. Email Categorization

Emails are automatically sorted:
- **General**: `info@`, `contact@`, `hello@`
- **Support**: `support@`, `help@`
- **Sales**: `sales@`, `business@`

### 8. Confidence Scoring

| Signal | Points |
|--------|--------|
| Official website found | +20 |
| Homepage crawled successfully | +15 |
| Contact page found | +10 |
| About page found | +5 |
| Emails found | +15 |
| Phone numbers found | +10 |
| Social media profiles (each) | +5 (max 25) |

**Total: max 100**

| Score Range | Label | Color |
|-------------|-------|-------|
| 90-100 | Verified | Green |
| 75-89 | Reliable | Blue |
| 50-74 | Possible | Orange |
| 0-49 | Low | Pink |

Businesses with score >= 75 are automatically marked as `verified: true`.

### 9. Database Storage

All profiles are saved to SQLite via Prisma with `city`, `industry`, and `country: "Pakistan"` fields. Indexed on `(city, industry)` for fast lookups.

### 10. Caching

If the same city+industry combination was extracted within the last 24 hours, cached results are returned immediately without re-scraping.

---

## Getting Started

### Prerequisites

- **Node.js 18+** (recommended: 22 LTS)
- **npm** (or yarn/pnpm)

### Installation

```bash
git clone https://github.com/arqam66/extracter.git
cd extracter
npm install
```

### Database Setup

```bash
npx prisma generate
npx prisma db push
```

This creates the SQLite database at `prisma/dev.db` with the correct schema and indexes.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## Environment Variables

**None required.** The application works out of the box:
- SQLite database is created automatically at `prisma/dev.db`
- DuckDuckGo HTML search requires no API key
- All HTTP requests use a standard Chrome User-Agent string

---

## Configuration

### Scraper Tuning (src/lib/scraper.ts)

| Constant | Default | Description |
|----------|---------|-------------|
| Search result limit | 10 per query | Max results from each DuckDuckGo query |
| Business scrape limit | 8 per extraction | Max websites crawled per city+industry run |
| Fetch timeout | 10 seconds | Per-page abort timeout |
| Cache TTL | 24 hours | How long before re-extraction is triggered |

### Database Cache Check

The API checks for existing profiles matching the exact `city` + `industry` + `country: "Pakistan"` combination with `updatedAt` within the last 24 hours. If found, cached profiles are returned.

---

## Limitations

- **DuckDuckGo Rate Limiting**: Heavy usage may trigger rate limits from DuckDuckGo's HTML search
- **Website Availability**: Some Pakistani business websites may be slow, down, or block crawlers
- **Phone Number Patterns**: Pakistani numbers (+92 format) are well-supported, but some local-only formats may be missed
- **Email Discovery**: Only finds emails present in HTML source; emails behind contact forms or JavaScript are not captured
- **Language**: Search queries are in English; Urdu-only businesses may be underrepresented
- **Extraction Limit**: Max 8 businesses per run to prevent timeouts; larger industries in major cities may require multiple runs

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit changes (`git commit -m "Add my feature"`)
4. Push to branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## License

MIT
