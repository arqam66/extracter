<div align="center">

# Pakistan BizIntel

### Your Complete Business Directory for Pakistan

**Find any business's email, phone number, website, and social media — by city and industry.**

*No manual searching. No outdated directories. No wasted hours.*

---

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

</div>

---

## What Is This?

Pakistan BizIntel is a smart business research tool built specifically for the **Pakistan market**. It automatically finds and collects contact information for businesses across Pakistan — organized by **city** and **industry**.

Think of it as your own personal business directory assistant. Instead of spending hours Googling individual companies, you simply:

1. **Pick a city** — like Karachi, Lahore, or Islamabad
2. **Pick an industry** — like Security Barriers, Restaurants, or Construction
3. **Click Extract** — and the tool does the rest

Within moments, you get a clean list of businesses with their emails, phone numbers, websites, social media profiles, and physical addresses — all verified and scored for reliability.

---

## Website Layout

The application uses a clean **white theme** with a modern glassmorphism design. Here's how the interface is organized:

```
┌─────────────────────────────────────────────────────────────────┐
│                        HEADER / HERO                            │
│                                                                 │
│                    Pakistan BizIntel                            │
│   Extract verified business contacts across Pakistan            │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │   Select City    │  │ Select Industry  │  │   Extract    │  │
│  │   (dropdown)     │  │   (dropdown)     │  │   (button)   │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
│                                                                 │
│              Searching for businesses...                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                    EXTRACTION RESULTS                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Security Barriers in Karachi                    [85]   │   │
│  │  ┌───────────────────────────────────────────────────┐  │   │
│  │  │  Atlas Security Solutions (Pvt) Ltd        Verified│  │   │
│  │  │  [Karachi, Pakistan]  [Security Barriers & Boll]  │  │   │
│  │  │                                                   │  │   │
│  │  │  Website    info@atlassecurity.pk    +92 21 ...   │  │   │
│  │  │  Facebook   Instagram   LinkedIn   Twitter        │  │   │
│  │  │  Industrial Area, SITE, Karachi                   │  │   │
│  │  └───────────────────────────────────────────────────┘  │   │
│  │                                                         │   │
│  │  ┌───────────────────────────────────────────────────┐  │   │
│  │  │  Shield Barriers International              [72]  │  │   │
│  │  │  ...                                              │  │   │
│  │  └───────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                        DASHBOARD                                │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │Businesses│  │  Emails  │  │  Phones  │  │ Socials  │       │
│  │    45    │  │    38    │  │    42    │  │    28    │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                 │
│  ┌──── By City ─────┐  ┌──── By Industry ─────┐               │
│  │ Karachi     15   │  │ Security Barriers  10│               │
│  │ Lahore      12   │  │ Restaurants         8│               │
│  │ Islamabad    8   │  │ Construction        7│               │
│  └──────────────────┘  └──────────────────────┘               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                     RECENT EXTRACTIONS                          │
│                                                                 │
│  Security Barriers in Karachi        [Fresh]     07/17/2026    │
│  Food Venues in Lahore               [Cached]    07/17/2026    │
│  Construction in Islamabad           [Fresh]     07/16/2026    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                         FOOTER                                  │
│         Designed by github.com/arqam66/extracter               │
│              Pakistan BizIntel — Business Intelligence          │
└─────────────────────────────────────────────────────────────────┘
```

### Design Theme: White / Light

The interface uses a **clean white theme** with:

- **Background:** Soft off-white (`#f8f9fc`) with subtle floating gradient orbs
- **Cards:** White with frosted glass effect and soft shadows
- **Text:** Dark charcoal (`#1a1a2e`) for headings, medium gray for body text
- **Accents:** Purple-blue gradient for primary actions, with green/orange/pink for status indicators
- **Borders:** Light gray (`#e2e4ea`) with purple glow on hover
- **Buttons:** Purple-to-blue gradient with hover shadow effect
- **Fonts:** Inter (body) + Outfit (headings)

---

## System Architecture

Here's how the entire system fits together — from the user clicking a button to data appearing on screen:

