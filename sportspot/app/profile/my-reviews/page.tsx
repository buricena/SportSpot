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
  }[];
};

export default function MyReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
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
        .eq("user_id", user.id);

      setReviews(data || []);
    };

    load();
  }, []);

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>My Reviews</h1>
      <p className={styles.subtitle}>Your event feedback</p>

      {reviews.length === 0 && (
        <p className={styles.empty}>No reviews yet.</p>
      )}

      <div className={styles.reviewList}>
        {reviews.map(review => (
          <div key={review.id} className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <strong>{review.events[0].title}</strong>
              <span className={styles.rating}>
                {"★".repeat(review.rating)}
              </span>
            </div>

            <p className={styles.comment}>{review.comment}</p>

            <span className={styles.reviewDate}>
              {new Date(review.created_at).toLocaleDateString("hr-HR")}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
