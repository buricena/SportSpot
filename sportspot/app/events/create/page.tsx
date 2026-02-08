"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import styles from "./createEvent.module.css";

export default function CreateEventPage() {
  const router = useRouter();

  // Form state
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

    const eventDateISO = date ? new Date(date).toISOString() : null;

    try {
      const { data, error } = await supabase.from("events").insert([
        {
          title,
          description,
          sport,
          event_date: eventDateISO,
          location,
          lat: lat !== null && !isNaN(lat) ? lat : null,
          lng: lng !== null && !isNaN(lng) ? lng : null,
        },
      ]);

      if (error) throw error;

      router.push("/events");
    } catch (err) {
      console.error("CREATE EVENT ERROR:", err);
      setError("Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
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
            Event Title
            <input
              className={styles.input}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Tennis Doubles Tournament"
              required
            />
          </label>

          <label className={styles.formLabel}>
            Sport
            <input
              className={styles.input}
              value={sport}
              onChange={e => setSport(e.target.value)}
              placeholder="Tennis, Padel, Running..."
              required
            />
          </label>

          <label className={styles.formLabel}>
            Description
            <textarea
              className={styles.input}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Short description of the event..."
              rows={4}
              required
            />
          </label>

          <label className={styles.formLabel}>
            Date & Time
            <input
              className={styles.input}
              type="datetime-local"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </label>

          <label className={styles.formLabel}>
            Location
            <input
              className={styles.input}
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="City, venue..."
              required
            />
          </label>

          <label className={styles.formLabel}>
            Latitude
            <input
              className={styles.input}
              type="number"
              step="any"
              value={lat ?? ""}
              onChange={e => setLat(Number(e.target.value))}
              placeholder="45.8150"
            />
          </label>

          <label className={styles.formLabel}>
            Longitude
            <input
              className={styles.input}
              type="number"
              step="any"
              value={lng ?? ""}
              onChange={e => setLng(Number(e.target.value))}
              placeholder="15.9780"
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.button} disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>

        <p className={styles.footerText}>
          <Link href="/events">← Back to Events</Link>
        </p>
      </div>
    </main>
  );
}
