"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabaseClient";
import styles from "./event-details.module.css";

const EventMap = dynamic(() => import("./EventMap"), { ssr: false });

type Event = {
  id: string;
  title: string;
  description: string;
  sport: string;
  event_date: string;
  location: string;
  lat: number | null;
  lng: number | null;
  organizer_id: string;
};

export default function EventDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [user, setUser] = useState<any>(null);
  const [joined, setJoined] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [organizerName, setOrganizerName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchEvent() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (!error) setEvent(data);
    setLoading(false);
  }

  async function fetchOrganizer(organizerId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", organizerId)
      .single();

    if (data) setOrganizerName(data.username);
  }

  async function fetchUser() {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);

    if (data.user) {
      const { data: join } = await supabase
        .from("event_participants")
        .select("id")
        .eq("event_id", id)
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (join) setJoined(true);
    }
  }

  async function fetchParticipants() {
    const { count } = await supabase
      .from("event_participants")
      .select("*", { count: "exact", head: true })
      .eq("event_id", id);

    setParticipantsCount(count || 0);
  }

  async function handleJoin() {
    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("event_participants").insert({
      event_id: id,
      user_id: user.id,
    });

    if (!error) {
      setJoined(true);
      setParticipantsCount(c => c + 1);
    }
  }

  useEffect(() => {
    if (!id) return;
    fetchEvent();
    fetchUser();
    fetchParticipants();
  }, [id]);

  useEffect(() => {
    if (event?.organizer_id) fetchOrganizer(event.organizer_id);
  }, [event]);

  if (loading) {
    return <main className={styles.page}>Loading event…</main>;
  }

  if (!event) {
    return <main className={styles.page}>Event not found.</main>;
  }

  const isOrganizer = user && user.id === event.organizer_id;

  return (
    <main className={styles.page}>
      <article className={styles.card}>
        {/* BACK */}
        <button className={styles.back} onClick={() => router.push("/events")}>
          ← Back to events
        </button>

        {/* HEADER */}
        <div className={styles.headerRow}>
            <span className={styles.sport}>{event.sport}</span>
            <span className={styles.status}>Upcoming</span>
        </div>

        <div className={styles.organizer}>
          Organized by <strong>{organizerName ?? "Unknown"}</strong>
        </div>

        <h1 className={styles.title}>{event.title}</h1>

        {/* META */}
        <div className={styles.meta}>
          <div>
            <span className={styles.metaLabel}>Date</span>
            <span className={styles.metaValue}>
              {new Date(event.event_date).toLocaleDateString("hr-HR")}
            </span>
          </div>
          <div>
            <span className={styles.metaLabel}>Location</span>
            <span className={styles.metaValue}>{event.location}</span>
          </div>
        </div>

        {/* MAP */}
        {event.lat && event.lng && (
          <div className={styles.mapWrapper}>
            <EventMap lat={event.lat} lng={event.lng} />
          </div>
        )}

        {/* JOIN */}
        <div className={styles.joinCard}>
          <div className={styles.joinText}>
            <strong>Want to participate?</strong>
            <span>
              {joined
                ? "You are already participating in this event."
                : "Join this event and appear on the participants list."}
            </span>
            <span className={styles.participants}>
              👥 {participantsCount} people joined this event
            </span>
          </div>

          <button
            className={styles.joinBtn}
            onClick={handleJoin}
            disabled={joined}
          >
            {joined ? "Joined" : "Join event"}
          </button>
        </div>

        {/* ORGANIZER ONLY */}
        {isOrganizer && (
          <div className={styles.organizerActions}>
            <button
              className={styles.resultsBtn}
              onClick={() =>
                router.push(`/results/create?event=${event.id}`)
              }
            >
              Add results
            </button>
          </div>
        )}

        {/* DESCRIPTION */}
        <p className={styles.description}>{event.description}</p>
      </article>
    </main>
  );
}
