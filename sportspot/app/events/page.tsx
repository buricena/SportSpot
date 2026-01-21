"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import styles from "./events.module.css";

type Event = {
  id: string;
  title: string;
  description: string;
  sport: string;
  event_date: string;
  location: string;
};

type Tab = "upcoming" | "past";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [joinedEventIds, setJoinedEventIds] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");

  useEffect(() => {
    init();
  }, [activeTab]);

  async function init() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUserId(user?.id ?? null);

    await Promise.all([fetchEvents(), user && fetchJoinedEvents(user.id)]);
  }

  async function fetchEvents() {
    setLoading(true);

    const today = new Date().toISOString().split("T")[0];

    const query =
      activeTab === "upcoming"
        ? supabase
            .from("events")
            .select("*")
            .gte("event_date", today)
            .order("event_date", { ascending: true })
        : supabase
            .from("events")
            .select("*")
            .lt("event_date", today)
            .order("event_date", { ascending: false });

    const { data, error } = await query;

    if (!error) {
      setEvents(data || []);
    }

    setLoading(false);
  }

  async function fetchJoinedEvents(uid: string) {
    const { data } = await supabase
      .from("event_participants")
      .select("event_id")
      .eq("user_id", uid);

    setJoinedEventIds(data?.map(e => e.event_id) || []);
  }

  async function joinEvent(eventId: string) {
    if (!userId) return;

    const { error } = await supabase.from("event_participants").insert({
      user_id: userId,
      event_id: eventId,
    });

    if (!error) {
      setJoinedEventIds(prev => [...prev, eventId]);
    }
  }

  return (
    <main className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <h1>Events</h1>
        <p className={styles.subtitle}>
          Browse upcoming and past sports events.
        </p>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "upcoming" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </button>

          <button
            className={`${styles.tab} ${
              activeTab === "past" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("past")}
          >
            Past
          </button>
        </div>
      </header>

      {loading && <p>Loading events...</p>}

      {!loading && events.length === 0 && (
        <p className={styles.empty}>
          {activeTab === "upcoming"
            ? "No upcoming events."
            : "No past events."}
        </p>
      )}

      {/* GRID */}
      <section className={styles.grid}>
        {events.map(event => {
          const isJoined = joinedEventIds.includes(event.id);

          return (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className={styles.cardLink}
            >
              <div className={styles.card}>
                <span className={styles.tag}>{event.sport}</span>

                <h3 className={styles.title}>{event.title}</h3>

                <p className={styles.description}>
                  {event.description?.slice(0, 90)}...
                </p>

                <p className={styles.meta}>
                  📅{" "}
                  {new Date(event.event_date).toLocaleDateString("hr-HR")}
                </p>

                <p className={styles.meta}>📍 {event.location}</p>

                {/* JOIN */}
                {userId && (
                  <div className={styles.joinArea}>
                    {isJoined ? (
                      <span className={styles.joined}>Joined</span>
                    ) : (
                      <button
                        className={styles.joinBtn}
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          joinEvent(event.id);
                        }}
                      >
                        Join
                      </button>
                    )}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
