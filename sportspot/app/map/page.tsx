"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabaseClient";
import styles from "./map.module.css";

const EventsMap = dynamic(() => import("./EventsMap"), {
  ssr: false,
});

type Event = {
  id: string;
  title: string;
  event_date: string;
  location: string;
  lat: number;
  lng: number;
};

export default function MapPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [center, setCenter] = useState<[number, number]>([
    45.815,
    15.978, // HR default
  ]);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const now = new Date().toISOString();

    const { data } = await supabase
      .from("events")
      .select("id, title, event_date, location, lat, lng")
      .not("lat", "is", null)
      .not("lng", "is", null)
      .gte("event_date", now); // ✅ ONLY UPCOMING

    setEvents(data || []);
    setLoading(false);
  }

  async function handleSearch() {
    if (!search.trim()) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        search
      )}`
    );
    const data = await res.json();

    if (data?.length > 0) {
      setCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
    } else {
      alert("Location not found");
    }
  }

  if (loading) {
    return <p className={styles.state}>Loading map…</p>;
  }

  return (
    <main className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1>Find events near you</h1>
      <p>
        Explore sports events on an interactive map and discover activities
        happening around your location.
        </p>
        <p>Move the map or search by city to find events near you. Click markers
        to see event details.
      </p>
      </div>

      {/* SEARCH */}
      <div className={styles.searchBar}>
        <input
          placeholder="Search city or location (e.g. Split)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* MAP */}
      <div className={styles.mapWrapper}>
        <EventsMap events={events} center={center} />
      </div>
    </main>
  );
}