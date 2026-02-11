"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { useEffect } from "react";

type Event = {
  id: string;
  title: string;
  event_date: string;
  location: string;
  lat: number;
  lng: number;
};

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 11);
  }, [center, map]);

  return null;
}

// Leaflet icon fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function EventsMap({
  events,
  center,
}: {
  events: Event[];
  center: [number, number];
}) {
  if (typeof window === "undefined") return null;

  return (
    <MapContainer
      center={center}
      zoom={7}
      style={{ height: "100%", width: "100%" }}
    >
      <ChangeView center={center} />

      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {events.map((event) => (
        <Marker key={event.id} position={[event.lat, event.lng]}>
          <Popup>
            <strong>{event.title}</strong>
            <br />
            {new Date(event.event_date).toLocaleDateString("hr-HR")}
            <br />
            📍 {event.location}
            <br />
            <Link href={`/events/${event.id}`} className="popupBtn">
              View event
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
