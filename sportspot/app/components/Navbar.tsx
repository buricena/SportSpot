"use client";

import Link from "next/link";
import { LandPlot, User } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  // MOCK LOGIN STATE
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="navbar">
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

      <nav className="navbar-center">
        <Link href="/events">Events</Link>
        <Link href="/map">Map</Link>
        <Link href="/results">Results</Link>
      </nav>

      {/* RIGHT SIDE */}
      {!isLoggedIn ? (
        <Link href="/login" className="signin-btn">
          Sign In
        </Link>
      ) : (
        <Link href="/profile" className="profile-btn">
          <User size={18} style={{ marginRight: "6px" }} />
          My Profile
        </Link>
      )}

      {/* TEMP BUTTON – SAMO ZA TEST */}
      <button
        onClick={() => setIsLoggedIn(prev => !prev)}
        style={{
          marginLeft: "1rem",
          fontSize: "0.7rem",
          opacity: 0.5,
        }}
      >
        toggle login
      </button>
    </header>
  );
}
