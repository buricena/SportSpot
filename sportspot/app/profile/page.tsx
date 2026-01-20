"use client";
import RequireAuth from "../components/RequireAuth";

import Link from "next/link";
import styles from "./profile.module.css";

export default function ProfilePage() {
  return (
    <RequireAuth>
    <main className={styles.container}>
      <h1 className={styles.title}>My Profile</h1>
      <p className={styles.subtitle}>
        Welcome back, <strong>Ena</strong>
      </p>

      <div className={styles.grid}>
        <Link href="/profile/my-events" className={styles.card}>
          <h3>My Events</h3>
          <p>Events you joined or participated in</p>
        </Link>

        <Link href="/profile/my-reviews" className={styles.card}>
          <h3>My Reviews</h3>
          <p>Your reviews and ratings</p>
        </Link>

        <Link href="/profile/personal-information" className={styles.card}>
          <h3>Personal Info</h3>
          <p>Edit your personal information</p>
        </Link>

        <Link href="/profile/sports-preferences" className={styles.card}>
          <h3>Sport Preferences</h3>
          <p>Select your favorite sports</p>
        </Link>
      </div>
    </main>
    </RequireAuth>
  );
}
