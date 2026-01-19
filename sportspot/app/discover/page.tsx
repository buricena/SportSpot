import styles from "./discover.module.css";
import Link from "next/link";

export default function DiscoverPage() {
  return (
    <main className={styles.page}>
      {/* PAGE HEADER */}
      <section className={styles.hero}>
        <h1>Discover Sports Near You</h1>
        <p>
          Find games, events and players in your area and join the action.
        </p>
      </section>

      {/* BROWSE BY SPORT – PRVO */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Browse by Sport</h2>

        <div className={styles.sportsGrid}>
          <div className={styles.sportCard}>⚽ Football</div>
          <div className={styles.sportCard}>🏀 Basketball</div>
          <div className={styles.sportCard}>🎾 Tennis</div>
        </div>
      </section>

      {/* FEATURED EVENTS – DRUGO */}
      <section className={styles.sectionAlt}>
        <h2 className={styles.sectionTitle}>Featured Events</h2>

        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h3>5v5 Football Match</h3>
            <p>📍 Central Park</p>
            <p>📅 Saturday</p>
            <Link href="/events/1" className={styles.cardLink}>
              View Event →
            </Link>
          </div>

          <div className={styles.card}>
            <h3>Basketball Pickup Game</h3>
            <p>📍 Downtown Court</p>
            <p>📅 Sunday</p>
            <Link href="/events/2" className={styles.cardLink}>
              View Event →
            </Link>
          </div>
        </div>

        {/* SECONDARY CTA */}
        <div className={styles.moreWrapper}>
          <Link href="/events" className={styles.moreLink}>
            Browse all events →
          </Link>
        </div>
      </section>
    </main>
  );
}
