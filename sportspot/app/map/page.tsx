"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import styles from "./map.module.css";

const MapView = dynamic(() => import("../components/MapView"), {
  ssr: false,
});

export default function MapPage() {
  const defaultCenter: [number, number] = [45.815399, 15.966568];

  const [center, setCenter] = useState<[number, number]>(defaultCenter);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const coords: [number, number] = [
          position.coords.latitude,
          position.coords.longitude,
        ];

        setUserLocation(coords);
        setCenter(coords);
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
        <button className={styles.locBtn} onClick={handleMyLocation}>
          My location
        </button>
      </header>

      <section className={styles.mapWrapper}>
        <MapView center={center} userLocation={userLocation} />
      </section>
    </main>
  );
}
