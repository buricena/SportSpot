import "./globals.css";
import { AuthProvider } from "../lib/AuthProvider";
import Navbar from "./components/Navbar";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "SportSpot",
  description: "Explore sports events on an interactive map and find activities near you.",
   icons: {
    icon: "/land-plot.png", // ovo koristi tvoj skinuti LandPlot SVG kao favicon
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<html lang="en">
  <body>
    <AuthProvider>
      <Navbar />
      {children}
    </AuthProvider>
  </body>
</html>

  );
}
