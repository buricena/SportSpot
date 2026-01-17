"use client";

type EventMarker = {
  id: number;
  title: string;
  position: [number, number];
};

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";


// Fix za Leaflet ikone u Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Props = {
  center: [number, number];
};

function ChangeView({ center }: Props) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);

  return null;
}

const events: EventMarker[] = [
  {
    id: 1,
    title: "5v5 Football",
    position: [45.815399, 15.966568],
  },
  {
    id: 2,
    title: "3v3 Basketball",
    position: [45.810567, 15.979123],
  },
  {
    id: 3,
    title: "Tennis Match",
    position: [45.818234, 15.955123],
  },
];


export default function MapView({ center }: Props) {
  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <ChangeView center={center} />

      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {events.map(event => (
        <Marker key={event.id} position={event.position}>
          <Popup>{event.title}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
