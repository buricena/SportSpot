import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import styles from "./contact.module.css";

export default function ContactPage() {
  return (
    <main className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.icon}>
          <Mail size={22} />
        </div>
        <div>
          <h1>Contact</h1>
          <p>Get in touch with the SportSpot team</p>
        </div>
      </header>

      {/* CONTENT */}
      <section className={styles.card}>
        <p>
          If you have any questions, suggestions or feedback regarding the
          SportSpot platform, feel free to contact us.
        </p>

        <div className={styles.contactList}>
          <div className={styles.contactItem}>
            <Mail size={18} />
            <span>sportspot.app@gmail.com</span>
          </div>

        </div>

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
