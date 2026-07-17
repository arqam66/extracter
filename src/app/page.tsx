"use client";

import React, { useState, useEffect, useCallback } from "react";
import SearchResult from "@/components/SearchResult";

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

interface SearchHistoryItem {
  id: string;
  createdAt: string;
  query: string;
  city: string | null;
  industry: string | null;
  status: string;
}

interface ExtractResponse {
  profiles: Record<string, unknown>[];
  cached: boolean;
  city: string;
  industry: string;
  totalFound?: number;
  error?: string;
}

// ── SVG Icons ────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.3-4.3"/>
  </svg>
);

const LoaderIcon = () => (
  <div className="spinner" />
);

// ── Stat Card ────────────────────────────────────────────────────────────────
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

// ── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ExtractResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loadingPhase, setLoadingPhase] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      // silent
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/search");
      if (res.ok) {
        const data = await res.json();
        setHistory(data.searches || []);
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchHistory();
  }, [fetchStats, fetchHistory]);

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
        fetchStats();
        fetchHistory();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      clearInterval(interval);
      setLoading(false);
      setLoadingPhase("");
    }
  };

  const handleHistoryClick = (city: string, industry: string) => {
    setSelectedCity(city);
    setSelectedIndustry(industry);

    setLoading(true);
    setError(null);
    setResults(null);

    const phases = [
      "Searching for businesses...",
      `Finding ${industry} in ${city}...`,
      "Extracting contact information...",
    ];
    let phaseIndex = 0;
    setLoadingPhase(phases[0]);
    const interval = setInterval(() => {
      phaseIndex++;
      if (phaseIndex < phases.length) {
        setLoadingPhase(phases[phaseIndex]);
      }
    }, 1500);

    fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city, industry }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setResults(data);
          fetchStats();
          fetchHistory();
        }
      })
      .catch(() => setError("Network error."))
      .finally(() => {
        clearInterval(interval);
        setLoading(false);
        setLoadingPhase("");
      });
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
      {/* ── Hero ────────────────────────────────────────────────────── */}
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

        {/* ── City + Industry Selectors ───────────────────────────── */}
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

        {/* Loading phase indicator */}
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

      {/* ── Error ───────────────────────────────────────────────────── */}
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

      {/* ── Results ────────────────────────────────────────────────── */}
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
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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

      {/* ── Stats Grid ──────────────────────────────────────────────── */}
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

          {/* City & Industry Breakdowns */}
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
        </div>
      )}

      {/* ── Search History ──────────────────────────────────────────── */}
      {history.length > 0 && (
        <div>
          <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              fontFamily: "'Outfit', sans-serif",
              marginBottom: 16,
              color: "var(--text-secondary)",
            }}
          >
            Recent Extractions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => item.city && item.industry && handleHistoryClick(item.city, item.industry)}
                className="glass-card"
                style={{
                  padding: "14px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  width: "100%",
                  textAlign: "left",
                  fontSize: "0.9rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ color: "var(--text-muted)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  </span>
                  <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                    {item.industry} in {item.city}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 6,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      background: item.status === "cached"
                        ? "rgba(0, 230, 230, 0.1)"
                        : "rgba(0, 230, 118, 0.1)",
                      color: item.status === "cached"
                        ? "var(--accent-cyan)"
                        : "var(--accent-green)",
                      border: `1px solid ${
                        item.status === "cached"
                          ? "rgba(0, 230, 230, 0.2)"
                          : "rgba(0, 230, 118, 0.2)"
                      }`,
                    }}
                  >
                    {item.status === "cached" ? "Cached" : "Fresh"}
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Footer ──────────────────────────────────────────────────── */}
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
