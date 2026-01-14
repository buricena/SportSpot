import "./globals.css";
import Link from "next/link";

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
            <span className="logo-icon">⚽</span>
            SportSpot
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
