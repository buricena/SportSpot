import Link from "next/link";
import styles from "./events.module.css";

type Event = {
  id: number;
  title: string;
  body: string;
};

async function getEvents(): Promise<Event[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    cache: "no-store",
  });
  return res.json();
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <h1>Browse Events</h1>
        <p className={styles.subtitle}>
          Discover upcoming sports events and join the ones you like.
        </p>
      </header>

      {/* EVENTS GRID */}
      <section className={styles.grid}>
        {events.slice(0, 12).map(event => (
          <div key={event.id} className={styles.card}>
            <span className={styles.tag}>Sport Event</span>

            <h3 className={styles.title}>{event.title}</h3>

            <p className={styles.description}>
              {event.body.slice(0, 90)}...
            </p>

            <div className={styles.footer}>
              <span className={styles.status}>Upcoming</span>

              <Link href={`/events/${event.id}`} className={styles.link}>
                View details →
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* Plus Button for Adding Event */}
      <Link href="/add-event" className={styles.addButton}>
        +
      </Link>
    </main>
  );
}
