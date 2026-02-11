"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Star, Calendar } from "lucide-react";
import styles from "./my-reviews.module.css";

type Review = {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  events: {
    id: string;
    title: string;
  }[];
};


export default function MyReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("event_reviews")
      .select(`
        id,
        rating,
        comment,
        created_at,
        events (
          id,
          title
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReviews(data);
    }

    setLoading(false);
  }

  if (loading) {
    return <p>Loading reviews…</p>;
  }

  if (reviews.length === 0) {
    return <p>You haven’t written any reviews yet.</p>;
  }

  return (
    <div className={styles.wrapper}>
      {reviews.map((review) => (
        <div key={review.id} className={styles.card}>
          <div className={styles.header}>
            <h3 className={styles.eventTitle}>
              {review.events[0]?.title
 ?? "Unknown event"}
            </h3>

            {review.rating && (
              <div className={styles.rating}>
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill="#ff6b35"
                    stroke="#ff6b35"
                  />
                ))}
              </div>
            )}
          </div>

          {review.comment && (
            <p className={styles.comment}>
              “{review.comment}”
            </p>
          )}

          <div className={styles.date}>
            <Calendar size={14} />
            {new Date(review.created_at).toLocaleDateString("hr-HR")}
          </div>
        </div>
      ))}
    </div>
  );
}
