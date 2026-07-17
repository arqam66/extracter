"use client";

import React, { useState, useEffect, useCallback } from "react";
import SearchResult, { downloadAllPDF } from "@/components/SearchResult";

const PAKISTAN_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Abbottabad",
  "Gujranwala",
  "Bahawalpur",
  "Sargodha",
  "Sukkur",
  "Larkana",
  "Mardan",
  "Mingora",
  "Nawabshah",
  "Bannu",
  "Dera Ghazi Khan",
  "Dera Ismail Khan",
  "Gwadar",
  "Jacobabad",
  "Jhang",
  "Jhelum",
  "Kohat",
  "Kotri",
  "Mianwali",
  "Mirpur",
  "Nowshera",
  "Okara",
  "Rahim Yar Khan",
  "Shikarpur",
  "Swat",
  "Taxila",
  "Toba Tek Singh",
  "Turbat",
  "Charsadda",
  "Chitral",
  "Daska",
  "Hafizabad",
  "Haripur",
  "Kamoke",
  "Karak",
  "Khuzdar",
  "Lasbela",
  "Mansehra",
  "Matiari",
  "Naushahro Feroze",
  "Qambar Shahdadkot",
  "Sanghar",
  "Thatta",
  "Ziarat",
];

const INDUSTRIES = [
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
];

const CACHE_KEY = "bizintel_profiles";
const CACHE_TTL = 24 * 60 * 60 * 1000;

interface CachedEntry {
  city: string;
  industry: string;
  profiles: Record<string, unknown>[];
  timestamp: number;
}

interface HistoryItem {
  id: string;
  query: string;
  city: string;
  industry: string;
  status: string;
  createdAt: string;
}

interface Stats {
  totalBusinesses: number;
  verifiedBusinesses: number;
  totalSearches: number;
  emailsFound: number;
  phonesFound: number;
  websitesFound: number;
  socialsFound: number;
  averageConfidence: number;
  cityBreakdown: { city: string; count: number }[];
  industryBreakdown: { industry: string; count: number }[];
}

interface ExtractResponse {
  profiles: Record<string, unknown>[];
  cached: boolean;
  city: string;
  industry: string;
  totalFound?: number;
  error?: string;
}

function loadCache(): CachedEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveCache(entries: CachedEntry[]) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(entries));
}

function getCachedProfiles(city: string, industry: string): Record<string, unknown>[] | null {
  const cache = loadCache();
  const entry = cache.find(
    (e) => e.city === city && e.industry === industry && Date.now() - e.timestamp < CACHE_TTL
  );
  return entry ? entry.profiles : null;
}

function setCachedProfiles(city: string, industry: string, profiles: Record<string, unknown>[]) {
  const cache = loadCache();
  const existing = cache.findIndex((e) => e.city === city && e.industry === industry);
  const entry: CachedEntry = { city, industry, profiles, timestamp: Date.now() };
  if (existing >= 0) {
    cache[existing] = entry;
  } else {
    cache.push(entry);
  }
  saveCache(cache);
}

function computeStats(): Stats {
  const cache = loadCache();
  const allProfiles: Record<string, unknown>[] = [];
  for (const entry of cache) {
    allProfiles.push(...entry.profiles);
  }

  const totalBusinesses = allProfiles.length;
  const verifiedBusinesses = allProfiles.filter((p) => p.verified === true).length;
  const totalSearches = cache.length;

  const emailsFound = allProfiles.filter(
    (p) => p.generalEmail || p.supportEmail || p.salesEmail
  ).length;

  const phonesFound = allProfiles.filter((p) => p.officePhone).length;
  const websitesFound = allProfiles.filter((p) => p.officialWebsite).length;

  const socialsFound = allProfiles.filter(
    (p) => p.facebook || p.instagram || p.linkedin || p.twitter || p.youtube
  ).length;

  const scores = allProfiles
    .map((p) => p.confidenceScore as number)
    .filter((s) => typeof s === "number");
  const averageConfidence = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;

  const cityMap = new Map<string, number>();
  const industryMap = new Map<string, number>();
  for (const p of allProfiles) {
    const c = p.city as string;
    const ind = p.industry as string;
    if (c) cityMap.set(c, (cityMap.get(c) || 0) + 1);
    if (ind) industryMap.set(ind, (industryMap.get(ind) || 0) + 1);
  }

  const cityBreakdown = [...cityMap.entries()]
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count);

  const industryBreakdown = [...industryMap.entries()]
    .map(([industry, count]) => ({ industry, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalBusinesses,
    verifiedBusinesses,
    totalSearches,
    emailsFound,
    phonesFound,
    websitesFound,
    socialsFound,
    averageConfidence,
    cityBreakdown,
    industryBreakdown,
  };
}

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.3-4.3"/>
  </svg>
);

