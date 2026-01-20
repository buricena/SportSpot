"use client";

import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LandPlot } from "lucide-react";
import "leaflet/dist/leaflet.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // za aktivni link

  return (
    <html lang="en">
      <body>
        <header className="navbar">
          {/* LOGO */}
          <div className="logo">
            <Link
              href="/"
              className="logo-link"
              style={{
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <LandPlot
                size={24}
                style={{
                  marginRight: "8px",
                  background: "#FF6B35",
                  color: "white",
                  borderRadius: "30%",
                  padding: "4px",
                  display: "inline-flex",
                  verticalAlign: "middle",
                }}
              />
              SportSpot
            </Link>
          </div>

          {/* NAV LINKS */}
          <nav className="navbar-center">
            <Link
              href="/events"
              className={pathname === "/events" ? "active" : ""}
            >
              Events
            </Link>
            <Link
              href="/map"
              className={pathname === "/map" ? "active" : ""}
            >
              Map
            </Link>
            <Link
              href="/results"
              className={pathname === "/results" ? "active" : ""}
            >
              Results
            </Link>
          </nav>

          <button className="signin-btn">Sign In</button>
        </header>

        {children}
      </body>
    </html>
  );
}
