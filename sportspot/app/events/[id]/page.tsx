"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react";
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
  max_participants: number | null;
};

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [user, setUser] = useState<any>(null);
  const [joined, setJoined] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [organizerName, setOrganizerName] = useState<string>("Unknown");
  const [loading, setLoading] = useState(true);
  


  useEffect(() => {
    fetchAll();
  }, [id]);

  async function fetchAll() {
    setLoading(true);

    /* EVENT */
    const { data: eventData } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (!eventData) {
      setLoading(false);
      return;
    }

    setEvent(eventData);
/* ORGANIZER */
if (eventData.organizer_id) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", eventData.organizer_id)
    .maybeSingle();

  if (profile?.name) {
    setOrganizerName(profile.name);
  } else {
    setOrganizerName("Unknown");
  }
}



    /* AUTH USER */
    const { data: auth } = await supabase.auth.getUser();
    setUser(auth.user);

    if (auth.user) {
      const { data: joinedData } = await supabase
        .from("event_participants")
        .select("id")
        .eq("event_id", id)
        .eq("user_id", auth.user.id)
        .maybeSingle();

      if (joinedData) setJoined(true);
    }

    /* PARTICIPANTS COUNT */
    const { count } = await supabase
      .from("event_participants")
      .select("*", { count: "exact", head: true })
      .eq("event_id", id);

    setParticipantsCount(count ?? 0);
    setLoading(false);
  }

  async function handleJoin() {
    if (!user) {
      router.push("/login");
      return;
    }

    await supabase.from("event_participants").insert({
      event_id: id,
      user_id: user.id,
    });

    setJoined(true);
    setParticipantsCount((c) => c + 1);
  }

  if (loading || !event) {
    return <main className={styles.page}>Loading…</main>;
  }
const eventDate = new Date(event.event_date);
const isPast = eventDate < new Date();

  return (
    <main className={styles.page}>
      <article className={styles.card}>
        {/* BACK */}
        <button className={styles.back} onClick={() => router.push("/events")}>
          <ArrowLeft size={16} />
          Back to events
        </button>

        {/* TAGS */}
        <div className={styles.tags}>
  <span className={styles.sport}>{event.sport}</span>
  <span
    className={`${styles.status} ${
      isPast ? styles.past : styles.upcoming
    }`}
  >
    {isPast ? "Past" : "Upcoming"}
  </span>
</div>

        <h1 className={styles.title}>{event.title}</h1>

        <p className={styles.organizer}>
          Organized by <strong>{organizerName}</strong>
        </p>

        <div className={styles.infoGrid}>
          {/* DATE */}
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <Calendar size={20} />
            </div>
            <div className={styles.infoText}>
              <span className={styles.infoLabel}>Date</span>
              <span className={styles.infoValue}>
                {new Date(event.event_date).toLocaleDateString("hr-HR")}
              </span>
            </div>
          </div>

          {/* TIME */}
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <Clock size={20} />
            </div>
            <div className={styles.infoText}>
              <span className={styles.infoLabel}>Time</span>
              <span className={styles.infoValue}>
                {new Date(event.event_date).toLocaleTimeString("hr-HR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {/* LOCATION */}
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <MapPin size={20} />
            </div>
            <div className={styles.infoText}>
              <span className={styles.infoLabel}>Location</span>
              <span className={styles.infoValue}>{event.location}</span>
            </div>
          </div>

          {/* PARTICIPANTS */}
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <Users size={20} />
            </div>
            <div className={styles.infoText}>
              <span className={styles.infoLabel}>Participants</span>

              {event.max_participants ? (
                <>
                  <span className={styles.infoValue}>
                    {participantsCount} / {event.max_participants}
                  </span>
                  <span className={styles.infoHint}>
                    {event.max_participants - participantsCount} spots remaining
                  </span>
                </>
              ) : (
                <>
                  <span className={styles.infoValue}>{participantsCount}</span>
                  <span className={styles.infoHint}>
                    Unlimited participants
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* JOIN */}
        <div className={styles.joinCard}>
          <div>
            <strong>Want to participate?</strong>
            <p>Join this event and appear on the participants list.</p>
            <span className={styles.participants}>
              {participantsCount} people joined
            </span>
          </div>

          <button
            onClick={handleJoin}
            disabled={joined}
            className={styles.joinBtn}
          >
            {joined ? "Joined" : "Join Event"}
          </button>
        </div>

        {/* MAP + DESCRIPTION */}
        <div className={styles.contentGrid}>
          {event.lat && event.lng && (
            <EventMap lat={event.lat} lng={event.lng} />
          )}

          <div className={styles.descriptionCard}>
            <h3>About this Event</h3>
            <p>{event.description}</p>
          </div>
        </div>
      </article>
    </main>
  );
}
