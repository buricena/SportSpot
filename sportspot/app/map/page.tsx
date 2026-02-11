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
    15.978, // default HR
  ]);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const { data } = await supabase
      .from("events")
      .select("id, title, event_date, location, lat, lng")
      .not("lat", "is", null)
      .not("lng", "is", null);

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
      {/* SEARCH BAR */}
      <div className={styles.searchBar}>
        <input
          placeholder="Search city or location (e.g. Split)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className={styles.mapWrapper}>
        <EventsMap events={events} center={center} />
      </div>
    </main>
  );
}
