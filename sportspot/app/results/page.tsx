"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "./results.module.css";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  Clock,
  Search,
  Star,
} from "lucide-react";

type Review = {
  rating: number;
  comment: string | null;
};

type Event = {
  id: string;
  title: string;
  sport: string;
  location: string;
  event_date: string;
  organizer_id: string;
  max_participants: number | null;
  participants_count: number;
  result?: {
    comment: string | null;
  };
  reviews: Review[];
};

type Filter = "all" | "posted" | "pending";

export default function ResultsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [comments, setComments] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserId(user?.id ?? null);

    const now = new Date().toISOString();

    const { data } = await supabase
      .from("events")
      .select(`
        id,
        title,
        sport,
        location,
        event_date,
        organizer_id,
        max_participants,
        event_results ( comment ),
        event_participants ( id ),
        event_reviews ( rating, comment )
      `)
      .lt("event_date", now)
      .order("event_date", { ascending: false });

    const formatted =
      data?.map((e: any) => ({
        ...e,
        participants_count: e.event_participants?.length ?? 0,
        result: e.event_results?.[0] ?? null,
        reviews: e.event_reviews ?? [],
      })) ?? [];

    setEvents(formatted);
  }

  async function saveComment(eventId: string) {
    const text = comments[eventId]?.trim();
    if (!text) return;

    const { error } = await supabase.from("event_results").insert({
      event_id: eventId,
      comment: text,
    });

    if (!error) {
      setComments({});
      loadData();
    }
  }

  /* ================= FILTER + SEARCH ================= */

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const hasResult = !!e.result?.comment;

      if (filter === "posted" && !hasResult) return false;
      if (filter === "pending" && hasResult) return false;

      if (search) {
        const q = search.toLowerCase();
        return (
          e.title.toLowerCase().includes(q) ||
          e.sport.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [events, filter, search]);

  const stats = {
    total: events.length,
    posted: events.filter((e) => e.result?.comment).length,
    pending: events.filter((e) => !e.result?.comment).length,
  };

  return (
    <main className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerIcon}>
          <Trophy size={22} />
        </div>
        <div>
          <h1>Event Results</h1>
          <p>Results and comments from past events</p>
        </div>
      </header>

      {/* STATS */}
      <section className={styles.stats}>
        <div className={styles.statCard}>
          <Calendar />
          <div>
            <span>Past events</span>
            <strong>{stats.total}</strong>
          </div>
        </div>

        <div className={styles.statCardGreen}>
          <CheckCircle />
          <div>
            <span>Results posted</span>
            <strong>{stats.posted}</strong>
          </div>
        </div>

        <div className={styles.statCardOrange}>
          <Clock />
          <div>
            <span>Awaiting results</span>
            <strong>{stats.pending}</strong>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <div className={styles.search}>
        <Search size={16} />
        <input
          placeholder="Search by name, sport or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* FILTERS */}
      <div className={styles.filters}>
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? styles.active : ""}
        >
          All events <span>{stats.total}</span>
        </button>
        <button
          onClick={() => setFilter("posted")}
          className={filter === "posted" ? styles.active : ""}
        >
          Results posted <span>{stats.posted}</span>
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={filter === "pending" ? styles.active : ""}
        >
          Pending <span>{stats.pending}</span>
        </button>
      </div>

      {/* LIST */}
      <section className={styles.list}>
        {filteredEvents.map((event) => {
          const isOrganizer = userId === event.organizer_id;
          const hasResult = !!event.result?.comment;

          const avgRating =
            event.reviews.length > 0
              ? (
                  event.reviews.reduce((s, r) => s + r.rating, 0) /
                  event.reviews.length
                ).toFixed(1)
              : null;

          return (
            <article key={event.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3>{event.title}</h3>
                  <div className={styles.meta}>
                    <span>
                      <Calendar size={14} />
                      {new Date(event.event_date).toLocaleDateString("hr-HR")}
                    </span>
                    <span>
                      <MapPin size={14} />
                      {event.location}
                    </span>
                    <span>
                      <Users size={14} />
                      {event.participants_count}
                      {event.max_participants
                        ? ` / ${event.max_participants}`
                        : ""}
                    </span>
                  </div>
                </div>

                <span
                  className={
                    hasResult ? styles.statusDone : styles.statusPending
                  }
                >
                  {hasResult ? (
                    <>
                      <CheckCircle size={14} /> Result posted
                    </>
                  ) : (
                    <>
                      <Clock size={14} /> Pending
                    </>
                  )}
                </span>
              </div>

              {/* RESULT */}
              <div
                className={`${styles.resultBox} ${
                  hasResult ? styles.resultHighlight : ""
                }`}
              >
                {hasResult ? (
                  <p>{event.result!.comment}</p>
                ) : (
                  <p className={styles.empty}>Result not added yet</p>
                )}

                {/* ONLY ORGANIZER & ONLY IF NO RESULT */}
                {isOrganizer && !hasResult && (
                  <div className={styles.editor}>
                    <textarea
                      placeholder="Write how the event went..."
                      value={comments[event.id] ?? ""}
                      onChange={(e) =>
                        setComments({
                          ...comments,
                          [event.id]: e.target.value,
                        })
                      }
                    />
                    <button onClick={() => saveComment(event.id)}>
                      Save result
                    </button>
                  </div>
                )}
              </div>

              {/* REVIEWS */}
              <div className={styles.reviews}>
                {avgRating ? (
                  <div className={styles.ratingSummary}>
                    <Star size={16} className={styles.starIcon} />
                    <span className={styles.ratingValue}>
                      {avgRating} / 5
                    </span>
                    <span className={styles.reviewCount}>
                      ({event.reviews.length})
                    </span>
                  </div>
                ) : (
                  <span className={styles.noReviews}>
                    No reviews yet
                  </span>
                )}

                <ul className={styles.reviewList}>
                  {event.reviews.map((r, i) => (
                    <li key={i} className={styles.reviewItem}>

                      {r.comment && (
                        <p className={styles.reviewComment}>
                          {r.comment}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