```
┌──────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                               │
│                     (White Theme, Glass Cards)                       │
│                                                                      │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│   │ City Dropdown│    │Industry Drop │    │   Extract Button     │  │
│   │              │    │              │    │                      │  │
│   │ Karachi      │    │Security      │    │    [ Extract ]       │  │
│   │ Lahore       │    │Barriers      │    │                      │  │
│   │ Islamabad    │    │Restaurants   │    └──────────┬───────────┘  │
│   │ ...          │    │Construction  │               │              │
│   └──────────────┘    └──────────────┘               │              │
│                                                      ▼              │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │                    RESULTS DISPLAY                          │   │
│   │                                                             │   │
│   │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │   │
│   │   │ Business 1  │  │ Business 2  │  │ Business 3  │       │   │
│   │   │ Name        │  │ Name        │  │ Name        │       │   │
│   │   │ Email       │  │ Email       │  │ Email       │       │   │
│   │   │ Phone       │  │ Phone       │  │ Phone       │       │   │
│   │   │ Website     │  │ Website     │  │ Website     │       │   │
│   │   │ Socials     │  │ Socials     │  │ Socials     │       │   │
│   │   │ Score: 85   │  │ Score: 72   │  │ Score: 90   │       │   │
│   │   └─────────────┘  └─────────────┘  └─────────────┘       │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │                    DASHBOARD STATS                          │   │
│   │   Businesses: 45  │  Emails: 38  │  Phones: 42  │ Socials:28│   │
│   │   By City: [Karachi:15, Lahore:12, Islamabad:8]            │   │
│   │   By Industry: [Security:10, Restaurants:8, Construction:7] │   │
│   └─────────────────────────────────────────────────────────────┘   │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
                           │  HTTP Requests
                           │  POST /api/search {city, industry}
                           │  GET  /api/stats
                           │  GET  /api/search (history)
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│                       API LAYER                                      │
│                 (Next.js Route Handlers)                             │
│                                                                      │
│   ┌────────────────────┐    ┌────────────────────┐                  │
│   │   /api/search      │    │   /api/stats       │                  │
│   │   POST + GET       │    │   GET              │                  │
│   └────────┬───────────┘    └────────┬───────────┘                  │
│            │                         │                               │
│            ▼                         ▼                               │
│   ┌─────────────────────────────────────────────────┐               │
│   │              CACHE CHECK                        │               │
│   │                                                  │               │
│   │  Same city + industry extracted within 24 hrs?  │               │
│   │                                                  │               │
│   │     YES ──► Return cached results instantly      │               │
│   │                                                  │               │
│   │     NO  ──► Run fresh extraction (below)         │               │
│   └─────────────────────────────────────────────────┘               │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
                           │  If cache miss
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    EXTRACTION ENGINE                                 │
│                   (src/lib/scraper.ts)                               │
│                                                                      │
│   STEP 1: Build Search Queries                                      │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  Query 1: "{industry} companies in {city} Pakistan"        │   │
│   │  Query 2: "{industry} suppliers {city} Pakistan contact"   │   │
│   │  Query 3: "{industry} businesses {city} Pakistan"          │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│   STEP 2: Search the Internet (3 parallel searches)                 │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │                                                             │   │
│   │   ┌──────────┐   ┌──────────┐   ┌──────────┐              │   │
│   │   │ Query 1  │   │ Query 2  │   │ Query 3  │              │   │
│   │   └────┬─────┘   └────┬─────┘   └────┬─────┘              │   │
│   │        │              │              │                      │   │
│   │        └──────────────┼──────────────┘                      │   │
│   │                       │                                     │   │
│   │                       ▼                                     │   │
│   │              DuckDuckGo Search                              │   │
│   │              (HTML scraping)                                │   │
│   │                       │                                     │   │
│   │                       ▼                                     │   │
│   │              Raw Search Results                             │   │
│   │              (up to 30 results)                             │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│   STEP 3: Filter & Deduplicate                                      │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │                                                             │   │
│   │   Remove: Facebook, Instagram, LinkedIn, Twitter            │   │
│   │   Remove: Wikipedia, Yelp, Google Maps, Yellow Pages        │   │
│   │   Remove: Duplicate websites (same domain)                  │   │
│   │   Keep:  Real business websites only                        │   │
│   │                                                             │   │
│   │   Result: Up to 8 unique business websites                 │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│   STEP 4: Deep-Scrape Each Business Website                         │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │                                                             │   │
│   │   For each of the 8 businesses:                             │   │
│   │                                                             │   │
│   │   ┌──────────────┐                                          │   │
│   │   │  Homepage    │ ──► Description, Logo, Emails, Phones,   │   │
│   │   │              │     Social Media Links                   │   │
│   │   └──────┬───────┘                                          │   │
│   │          │                                                  │   │
│   │          ▼                                                  │   │
│   │   ┌──────────────┐                                          │   │
│   │   │ /contact     │ ──► Additional Emails, Phones, Socials   │   │
│   │   └──────┬───────┘                                          │   │
│   │          │                                                  │   │
│   │          ▼                                                  │   │
│   │   ┌──────────────┐                                          │   │
│   │   │ /about       │ ──► Additional Emails, Socials           │   │
│   │   └──────────────┘                                          │   │
│   │                                                             │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│   STEP 5: Score & Verify                                            │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │                                                             │   │
│   │   Website found         +20 points                         │   │
│   │   Homepage read         +15 points                         │   │
│   │   Contact page found    +10 points                         │   │
│   │   About page found      +5 points                          │   │
│   │   Emails extracted      +15 points                         │   │
│   │   Phones extracted      +10 points                         │   │
│   │   Social media (each)   +5 points (max 25)                 │   │
│   │   ─────────────────────────────────                        │   │
│   │   Maximum:              100 points                         │   │
│   │                                                             │   │
│   │   Score >= 75 ──► Marked as "Verified"                     │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│   STEP 6: Save to Database                                          │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │                                                             │   │
│   │   Each business profile saved with:                         │   │
│   │   • City, Industry, Country (Pakistan)                      │   │
│   │   • All extracted contact data                              │   │
│   │   • Confidence score and verification status                │   │
│   │                                                             │   │
│   └─────────────────────────────────────────────────────────────┘   │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│                        DATABASE                                     │
│                   (SQLite + Prisma ORM)                              │
│                                                                      │
│   ┌─────────────────────────────┐  ┌─────────────────────────────┐  │
│   │      BusinessProfile        │  │       SearchHistory         │  │
│   │                             │  │                             │  │
│   │  id                         │  │  id                         │  │
│   │  companyName                │  │  query                      │  │
│   │  officialWebsite            │  │  city                       │  │
│   │  description                │  │  industry                   │  │
│   │  industry ──────────────────│──│  status                     │  │
│   │  city ──────────────────────│──│  createdAt                  │  │
│   │  country ("Pakistan")       │  │  profileId ─────────────────│──│
│   │  generalEmail               │  │                             │  │
│   │  supportEmail               │  └─────────────────────────────┘  │
│   │  salesEmail                 │                                   │
│   │  officePhone                │  Indexes:                         │  │
│   │  fullAddress                │  • city                           │  │
│   │  facebook                   │  • industry                       │  │
│   │  instagram                  │  • (city, industry) composite    │  │
│   │  linkedin                   │  • country                        │  │
│   │  twitter                    │                                   │
│   │  youtube                    │                                   │
│   │  confidenceScore            │                                   │
│   │  verified                   │                                   │
│   │  createdAt                  │                                   │
│   │  updatedAt                  │                                   │
│   └─────────────────────────────┘                                   │
└──────────────────────────────────────────────────────────────────────┘
```

