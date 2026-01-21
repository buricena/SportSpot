"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "../profile.module.css";

type Review = {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  events: {
    title: string;
  }[] | null;
};

export default function MyReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("reviews")
      .select(`
        id,
        rating,
        comment,
        created_at,
        events (
          title
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("REVIEWS FETCH ERROR:", error);
      setReviews([]);
      setLoading(false);
      return;
    }

    // ✅ SANITIZE DATA (ključ za Vercel crash fix)
    const safeData: Review[] =
      data?.map((r: any) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at,
        events: r.events ?? [],
      })) ?? [];

    setReviews(safeData);
    setLoading(false);
  };

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading reviews…</p>;
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>My Reviews</h1>
      <p className={styles.subtitle}>Your reviews and ratings</p>

      {reviews.length === 0 && (
        <p className={styles.empty}>
          You haven’t written any reviews yet.
        </p>
      )}

      <div className={styles.eventsGrid}>
        {reviews.map(review => (
          <div key={review.id} className={styles.eventCard}>
            <h3 className={styles.eventTitle}>
              {review.events?.[0]?.title ?? "Unknown event"}
            </h3>

            <div className={styles.eventMeta}>
              ⭐ {review.rating} / 5
            </div>

            <p style={{ marginTop: "0.6rem" }}>
              {review.comment || "No comment provided."}
            </p>

            <span
              className={styles.eventMeta}
              style={{ marginTop: "0.6rem", display: "block" }}
            >
              {new Date(review.created_at).toLocaleDateString("hr-HR")}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
