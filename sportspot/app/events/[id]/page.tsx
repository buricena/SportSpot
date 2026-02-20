"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react";
import styles from "./event-details.module.css";
import EventNotFound from "@/app/components/EventNotFound";

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
  const [organizerName, setOrganizerName] = useState("Unknown");

  const [loading, setLoading] = useState(true);
  const [notFoundEvent, setNotFoundEvent] = useState(false);

  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [id]);

  async function fetchAll() {
    setLoading(true);
    setNotFoundEvent(false);

    const { data: eventData } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!eventData) {
      setNotFoundEvent(true);
      setLoading(false);
      return;
    }

    setEvent(eventData);

    if (eventData.organizer_id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", eventData.organizer_id)
        .maybeSingle();

      if (profile?.name) setOrganizerName(profile.name);
    }

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

    const { count } = await supabase
      .from("event_participants")
      .select("*", { count: "exact", head: true })
      .eq("event_id", id);

    setParticipantsCount(count ?? 0);
    setLoading(false);
  }

  async function handleJoin() {
    if (!event) return;

    const isPast = new Date(event.event_date) < new Date();
    const isFull =
      event.max_participants !== null &&
      participantsCount >= event.max_participants;

    if (isPast || isFull) return;

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

  function handleDelete() {
    setDeleteError(null);

    if (!user) {
      setDeleteError("You must be logged in to delete an event.");
      return;
    }

    if (user.id !== event?.organizer_id) {
      setDeleteError("Only the event organizer can delete this event.");
      return;
    }

    setShowConfirm(true);
  }

  async function confirmDelete() {
    if (!event) return;

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", event.id);

    if (error) {
      setDeleteError("Failed to delete event.");
      return;
    }

    setShowConfirm(false);
    setDeleteSuccess(true);

    setTimeout(() => {
      router.push("/events");
    }, 2000);
  }

  if (loading) {
    return <main className={styles.page}>Loading…</main>;
  }

  if (notFoundEvent) {
    return (
      <main className={styles.page}>
        <EventNotFound onBack={() => router.push("/events")} />
      </main>
    );
  }

  if (!event) return null;

  const isPast = new Date(event.event_date) < new Date();
  const isFull =
    event.max_participants !== null &&
    participantsCount >= event.max_participants;

  return (
    <main className={styles.page}>
      <article className={styles.card}>
        <button className={styles.back} onClick={() => router.push("/events")}>
          <ArrowLeft size={16} /> Back to events
        </button>

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
 <div className={styles.infoCard}>
  <span className={styles.infoLabel}>Date</span>

  <div className={styles.infoValue}>
    <Calendar size={18} />
    <strong>
      {new Date(event.event_date).toLocaleDateString("hr-HR")}
    </strong>
  </div>
</div>

  <div className={styles.infoCard}>
    <span className={styles.infoLabel}>Time</span>
    <div className={styles.infoValue}>
      <Clock size={18} />
      <strong>
        {new Date(event.event_date).toLocaleTimeString("hr-HR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </strong>
    </div>
  </div>

  <div className={styles.infoCard}>
    <span className={styles.infoLabel}>Location</span>
    <div className={styles.infoValue}>
      <MapPin size={18} />
      <strong>{event.location}</strong>
    </div>
  </div>

  <div className={styles.infoCard}>
    <span className={styles.infoLabel}>Participants</span>
    <div className={styles.infoValue}>
      <Users size={18} />
      <strong>
        {participantsCount}
        {event.max_participants
          ? ` / ${event.max_participants}`
          : " / Unlimited"}
      </strong>
    </div>
  </div>
</div>

        {/* JOIN */}
        <div className={styles.joinCard}>
          {isPast ? (
            <p className={styles.pastNotice}>
              This event has already ended.
            </p>
          ) : isFull ? (
            <p className={styles.pastNotice}>
              This event is full. You can no longer join.
            </p>
          ) : (
            <>
              <div>
                <strong>Want to participate?</strong>
                <p>Join this event and appear in the participants list.</p>
              </div>

              <button
                onClick={handleJoin}
                disabled={joined}
                className={styles.joinBtn}
              >
                {joined ? "Joined" : "Join Event"}
              </button>
            </>
          )}
        </div>

        <div className={styles.contentGrid}>
          {event.lat && event.lng && (
            <EventMap lat={event.lat} lng={event.lng} />
          )}

          <div className={styles.descriptionCard}>
            <h3>About this Event</h3>
            <p>{event.description}</p>
          </div>
        </div>

        {/* DELETE */}
        <div className={styles.deleteSection}>
          <button className={styles.deleteBtn} onClick={handleDelete}>
            Delete Event
          </button>

          {deleteError && (
            <p className={styles.deleteError}>{deleteError}</p>
          )}
        </div>
      </article>

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmBox}>
            <p>Are you sure you want to delete this event?</p>

            <div className={styles.confirmActions}>
              <button
                className={styles.confirmDelete}
                onClick={confirmDelete}
              >
                Yes, delete
              </button>
              <button
                className={styles.confirmCancel}
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteSuccess && (
        <div className={styles.successToast}>
          Event deleted successfully
        </div>
      )}
    </main>
  );
}
