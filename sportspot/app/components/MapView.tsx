"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

type Event = {
  id: string;
  title: string;
  lat: number;
  lng: number;
  location?: string;
  sport?: string;
  event_date?: string;
};

type Props = {
  center: [number, number];
  events?: Event[];
  userLocation?: [number, number] | null;
};

export default function MapView({ center, events = [], userLocation }: Props) {
  const [Map, setMap] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    Promise.all([import("react-leaflet"), import("leaflet")]).then(
      ([reactLeaflet, L]) => {
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
      }
    );
  }, []);

  if (!Map) return <div style={{ height: 400 }} />;

  const { MapContainer, TileLayer, Marker, Popup, useMap } = Map;

  // centriranje mape kad se promijeni center
  const RecenterMap = ({ coords }: { coords: [number, number] }) => {
    const map = useMap();

    useEffect(() => {
      map.flyTo(coords, map.getZoom(), { animate: true });
    }, [coords, map]);

    return null;
  };

  // PRIORITET: userLocation → featured center → fallback
  const mapCenter: [number, number] =
    userLocation ?? center ?? [45.815399, 15.966568];

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <RecenterMap coords={mapCenter} />

      <Marker position={mapCenter}>
        <Popup>
          <strong>Selected location</strong>
        </Popup>
      </Marker>

     
      {events.map((event) => (
        <Marker key={event.id} position={[event.lat, event.lng]}>
          <Popup>
            <strong>{event.title}</strong>
            {event.location && <div>{event.location}</div>}
            {event.event_date && (
              <div>
                {new Date(event.event_date).toLocaleDateString("hr-HR")}
              </div>
            )}
          </Popup>
        </Marker>
      ))}

  
      {userLocation && (
        <Marker position={userLocation}>
          <Popup>You are here</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}