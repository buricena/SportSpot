"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import styles from "./register.module.css";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [favoriteSport, setFavoriteSport] = useState("Football");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setError(null);
    setLoading(true);

    /* 1️⃣ CREATE AUTH USER */
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError || !data.user) {
      setError(signUpError?.message || "Registration failed");
      setLoading(false);
      return;
    }

    /* 2️⃣ INSERT PROFILE (⚠️ favorite_sport MORA BITI ARRAY) */
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        name,
        favorite_sport: [favoriteSport], // ✅ KLJUČNI FIX
      });

    if (profileError) {
      console.error(profileError);
      setError("Profile creation failed. Please try again.");
      setLoading(false);
      return;
    }

    /* 3️⃣ REDIRECT */
    router.push("/profile");
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1>Create Account</h1>
        <p className={styles.subtitle}>
          Join SportSpot and discover sports events near you
        </p>

        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <label>
            Name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </label>

          <label>
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label>
            Password
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
            />
          </label>

          <label>
            Favorite sport
            <select
              value={favoriteSport}
              onChange={(e) => setFavoriteSport(e.target.value)}
            >
              <option>Football</option>
              <option>Basketball</option>
              <option>Tennis</option>
              <option>Volleyball</option>
              <option value="None">None of the above</option>
            </select>
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