---

## UML Class Diagram — Data Model

This diagram shows the structure of the data we collect and how different pieces of information relate to each other:

```
┌─────────────────────────────────────────────────────────────────┐
│                       BusinessProfile                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  IDENTIFICATION                                                 │
│  ─────────────                                                  │
│  + id: String (unique)                                          │
│  + companyName: String                                          │
│  + legalName: String?                                           │
│  + brandName: String?                                           │
│                                                                 │
│  CLASSIFICATION                                                 │
│  ──────────────                                                 │
│  + industry: String?        ◄── "Security Barriers & Bollards" │
│  + city: String?            ◄── "Karachi"                       │
│  + country: String?         ◄── "Pakistan"                      │
│  + category: String?                                           │
│  + companyType: String?                                         │
│                                                                 │
│  ONLINE PRESENCE                                                │
│  ───────────────                                                │
│  + officialWebsite: String?  ◄── "https://example.pk"           │
│  + logoUrl: String?                                             │
│  + description: String?                                         │
│                                                                 │
│  EMAIL ADDRESSES                                                │
│  ───────────────                                                │
│  + generalEmail: String?    ◄── info@, contact@, hello@         │
│  + supportEmail: String?    ◄── support@, help@                 │
│  + salesEmail: String?      ◄── sales@, business@               │
│                                                                 │
│  PHONE NUMBERS                                                  │
│  ─────────────                                                  │
│  + officePhone: String?     ◄── "+92 21 3456 7890"             │
│  + mobilePhone: String?                                          │
│  + whatsappPhone: String?                                       │
│                                                                 │
│  PHYSICAL ADDRESS                                               │
│  ────────────────                                               │
│  + fullAddress: String?     ◄── "SITE Area, Karachi, Sindh"    │
│  + street: String?                                             │
│  + state: String?           ◄── "Sindh"                         │
│  + postalCode: String?                                         │
│                                                                 │
│  SOCIAL MEDIA (10 platforms)                                    │
│  ───────────────────────────                                    │
│  + facebook: String?        ◄── facebook.com/example            │
│  + instagram: String?       ◄── instagram.com/example           │
│  + linkedin: String?        ◄── linkedin.com/company/example    │
│  + twitter: String?         ◄── x.com/example                   │
│  + tiktok: String?          ◄── tiktok.com/@example             │
│  + youtube: String?         ◄── youtube.com/@example            │
│  + threads: String?         ◄── threads.net/@example            │
│  + pinterest: String?       ◄── pinterest.com/example           │
│  + github: String?          ◄── github.com/example              │
│  + medium: String?          ◄── medium.com/@example             │
│                                                                 │
│  RELIABILITY                                                    │
│  ───────────                                                    │
│  + confidenceScore: Int     ◄── 0 to 100                        │
│  + verified: Boolean        ◄── true if score >= 75             │
│                                                                 │
│  TIMESTAMPS                                                     │
│  ──────────                                                     │
│  + createdAt: DateTime                                          │
│  + updatedAt: DateTime                                          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  RELATIONSHIPS                                                  │
│  ─────────────                                                  │
│  A BusinessProfile can have many SearchHistory records          │
│  (One-to-Many relationship)                                     │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              │ 1
                              │
                              │ N
┌─────────────────────────────┴───────────────────────────────────┐
│                        SearchHistory                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  + id: String (unique)                                          │
│  + query: String           ◄── "Security Barriers in Karachi"   │
│  + city: String?           ◄── "Karachi"                        │
│  + industry: String?       ◄── "Security Barriers & Bollards"   │
│  + status: String          ◄── "completed" or "cached"          │
│  + profileId: String?      ◄── Links to BusinessProfile         │
│  + createdAt: DateTime                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## UML Activity Diagram — Extraction Flow

This diagram shows the step-by-step process from user action to result:

```
                          ┌─────────┐
                          │  START  │
                          └────┬────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   User selects:     │
                    │   • City            │
                    │   • Industry        │
                    │   Clicks "Extract"  │
                    └─────────┬───────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │   Validate input    │
                    │   (city + industry) │
                    └─────────┬───────────┘
                              │
                     ┌────────┴────────┐
                     │                 │
                Valid│                 │Invalid
                     │                 │
                     ▼                 ▼
          ┌──────────────────┐  ┌──────────────┐
          │ Check database   │  │ Return error │
          │ for cached data  │  │ message      │
          │ (last 24 hours)  │  └──────────────┘
          └────────┬─────────┘
                   │
          ┌────────┴────────┐
          │                 │
     Found│                 │Not Found
          │                 │
          ▼                 ▼
   ┌──────────────┐  ┌─────────────────────────┐
   │ Return cached│  │ START EXTRACTION        │
   │ results      │  │                         │
   └──────────────┘  └────────────┬────────────┘
                                  │
                                  ▼
                   ┌──────────────────────────────┐
                   │  Build 3 search queries      │
                   │  (different wording each)    │
                   └──────────────┬───────────────┘
                                  │
                                  ▼
                   ┌──────────────────────────────┐
                   │  Run searches in PARALLEL    │
                   │  (all 3 at the same time)    │
                   └──────────────┬───────────────┘
                                  │
                                  ▼
                   ┌──────────────────────────────┐
                   │  Combine all results         │
                   │  Remove duplicates           │
                   │  Remove social media sites   │
                   │  Remove directory listings   │
                   └──────────────┬───────────────┘
                                  │
                                  ▼
                   ┌──────────────────────────────┐
                   │  Take top 8 business websites│
                   └──────────────┬───────────────┘
                                  │
                                  ▼
                   ┌──────────────────────────────┐
                   │  For EACH business website:  │
                   │                              │
                   │  ┌────────────────────────┐  │
                   │  │ Fetch homepage         │  │
                   │  │ Extract:               │  │
                   │  │  • Description         │  │
                   │  │  • Logo                │  │
                   │  │  • Emails              │  │
                   │  │  • Phone numbers       │  │
                   │  │  • Social media links  │  │
                   │  └───────────┬────────────┘  │
                   │              │               │
                   │              ▼               │
                   │  ┌────────────────────────┐  │
                   │  │ Fetch /contact page    │  │
                   │  │ Extract more:          │  │
                   │  │  • Emails              │  │
                   │  │  • Phone numbers       │  │
                   │  │  • Social media links  │  │
                   │  └───────────┬────────────┘  │
                   │              │               │
                   │              ▼               │
                   │  ┌────────────────────────┐  │
                   │  │ Fetch /about page      │  │
                   │  │ Extract more:          │  │
                   │  │  • Emails              │  │
                   │  │  • Social media links  │  │
                   │  └───────────┬────────────┘  │
                   └──────────────┬───────────────┘
                                  │
                                  ▼
                   ┌──────────────────────────────┐
                   │  Clean & organize data:      │
                   │  • Remove duplicate emails   │
                   │  • Remove duplicate phones   │
                   │  • Categorize emails         │
                   │  • Pick best phone number    │
                   └──────────────┬───────────────┘
                                  │
                                  ▼
                   ┌──────────────────────────────┐
                   │  Calculate confidence score  │
                   │  (0-100 based on completeness)│
                   └──────────────┬───────────────┘
                                  │
                                  ▼
                   ┌──────────────────────────────┐
                   │  Save all profiles to        │
                   │  database with:              │
                   │  • city, industry, country   │
                   │  • all contact data          │
                   │  • score & verification      │
                   └──────────────┬───────────────┘
                                  │
                                  ▼
                   ┌──────────────────────────────┐
                   │  Record search in history    │
                   └──────────────┬───────────────┘
                                  │
                                  ▼
                   ┌──────────────────────────────┐
                   │  Return results to user      │
                   │  (displayed as profile cards)│
                   └──────────────┬───────────────┘
                                  │
                                  ▼
                            ┌─────────┐
                            │   END   │
                            └─────────┘
