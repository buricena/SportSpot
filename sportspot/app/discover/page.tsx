import styles from "./discover.module.css";
import Link from "next/link";

export default function DiscoverPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>Discover Sports Near You</h1>
        <p className={styles.subtitle}>
          Explore featured events and popular sports around you.
        </p>
      </header>

      <section className={styles.section}>
        <h2>Featured Events</h2>
        <div className={styles.featuredGrid}>
          <div className={styles.card}>
            <h3>5v5 Football Match</h3>
            <p>Central Park • Saturday</p>
            <Link href="/events/1">View Event</Link>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Browse by Sport</h2>
        <div className={styles.sportsGrid}>
          <div className={styles.sport}>⚽ Football</div>
          <div className={styles.sport}>🏀 Basketball</div>
          <div className={styles.sport}>🎾 Tennis</div>
        </div>
      </section>

      <section className={styles.cta}>
        <h2>Looking for more events?</h2>
        <Link href="/events">Browse all events</Link>
      </section>
    </main>
  );
}
