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
  hrEmail: string | null;
  officePhone: string | null;
  mobilePhone: string | null;
  whatsappPhone: string | null;
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
  verified: boolean;
}

// ── SVG Icons ────────────────────────────────────────────────────────────────
const icons: Record<string, React.ReactNode> = {
  globe: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  mail: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  phone: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  mapPin: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>,
  copy: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>,
  check: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  verified: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.77 4 4 0 0 1 0 6.76 4 4 0 0 1-4.78 4.77 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>,
  externalLink: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>,
  download: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  user: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  building: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>,
};

const socialColors: Record<string, string> = {
  facebook: "#1877F2", instagram: "#E4405F", linkedin: "#0A66C2",
  twitter: "#1DA1F2", tiktok: "#00f2ea", youtube: "#FF0000",
  threads: "#000000", pinterest: "#BD081C", github: "#333333", medium: "#000000",
};

// ── Copy button ──────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* */ }
  };
  return (
    <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={handleCopy} title="Copy">
      {copied ? icons.check : icons.copy}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// ── Confidence Ring ──────────────────────────────────────────────────────────
function ConfidenceRing({ score }: { score: number }) {
  const color = score >= 90 ? "var(--accent-green)" : score >= 75 ? "var(--accent-blue)" : score >= 50 ? "var(--accent-orange)" : "var(--accent-pink)";
  const label = score >= 90 ? "Verified" : score >= 75 ? "Reliable" : score >= 50 ? "Possible" : "Low";
  return (
    <div style={{ textAlign: "center" }}>
      <div className="confidence-ring" style={{ "--progress": `${(score / 100) * 360}deg`, color, border: `2px solid ${color}20` } as React.CSSProperties}>
        {score}
      </div>
      <div style={{ fontSize: "0.7rem", color, marginTop: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </div>
    </div>
  );
}

// ── PDF Download ─────────────────────────────────────────────────────────────
function downloadPDF(profile: Profile) {
  const allSocials = [
    { name: "Facebook", url: profile.facebook },
    { name: "Instagram", url: profile.instagram },
    { name: "LinkedIn", url: profile.linkedin },
    { name: "X (Twitter)", url: profile.twitter },
    { name: "TikTok", url: profile.tiktok },
    { name: "YouTube", url: profile.youtube },
    { name: "Threads", url: profile.threads },
    { name: "Pinterest", url: profile.pinterest },
    { name: "GitHub", url: profile.github },
    { name: "Medium", url: profile.medium },
  ].filter(s => s.url);

  const emails = [profile.generalEmail, profile.supportEmail, profile.salesEmail, profile.hrEmail].filter(Boolean);
  const phones = [profile.officePhone, profile.mobilePhone, profile.whatsappPhone].filter(Boolean);

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${profile.companyName} - Business Profile</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 30px; color: #1a1a2e; background: #fff; }
  h1 { font-size: 28px; margin: 0 0 4px; color: #1a1a2e; }
  .badges { margin: 8px 0 16px; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-right: 6px; }
  .badge-city { background: #f0ecff; color: #6c5ce7; border: 1px solid #d4ccf7; }
  .badge-industry { background: #fff3e0; color: #ff9800; border: 1px solid #ffe0b2; }
  .badge-score { background: ${profile.confidenceScore >= 75 ? "#e8f5e9" : "#fff3e0"}; color: ${profile.confidenceScore >= 75 ? "#4caf50" : "#ff9800"}; border: 1px solid ${profile.confidenceScore >= 75 ? "#c8e6c9" : "#ffe0b2"}; }
  .verified { background: #e8f5e9; color: #4caf50; border: 1px solid #c8e6c9; }
  .desc { color: #555; font-size: 14px; line-height: 1.6; margin: 12px 0 20px; }
  .section { margin: 20px 0; border-top: 1px solid #eee; padding-top: 16px; }
  .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin: 0 0 10px; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 6px 0; font-size: 13px; vertical-align: top; }
  td:first-child { font-weight: 600; color: #666; width: 120px; }
  a { color: #6c5ce7; text-decoration: none; }
  .social-link { display: inline-block; padding: 4px 10px; margin: 2px 4px 2px 0; border-radius: 6px; font-size: 12px; background: #f5f5f5; border: 1px solid #ddd; }
  .footer { margin-top: 30px; padding-top: 16px; border-top: 2px solid #eee; text-align: center; font-size: 11px; color: #aaa; }
</style>
</head>
<body>
  <h1>${profile.companyName}</h1>
  <div class="badges">
    ${profile.city ? `<span class="badge badge-city">${profile.city}, Pakistan</span>` : ""}
    ${profile.industry ? `<span class="badge badge-industry">${profile.industry}</span>` : ""}
    <span class="badge badge-score">Score: ${profile.confidenceScore}/100</span>
    ${profile.verified ? `<span class="badge verified">Verified</span>` : ""}
  </div>
  ${profile.description ? `<p class="desc">${profile.description}</p>` : ""}

  <div class="section">
    <div class="section-title">Contact Information</div>
    <table>
      ${profile.officialWebsite ? `<tr><td>Website</td><td><a href="${profile.officialWebsite}">${profile.officialWebsite}</a></td></tr>` : ""}
      ${emails.map(e => `<tr><td>Email</td><td><a href="mailto:${e}">${e}</a></td></tr>`).join("")}
      ${phones.map(p => `<tr><td>Phone</td><td>${p}</td></tr>`).join("")}
      ${profile.fullAddress ? `<tr><td>Address</td><td>${profile.fullAddress}</td></tr>` : ""}
      ${profile.foundedYear ? `<tr><td>Founded</td><td>${profile.foundedYear}</td></tr>` : ""}
      ${profile.employeeCount ? `<tr><td>Employees</td><td>${profile.employeeCount}</td></tr>` : ""}
    </table>
  </div>

  ${allSocials.length > 0 ? `
  <div class="section">
    <div class="section-title">Social Media</div>
    ${allSocials.map(s => `<span class="social-link"><strong>${s.name}:</strong> <a href="${s.url}">${s.url}</a></span>`).join("<br>")}
  </div>` : ""}

  <div class="section">
    <div class="section-title">Data Sources</div>
    <p style="font-size:12px;color:#888;margin:0">Confidence Score: ${profile.confidenceScore}/100 | Extracted by Pakistan BizIntel</p>
  </div>

  <div class="footer">
    Generated by Pakistan BizIntel &mdash; github.com/arqam66/extracter<br>
    Report generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
  </div>
</body>
</html>`;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  }
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function SearchResult({ profile }: { profile: Profile }) {
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
  ].filter(s => s.url);

  const emails = [
    { label: "General", value: profile.generalEmail },
    { label: "Support", value: profile.supportEmail },
    { label: "Sales", value: profile.salesEmail },
    { label: "HR", value: profile.hrEmail },
  ].filter(e => e.value);

  const phones = [
    { label: "Office", value: profile.officePhone },
    { label: "Mobile", value: profile.mobilePhone },
    { label: "WhatsApp", value: profile.whatsappPhone },
  ].filter(p => p.value);

  return (
    <div className="glass-card fade-in-up" style={{ padding: 0, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "28px 32px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "'Outfit', sans-serif", margin: 0 }}>{profile.companyName}</h2>
            {profile.verified && icons.verified}
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            {profile.city && <span className="badge-city" style={{ padding: "3px 10px", borderRadius: 6, fontSize: "0.75rem", fontWeight: 600, background: "rgba(108, 92, 231, 0.1)", color: "var(--accent-purple)", border: "1px solid rgba(108, 92, 231, 0.2)" }}>{profile.city}, Pakistan</span>}
            {profile.industry && <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: "0.75rem", fontWeight: 600, background: "rgba(255, 152, 0, 0.1)", color: "var(--accent-orange)", border: "1px solid rgba(255, 152, 0, 0.2)" }}>{profile.industry}</span>}
            {profile.foundedYear && <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: "0.75rem", fontWeight: 600, background: "rgba(0, 188, 212, 0.1)", color: "var(--accent-cyan)", border: "1px solid rgba(0, 188, 212, 0.2)" }}>Est. {profile.foundedYear}</span>}
            {profile.employeeCount && <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: "0.75rem", fontWeight: 600, background: "rgba(76, 175, 80, 0.1)", color: "var(--accent-green)", border: "1px solid rgba(76, 175, 80, 0.2)" }}>{profile.employeeCount}</span>}
          </div>
          {profile.description && <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0, maxWidth: 600 }}>{profile.description}</p>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <ConfidenceRing score={profile.confidenceScore} />
          <button data-testid="download-pdf" onClick={() => downloadPDF(profile)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 8, fontSize: "0.75rem", fontWeight: 600, background: "var(--gradient-1)", color: "white", border: "none", cursor: "pointer" }}>
            {icons.download} PDF
          </button>
        </div>
      </div>

      <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* ── All Contact Info Inline ─────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          {/* Website */}
          {profile.officialWebsite && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--bg-secondary)", borderRadius: 10, border: "1px solid var(--border)" }}>
              <span style={{ color: "var(--accent-blue)" }}>{icons.globe}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 1 }}>Website</div>
                <a href={profile.officialWebsite} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-blue)", textDecoration: "none", fontSize: "0.82rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                  {profile.officialWebsite.replace(/https?:\/\//, "").replace(/\/$/, "")} {icons.externalLink}
                </a>
              </div>
              <CopyButton text={profile.officialWebsite} />
            </div>
          )}

          {/* All Emails - inline */}
          {emails.map(email => (
            <div key={email.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--bg-secondary)", borderRadius: 10, border: "1px solid var(--border)" }}>
              <span style={{ color: "var(--accent-purple)" }}>{icons.mail}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 1 }}>{email.label}</div>
                <span style={{ fontSize: "0.82rem", color: "var(--text-primary)", wordBreak: "break-all" }}>{email.value}</span>
              </div>
              <CopyButton text={email.value!} />
            </div>
          ))}

          {/* All Phones - inline */}
          {phones.map(phone => (
            <div key={phone.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--bg-secondary)", borderRadius: 10, border: "1px solid var(--border)" }}>
              <span style={{ color: phone.label === "WhatsApp" ? "#25D366" : "var(--accent-green)" }}>{icons.phone}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 1 }}>{phone.label}</div>
                <span style={{ fontSize: "0.82rem", color: "var(--text-primary)" }}>{phone.value}</span>
              </div>
              <CopyButton text={phone.value!} />
            </div>
          ))}

          {/* Address */}
          {profile.fullAddress && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--bg-secondary)", borderRadius: 10, border: "1px solid var(--border)" }}>
              <span style={{ color: "var(--accent-orange)" }}>{icons.mapPin}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 1 }}>Address</div>
                <span style={{ fontSize: "0.82rem", color: "var(--text-primary)" }}>{profile.fullAddress}</span>
              </div>
              <CopyButton text={profile.fullAddress} />
            </div>
          )}
        </div>

        {/* ── Social Media ────────────────────────────────────────── */}
        {socials.length > 0 && (
          <div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, fontWeight: 600 }}>
              Social Media ({socials.length} platforms)
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {socials.map(s => (
                <a key={s.key} href={s.url!} target="_blank" rel="noopener noreferrer" className="social-badge" style={{ borderColor: `${socialColors[s.key]}30` }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: socialColors[s.key], display: "inline-block" }} />
                  {s.name}
                  {icons.externalLink}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
