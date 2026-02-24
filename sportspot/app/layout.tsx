import "./globals.css";
import { AuthProvider } from "../lib/AuthProvider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SportSpot",
  description:
    "Explore sports events on an interactive map and find activities near you.",
  icons: {
    icon: "/land-plot.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="app-layout">
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}