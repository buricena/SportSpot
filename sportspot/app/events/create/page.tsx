"use client";

import styles from "./createEvent.module.css";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

// MAPA – SSR OFF
const MapPicker = dynamic(() => import("./MapPicker"), {
  ssr: false,
});

export default function CreateEventPage() {
  const router = useRouter();

  // 🔹 FORM STATE
  const [title, setTitle] = useState("");
  const [sport, setSport] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const dateRef = useRef<HTMLInputElement>(null);
const timeRef = useRef<HTMLInputElement>(null);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 SUBMIT
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title || !sport || !date || !time || !location) {
      setError("Please fill all required fields.");
      return;
    }

    if (!lat || !lng) {
      setError("Please select location on the map.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in.");
      return;
    }

    setLoading(true);

    // 🔥 SPOJ DATE + TIME → TIMESTAMP
    const eventDate = new Date(`${date}T${time}`).toISOString();

    const { error: insertError } = await supabase
      .from("events")
      .insert({
        title,
        sport,
        description,
        location,
        event_date: eventDate,
        lat,
        lng,
        organizer_id: user.id,
        max_participants:
          maxParticipants === "" ? null : Number(maxParticipants),
      });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/events");
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* BACK */}
        <Link href="/events" className={styles.back}>
          <ArrowLeft size={16} />
          Back to events
        </Link>

        {/* HEADER */}
        <header className={styles.header}>
          <h1>Create a New Event</h1>
          <p>Organize a sports event and invite participants.</p>
        </header>

        <form onSubmit={handleSubmit}>
          {/* EVENT DETAILS */}
          <section className={styles.card}>
            <h2>
              <Trophy size={18} />
              Event Details
            </h2>

            <div className={styles.field}>
              <label>Event title *</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>Sport *</label>
<input
  placeholder="e.g. Football, Yoga, Crossfit..."
  value={sport}
  onChange={e => setSport(e.target.value)}
/>

            </div>

            <div className={styles.field}>
              <label>Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </section>

          {/* DATE & TIME */}
          <section className={styles.card}>
            <h2>
              <Calendar size={18} />
              Date & Time
            </h2>

            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Date *</label>
<input
  ref={dateRef}
  type="date"
  value={date}
  min={new Date().toISOString().split("T")[0]}
  onChange={e => setDate(e.target.value)}
  onClick={() => dateRef.current?.showPicker()}
 
/>



              </div>

              <div className={styles.field}>
                <label>Time *</label>
              <input
  ref={timeRef}
  type="time"
  value={time}
  onChange={e => setTime(e.target.value)}
  onClick={() => timeRef.current?.showPicker()}
 
/>

              </div>
            </div>
          </section>

          {/* LOCATION */}
          <section className={styles.card}>
            <h2>
              <MapPin size={18} />
              Location
            </h2>

            <div className={styles.field}>
              <label>Venue name *</label>
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>

            <div className={styles.mapWrapper}>
              <MapPicker
                lat={lat}
                lng={lng}
                onSelect={(lat, lng) => {
                  setLat(lat);
                  setLng(lng);
                }}
              />
            </div>
          </section>

          {/* PARTICIPANTS */}
          <section className={styles.card}>
            <h2>
              <Users size={18} />
              Participants
            </h2>

            <div className={styles.field}>
              <label>Max participants (optional)</label>
              <input
                type="number"
                min={2}
                value={maxParticipants}
                onChange={e => setMaxParticipants(e.target.value)}
              />
            </div>
          </section>

          {error && <p className={styles.error}>{error}</p>}

          {/* ACTIONS */}
          <div className={styles.actions}>
            <Link href="/events" className={styles.cancel}>
              Cancel
            </Link>
            <button
              className={styles.submit}
              disabled={loading}
            >
              {loading ? "Creating…" : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
