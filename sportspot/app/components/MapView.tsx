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

  // Centriranje mape
  const RecenterMap = ({ coords }: { coords: [number, number] }) => {
    const map = useMap();

    useEffect(() => {
      map.flyTo(coords, 13);
    }, [coords, map]);

    return null;
  };

  const top3Events = events.slice(0, 3);

  // Ako korisnik odabere lokaciju, centriramo na nju
  const mapCenter: [number, number] = userLocation
    ? userLocation
    : top3Events.length > 0
    ? [top3Events[0].lat, top3Events[0].lng]
    : center;

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <RecenterMap coords={mapCenter} />

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

      {userLocation && (
        <Marker position={userLocation}>
          <Popup>You are here</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
