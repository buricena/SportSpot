"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
} from "lucide-react";

import styles from "./my-events.module.css";

type MyEvent = {
  id: string;
  title: string;
  sport: string;
  location: string;
  event_date: string;
};

export default function MyEvents() {
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [toLeave, setToLeave] = useState<MyEvent | null>(null);

  const router = useRouter();

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
          sport,
          location,
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

  if (loading) {
    return <p>Loading events…</p>;
  }

  return (
    <div className={styles.wrapper}>
      {/* EMPTY STATE */}
      {events.length === 0 && (
        <p>You haven’t joined any events yet.</p>
      )}

      {/* UPCOMING EVENTS */}
      {upcoming.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Upcoming</h2>
            <span className={styles.sectionCount}>
              {upcoming.length}
            </span>
          </div>

          <div className={styles.grid}>
            {upcoming.map(event => (
              <div
                key={event.id}
                className={styles.card}
                onClick={() =>
                  router.push(`/events/${event.id}`)
                }
                role="button"
              >
                <div>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.title}>{event.title}</h3>
                    <span className={styles.badge}>
                      {event.sport}
                    </span>
                  </div>

                  <div className={styles.meta}>
                    <div className={styles.metaRow}>
                      <Calendar size={16} />
                      {new Date(event.event_date).toLocaleDateString("hr-HR")}
                    </div>

                    <div className={styles.metaRow}>
                      <MapPin size={16} />
                      {event.location}
                    </div>

                    <div className={styles.metaRow}>
                      <Users size={16} />
                      participants
                    </div>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button
                    className={styles.leave}
                    onClick={(e) => {
                      e.stopPropagation();
                      setToLeave(event);
                    }}
                  >
                    Leave Event
                  </button>

                  <button
                    className={styles.details}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/events/${event.id}`);
                    }}
                  >
                    Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PAST EVENTS */}
      {past.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Past Events</h2>
            <span className={styles.sectionCount}>
              {past.length}
            </span>
          </div>

          <div className={styles.grid}>
            {past.map(event => (
              <div
                key={event.id}
                className={`${styles.card} ${styles.past}`}
                onClick={() =>
                  router.push(`/events/${event.id}`)
                }
                role="button"
              >
                <div>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.title}>{event.title}</h3>
                    <span className={styles.badge}>
                      {event.sport}
                    </span>
                  </div>

                  <div className={styles.meta}>
                    <div className={styles.metaRow}>
                      <Calendar size={16} />
                      {new Date(event.event_date).toLocaleDateString("hr-HR")}
                    </div>

                    <div className={styles.metaRow}>
                      <MapPin size={16} />
                      {event.location}
                    </div>
                  </div>
                </div>

                <div className={styles.actions}>
                  <span />
                  <button
                    className={styles.details}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/events/${event.id}`);
                    }}
                  >
                    Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONFIRM LEAVE MODAL */}
      {toLeave && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p>
              Are you sure you want to leave <br />
              <b>{toLeave.title}</b>?
            </p>

            <div className={styles.modalActions}>
              <button onClick={() => setToLeave(null)}>
                Cancel
              </button>

              <button onClick={confirmLeave}>
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
