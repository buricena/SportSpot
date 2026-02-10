"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "./my-reviews.module.css";

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
    loadReviews();
  }, []);

  const loadReviews = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setLoading(false);

    const { data } = await supabase
      .from("reviews")
      .select(`
        id,
        rating,
        comment,
        created_at,
        events ( title )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setReviews(
      data?.map((r: any) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at,
        events: r.events ?? [],
      })) ?? []
    );

    setLoading(false);
  };

  if (loading) {
    return <p>Loading reviews…</p>;
  }

  /* EMPTY STATE */
  if (reviews.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.icon}>⭐</div>
        <h3>No reviews yet</h3>
        <p>
          You haven’t reviewed any events yet.
          <br />
          Join an event and share your experience.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {reviews.map(review => (
          <div key={review.id} className={styles.card}>
            <h4 className={styles.eventTitle}>
              {review.events?.[0]?.title ?? "Unknown event"}
            </h4>

            <div className={styles.rating}>
              {"⭐".repeat(review.rating)}
              <span>{review.rating}/5</span>
            </div>

            <p className={styles.comment}>
              {review.comment || "No comment provided."}
            </p>

            <span className={styles.date}>
              {new Date(review.created_at).toLocaleDateString("hr-HR")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
