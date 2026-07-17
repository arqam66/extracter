"use client";

import React, { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────
interface Profile {
  id: string;
  companyName: string;
  officialWebsite: string | null;
  description: string | null;
  logoUrl: string | null;
  industry: string | null;
  city: string | null;
  country: string | null;
  generalEmail: string | null;
  supportEmail: string | null;
  salesEmail: string | null;
  officePhone: string | null;
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
  googleRating: number | null;
  googleReviews: number | null;
  workingHours: string | null;
  confidenceScore: number;
  verified: boolean;
}

// ── SVG Icons (inline to avoid dependency issues) ────────────────────────────
const icons: Record<string, React.ReactNode> = {
  globe: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  mail: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  ),
  phone: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  mapPin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  copy: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
  ),
  check: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  verified: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.77 4 4 0 0 1 0 6.76 4 4 0 0 1-4.78 4.77 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  ),
  externalLink: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    </svg>
  ),
  star: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--accent-yellow)" stroke="var(--accent-yellow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
};

const socialColors: Record<string, string> = {
  facebook: "#1877F2",
  instagram: "#E4405F",
  linkedin: "#0A66C2",
  twitter: "#1DA1F2",
  tiktok: "#00f2ea",
  youtube: "#FF0000",
  threads: "#ffffff",
  pinterest: "#BD081C",
  github: "#ffffff",
  medium: "#ffffff",
};

// ── Copy helper ──────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <button
      className={`copy-btn ${copied ? "copied" : ""}`}
      onClick={handleCopy}
      title="Copy"
    >
      {copied ? icons.check : icons.copy}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// ── Confidence Ring ──────────────────────────────────────────────────────────