```

---

## UML Use Case Diagram — Who Uses What

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                          Pakistan BizIntel                           │
│                                                                      │
│   ┌──────────────────────────────────────────────────────────────┐   │
│   │                                                              │   │
│   │                                                              │   │
│   │    ┌─────────────────┐          ┌─────────────────────┐     │   │
│   │    │  Sales Team     │          │  Marketing Agency   │     │   │
│   │    │                 │          │                     │     │   │
│   │    │  Build lead     │          │  Find potential     │     │   │
│   │    │  lists for      │          │  clients by city    │     │   │
│   │    │  cold outreach  │          │  and industry       │     │   │
│   │    └────────┬────────┘          └──────────┬──────────┘     │   │
│   │             │                              │                │   │
│   │             │    ┌──────────────────┐      │                │   │
│   │             │    │                  │      │                │   │
│   │             ├───►│   Select City    │◄─────┤                │   │
│   │             │    │   Select Industry│      │                │   │
│   │             │    │   Click Extract  │      │                │   │
│   │             │    │                  │      │                │   │
│   │             │    └────────┬─────────┘      │                │   │
│   │             │             │                │                │   │
│   │             │             ▼                │                │   │
│   │             │    ┌──────────────────┐      │                │   │
│   │             │    │                  │      │                │   │
│   │             ├───►│  View Business   │◄─────┤                │   │
│   │             │    │  Profiles with:  │      │                │   │
│   │             │    │  • Emails        │      │                │   │
│   │             │    │  • Phone numbers │      │                │   │
│   │             │    │  • Websites      │      │                │   │
│   │             │    │  • Social media  │      │                │   │
│   │             │    │  • Addresses     │      │                │   │
│   │             │    │  • Score/Rating  │      │                │   │
│   │             │    │                  │      │                │   │
│   │             │    └────────┬─────────┘      │                │   │
│   │             │             │                │                │   │
│   │             │             ▼                │                │   │
│   │             │    ┌──────────────────┐      │                │   │
│   │             │    │                  │      │                │   │
│   │             ├───►│  Use for:        │◄─────┤                │   │
│   │             │    │  • Email campaigns│     │                │   │
│   │             │    │  • Cold calling  │      │                │   │
│   │             │    │  • Market research│     │                │   │
│   │             │    │  • Competitor    │      │                │   │
│   │             │    │    analysis      │      │                │   │
│   │             │    └──────────────────┘      │                │   │
│   │             │                              │                │   │
│   │    ┌────────┴────────┐          ┌──────────┴──────────┐     │   │
│   │    │  Business Dev   │          │  Market Researcher  │     │   │
│   │    │                 │          │                     │     │   │
│   │    │  Find partners  │          │  Map industry       │     │   │
│   │    │  suppliers &    │          │  landscapes in      │     │   │
│   │    │  distributors   │          │  specific cities    │     │   │
│   │    └─────────────────┘          └─────────────────────┘     │   │
│   │                                                              │   │
│   └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Why Do You Need This?

| Without BizIntel | With BizIntel |
|------------------|---------------|
| Manually Google each business one by one | Find dozens of businesses in one click |
| Copy-paste contact info from random websites | Get organized, structured contact data |
| No idea if the info is current or accurate | Every result is scored for reliability |
| Scattered notes across spreadsheets | Everything saved in one place |
| Hours wasted on dead phone numbers & bounced emails | Only verified, working contacts |
| No way to track what you've already searched | Full history of every extraction |

---

## Who Is This For?

- **Sales Teams** — Build lead lists for cold calling, email campaigns, and outreach
- **Marketing Agencies** — Find potential clients by city and industry for targeted campaigns
- **Business Development** — Identify partners, suppliers, and distributors across Pakistan
- **Market Researchers** — Map out industry landscapes in specific cities
- **Entrepreneurs** — Discover competitors and potential collaborators
- **Recruiters** — Find companies hiring in specific sectors and locations
- **Exporters/Importers** — Locate potential buyers or suppliers in Pakistani cities
- **Event Organizers** — Find businesses for sponsorships, partnerships, or vendor lists

---

## What You'll Get for Each Business

Every business profile includes up to **30+ data points**:

| Data Type | What's Extracted | Example |
|-----------|------------------|---------|
| **Company Name** | Full business name | "Atlas Security Solutions (Pvt) Ltd" |
| **Website** | Official website URL | `https://atlassecurity.pk` |
| **Description** | What the company does | "Leading manufacturer of road barriers and bollards since 2005..." |
| **Logo** | Company logo image | Extracted from their website |
| **General Email** | Main contact email | `info@atlassecurity.pk` |
| **Support Email** | Help/support email | `support@atlassecurity.pk` |
| **Sales Email** | Business/sales email | `sales@atlassecurity.pk` |
| **Phone Number** | Office phone | `+92 21 3456 7890` |
| **Full Address** | Physical location | "SITE Area, Karachi, Sindh" |
| **Facebook** | Facebook page | `facebook.com/atlassecurity` |
| **Instagram** | Instagram profile | `instagram.com/atlassecurity` |
| **LinkedIn** | LinkedIn company page | `linkedin.com/company/atlas-security` |
| **Twitter/X** | Twitter profile | `twitter.com/atlassecurity` |
| **YouTube** | YouTube channel | `youtube.com/@atlassecurity` |
| **TikTok** | TikTok profile | `tiktok.com/@atlassecurity` |
| **Confidence Score** | Reliability rating (0-100) | 85 out of 100 |
| **Verified Status** | Auto-verified if score >= 75 | Verified |

