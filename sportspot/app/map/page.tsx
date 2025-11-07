import Link from "next/link";

export default function MapPage() {
  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Map</h1>
      <p>Here you can see all sports events on the map.</p>

     

      <p style={{ marginTop: "1.5rem" }}>
        <Link href="/">← Back to Homepage</Link>
      </p>
    </main>
  );
}
