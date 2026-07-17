import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pakistan BizIntel — Business Intelligence & Contact Extraction",
  description:
    "Extract verified business contacts, emails, phone numbers, and social media profiles across Pakistan — organized by city and industry.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Inter', 'Outfit', system-ui, sans-serif", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Background decoration */}
        <div
          className="floating-orb"
          style={{
            width: 400,
            height: 400,
            background: "var(--accent-purple)",
            top: "-10%",
            left: "-5%",
          }}
        />
        <div
          className="floating-orb"
          style={{
            width: 300,
            height: 300,
            background: "var(--accent-cyan)",
            bottom: "10%",
            right: "-5%",
            animationDelay: "3s",
          }}
        />
        <div
          className="floating-orb"
          style={{
            width: 200,
            height: 200,
            background: "var(--accent-pink)",
            top: "50%",
            left: "50%",
            animationDelay: "5s",
          }}
        />

        <main
          style={{
            position: "relative",
            zIndex: 1,
            flex: 1,
            padding: "0 16px",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
