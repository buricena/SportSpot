"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "../events.module.css";

export default function ReviewForm({
  eventId,
}: {
  eventId: string;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Login required");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      event_id: eventId,
      rating,
      comment,
    });

    if (error) {
      alert(error.message);
    } else {
      setComment("");
      alert("Review submitted");
    }

    setLoading(false);
  };

  return (
    <div className={styles.reviewForm}>
      <h3>Leave a review</h3>

      <label>
        Rating
        <select
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map(n => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>

      <textarea
        placeholder="Your comment"
        value={comment}
        onChange={e => setComment(e.target.value)}
      />

      <button onClick={submitReview} disabled={loading}>
        Submit review
      </button>
    </div>
  );
}