function ConfidenceRing({ score }: { score: number }) {
  const color =
    score >= 90
      ? "var(--accent-green)"
      : score >= 75
      ? "var(--accent-blue)"
      : score >= 50
      ? "var(--accent-orange)"
      : "var(--accent-pink)";

  const label =
    score >= 90
      ? "Verified"
      : score >= 75
      ? "Reliable"
      : score >= 50
      ? "Possible"
      : "Low";

  return (
    <div style={{ textAlign: "center" }}>
      <div
        className="confidence-ring"
        style={
          {
            "--progress": `${(score / 100) * 360}deg`,
            color,
            border: `2px solid ${color}20`,
          } as React.CSSProperties
        }
      >
        {score}
      </div>
      <div
        style={{
          fontSize: "0.7rem",
          color,
          marginTop: 4,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function SearchResult({
  profile,
  allEmails,
  allPhones,
  sourcesChecked,
}: {
  profile: Profile;
  allEmails?: string[];
  allPhones?: string[];
  sourcesChecked?: string[];
}) {
  const socials = [
    { name: "Facebook", key: "facebook", url: profile.facebook },
    { name: "Instagram", key: "instagram", url: profile.instagram },
    { name: "LinkedIn", key: "linkedin", url: profile.linkedin },
    { name: "X (Twitter)", key: "twitter", url: profile.twitter },
    { name: "TikTok", key: "tiktok", url: profile.tiktok },
    { name: "YouTube", key: "youtube", url: profile.youtube },
    { name: "Threads", key: "threads", url: profile.threads },
    { name: "Pinterest", key: "pinterest", url: profile.pinterest },
    { name: "GitHub", key: "github", url: profile.github },
    { name: "Medium", key: "medium", url: profile.medium },
  ].filter((s) => s.url);

  const emails = [
    { label: "General", value: profile.generalEmail },
    { label: "Support", value: profile.supportEmail },
    { label: "Sales", value: profile.salesEmail },
  ].filter((e) => e.value);

  return (
    <div className="glass-card fade-in-up" style={{ padding: 0, overflow: "hidden" }}>
      {/* Header */}
      <div
        style={{
          padding: "28px 32px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                fontFamily: "'Outfit', sans-serif",
                margin: 0,
              }}
            >
              {profile.companyName}
            </h2>
            {profile.verified && icons.verified}
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            {profile.city && (
              <span style={{
                padding: "3px 10px",
                borderRadius: 6,
                fontSize: "0.75rem",
                fontWeight: 600,
                background: "rgba(108, 92, 231, 0.1)",
                color: "var(--accent-purple)",
                border: "1px solid rgba(108, 92, 231, 0.2)",
              }}>
                {profile.city}, Pakistan
              </span>
            )}
            {profile.industry && (
              <span style={{
                padding: "3px 10px",
                borderRadius: 6,
                fontSize: "0.75rem",
                fontWeight: 600,
                background: "rgba(255, 165, 0, 0.1)",
                color: "var(--accent-orange)",
                border: "1px solid rgba(255, 165, 0, 0.2)",
              }}>
                {profile.industry}
              </span>
            )}
          </div>
          {profile.description && (
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                lineHeight: 1.6,
                margin: 0,
                maxWidth: 600,
              }}
            >
              {profile.description}
            </p>
          )}
        </div>
        <ConfidenceRing score={profile.confidenceScore} />
      </div>

      <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 24 }}>
        {/* ── Contact Info ──────────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {/* Website */}
          {profile.officialWebsite && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                background: "var(--bg-secondary)",
                borderRadius: 10,
                border: "1px solid var(--border)",
              }}
            >
              <span style={{ color: "var(--accent-blue)" }}>{icons.globe}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>
                  Website
                </div>
                <a
                  href={profile.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--accent-blue)",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {profile.officialWebsite.replace(/https?:\/\//, "").replace(/\/$/, "")}
                  {icons.externalLink}
                </a>
              </div>
              <CopyButton text={profile.officialWebsite} />
            </div>
          )}

          {/* Emails */}
          {emails.map((email) => (
            <div
              key={email.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                background: "var(--bg-secondary)",
                borderRadius: 10,
                border: "1px solid var(--border)",
              }}
            >
              <span style={{ color: "var(--accent-purple)" }}>{icons.mail}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>
                  {email.label} Email
                </div>
                <span style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
                  {email.value}
                </span>
              </div>
              <CopyButton text={email.value!} />
            </div>
          ))}

          {/* Phone */}
          {profile.officePhone && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                background: "var(--bg-secondary)",
                borderRadius: 10,
                border: "1px solid var(--border)",
              }}
            >
              <span style={{ color: "var(--accent-green)" }}>{icons.phone}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>
                  Phone
                </div>
                <span style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
                  {profile.officePhone}
                </span>
              </div>
              <CopyButton text={profile.officePhone} />
            </div>
          )}

          {/* Address */}
          {profile.fullAddress && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                background: "var(--bg-secondary)",
                borderRadius: 10,
                border: "1px solid var(--border)",
              }}
            >
              <span style={{ color: "var(--accent-orange)" }}>{icons.mapPin}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>
                  Address
                </div>
                <span style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
                  {profile.fullAddress}
                </span>
              </div>
              <CopyButton text={profile.fullAddress} />
            </div>
          )}
        </div>

        {/* ── Google Rating ──────────────────────────────────────────────── */}
        {profile.googleRating && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              background: "var(--bg-secondary)",
              borderRadius: 10,
              border: "1px solid var(--border)",
              width: "fit-content",
            }}
          >
            {icons.star}
            <span style={{ fontWeight: 600 }}>{profile.googleRating}</span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              ({profile.googleReviews || 0} reviews)
            </span>
            {profile.workingHours && (
              <>
                <span style={{ color: "var(--border)", margin: "0 4px" }}>|</span>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                  {profile.workingHours}
                </span>
              </>
            )}
          </div>
        )}

        {/* ── Social Media ──────────────────────────────────────────────── */}
        {socials.length > 0 && (
          <div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 10,
                fontWeight: 600,
              }}
            >
              Social Media
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={s.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-badge"
                  style={{ borderColor: `${socialColors[s.key]}30` }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: socialColors[s.key],
                      display: "inline-block",
                    }}
                  />
                  {s.name}
                  {icons.externalLink}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── All Emails Found ──────────────────────────────────────────── */}
        {allEmails && allEmails.length > 0 && (
          <div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 10,
                fontWeight: 600,
              }}
            >
              All Emails Found ({allEmails.length})
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {allEmails.map((email) => (
                <div
                  key={email}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 10px",
                    background: "var(--bg-secondary)",
                    borderRadius: 6,
                    border: "1px solid var(--border)",
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  {email}
                  <CopyButton text={email} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── All Phones Found ──────────────────────────────────────────── */}
        {allPhones && allPhones.length > 0 && (
          <div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 10,
                fontWeight: 600,
              }}
            >
              All Phones Found ({allPhones.length})
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {allPhones.map((phone) => (
                <div
                  key={phone}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 10px",
                    background: "var(--bg-secondary)",
                    borderRadius: 6,
                    border: "1px solid var(--border)",
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  {phone}
                  <CopyButton text={phone} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Sources ──────────────────────────────────────────────────── */}
        {sourcesChecked && sourcesChecked.length > 0 && (
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexWrap: "wrap",
              borderTop: "1px solid var(--border)",
              paddingTop: 16,
            }}
          >
            <span style={{ fontWeight: 600 }}>Sources:</span>
            {sourcesChecked.map((src) => (
              <span
                key={src}
                style={{
                  padding: "2px 8px",
                  background: "var(--bg-secondary)",
                  borderRadius: 4,
                  border: "1px solid var(--border)",
                }}
              >
                {src}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
