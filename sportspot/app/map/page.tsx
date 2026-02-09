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

  if (loading) {
    return <p className={styles.state}>Loading map…</p>;
  }

  return (
    <main className={styles.page}>
      <div className={styles.mapWrapper}>
        <EventsMap events={events} />
      </div>
    </main>
  );
}