---

## Reliability Score — How Trustworthy Is Each Result?

Every business gets a **Confidence Score** from 0 to 100. This tells you how reliable the extracted data is.

| Score | Rating | What It Means |
|-------|--------|---------------|
| 90 - 100 | **Verified** | Excellent data. Multiple contact points confirmed. You can trust this. |
| 75 - 89 | **Reliable** | Good data. Website, email, and phone all found. Safe to use. |
| 50 - 74 | **Possible** | Some data found, but incomplete. Verify before using for outreach. |
| 0 - 49 | **Low** | Limited data. May be outdated or incomplete. Use with caution. |

**How the score is calculated:**

| What We Check | Points |
|---------------|--------|
| Found their official website | +20 |
| Read their homepage successfully | +15 |
| Found their contact page | +10 |
| Found their about page | +5 |
| Extracted email addresses | +15 |
| Extracted phone numbers | +10 |
| Found social media profiles (each) | +5 (up to 25) |
| **Maximum possible** | **100** |

Businesses scoring 75 or above are automatically marked as **Verified**.

---

## Cities Covered

We cover all major business centers across Pakistan:

| City | Province | Why It Matters |
|------|----------|----------------|
| **Karachi** | Sindh | Pakistan's largest city and commercial capital |
| **Lahore** | Punjab | Cultural capital and growing tech hub |
| **Islamabad** | ICT | Federal capital, government & corporate center |
| **Rawalpindi** | Punjab | Twin city of Islamabad, military & industrial |
| **Faisalabad** | Punjab | Pakistan's textile and industrial powerhouse |
| **Multan** | Punjab | Agricultural and industrial center of South Punjab |
| **Peshawar** | KPK | Gateway to the northwest, trade & commerce |
| **Quetta** | Balochistan | Provincial capital, mining & agriculture |
| **Sialkot** | Punjab | World-famous for sports goods and surgical instruments |
| **Hyderabad** | Sindh | Industrial center between Karachi and interior Sindh |
| **Abbottabad** | KPK | Education hub and tourism center |

