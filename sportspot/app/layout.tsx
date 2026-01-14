import "./globals.css";
import Link from "next/link";
import { LandPlot, Radius } from "lucide-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="navbar">
          <div className="logo">
             <Link href="/" className="logo-link" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
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
          

          <nav className="navbar-center">
            <Link href="/discover">Discover</Link>
            <Link href="/events">Events</Link>
            <Link href="/map">Map</Link>
            <Link href="/results">Results</Link>
          </nav>

          <button className="signin-btn">Sign In</button>
        </header>

        {children}
      </body>
    </html>
  );
}
