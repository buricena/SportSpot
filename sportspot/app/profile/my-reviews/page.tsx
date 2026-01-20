"use client";

import styles from "../profile.module.css";
import RequireAuth from "../../components/RequireAuth";

type Review = {
  id: number;
  event: string;
  rating: number;
  comment: string;
  date: string;
};

const reviews: Review[] = [
  {
    id: 1,
    event: "5v5 Football Match",
    rating: 5,
    comment: "Great atmosphere and friendly players. Would join again!",
    date: "2026-01-12",
  },
  {
    id: 2,
    event: "3v3 Basketball",
    rating: 4,
    comment: "Nice game, well organized. Courts could be better.",
    date: "2025-12-28",
  },
];

export default function MyReviewsPage() {
  return (
    <RequireAuth>
    <main className={styles.container}>
      <h1 className={styles.title}>My Reviews</h1>
      <p className={styles.subtitle}>
        Reviews you have written for events
      </p>

      {reviews.length === 0 && (
        <p className={styles.empty}>You haven’t written any reviews yet.</p>
      )}

      <div className={styles.reviewList}>
        {reviews.map(review => (
          <div key={review.id} className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <h3>{review.event}</h3>
              <span className={styles.rating}>
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </span>
            </div>

            <p className={styles.comment}>{review.comment}</p>

            <span className={styles.date}>{review.date}</span>
          </div>
        ))}
      </div>
    </main>
    </RequireAuth>
  );
}