---

## Industries Covered

We currently support **13 industry categories** — the most in-demand sectors for Pakistani businesses:

| Industry | Includes Businesses Like... |
|----------|---------------------------|
| **Security Barriers & Bollards** | Road barrier manufacturers, bollard suppliers, perimeter security companies, access control equipment dealers |
| **Food Venues & Restaurants** | Restaurants, cafes, bakeries, catering companies, food chains, cloud kitchens |
| **Construction** | Building contractors, architects, construction material suppliers, real estate developers |
| **Textiles** | Garment manufacturers, fabric suppliers, yarn traders, fashion houses, home textile producers |
| **IT & Software** | Software houses, web development agencies, IT consultants, digital marketing firms, app developers |
| **Real Estate** | Property developers, real estate agents, housing societies, property portals |
| **Healthcare & Hospitals** | Hospitals, clinics, pharmaceutical companies, medical equipment suppliers, diagnostic labs |
| **Education** | Schools, colleges, universities, training institutes, coaching centers, EdTech companies |
| **Automotive** | Car dealers, spare parts shops, workshops, transport companies, tire shops |
| **Retail & Shopping** | Wholesale markets, retail chains, shopping malls, e-commerce businesses |
| **Manufacturing** | Factories, industrial production units, FMCG companies, packaging firms |
| **Legal & Law Firms** | Law firms, corporate lawyers, legal consultants, notary services |
| **Hotels & Hospitality** | Hotels, motels, guest houses, event venues, travel agencies |

---

## How It Works — A Simple Walkthrough

Here's exactly what happens when you use BizIntel:

### Step 1: You Make Your Selection

You open the app and see two simple dropdown menus:
- **Left dropdown** — Pick a city (e.g., "Karachi")
- **Right dropdown** — Pick an industry (e.g., "Security Barriers & Bollards")
- Click the **Extract** button

### Step 2: The System Searches the Internet

Behind the scenes, BizIntel sends **three different search queries** to find relevant businesses. For example:
- "Security Barriers companies in Karachi Pakistan"
- "Security Barriers suppliers Karachi Pakistan contact"
- "Security Barriers businesses Karachi Pakistan"

Using three different searches means we find more businesses than a single search would.

### Step 3: Results Are Filtered

