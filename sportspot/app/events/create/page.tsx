"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import styles from "./createEvent.module.css";

const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false });

export default function CreateEventPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sport, setSport] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in to create an event.");
      setLoading(false);
      return;
    }

    const eventDateISO = new Date(date).toISOString();

    const { error } = await supabase.from("events").insert([
      {
        title,
        description,
        sport,
        event_date: eventDateISO,
        location,
        lat,
        lng,
        organizer_id: user.id,
      },
    ]);

    if (error) {
      setError("Failed to create event.");
      setLoading(false);
      return;
    }

    router.push("/events");
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1>Create Event</h1>
        <p className={styles.subtitle}>
          Organize your sports event and invite participants.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.formLabel}>
            Event title
            <input
              className={styles.input}
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </label>

          <label className={styles.formLabel}>
            Sport
            <input
              className={styles.input}
              value={sport}
              onChange={e => setSport(e.target.value)}
              required
            />
          </label>

          <label className={styles.formLabel}>
            Description
            <textarea
              className={styles.input}
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              required
            />
          </label>

          <label className={styles.formLabel}>
            Date & time
            <input
              className={styles.input}
              type="datetime-local"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </label>

          <label className={styles.formLabel}>
            Location (name)
            <input
              className={styles.input}
              value={location}
              onChange={e => setLocation(e.target.value)}
              required
            />
          </label>

          {/* MAP PICKER */}
          <div className={styles.mapSection}>
            <span className={styles.mapLabel}>Select event location</span>
            <MapPicker
              lat={lat}
              lng={lng}
              onSelect={(lat, lng) => {
                setLat(lat);
                setLng(lng);
              }}
            />
            {lat && lng && (
              <span className={styles.mapHint}>Location selected ✓</span>
            )}
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.button} disabled={loading}>
            {loading ? "Creating…" : "Create event"}
          </button>
        </form>

        <p className={styles.footerText}>
          <Link href="/events">← Back to events</Link>
        </p>
      </div>
    </main>
  );
}
