"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Users } from "lucide-react";
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

  const [reviewText, setReviewText] = useState<Record<string, string>>({});
  const [reviewRating, setReviewRating] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  const [reviewedEventIds, setReviewedEventIds] = useState<Set<string>>(
    new Set()
  );
  const [reviewSuccess, setReviewSuccess] = useState(false);

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

    const { data } = await supabase
      .from("event_participants")
      .select(
        `
        events (
          id,
          title,
          sport,
          location,
          event_date
        )
      `
      )
      .eq("user_id", user.id);

    const mapped =
      data?.map((row: any) => row.events).filter(Boolean) ?? [];

    setEvents(mapped);

    const { data: reviews } = await supabase
      .from("event_reviews")
      .select("event_id")
      .eq("user_id", user.id);

    if (reviews) {
      setReviewedEventIds(new Set(reviews.map((r) => r.event_id)));
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

    setEvents((prev) => prev.filter((e) => e.id !== toLeave.id));
    setToLeave(null);
  };

  const submitReview = async (eventId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setSubmitting(eventId);

    const { error } = await supabase.from("event_reviews").insert({
      event_id: eventId,
      user_id: user.id,
      rating: reviewRating[eventId],
      comment: reviewText[eventId],
    });

    setSubmitting(null);
    if (error) return;

    setReviewedEventIds((prev) => new Set(prev).add(eventId));
    setReviewSuccess(true);

    setTimeout(() => setReviewSuccess(false), 2000);
  };

  const now = new Date();

  const upcoming = events.filter((e) => new Date(e.event_date) >= now);
  const past = events.filter((e) => new Date(e.event_date) < now);

  if (loading) {
    return <p>Loading events…</p>;
  }

  return (
    <div className={styles.wrapper}>
      {events.length === 0 && (
        <p>You haven’t joined any events yet.</p>
      )}

      {/* ================= UPCOMING ================= */}
      {upcoming.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Upcoming</h2>
            <span className={styles.sectionCount}>{upcoming.length}</span>
          </div>

          <div className={styles.grid}>
            {upcoming.map((event) => (
              <div
                key={event.id}
                className={styles.card}
                role="button"
                onClick={() => router.push(`/events/${event.id}`)}
              >
                <div>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.title}>{event.title}</h3>
                    <span className={styles.badge}>{event.sport}</span>
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

      {/* ================= PAST ================= */}
      {past.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Past Events</h2>
            <span className={styles.sectionCount}>{past.length}</span>
          </div>

          <div className={styles.grid}>
            {past.map((event) => (
              <div
                key={event.id}
                className={`${styles.card} ${styles.past}`}
                role="button"
                onClick={() => router.push(`/events/${event.id}`)}
              >
                <div>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.title}>{event.title}</h3>
                    <span className={styles.badge}>{event.sport}</span>
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

                {!reviewedEventIds.has(event.id) ? (
                  <div
                    className={styles.reviewBox}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <strong className={styles.reviewTitle}>
                      Leave a review
                    </strong>

                    <div className={styles.ratingRow}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          className={`${styles.star} ${
                            reviewRating[event.id] >= n
                              ? styles.activeStar
                              : ""
                          }`}
                          onClick={() =>
                            setReviewRating((prev) => ({
                              ...prev,
                              [event.id]: n,
                            }))
                          }
                        >
                          ★
                        </button>
                      ))}
                    </div>

                    <textarea
                      className={styles.reviewTextarea}
                      placeholder="How was this event?"
                      value={reviewText[event.id] || ""}
                      onChange={(e) =>
                        setReviewText((prev) => ({
                          ...prev,
                          [event.id]: e.target.value,
                        }))
                      }
                    />

                    <button
                      className={styles.reviewButton}
                      disabled={submitting === event.id}
                      onClick={() => submitReview(event.id)}
                    >
                      {submitting === event.id
                        ? "Saving…"
                        : "Submit review"}
                    </button>
                  </div>
                ) : (
                  <div className={styles.reviewedBadge}>
                    ✔ Review submitted
                  </div>
                )}

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

      {/* ================= LEAVE MODAL ================= */}
      {toLeave && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Leave event?</h3>

            <p className={styles.modalText}>
              Are you sure you want to leave <br />
              <strong>{toLeave.title}</strong>?
            </p>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setToLeave(null)}
              >
                Cancel
              </button>

              <button
                className={styles.confirmBtn}
                onClick={confirmLeave}
              >
                Leave event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= REVIEW TOAST ================= */}
      {reviewSuccess && (
        <div className={styles.successToast}>
          Review submitted successfully
        </div>
      )}
    </div>
  );
}
