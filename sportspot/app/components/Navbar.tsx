"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LandPlot } from "lucide-react";
import { useAuth } from "../../lib/AuthProvider";
import { supabase } from "../../lib/supabaseClient";

export default function Navbar() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [initials, setInitials] = useState<string>("");

  useEffect(() => {
    if (!user) {
      setInitials("");
      return;
    }

    const loadProfileInitials = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();

      if (data?.name) {
        const parts = data.name.trim().split(" ");
        setInitials(
          parts
            .slice(0, 2)
.map((p: string) => p[0].toUpperCase())            .join("")
        );
      } else if (user.email) {
        setInitials(user.email[0].toUpperCase());
      }
    };

    loadProfileInitials();
  }, [user]);

  if (loading) return null;

const handleLogout = async () => {
  await supabase.auth.signOut();
  window.location.href = "/";
};

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <header className="navbar">
      {/* LOGO */}
      <div className="logo">
        <Link
          href="/"
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
            }}
          />
          SportSpot
        </Link>
      </div>

      {/* CENTER NAV */}
      <nav className="navbar-center">
        <Link href="/" className={isActive("/") ? "active" : ""}>
          Home
        </Link>

        <Link href="/events" className={isActive("/events") ? "active" : ""}>
          Events
        </Link>

        <Link href="/map" className={isActive("/map") ? "active" : ""}>
          Map
        </Link>

        <Link href="/results" className={isActive("/results") ? "active" : ""}>
          Results
        </Link>
      </nav>

      {/* RIGHT ACTIONS */}
      <div className="navbar-actions">
        {!user ? (
          <Link href="/login">
            <button className="signin-btn">Sign In</button>
          </Link>
        ) : (
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Link href="/profile" className="profile-avatar">
              {initials || "U"}
            </Link>

            <button className="signin-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}