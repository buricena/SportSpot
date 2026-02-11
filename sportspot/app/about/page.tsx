import Link from "next/link";
import { Info } from "lucide-react";
import styles from "./about.module.css";

export default function AboutPage() {
  return (
    <main className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.icon}>
          <Info size={22} />
        </div>
        <div>
          <h1>About SportSpot</h1>
          <p>Learn more about the idea behind the platform</p>
        </div>
      </header>

      {/* CONTENT */}
      <section className={styles.card}>
        <p>
          <strong>SportSpot</strong> is a web application designed to connect
          people through local, non-professional sports events. The goal of the
          platform is to make discovering, joining and organizing sports
          activities simple and accessible to everyone.
        </p>

        <p>
          Users can explore events on an interactive map, join activities, leave
          reviews after participation and track event results. Event organizers
          are able to create and manage events, publish results and receive
          feedback from participants.
        </p>

        <p>
          SportSpot was developed as part of a university project with a strong
          focus on modern web technologies, clean user interface design and
          real-world application use cases.
        </p>

        {/* CTA */}
        <div className={styles.cta}>
          <Link href="/events" className={styles.ctaBtn}>
            Explore Events
          </Link>
        </div>
      </section>
    </main>
  );
}
