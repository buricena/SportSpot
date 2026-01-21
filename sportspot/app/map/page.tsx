"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import styles from "./map.module.css";

// ⛔ Leaflet mora biti client-side
const MapView = dynamic(() => import("../components/MapView"), {
  ssr: false,
});

type Event = {
  id: string;
  title: string;
  lat: number;
  lng: number;
};

export default function MapPage() {
  const defaultCenter: [number, number] = [45.815399, 15.966568]; // Zagreb
  const [center, setCenter] = useState<[number, number]>(defaultCenter);
  const [events, setEvents] = useState<Event[]>([]);

  // 🔹 privremeni mock eventi (kasnije Supabase)
  useEffect(() => {
    setEvents([
      {
        id: "1",
        title: "5v5 Football Match",
        lat: 45.817,
        lng: 15.97,
      },
      {
        id: "2",
        title: "3v3 Basketball",
        lat: 45.81,
        lng: 15.98,
      },
      {
        id: "3",
        title: "Tennis Doubles",
        lat: 45.812,
        lng: 15.955,
      },
    ]);
  }, []);

  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        setCenter([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        alert("Location access denied");
      }
    );
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>Event Map</h1>
        <p>Explore events and your location on the map</p>

        <button
          onClick={handleMyLocation}
          className={styles.locationBtn}
        >
          My location
        </button>
      </header>

      <section className={styles.mapWrapper}>
<MapView center={center} events={events ?? []} />
      </section>
    </main>
  );
}
