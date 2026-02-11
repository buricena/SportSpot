"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "./results.module.css";

type Review = {
  rating: number;
  comment: string | null;
};

type EventWithReviews = {
  id: string;
  title: string;
  event_date: string;
  reviews: Review[];
};

export default function ResultsPage() {
  const [events, setEvents] = useState<EventWithReviews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    const { data, error } = await supabase
      .from("events")
      .select(`
        id,
        title,
        event_date,
        event_reviews (
          rating,
          comment
        )
      `)
      .lt("event_date", new Date().toISOString())
      .order("event_date", { ascending: false });

    if (error) {
      console.error("Error fetching results:", error);
      setLoading(false);
      return;
    }

    const mapped: EventWithReviews[] =
      data?.map((e: any) => ({
        id: e.id,
        title: e.title,
        event_date: e.event_date,
        reviews: e.event_reviews ?? [],
      })) ?? [];

    setEvents(mapped);
    setLoading(false);
  };

  const getAverageRating = (reviews: Review[]) => {
    if (reviews.length === 0) return null;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return <p className={styles.loading}>Loading results…</p>;
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Results</h1>
      <p className={styles.subtitle}>
        Results and reviews from past events
      </p>

      {events.length === 0 && (
        <p className={styles.empty}>No past events yet.</p>
      )}

      <div className={styles.grid}>
        {events.map(event => {
          const avg = getAverageRating(event.reviews);

          return (
            <div key={event.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.eventTitle}>
                  {event.title}
                </h3>
                <span className={styles.date}>
                  {new Date(event.event_date).toLocaleDateString("hr-HR")}
                </span>
              </div>

              <div className={styles.reviews}>
                {event.reviews.length === 0 ? (
                  <p className={styles.noReviews}>
                    No reviews yet
                  </p>
                ) : (
                  <>
                    <div className={styles.ratingSummary}>
                      ⭐ {avg} / 5
                      <span className={styles.reviewCount}>
                        ({event.reviews.length})
                      </span>
                    </div>

                    <ul className={styles.reviewList}>
                      {event.reviews.map((r, i) => (
                        <li key={i} className={styles.reviewItem}>
                          <strong>⭐ {r.rating}</strong>
                          {r.comment && <p>{r.comment}</p>}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
