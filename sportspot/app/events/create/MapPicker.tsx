"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

type Props = {
  lat: number | null;
  lng: number | null;
  onSelect: (lat: number, lng: number) => void;
};

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationMarker({ onSelect }: { onSelect: Props["onSelect"] }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MoveMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], 14);
  }, [lat, lng]);

  return null;
}

export default function MapPicker({ lat, lng, onSelect }: Props) {
  if (typeof window === "undefined") return null;

  const fallback: [number, number] = [45.815, 15.978];

  return (
    <MapContainer
      center={fallback}
      zoom={13}
      scrollWheelZoom
      style={{ height: "260px", width: "100%", borderRadius: "14px" }}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker onSelect={onSelect} />

      {lat && lng && (
        <>
          <MoveMap lat={lat} lng={lng} />
          <Marker position={[lat, lng]} />
        </>
      )}
    </MapContainer>
  );
}
