"use client";

import { useEffect, useState } from "react";
import MapView from "./MapView";
import { supabase } from "@/lib/supabaseClient";

export type Event = {
  id: string;
  title: string;
  lat: number;
  lng: number;
  location: string;
  sport: string;
  event_date: string;
};

type MapSectionProps = {
  onEventsFetched: (events: Event[]) => void;
};

export default function MapSection({ onEventsFetched }: MapSectionProps) {
  const [center, setCenter] = useState<[number, number]>([45.815399, 15.966568]);
  const [events, setEvents] = useState<Event[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];

    const { data } = await supabase
      .from("events")
      .select("id, title, lat, lng, location, sport, event_date")
      .gte("event_date", today)
      .order("event_date", { ascending: true })
      .limit(3);

    if (data) {
      setEvents(data);
      onEventsFetched(data);

      if (data.length > 0) {
        setCenter([data[0].lat, data[0].lng]);
      }
    }
    setLoading(false);
  }

  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setCenter(coords);
        setUserLocation(coords);
      },
      () => alert("Location access denied")
    );
  };

  return (
    <div className="map-wrapper">
      <button className="map-btn" onClick={handleMyLocation}>
        My location
      </button>

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <MapView
          center={center}
          events={events}
          userLocation={userLocation}
        />
      )}
    </div>
  );
}
