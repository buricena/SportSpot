"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "./results.module.css";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
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
  result?: { comment: string | null };
  reviews: Review[];
};

type Filter = "all" | "posted" | "pending";

export default function ResultsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [comments, setComments] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  async function saveResult(eventId: string) {
    const text = comments[eventId]?.trim();
    if (!text || text.length < 10) {
      setError("Result must contain at least 10 characters.");
      return;
    }

    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const action = event.result
      ? supabase.from("event_results").update({ comment: text }).eq("event_id", eventId)
      : supabase.from("event_results").insert({ event_id: eventId, comment: text });

    const { error } = await action;

    if (!error) {
      setComments({});
      setEditing(null);
      setError(null);
      loadData();
    }
  }

  /* FILTER + SEARCH */
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
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
    posted: events.filter(e => e.result?.comment).length,
    pending: events.filter(e => !e.result?.comment).length,
  };

  return (
    <main className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerIcon}><Trophy size={22} /></div>
        <div>
          <h1>Event Results</h1>
          <p>Final results and reviews from past events</p>
        </div>
      </header>

      {/* STATS */}
      <section className={styles.stats}>
        <Stat icon={<Calendar />} label="Past events" value={stats.total} />
        <Stat icon={<Trophy />} label="Results posted" value={stats.posted} green />
        <Stat icon={<Clock />} label="Pending" value={stats.pending} orange />
      </section>

      {/* SEARCH */}
      <div className={styles.search}>
        <Search size={16} />
        <input
          placeholder="Search by name, sport or location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* FILTERS */}
      <div className={styles.filters}>
        <FilterBtn label="All" count={stats.total} active={filter==="all"} onClick={()=>setFilter("all")} />
        <FilterBtn label="Results posted" count={stats.posted} active={filter==="posted"} onClick={()=>setFilter("posted")} />
        <FilterBtn label="Pending" count={stats.pending} active={filter==="pending"} onClick={()=>setFilter("pending")} />
      </div>

      {/* LIST */}
      <section className={styles.list}>
        {filteredEvents.map(event => {
          const isOrganizer = userId === event.organizer_id;
          const hasResult = !!event.result?.comment;
          const isEditing = editing === event.id;

          const avgRating =
            event.reviews.length > 0
              ? (event.reviews.reduce((s,r)=>s+r.rating,0)/event.reviews.length).toFixed(1)
              : null;

          return (
            <article key={event.id} className={styles.card}>
              <header className={styles.cardHeader}>
                <div>
                  <h3>{event.title}</h3>
                  <div className={styles.meta}>
                    <span><Calendar size={14} />{new Date(event.event_date).toLocaleDateString("hr-HR")}</span>
                    <span><MapPin size={14} />{event.location}</span>
                    <span><Users size={14} />{event.participants_count}{event.max_participants && ` / ${event.max_participants}`}</span>
                  </div>
                </div>

                <span className={hasResult ? styles.statusDone : styles.statusPending}>
                  {hasResult ? "Final result" : "Pending"}
                </span>
              </header>

              <div className={styles.resultBox}>
                {hasResult && !isEditing && <p>{event.result!.comment}</p>}
                {!hasResult && <p className={styles.empty}>Result not added yet</p>}

                {isOrganizer && (isEditing || !hasResult) && (
                  <div className={styles.editor}>
                    <textarea
                      value={comments[event.id] ?? event.result?.comment ?? ""}
                      onChange={e => setComments({ ...comments, [event.id]: e.target.value })}
                      placeholder="Write final result summary..."
                    />
                    {error && <p className={styles.error}>{error}</p>}
                    <div className={styles.editorActions}>
                      <button onClick={() => saveResult(event.id)}>Save</button>
                      {hasResult && (
                        <button className={styles.cancel} onClick={() => setEditing(null)}>Cancel</button>
                      )}
                    </div>
                  </div>
                )}

                {hasResult && isOrganizer && !isEditing && (
                  <button className={styles.editBtn} onClick={() => setEditing(event.id)}>
                    Edit result
                  </button>
                )}
              </div>

              <div className={styles.reviews}>
                {avgRating ? (
                  <div className={styles.ratingSummary}>
                    <Star size={16} /> {avgRating} / 5 ({event.reviews.length})
                  </div>
                ) : (
                  <span className={styles.noReviews}>No reviews yet</span>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

/* helper components */
function Stat({ icon, label, value, green, orange }: any) {
  return (
    <div className={`${styles.statCard} ${green ? styles.green : ""} ${orange ? styles.orange : ""}`}>
      {icon}
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function FilterBtn({ label, count, active, onClick }: any) {
  return (
    <button onClick={onClick} className={active ? styles.active : ""}>
      {label} <span>{count}</span>
    </button>
  );
}