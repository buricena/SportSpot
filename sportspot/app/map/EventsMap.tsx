"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";

type Event = {
  id: string;
  title: string;
  event_date: string;
  location: string;
  lat: number;
  lng: number;
};

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

export default function EventsMap({ events }: { events: Event[] }) {
  if (typeof window === "undefined") return null;
  //mora ovako radi Leafleta
  const popupStyles = `
  .popupBtn {
    display: inline-block;
    margin-top: 8px;
    padding: 6px 12px;
    background: #ff5a1f;
    color: white !important;
    font-size: 13px;
    font-weight: 600;
    border-radius: 999px;
    text-decoration: none;
    transition: background 0.15s ease, transform 0.15s ease,
      box-shadow 0.15s ease;
  }

  .popupBtn:hover {
    background: #e84d15;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(255, 90, 31, 0.35);
  }
`;


  return (
    <MapContainer
      center={[45.815, 15.978]} // default HR
      zoom={7}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
<style>{popupStyles}</style>

      {events.map(event => (
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
