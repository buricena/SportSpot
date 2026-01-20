"use client";

import Link from "next/link";
import { LandPlot, User } from "lucide-react";
import { useAuth } from "../../lib/AuthProvider";
import { supabase } from "../../lib/supabaseClient";

export default function Navbar() {
  const { user, loading } = useAuth();

  if (loading) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
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
            }}
          />
          SportSpot
        </Link>
      </div>

      {/* CENTER NAV */}
      <nav className="navbar-center">
        <Link href="/events">Events</Link>
        <Link href="/map">Map</Link>
        <Link href="/results">Results</Link>
      </nav>

      {/* RIGHT ACTIONS */}
      <div className="navbar-actions">
        {!user ? (
          <Link href="/login">
            <button className="signin-btn">Sign In</button>
          </Link>
        ) : (
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Link
              href="/profile"
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <User size={20} />
              Profile
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