Not every search result is a real business. BizIntel automatically:
- **Removes** social media links (Facebook pages, Instagram profiles)
- **Removes** directory listings (Yellow Pages, Yelp, Google Maps)
- **Removes** Wikipedia and encyclopedia entries
- **Keeps** only actual business websites

### Step 4: Each Business Is Deep-Scanned

For every business website found (up to 8 per search), BizIntel:
1. **Reads the homepage** — Finds description, logo, emails, phone numbers, social media links
2. **Checks the contact page** — Often has additional phone numbers and emails
3. **Checks the about page** — May have more contact details and company info

### Step 5: Data Is Organized and Scored

All the information is:
- **Cleaned up** — Duplicate emails and phone numbers are removed
- **Categorized** — Emails sorted into General, Support, and Sales
- **Scored** — A confidence score (0-100) is calculated based on how much data was found
- **Verified** — Businesses scoring 75+ are marked as "Verified"

### Step 6: Results Are Saved and Displayed

Everything is saved to the database. You see a clean card for each business showing:
- Company name and description
- All emails, phone numbers, and addresses
- Social media links with colored badges
- A circular confidence score indicator
- A "Verified" badge if applicable

### Step 7: Smart Caching Saves Time

If you search the same city + industry again within 24 hours, BizIntel instantly shows the saved results instead of re-scraping the internet. This means:
- Faster results on repeat searches
- No wasted effort
- The data stays fresh (auto-refreshes after 24 hours)

---

## The Dashboard

The dashboard gives you a bird's-eye view of everything you've collected:

### Key Stats at a Glance
- **Total Businesses** — How many businesses you've extracted across all searches
- **Emails Found** — Total email addresses collected
- **Phones Found** — Total phone numbers collected
- **Social Accounts** — Total social media profiles discovered
- **Verified** — How many businesses passed the reliability threshold

### City Breakdown
See which cities have the most businesses in your database. Helps you identify where your data coverage is strongest.

### Industry Breakdown
See which industries have the most profiles. Useful for understanding where your lead generation efforts are paying off.

### Extraction History
Every search you've ever run is listed here. Click any previous search to instantly re-run it — no need to re-select the city and industry.

---

## Frequently Asked Questions

### Is this legal?
BizIntel only extracts **publicly available information** that businesses have published on their own websites. It does not hack, bypass security, or access private data. It's the same as visiting a website and writing down their contact information — just done automatically and at scale.

### How accurate is the data?
Every business gets a **Confidence Score** (0-100) so you know exactly how reliable the information is. Businesses scoring 75+ are marked as "Verified." We recommend always doing a quick verification before important outreach.

### How many businesses can I find per search?
Each extraction finds up to **8 businesses** for a given city + industry combination. For industries with many businesses in a major city, you may want to run multiple extractions over time.

### Does it work for Urdu-only businesses?
The search queries are in English, so businesses with English websites are found most easily. Businesses with only Urdu content may be underrepresented. We're working on adding Urdu search support in future versions.

### Can I add more cities or industries?
Yes! The system is designed to be easily expanded. A developer can add new cities or industries by updating the configuration in the code. See the Technical Documentation section below.

### How often should I re-extract?
Results are cached for **24 hours**. After that, the system will automatically fetch fresh data the next time you search the same combination. You can also force a fresh extraction by waiting 24 hours or searching a slightly different combination.

### What if no results are found?
This can happen if:
- The industry doesn't have many businesses with websites in that specific city
- The businesses in that area primarily use Urdu-only websites
- The search terms need to be broader

Try a neighboring city or a related industry category.

### Can I export the data?
The data is stored in a standard SQLite database file (`prisma/dev.db`). A developer can easily export it to CSV, Excel, or any other format. Direct export features are planned for future versions.

---

## Use Cases — Real Examples

### Use Case 1: Sales Lead Generation
**Scenario:** You sell security equipment and want to find construction companies in Lahore that might need road barriers.

**How to use BizIntel:**
1. Select **Lahore** as the city
2. Select **Construction** as the industry
3. Click **Extract**
4. Review the list of construction companies
5. Use their emails and phone numbers for outreach

### Use Case 2: Competitive Analysis
**Scenario:** You run a restaurant in Karachi and want to see who your competitors are and how they present themselves online.

**How to use BizIntel:**
1. Select **Karachi** as the city
2. Select **Food Venues & Restaurants** as the industry
3. Click **Extract**
4. Review each competitor's website, social media presence, and contact info

### Use Case 3: Market Research
**Scenario:** You're a textile exporter wanting to understand the IT landscape in Faisalabad to find potential tech partners.

**How to use BizIntel:**
1. Select **Faisalabad** as the city
2. Select **IT & Software** as the industry
3. Click **Extract**
4. Review the software companies, their websites, and reach out

### Use Case 4: Event Sponsorship
**Scenario:** You're organizing a business conference in Islamabad and need sponsors from the hotel industry.

