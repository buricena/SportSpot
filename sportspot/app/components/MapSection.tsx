"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

export default function MapSection() {
  const defaultCenter: [number, number] = [45.815399, 15.966568];
  const [center, setCenter] = useState(defaultCenter);

  const handleMyLocation = () => {
    console.log("BUTTON CLICKED");

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        setCenter([pos.coords.latitude, pos.coords.longitude]);
      },
      err => {
        alert("Location blocked or unavailable");
        console.error(err);
      }
    );
  };

  return (
    <div className="map-wrapper">
      <MapView center={center} />
      <button className="map-btn" onClick={handleMyLocation}>
        My Location
      </button>
    </div>
  );
}
