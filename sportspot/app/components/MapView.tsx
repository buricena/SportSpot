"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

type Event = {
  id: string;
  title: string;
  lat: number;
  lng: number;
};

type Props = {
  center: [number, number];
  events?: Event[]; // 👈 BITNO
};

export default function MapView({ center, events = [] }: Props) {
  const [Map, setMap] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
    ]).then(([reactLeaflet, L]) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      setMap(() => reactLeaflet);
    });
  }, []);

  if (!Map) {
    return <div style={{ height: 400 }} />;
  }

  const { MapContainer, TileLayer, Marker, Popup } = Map;

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {events.length === 0 && null}

      {events.map(event => (
        <Marker
          key={event.id}
          position={[event.lat, event.lng]}
        >
          <Popup>{event.title}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