**How to use BizIntel:**
1. Select **Islamabad** as the city
2. Select **Hotels & Hospitality** as the industry
3. Click **Extract**
4. Get a list of hotels with emails for sponsorship outreach

---

## Getting Started

### What You'll Need
- A computer with **Node.js 18 or newer** installed (Node.js 22 is recommended)
- **npm** (comes with Node.js)
- **Git** (to download the project)

### Step 1: Download the Project

Open a terminal (Command Prompt or PowerShell on Windows, Terminal on Mac) and run:

```
git clone https://github.com/arqam66/extracter.git
cd extracter
```

### Step 2: Install Dependencies

```
npm install
```

This downloads all the required software packages. It may take a few minutes.

### Step 3: Set Up the Database

```
npx prisma generate
npx prisma db push
```

This creates the local database where all extracted business data will be stored.

### Step 4: Start the Application

```
npm run dev
```

### Step 5: Open in Your Browser

Go to **http://localhost:3000** in your web browser. You'll see the Pakistan BizIntel interface with the city and industry dropdowns ready to use.

### For Production (Live Deployment)

When you're ready to deploy for real use:

```
npm run build
npm start
```

---

## Environment Variables

**None needed.** The application works right out of the box:
- The database is created automatically when you run the setup commands
- No API keys or accounts are required
- Search functionality works immediately

---

## Frequently Asked Questions — Technical

### Can I customize which cities or industries are available?
Yes. A developer can edit the city and industry lists in `src/lib/scraper.ts` and `src/app/page.tsx`. New cities and industries can be added in minutes.

### How do I add a new industry?
1. Open `src/lib/scraper.ts`
2. Add the new industry name to the `INDUSTRIES` array
3. Open `src/app/page.tsx`
4. Add the same name to the `INDUSTRIES` array there
5. The new industry will immediately appear in the dropdown

### How do I add a new city?
Same process as above — edit the `PAKISTAN_CITIES` array in both files.

### Can I change how many businesses are found per search?
Yes. In `src/lib/scraper.ts`, find the line that says `allResults.slice(0, 8)` and change `8` to your preferred number. Higher numbers may slow down extraction.

### Can I change the cache duration?
In `src/app/api/search/route.ts`, find the cache check that uses `24 * 60 * 60 * 1000` (24 hours in milliseconds) and change it to your preferred duration.

### What database does this use?
**SQLite** — a lightweight, file-based database. The database file is stored at `prisma/dev.db`. No server setup required.

### Can I switch to a different database?
Yes. Prisma supports PostgreSQL, MySQL, and others. Change the `provider` in `prisma/schema.prisma` and update the connection URL. You may need to install the corresponding database driver.

---

## Project File Overview

For developers who want to understand the codebase:

| File | What It Does |
|------|-------------|
| `prisma/schema.prisma` | Defines the database structure (what data fields are stored) |
| `src/lib/scraper.ts` | The core engine — searches the internet, reads websites, extracts contact info |
| `src/app/page.tsx` | The main user interface — dropdowns, buttons, results display, dashboard |
| `src/components/SearchResult.tsx` | The business profile card — shows emails, phones, socials, confidence score |
| `src/app/api/search/route.ts` | Handles search requests — checks cache, triggers extraction, saves results |
| `src/app/api/stats/route.ts` | Calculates dashboard statistics — totals, breakdowns, averages |
| `src/lib/prisma.ts` | Database connection helper |
| `src/app/globals.css` | Visual styling — colors, glass effects, animations |
| `src/app/layout.tsx` | Page layout — fonts, background effects |

---

## Limitations to Be Aware Of

| Limitation | Explanation |
|------------|-------------|
| **English-first search** | Search queries are in English. Businesses with only Urdu websites may not appear. |
| **Max 8 businesses per run** | Each extraction finds up to 8 businesses. For large industries, run multiple extractions. |
| **Website must be public** | If a business doesn't have a public website, it won't be found. |
| **Contact forms not scraped** | If a business only has a "Contact Us" form (no visible email/phone), we can't extract it. |
| **Rate limits possible** | Very heavy usage may temporarily slow down searches. Take breaks between large extractions. |
| **24-hour cache** | Same city+industry results are cached for 24 hours. This is by design to avoid overloading search engines. |

---

## Contributing

We welcome contributions! If you're a developer and want to help improve BizIntel:

1. **Fork** the repository on GitHub
2. **Create a branch** for your feature
3. **Make your changes**
4. **Test** that everything works
5. **Submit a Pull Request** with a clear description of what you changed

---

## License

This project is open source under the **MIT License**. You're free to use, modify, and distribute it.

---

## Support

- **Issues & Bug Reports:** [GitHub Issues](https://github.com/arqam66/extracter/issues)
- **Source Code:** [GitHub Repository](https://github.com/arqam66/extracter)

---

<div align="center">

**Built for Pakistan's business community**

*Pakistan BizIntel — Find. Connect. Grow.*

Designed by [github.com/arqam66/extracter](https://github.com/arqam66/extracter)

</div>
