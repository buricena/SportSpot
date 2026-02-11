"use client";

import styles from "./createEvent.module.css";
import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const MapPicker = dynamic(() => import("./MapPicker"), {
  ssr: false,
});

export default function CreateEventPage() {
  const router = useRouter();

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
  const [showSuccess, setShowSuccess] = useState(false);

  /* ================= GEO CODING ================= */
  useEffect(() => {
    if (!location || location.length < 3) return;

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            location
          )}`
        );

        const data = await res.json();

        if (data && data.length > 0) {
          setLat(parseFloat(data[0].lat));
          setLng(parseFloat(data[0].lon));
        }
      } catch (err) {
        console.error("Geocoding failed");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [location]);

  /* ================= SUBMIT ================= */
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
      router.push("/login");
      return;
    }

    setLoading(true);

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

    setShowSuccess(true);

    setTimeout(() => {
      router.push("/events");
    }, 2000);
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link href="/events" className={styles.back}>
          <ArrowLeft size={16} />
          Back to events
        </Link>

        <header className={styles.header}>
          <h1>Create a New Event</h1>
          <p>Organize a sports event and invite participants.</p>
        </header>

        <form onSubmit={handleSubmit}>
          {/* EVENT DETAILS */}
          <section className={styles.card}>
            <h2><Trophy size={18} /> Event Details</h2>

            <div className={styles.field}>
              <label>Event title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} />
            </div>

            <div className={styles.field}>
              <label>Sport *</label>
              <input value={sport} onChange={e => setSport(e.target.value)} />
            </div>

            <div className={styles.field}>
              <label>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} />
            </div>
          </section>

          {/* DATE & TIME */}
          <section className={styles.card}>
            <h2><Calendar size={18} /> Date & Time</h2>

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
            <h2><MapPin size={18} /> Location</h2>

            <div className={styles.field}>
              <label>Event location *</label>
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Zagreb Arena"
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
            <h2><Users size={18} /> Participants</h2>

            <div className={styles.field}>
              <label>Max participants</label>
              <input
                type="number"
                min={2}
                value={maxParticipants}
                onChange={e => setMaxParticipants(e.target.value)}
              />
            </div>
          </section>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <Link href="/events" className={styles.cancel}>Cancel</Link>
            <button className={styles.submit} disabled={loading}>
              {loading ? "Creating…" : "Create Event"}
            </button>
          </div>
        </form>
      </div>

      {showSuccess && (
        <div className={styles.toast}>Event created successfully!</div>
      )}
    </main>
  );
}
