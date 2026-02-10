"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "./results.module.css";

type EventResult = {
  comment: string;
  created_at: string;
};

type Event = {
  id: string;
  title: string;
  event_date: string;
  organizer_id: string;
  event_results: EventResult[];
};

export default function ResultsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: auth } = await supabase.auth.getUser();
    setUserId(auth.user?.id ?? null);

    const { data } = await supabase
      .from("events")
      .select(`
        id,
        title,
        event_date,
        organizer_id,
        event_results (
          comment,
          created_at
        )
      `)
      .lt("event_date", new Date().toISOString())
      .order("event_date", { ascending: false });

    setEvents(data ?? []);
    setLoading(false);
  }

  async function saveResult(eventId: string) {
    const text = comments[eventId];
    if (!text || !text.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    const { error } = await supabase.from("event_results").insert({
      event_id: eventId,
      comment: text,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setComments(prev => ({ ...prev, [eventId]: "" }));
    loadData();
  }

  if (loading) {
    return <main className={styles.page}>Loading results…</main>;
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Event Results</h1>
      <p className={styles.subtitle}>
        Results and comments from past events
      </p>

      <div className={styles.list}>
        {events.map(event => {
          const isOrganizer = userId === event.organizer_id;
          const hasResult = event.event_results.length > 0;

          return (
            <div key={event.id} className={styles.card}>
              <div className={styles.header}>
                <h3>{event.title}</h3>
                <span>
                  {new Date(event.event_date).toLocaleDateString("hr-HR")}
                </span>
              </div>

              {/* RESULT */}
              {hasResult ? (
                <p className={styles.comment}>
                  {event.event_results[0].comment}
                </p>
              ) : (
                <p className={styles.muted}>Result not added yet</p>
              )}

              {/* ORGANIZER FORM */}
              {isOrganizer && !hasResult && (
                <div className={styles.form}>
                  <textarea
                    placeholder="Write how the event went…"
                    value={comments[event.id] || ""}
                    onChange={e =>
                      setComments(prev => ({
                        ...prev,
                        [event.id]: e.target.value,
                      }))
                    }
                    rows={3}
                  />

                  <button onClick={() => saveResult(event.id)}>
                    Save comment
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
