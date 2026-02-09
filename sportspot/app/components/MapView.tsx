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
};

export default function MapView({ center, events = [] }: Props) {
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

  // Komponenta za centriranje mape na prvi event
  const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lng], 13);
    }, [lat, lng, map]);
    return null;
  };

  // Prvih 3 događaja
  const top3Events = events.slice(0, 3);

  // Centar mape – prvi event ili default
  const mapCenter =
    top3Events.length > 0
      ? [top3Events[0].lat, top3Events[0].lng]
      : center;

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {top3Events.map((event) =>
        event.lat != null && event.lng != null ? (
          <Marker key={event.id} position={[event.lat, event.lng]}>
            <Popup>
              <strong>{event.title}</strong>
              {event.sport && <div>{event.sport}</div>}
              {event.location && <div>{event.location}</div>}
              {event.event_date && (
                <div>{new Date(event.event_date).toLocaleDateString("hr-HR")}</div>
              )}
            </Popup>
          </Marker>
        ) : null
      )}

      {/* Recenter na prvi event */}
      {top3Events.length > 0 && (
        <RecenterMap lat={top3Events[0].lat} lng={top3Events[0].lng} />
      )}
    </MapContainer>
  );
}
