"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "../profile.module.css";

type MyEvent = {
  id: string;
  title: string;
  event_date: string;
};

export default function MyEvents() {
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [toLeave, setToLeave] = useState<MyEvent | null>(null);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("event_participants")
      .select(`
        events (
          id,
          title,
          event_date
        )
      `)
      .eq("user_id", user.id);

    if (!error) {
      const mapped =
        data?.map((row: any) => row.events).filter(Boolean) ?? [];
      setEvents(mapped);
    }

    setLoading(false);
  };

  const confirmLeave = async () => {
    if (!toLeave) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("event_participants")
      .delete()
      .eq("user_id", user.id)
      .eq("event_id", toLeave.id);

    setEvents(prev => prev.filter(e => e.id !== toLeave.id));
    setToLeave(null);
  };

  const now = new Date();

  const upcoming = events.filter(
    e => new Date(e.event_date) >= now
  );
  const past = events.filter(
    e => new Date(e.event_date) < now
  );

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>My Events</h1>
      <p className={styles.subtitle}>Events you have joined</p>

      {loading && <p>Loading events...</p>}

      {!loading && events.length === 0 && (
        <p className={styles.empty}>
          You haven’t joined any events yet.
        </p>
      )}

      {/* UPCOMING */}
      {upcoming.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Upcoming</h2>
          <div className={styles.eventsGrid}>
            {upcoming.map(event => (
              <div key={event.id} className={styles.eventCard}>
                <h3 className={styles.eventTitle}>{event.title}</h3>
                <span className={styles.eventMeta}>
                  {new Date(event.event_date).toLocaleDateString("hr-HR")}
                </span>

                <button
                  className={styles.primaryBtn}
                  style={{ marginTop: "0.8rem" }}
                  onClick={() => setToLeave(event)}
                >
                  Leave event
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PAST */}
      {past.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Past</h2>
          <div className={styles.eventsGrid}>
            {past.map(event => (
              <div
                key={event.id}
                className={`${styles.eventCard} ${styles.past}`}
              >
                <h3 className={styles.eventTitle}>{event.title}</h3>
                <span className={styles.eventMeta}>
                  {new Date(event.event_date).toLocaleDateString("hr-HR")}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONFIRM MODAL */}
      {toLeave && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p>
              Are you sure you want to leave
              <br />
              <b>{toLeave.title}</b>?
            </p>

            <div className={styles.modalActions}>
              <button
                className={styles.secondaryBtn}
                onClick={() => setToLeave(null)}
              >
                Cancel
              </button>
              <button
                className={styles.primaryBtn}
                onClick={confirmLeave}
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
