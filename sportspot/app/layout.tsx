import "./globals.css";
import { AuthProvider } from "../lib/AuthProvider";
import Navbar from "./components/Navbar";

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
