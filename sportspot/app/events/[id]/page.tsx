"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Event = {
  id: string;
  title: string;
  description: string;
  sport: string;
  event_date: string;
  location: string;
};

export default function EventDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetchEvent();
  }, [id]);

  async function fetchEvent() {
    setLoading(true);

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("EVENT FETCH ERROR:", error);
      setEvent(null);
    } else {
      setEvent(data);
    }

    setLoading(false);
  }

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading event...</p>;
  }

  if (!event) {
    return <p style={{ padding: "2rem" }}>Event not found.</p>;
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <h1>{event.title}</h1>

      <p style={{ marginTop: "0.5rem", color: "#666" }}>
        📅 {new Date(event.event_date).toLocaleDateString("hr-HR")}
      </p>

      <p style={{ color: "#666" }}>📍 {event.location}</p>

      <p style={{ marginTop: "1.5rem", lineHeight: 1.6 }}>
        {event.description}
      </p>
    </main>
  );
}
