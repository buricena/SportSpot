"use client";

import { useState } from "react";
import MapView from "./MapView";

type Event = {
  id: string;
  title: string;
  lat: number;
  lng: number;
};

export default function MapSection() {
  // 🔹 default Zagreb centar
  const [center, setCenter] = useState<[number, number]>([
    45.815399,
    15.966568,
  ]);

  // 🔹 privremeni eventi (kasnije Supabase)
  const [events] = useState<Event[]>([
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
    <div className="map-wrapper">
      <button className="map-btn" onClick={handleMyLocation}>
        My location
      </button>

      <MapView center={center} events={events} />
    </div>
  );
}
