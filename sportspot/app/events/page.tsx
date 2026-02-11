"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Calendar, MapPin } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { useRouter } from "next/navigation";
import styles from "./events.module.css";

type Event = {
  id: string;
  title: string;
  description: string;
  sport: string;
  event_date: string;
  location: string;
};

type Tab = "upcoming" | "past";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { user } = useAuth();
const router = useRouter();


  const [upcomingCount, setUpcomingCount] = useState(0);
  const [pastCount, setPastCount] = useState(0);

  useEffect(() => {
    fetchEvents();
  }, [activeTab]);

  async function fetchEvents() {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];

    // 👉 COUNTOVI ZA TABOVE
    const { data: upcoming } = await supabase
      .from("events")
      .select("id")
      .gte("event_date", today);

    const { data: past } = await supabase
      .from("events")
      .select("id")
      .lt("event_date", today);

    setUpcomingCount(upcoming?.length ?? 0);
    setPastCount(past?.length ?? 0);

    // 👉 EVENTI ZA AKTIVNI TAB
    const query =
      activeTab === "upcoming"
        ? supabase
            .from("events")
            .select("*")
            .gte("event_date", today)
            .order("event_date", { ascending: true })
        : supabase
            .from("events")
            .select("*")
            .lt("event_date", today)
            .order("event_date", { ascending: false });

    const { data } = await query;
    setEvents(data || []);
    setLoading(false);
  }

  const filtered = events.filter(e =>
    `${e.title} ${e.sport} ${e.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <span className={styles.kicker}>EVENTS</span>
        <h1>Discover Sports Events</h1>
        <p className={styles.subtitle}>
          Browse upcoming and past sports events. Find your next game,
          tournament, or match.
        </p>

        <div className={styles.topBar}>
          <input
            className={styles.search}
            placeholder="Search events by name, sport, or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className={styles.actions}>
 <div className={styles.tabs}>
  <div
    className={`${styles.slider} ${
      activeTab === "past" ? styles.slideRight : styles.slideLeft
    }`}
  />

  <button
    className={`${styles.tab} ${
      activeTab === "upcoming" ? styles.activeText : ""
    }`}
    onClick={() => setActiveTab("upcoming")}
  >
    Upcoming <span>{upcomingCount}</span>
  </button>

  <button
    className={`${styles.tab} ${
      activeTab === "past" ? styles.activeText : ""
    }`}
    onClick={() => setActiveTab("past")}
  >
    Past <span>{pastCount}</span>
  </button>
</div>

            <Link href="/events/create" className={styles.addBtn}>
              + Add Event
            </Link>
          </div>
        </div>
      </header>

      {/* GRID */}
      {loading && <p>Loading events...</p>}

      <section className={styles.grid}>
        {filtered.map(event => (
          <Link
            href={`/events/${event.id}`}
            key={event.id}
            className={styles.card}
          >
            <div className={styles.cardTop}>
              <span className={styles.sport}>{event.sport}</span>

              <span
                className={`${styles.status} ${
                  activeTab === "past" ? styles.past : styles.upcoming
                }`}
              >
                {activeTab === "past" ? "Past" : "Upcoming"}
              </span>
            </div>

            <h3>{event.title}</h3>
            <p className={styles.desc}>{event.description}</p>

            <div className={styles.meta}>
              <span className={styles.metaItem}>
                <Calendar size={14} className={styles.metaIcon} />
                {new Date(event.event_date).toLocaleDateString("hr-HR")}
              </span>

              <span className={styles.metaItem}>
                <MapPin size={14} className={styles.metaIcon} />
                {event.location}
              </span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