const LoaderIcon = () => (
  <div className="spinner" />
);

function StatCard({
  label,
  value,
  variant,
  icon,
}: {
  label: string;
  value: number;
  variant: string;
  icon: React.ReactNode;
}) {
  return (
    <div className={`glass-card stat-card ${variant}`} style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
          {label}
        </span>
        <span style={{ opacity: 0.5 }}>{icon}</span>
      </div>
      <div style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
        {value}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ExtractResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingPhase, setLoadingPhase] = useState("");

  const refreshLocalData = useCallback(() => {
    setStats(computeStats());
  }, []);

  useEffect(() => {
    refreshLocalData();
  }, [refreshLocalData]);

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCity || !selectedIndustry || loading) return;

    setLoading(true);
    setError(null);
    setResults(null);

    const phases = [
      "Searching for businesses...",
      `Finding ${selectedIndustry} in ${selectedCity}...`,
      "Extracting contact information...",
      "Discovering social media profiles...",
      "Verifying data...",
    ];
    let phaseIndex = 0;
    setLoadingPhase(phases[0]);
    const interval = setInterval(() => {
      phaseIndex++;
      if (phaseIndex < phases.length) {
        setLoadingPhase(phases[phaseIndex]);
      }
    }, 2500);

    try {
      const cachedProfiles = getCachedProfiles(selectedCity, selectedIndustry);
      if (cachedProfiles) {
        setResults({
          profiles: cachedProfiles,
          cached: true,
          city: selectedCity,
          industry: selectedIndustry,
        });
        refreshLocalData();
      } else {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ city: selectedCity, industry: selectedIndustry }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Extraction failed");
        } else {
          setResults(data);
          setCachedProfiles(selectedCity, selectedIndustry, data.profiles);
          refreshLocalData();
        }
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      clearInterval(interval);
      setLoading(false);
      setLoadingPhase("");
    }
  };

  const selectStyle: React.CSSProperties = {
    flex: 1,
    padding: "14px 16px",
    borderRadius: 12,
    border: "1px solid var(--border)",
    background: "var(--bg-card)",
    color: "var(--text-primary)",
    fontSize: "0.95rem",
    fontFamily: "'Outfit', sans-serif",
    outline: "none",
    cursor: "pointer",
    appearance: "none" as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    paddingRight: 36,
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", paddingTop: 48, paddingBottom: 80 }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 800,
            fontFamily: "'Outfit', sans-serif",
            lineHeight: 1.2,
            margin: "0 0 12px",
          }}
        >
          <span className="gradient-text">Pakistan BizIntel</span>
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.05rem",
            maxWidth: 520,
            margin: "0 auto 32px",
            lineHeight: 1.6,
          }}
        >
          Extract verified business contacts across Pakistan. Select a city and industry to discover companies.
        </p>

        <form
          onSubmit={handleExtract}
          style={{
            display: "flex",
            gap: 12,
            maxWidth: 700,
            margin: "0 auto",
            flexWrap: "wrap",
          }}
        >
          <select
            className="search-input"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={loading}
            style={selectStyle}
          >
            <option value="">Select City</option>
            {PAKISTAN_CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <select
            className="search-input"
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            disabled={loading}
            style={selectStyle}
          >
            <option value="">Select Industry</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !selectedCity || !selectedIndustry}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              minWidth: 140,
              justifyContent: "center",
              borderRadius: 12,
              padding: "14px 24px",
            }}
          >
            {loading ? <LoaderIcon /> : <SearchIcon />}
            {loading ? "Extracting" : "Extract"}
          </button>
        </form>

        {loading && loadingPhase && (
          <div
            className="fade-in-up"
            style={{
              marginTop: 20,
              color: "var(--accent-purple)",
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            {loadingPhase}
          </div>
        )}
      </div>

      {error && (
        <div
          className="glass-card fade-in-up"
          style={{
            padding: "16px 24px",
            marginBottom: 32,
            borderColor: "var(--accent-pink)",
            color: "var(--accent-pink)",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      {results && results.profiles && results.profiles.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2
              style={{
                fontSize: "1.2rem",
                fontWeight: 700,
                fontFamily: "'Outfit', sans-serif",
                color: "var(--text-secondary)",
                margin: 0,
              }}
            >
              {results.industry} in {results.city}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {results.cached && (
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--accent-cyan)",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-cyan)", display: "inline-block" }} />
                  Cached
                </span>
              )}
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {results.profiles.length} found
              </span>
              <button
                onClick={() => downloadAllPDF(results.profiles as any, results.city, results.industry)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  borderRadius: 8,
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  background: "var(--gradient-1)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download All as PDF
              </button>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {results.profiles.map((profile, i) => (
              <SearchResult
                key={(profile.id as string) || i}
                profile={profile as any}
              />
            ))}
          </div>
        </div>
      )}

      {results && results.profiles && results.profiles.length === 0 && (
        <div
          className="glass-card fade-in-up"
          style={{
            padding: "32px 24px",
            marginBottom: 32,
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          No businesses found for &quot;{results.industry}&quot; in &quot;{results.city}&quot;. Try a different combination.
        </div>
      )}

      {stats && (
        <div style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              fontFamily: "'Outfit', sans-serif",
              marginBottom: 16,
              color: "var(--text-secondary)",
            }}
          >
            Dashboard
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <StatCard
              label="Businesses"
              value={stats.totalBusinesses}
              variant="purple"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-purple)" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              }
            />
            <StatCard
              label="Emails Found"
              value={stats.emailsFound}
              variant="pink"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-pink)" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              }
            />
            <StatCard
              label="Phones Found"
              value={stats.phonesFound}
              variant="green"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              }
            />
            <StatCard
              label="Social Accounts"
              value={stats.socialsFound}
              variant="yellow"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-yellow)" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              }
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {stats.cityBreakdown.length > 0 && (
              <div className="glass-card" style={{ padding: "20px 24px" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, fontWeight: 600 }}>
                  By City
                </div>
                {stats.cityBreakdown.map((c) => (
                  <div
                    key={c.city}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "6px 0",
                      borderBottom: "1px solid var(--border)",
                      fontSize: "0.85rem",
                    }}
                  >
                    <span style={{ color: "var(--text-primary)" }}>{c.city}</span>
                    <span style={{ color: "var(--accent-purple)", fontWeight: 600 }}>{c.count}</span>
                  </div>
                ))}
              </div>
            )}

            {stats.industryBreakdown.length > 0 && (
              <div className="glass-card" style={{ padding: "20px 24px" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, fontWeight: 600 }}>
                  By Industry
                </div>
                {stats.industryBreakdown.map((ind) => (
                  <div
                    key={ind.industry}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "6px 0",
                      borderBottom: "1px solid var(--border)",
                      fontSize: "0.85rem",
                    }}
                  >
                    <span style={{ color: "var(--text-primary)" }}>{ind.industry}</span>
                    <span style={{ color: "var(--accent-pink)", fontWeight: 600 }}>{ind.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Extractions */}
          {stats.totalSearches > 0 && (
            <div style={{ marginTop: 24 }}>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  fontFamily: "'Outfit', sans-serif",
                  marginBottom: 12,
                  color: "var(--text-secondary)",
                }}
              >
                Recent Extractions
              </h3>
              <div className="glass-card" style={{ padding: "16px 20px" }}>
                {loadCache().map((entry, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom: idx < loadCache().length - 1 ? "1px solid var(--border)" : "none",
                      fontSize: "0.85rem",
                    }}
                  >
                    <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                      {entry.industry} in {entry.city}
                    </span>
                    <span style={{ color: "var(--text-muted)" }}>
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}



      <footer className="footer">
        <p style={{ margin: 0 }}>
          Designed by{" "}
          <a
            href="https://github.com/arqam66/extracter"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/arqam66/extracter
          </a>
        </p>
        <p style={{ margin: "6px 0 0", fontSize: "0.78rem" }}>
          Pakistan BizIntel &mdash; Business Intelligence Platform
        </p>
      </footer>
    </div>
  );
}
