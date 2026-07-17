<div align="center">

# BizIntel

**Business Contact & Social Media Intelligence Platform**

Instantly discover verified business contacts, social media profiles, and official online presence from a single search.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

</div>

---

## Features

- **Web Scraping Engine** -- Crawls official websites, contact pages, and about pages to extract emails, phone numbers, and social links
- **DuckDuckGo Integration** -- Finds official websites via search without requiring API keys
- **Social Media Discovery** -- Detects profiles across 10 platforms (Facebook, Instagram, LinkedIn, X, TikTok, YouTube, Threads, Pinterest, GitHub, Medium)
- **Confidence Scoring** -- Assigns a 0-100 score based on data completeness and verification signals
- **Caching Layer** -- Stores results in SQLite via Prisma with a 24-hour TTL
- **Dashboard** -- Real-time stats on businesses found, emails, phones, and social accounts
- **Search History** -- Click any previous search to re-fetch instantly

## Architecture

```mermaid
flowchart TD
    subgraph Frontend ["Frontend (Next.js Client)"]
        A[Search Bar] -->|POST /api/search| B[API Route]
        A2[Dashboard Stats] -->|GET /api/stats| B2[Stats API Route]
        A3[Search History] -->|GET /api/search| B3[History API Route]
    end

    subgraph API ["API Layer (Next.js Route Handlers)"]
        B --> C{Cache Hit?}
        C -->|Yes| D[Return Cached Profile]
        C -->|No| E[Scraper Engine]
        E --> F[Persist to Database]
        D --> G[Return Response to Client]
        F --> G
    end

    subgraph Scraper ["Scraper Engine (src/lib/scraper.ts)"]
        E --> H1[DuckDuckGo Search]
        H1 --> H2[Pick Official Website]
        H2 --> H3[Fetch Homepage]
        H2 --> H4[Fetch /contact]
        H2 --> H5[Fetch /about]
        H3 --> H6[Extract Emails]
        H3 --> H7[Extract Phones]
        H3 --> H8[Extract Social Links]
        H4 --> H6
        H4 --> H7
        H4 --> H8
        H5 --> H6
        H5 --> H8
        H6 --> H9[Deduplicate & Categorize]
        H7 --> H9
        H8 --> H9
        H9 --> H10[Calculate Confidence Score]
        H10 --> F
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

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4 |
| Language | TypeScript 5 |
| Database | SQLite via Prisma ORM 6 |
| Scraping | Cheerio (HTML parsing), DuckDuckGo HTML search |
| Fonts | Inter + Outfit (Google Fonts) |

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 22)
- npm or yarn

### Installation

```bash
git clone https://github.com/your-username/extracter.git
cd extracter
npm install
```

### Database Setup

```bash
npx prisma generate
npx prisma db push
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
npm run build
npm start
```

## Project Structure

```
extracter/
├── prisma/
│   └── schema.prisma          # Database schema (BusinessProfile, SearchHistory)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── search/
│   │   │   │   └── route.ts   # POST search + GET history
│   │   │   └── stats/
│   │   │       └── route.ts   # GET dashboard statistics
│   │   ├── globals.css         # Global styles, glassmorphism theme
│   │   ├── layout.tsx          # Root layout with floating orbs
│   │   └── page.tsx            # Main search page + dashboard
│   ├── components/
│   │   └── SearchResult.tsx    # Result card with contacts, socials, confidence ring
│   └── lib/
│       ├── prisma.ts           # Prisma client singleton
│       └── scraper.ts          # Core scraping engine
├── package.json
└── README.md
```

## How It Works

1. **Search** -- User enters a company name, website, or email
2. **Discovery** -- DuckDuckGo locates the official website (skipping social media and directory sites)
3. **Extraction** -- The scraper fetches the homepage, `/contact`, and `/about` pages, parsing HTML with Cheerio
4. **Enrichment** -- Emails are categorized (general/support/sales), phone numbers extracted, and social profiles detected via regex
5. **Scoring** -- A confidence score (0-100) is calculated based on data completeness
6. **Storage** -- Results are persisted to SQLite; subsequent identical searches within 24 hours are served from cache

## API Reference

### `POST /api/search`

Search for a business profile.

**Request Body:**
```json
{ "query": "Vercel" }
```

**Response:**
```json
{
  "profile": { "companyName": "Vercel", "confidenceScore": 85, "verified": true, ... },
  "cached": false,
  "sourcesChecked": ["DuckDuckGo Search", "Official Website", "Contact Page"],
  "allEmails": ["info@vercel.com", "support@vercel.com"],
  "allPhones": ["+1-555-0100"]
}
```

### `GET /api/search`

Returns the 20 most recent search history entries.

### `GET /api/stats`

Returns aggregate statistics (total businesses, emails found, phones found, etc.).

## Environment Variables

No environment variables are required for basic functionality. The SQLite database is created automatically at `prisma/dev.db`.

## License

MIT
