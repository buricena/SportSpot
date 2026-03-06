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
  externalCenter?: [number, number] | null;
};

export default function MapSection({ externalCenter }: MapSectionProps) {
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  // Featured event ima prioritet
  useEffect(() => {
    if (externalCenter) {
      setCenter(externalCenter);
    }
  }, [externalCenter]);

  async function fetchEvents() {
    const today = new Date().toISOString().split("T")[0];

    const { data } = await supabase
      .from("events")
      .select("id, title, lat, lng, location, sport, event_date")
      .gte("event_date", today)
      .order("event_date", { ascending: true })
      .limit(3);

    if (data) {
      setEvents(data);
    }
  }

  const handleMyLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLocation([pos.coords.latitude, pos.coords.longitude]);
    });
  };

  return (
    <div className="map-wrapper">
      <button className="map-btn" onClick={handleMyLocation}>
        My location
      </button>

      <MapView
        center={center ?? [45.815399, 15.966568]} 
        events={events}
        userLocation={userLocation}
      />
    </div>
  );
}