"use client";

import { useEffect, useState } from "react";
import RequireAuth from "../../components/RequireAuth";
import { supabase } from "../../../lib/supabaseClient";
import styles from "../profile.module.css";

type Event = {
  id: number;
  title: string;
  body: string;
};

export default function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1️⃣ dohvati joined event ID-e
      const { data: joins } = await supabase
        .from("event_participants")
        .select("external_event_id")
        .eq("user_id", user.id);

      if (!joins || joins.length === 0) {
        setEvents([]);
        return;
      }

      const ids = joins.map(j => j.external_event_id);

      // 2️⃣ dohvati evente iz API-ja
      const res = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      const allEvents: Event[] = await res.json();

      const joinedEvents = allEvents.filter(e =>
        ids.includes(e.id)
      );

      setEvents(joinedEvents);
    };

    load();
  }, []);

  return (
    <RequireAuth>
      <main className={styles.container}>
        <h1 className={styles.title}>My Events</h1>

        {events.length === 0 && <p>No joined events yet.</p>}

        <div className={styles.cards}>
          {events.map(event => (
            <div key={event.id} className={styles.card}>
              <h3>{event.title}</h3>
              <p>{event.body.slice(0, 80)}...</p>
            </div>
          ))}
        </div>
      </main>
    </RequireAuth>
  );
}
