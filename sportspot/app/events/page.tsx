"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import styles from "./events.module.css";

type Event = {
  id: number;
  title: string;
  body: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      const data = await res.json();
      setEvents(data);
    }

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(search.toLowerCase()) ||
    event.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className={styles.page}>
      {/* HERO HEADER */}
      <header className={styles.header}>
        <h1>Upcoming Sports Events</h1>
        <p className={styles.subtitle}>
          Discover upcoming events, search by interest, or create your own.
        </p>

        {/* ACTION BAR */}
     <div className={styles.actions}>
  <div className={styles.searchWrapper}>
    <input
      type="text"
      placeholder="Search events..."
      value={search}
      onChange={e => setSearch(e.target.value)}
      className={styles.search}
    />
  </div>
</div>

      </header>

      {/* SECTION HEADER */}
      <section className={styles.sectionHeader}>
        <h2>Upcoming Events</h2>
        <span>{filteredEvents.length} events</span>
      </section>

      {/* EVENTS GRID */}
      <section className={styles.grid}>
        {filteredEvents.slice(0, 12).map(event => (
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

        {filteredEvents.length === 0 && (
          <p className={styles.empty}>No events found.</p>
        )}
      </section>

      {/* FLOATING ADD EVENT BUTTON */}
      <Link
        href="/add-event"
        className={styles.addButton}
        aria-label="Create event"
      >
        <Plus size={28} strokeWidth={2.5} />
      </Link>
    </main>
  );
}
